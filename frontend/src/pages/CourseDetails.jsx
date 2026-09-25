import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  BookOpen,
  Clock3,
  UserCheck,
  Award,
  PlayCircle,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Loader2,
  Trophy,
  ClipboardCheck,
  StickyNote,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
} from "lucide-react";

import {
  Loader,
  Button,
  Card,
  SectionTitle,
  Badge,
} from "../components/common";

import { Newsletter, CTA } from "../components/home";

import {
  getCourse,
  getCourses,
  enrollCourse,
  initializePaystackCoursePayment,
  completeLesson,
  updateCurrentLesson,
  submitAssessment,
  completeModule,
} from "../services";

import CoursePurchaseCard from "../components/courses/CoursePurchaseCard";

import { uploadAssessmentFile } from "../api/uploadApi";

const COURSE_IMAGE_FALLBACK = "/images/course-placeholder.png";

const formatCourseDuration = (hours) => {
  const value = Number(hours);

  if (!Number.isFinite(value) || value <= 0) {
    return "Self-paced";
  }

  if (value === 1) {
    return "1 hour";
  }

  if (Number.isInteger(value)) {
    return `${value} hours`;
  }

  return `${value} hours`;
};

const formatLessonDuration = (minutes) => {
  const value = Number(minutes);

  if (!Number.isFinite(value) || value <= 0) {
    return "Self-paced";
  }

  if (value < 60) {
    return `${value} min`;
  }

  const hours = Math.floor(value / 60);
  const remainingMinutes = value % 60;

  if (remainingMinutes === 0) {
    return hours === 1 ? "1 hr" : `${hours} hrs`;
  }

  return `${hours} hr ${remainingMinutes} min`;
};

const formatDate = (date) => {
  if (!date) {
    return null;
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(parsedDate);
};

const instructorName = (instructor) => {
  if (!instructor || !instructor.trim()) {
    return "KanuorieTech";
  }
  return instructor;
};

const getImage = (image) => {
  if (typeof image !== "string" || !image.trim()) {
    return COURSE_IMAGE_FALLBACK;
  }

  return image;
};

const getApiMessage = (error, fallback) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
};

/* =========================================================
   COURSE DETAILS
========================================================= */

export default function CourseDetails() {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [relatedCourses, setRelatedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);

  const [completingLesson, setCompletingLesson] = useState(null);
  const [completingModule, setCompletingModule] = useState(null);
  const [submittingAssessment, setSubmittingAssessment] = useState(null);
  const [assessmentDrafts, setAssessmentDrafts] = useState({});
  const [assessmentFiles, setAssessmentFiles] = useState({});
  const [openModules, setOpenModules] = useState({});
  const [openNoteLessonId, setOpenNoteLessonId] = useState(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [lessonNotes, setLessonNotes] = useState({});
  const currentLessonRef = useRef(null);

  /* =======================================================
     LOAD COURSE
  ======================================================= */

  useEffect(() => {
    let isMounted = true;

    const loadCourse = async () => {
      setLoading(true);
      setCourse(null);
      setProgress(null);
      setRelatedCourses([]);


      try {
        // Public catalog data is always loaded first so non-enrolled
        // learners can view the course before enrollment/purchase.
        const coursesRes = await getCourses();

        if (!isMounted) {
          return;
        }

        const fetchedCourses = Array.isArray(coursesRes?.data)
          ? coursesRes.data
          : [];

        const publicCourse =
          fetchedCourses.find(
            (item) =>
              String(item?._id) === String(id) ||
              String(item?.slug) === String(id),
          ) || null;

        // The protected endpoint returns the full curriculum only when
        // the learner is enrolled. A 403 is expected for public previews.
        let fetchedCourse = publicCourse;
        let fetchedProgress = null;

        try {
          const courseRes = await getCourse(id);

          fetchedCourse = courseRes?.data?.course || publicCourse;
          fetchedProgress = courseRes?.data?.progress || null;
        } catch (courseError) {
          if (courseError?.response?.status !== 403) {
            throw courseError;
          }
        }

        if (!isMounted) {
          return;
        }

        setCourse(fetchedCourse);
        setProgress(fetchedProgress);

        if (!fetchedCourse) {
          return;
        }

        /* -----------------------------------------------
          OPEN CURRENT LESSON'S MODULE BY DEFAULT
          Only available for enrolled learners.
        ------------------------------------------------ */

        const courseModules = Array.isArray(fetchedCourse.modules)
          ? fetchedCourse.modules
          : [];

        const fetchedCurrentLessonId = fetchedProgress?.currentLesson
          ? String(fetchedProgress.currentLesson)
          : null;

        let currentModule = null;

        if (fetchedCurrentLessonId) {
          currentModule = courseModules.find(
            (module) =>
              Array.isArray(module?.lessons) &&
              module.lessons.some(
                (lesson) => String(lesson?._id) === fetchedCurrentLessonId,
              ),
          );
        }

        const firstModule = courseModules[0];
        const moduleToOpen = currentModule || firstModule;

        if (moduleToOpen) {
          setOpenModules({
            [moduleToOpen._id || moduleToOpen.order || 0]: true,
          });
        }

        /* -----------------------------------------------
           RELATED COURSES
        ------------------------------------------------ */

        const availableCourses = fetchedCourses.filter(
          (item) =>
            item?._id &&
            String(item._id) !== String(fetchedCourse._id) &&
            item?.published !== false,
        );

        const sameCategory = availableCourses.filter(
          (item) =>
            item.category &&
            fetchedCourse.category &&
            item.category.toLowerCase() ===
              fetchedCourse.category.toLowerCase(),
        );

        const otherCourses = availableCourses.filter(
          (item) => !sameCategory.some((related) => related._id === item._id),
        );

        setRelatedCourses([...sameCategory, ...otherCourses].slice(0, 3));
      } catch (error) {
        console.error("Failed to load course:", error);

        if (isMounted) {
          toast.error(
            getApiMessage(
              error,
              "Unable to load this course. Please try again.",
            ),
          );

          setCourse(null);
          setProgress(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      loadCourse();
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  const isEnrolled = Boolean(progress?._id || progress?.course);

  const handleEnroll = async () => {
    if (!id || enrollmentLoading || isEnrolled) {
      return;
    }

    try {
      setEnrollmentLoading(true);

      const response = await enrollCourse(id);
      const enrolledProgress = response?.data?.progress || response?.data || null;

      setProgress(enrolledProgress);

      toast.success("You are now enrolled! Loading your curriculum...");

      // Reload the protected course endpoint so modules and lessons become
      // available immediately after successful enrollment.
      const courseResponse = await getCourse(id);

      if (courseResponse?.data?.course) {
        setCourse(courseResponse.data.course);
      }

      if (courseResponse?.data?.progress) {
        setProgress(courseResponse.data.progress);
      }
    } catch (error) {
      console.error("Enroll course error:", error);
      toast.error(getApiMessage(error, "Unable to enroll in this course."));
    } finally {
      setEnrollmentLoading(false);
    }
  };

  const handleBuyCourse = async () => {
    if (!id || purchaseLoading || isEnrolled) {
      return;
    }

    try {
      setPurchaseLoading(true);

      const response = await initializePaystackCoursePayment(id);

      const authorizationUrl =
        response?.data?.paystack?.authorization_url;

      if (!authorizationUrl) {
        throw new Error(
          "Secure Paystack checkout could not be initialized.",
        );
      }

      toast.success(
        "Redirecting you to secure payment checkout...",
      );

      window.location.assign(authorizationUrl);
    } catch (error) {
      console.error(
        "Initialize Paystack course payment error:",
        error,
      );

      toast.error(
        getApiMessage(
          error,
          "Unable to start secure payment checkout.",
        ),
      );

      setPurchaseLoading(false);
    }
  };

  /* =======================================================
     COURSE CALCULATIONS
  ======================================================= */

  const modules = useMemo(() => {
    if (!Array.isArray(course?.modules)) {
      return [];
    }

    return [...course.modules].sort(
      (a, b) => Number(a?.order || 0) - Number(b?.order || 0),
    );
  }, [course]);

  const totalLessons = useMemo(() => {
    return modules.reduce((total, module) => {
      return (
        total + (Array.isArray(module?.lessons) ? module.lessons.length : 0)
      );
    }, 0);
  }, [modules]);

  const totalLessonMinutes = useMemo(() => {
    return modules.reduce((total, module) => {
      if (!Array.isArray(module?.lessons)) {
        return total;
      }

      return (
        total +
        module.lessons.reduce(
          (lessonTotal, lesson) => lessonTotal + Number(lesson?.duration || 0),
          0,
        )
      );
    }, 0);
  }, [modules]);

  const totalLearningHours = useMemo(() => {
    if (totalLessonMinutes <= 0) {
      return null;
    }

    return Math.round((totalLessonMinutes / 60) * 10) / 10;
  }, [totalLessonMinutes]);

  const outcomes = useMemo(() => {
    return Array.isArray(course?.outcomes)
      ? course.outcomes.filter(Boolean)
      : [];
  }, [course]);

  const prerequisites = useMemo(() => {
    return Array.isArray(course?.prerequisites)
      ? course.prerequisites.filter(Boolean)
      : [];
  }, [course]);

  const tags = useMemo(() => {
    return Array.isArray(course?.tags) ? course.tags.filter(Boolean) : [];
  }, [course]);

  const completedLessonIds = useMemo(() => {
    return new Set(
      (progress?.completedLessons || []).map((lessonId) => String(lessonId)),
    );
  }, [progress]);

  const completedLessonsCount = completedLessonIds.size;

  const currentLessonId = progress?.currentLesson
    ? String(progress.currentLesson)
    : null;

  const allLessons = useMemo(() => {
    const lessons = [];

    modules.forEach((module) => {
      if (!Array.isArray(module?.lessons)) {
        return;
      }

      module.lessons.forEach((lesson) => {
        if (lesson?._id) {
          lessons.push({
            ...lesson,
            moduleId: module?._id,
            moduleTitle: module?.title,
            moduleOrder: module?.order,
          });
        }
      });
    });

    return lessons.sort((a, b) => {
      const moduleOrderA = Number(a.moduleOrder || 0);
      const moduleOrderB = Number(b.moduleOrder || 0);

      if (moduleOrderA !== moduleOrderB) {
        return moduleOrderA - moduleOrderB;
      }

      return Number(a.order || 0) - Number(b.order || 0);
    });
  }, [modules]);

  const currentLessonIndex = useMemo(() => {
    if (!currentLessonId) {
      return -1;
    }

    return allLessons.findIndex(
      (lesson) => String(lesson._id) === currentLessonId,
    );
  }, [allLessons, currentLessonId]);

  const previousLesson =
    currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;

  const nextLesson =
    currentLessonIndex >= 0 && currentLessonIndex < allLessons.length - 1
      ? allLessons[currentLessonIndex + 1]
      : null;

  const progressPercentage = Math.min(
    Math.max(Number(progress?.percentage || 0), 0),
    100,
  );

  let currentLessonDetails = null;

  if (currentLessonId) {
    for (const module of modules) {
      const lesson = Array.isArray(module?.lessons)
        ? module.lessons.find((item) => String(item?._id) === currentLessonId)
        : null;

      if (lesson) {
        currentLessonDetails = {
          lesson,
          module,
        };

        break;
      }
    }
  }

  const rating = Number(course?.rating || 0);
  const enrollments = Number(course?.enrollments || 0);

  const formattedDate = formatDate(course?.createdAt);

  /* =======================================================
     MODULE ACCORDION
  ======================================================= */

  const toggleModule = (moduleKey) => {
    setOpenModules((previous) => ({
      ...previous,
      [moduleKey]: !previous[moduleKey],
    }));
  };

  /* =======================================================
     COMPLETE LESSON
  ======================================================= */

  const handleCompleteLesson = async (lessonId) => {
    if (!lessonId || completingLesson) {
      return;
    }

    const alreadyCompleted = completedLessonIds.has(String(lessonId));

    if (alreadyCompleted) {
      return;
    }

    try {
      setCompletingLesson(lessonId);

      const response = await completeLesson(id, lessonId);

      const updatedProgress = response?.data || null;

      if (updatedProgress) {
        setProgress(updatedProgress);
      }

      toast.success("Lesson completed!");
    } catch (error) {
      console.error("Complete lesson error:", error);

      toast.error(getApiMessage(error, "Unable to complete lesson."));
    } finally {
      setCompletingLesson(null);
    }
  };

  /* =======================================================
   MODULE ASSESSMENTS
======================================================= */

  const getAssessmentSubmission = (module) => {
    const assessment = module?.assessment;

    if (!assessment?._id) {
      return null;
    }

    return (
      progress?.assessmentSubmissions?.find(
        (submission) =>
          String(submission?.module) === String(module?._id) &&
          String(submission?.assessment) === String(assessment?._id),
      ) || null
    );
  };

  const getAssessmentDraft = (moduleId) => {
    return (
      assessmentDrafts[String(moduleId)] || {
        text: "",
        url: "",
      }
    );
  };

  const handleAssessmentDraftChange = (moduleId, field, value) => {
    setAssessmentDrafts((previous) => ({
      ...previous,
      [String(moduleId)]: {
        ...(previous[String(moduleId)] || {}),
        [field]: value,
      },
    }));
  };

  const handleAssessmentFileChange = (moduleId, file) => {
    if (!file) {
      setAssessmentFiles((previous) => {
        const updated = {
          ...previous,
        };

        delete updated[String(moduleId)];

        return updated;
      });

      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Assessment files must be 10MB or smaller.");
      return;
    }

    setAssessmentFiles((previous) => ({
      ...previous,
      [String(moduleId)]: file,
    }));
  };

  const handleSubmitAssessment = async (module) => {
    const assessment = module?.assessment;

    if (!module?._id || !assessment?._id) {
      return;
    }

    const moduleId = String(module._id);
    const submissionType = assessment.submissionType;

    if (!["text", "url", "file"].includes(submissionType)) {
      toast.error("This assessment does not require a submission.");
      return;
    }

    try {
      setSubmittingAssessment(moduleId);

      let submissionData = {
        submissionType,
      };

      if (submissionType === "text") {
        const text = getAssessmentDraft(moduleId).text?.trim() || "";

        if (!text) {
          toast.error("Please enter your assessment response.");
          return;
        }

        submissionData.text = text;
      }

      if (submissionType === "url") {
        const url = getAssessmentDraft(moduleId).url?.trim() || "";

        if (!url) {
          toast.error("Please provide your project URL.");
          return;
        }

        submissionData.url = url;
      }

      if (submissionType === "file") {
        const file = assessmentFiles[moduleId];

        if (!file) {
          toast.error("Please select an assessment file.");
          return;
        }

        const uploadResponse = await uploadAssessmentFile(file);

        const fileUrl =
          uploadResponse?.data?.url ||
          uploadResponse?.data?.fileUrl ||
          uploadResponse?.url ||
          uploadResponse?.fileUrl ||
          "";

        if (!fileUrl) {
          throw new Error(
            "The uploaded assessment file did not return a valid URL.",
          );
        }

        submissionData.fileUrl = fileUrl;
      }

      const response = await submitAssessment(id, moduleId, submissionData);

      const updatedProgress = response?.data || null;

      if (updatedProgress) {
        setProgress(updatedProgress);
      }

      if (submissionType === "file") {
        setAssessmentFiles((previous) => {
          const updated = {
            ...previous,
          };

          delete updated[moduleId];

          return updated;
        });
      }

      toast.success("Assessment submitted successfully!");
    } catch (error) {
      console.error("Submit assessment error:", error);

      toast.error(getApiMessage(error, "Unable to submit assessment."));
    } finally {
      setSubmittingAssessment(null);
    }
  };

  const handleCompleteModule = async (module) => {
    if (!module?._id || completingModule) {
      return;
    }

    const moduleId = String(module._id);

    const lessons = Array.isArray(module.lessons) ? module.lessons : [];

    const allLessonsCompleted = lessons.every(
      (lesson) => lesson?._id && completedLessonIds.has(String(lesson._id)),
    );

    if (!allLessonsCompleted) {
      toast.error("Please complete all lessons in this module first.");
      return;
    }

    const assessment = module.assessment;
    const assessmentRequired =
      Boolean(assessment?.required) && assessment?.submissionType !== "none";

    const assessmentSubmission = getAssessmentSubmission(module);

    if (assessmentRequired && !assessmentSubmission) {
      toast.error("Please submit the module assessment first.");
      return;
    }

    try {
      setCompletingModule(moduleId);

      const response = await completeModule(id, moduleId);

      const updatedProgress = response?.data || null;

      if (updatedProgress) {
        setProgress(updatedProgress);
      }

      toast.success("Module completed successfully!");
    } catch (error) {
      console.error("Complete module error:", error);

      toast.error(getApiMessage(error, "Unable to complete module."));
    } finally {
      setCompletingModule(null);
    }
  };

  /* =======================================================
   SET CURRENT LESSON
======================================================= */
  const handleSetCurrentLesson = async (lessonId) => {
    if (!lessonId) {
      return;
    }

    if (String(currentLessonId) === String(lessonId)) {
      return;
    }

    try {
      const response = await updateCurrentLesson(id, lessonId);

      const updatedProgress = response?.data || null;

      if (updatedProgress) {
        setProgress(updatedProgress);
      }
    } catch (error) {
      console.error("Update current lesson error:", error);

      toast.error(getApiMessage(error, "Unable to save your current lesson."));
    }
  };

  const handlePreviousLesson = async () => {
    if (!previousLesson?._id) {
      return;
    }

    await handleSetCurrentLesson(previousLesson._id);

    const moduleKey =
      previousLesson.moduleId || previousLesson.moduleOrder || 0;

    setOpenModules((previous) => ({
      ...previous,
      [moduleKey]: true,
    }));
  };

  const handleNextLesson = async () => {
    if (!nextLesson?._id) {
      return;
    }

    await handleSetCurrentLesson(nextLesson._id);

    const moduleKey = nextLesson.moduleId || nextLesson.moduleOrder || 0;

    setOpenModules((previous) => ({
      ...previous,
      [moduleKey]: true,
    }));
  };

  /* =======================================================
   LESSON NOTES â€” UI ONLY
======================================================= */

  const handleOpenNote = (lessonId) => {
    if (!lessonId) {
      return;
    }

    const existingNote = lessonNotes[String(lessonId)] || "";

    setOpenNoteLessonId(String(lessonId));
    setNoteDraft(existingNote);
  };

  const handleCancelNote = () => {
    setOpenNoteLessonId(null);
    setNoteDraft("");
  };

  const handleSaveNote = (lessonId) => {
    if (!lessonId) {
      return;
    }

    const trimmedNote = noteDraft.trim();

    if (!trimmedNote) {
      toast.error("Please enter a note first.");
      return;
    }

    setLessonNotes((previous) => ({
      ...previous,
      [String(lessonId)]: trimmedNote,
    }));

    setOpenNoteLessonId(null);
    setNoteDraft("");

    toast.success("Note saved.");
  };

  const handleDeleteNote = (lessonId) => {
    if (!lessonId) {
      return;
    }

    setLessonNotes((previous) => {
      const updated = {
        ...previous,
      };

      delete updated[String(lessonId)];

      return updated;
    });

    if (openNoteLessonId === String(lessonId)) {
      setOpenNoteLessonId(null);
      setNoteDraft("");
    }

    toast.success("Note removed.");
  };
  /* =======================================================
     RESUME CURRENT LESSON
  ======================================================= */

  const handleResumeLesson = () => {
    if (!currentLessonDetails?.lesson?._id) {
      return;
    }

    const moduleKey =
      currentLessonDetails.module?._id ||
      currentLessonDetails.module?.order ||
      0;

    setOpenModules((previous) => ({
      ...previous,
      [moduleKey]: true,
    }));

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        currentLessonRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      });
    });
  };

  /* =======================================================
     LOADING STATE
  ======================================================= */

  if (loading) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center px-6">
        <Loader />
      </section>
    );
  }

  /* =======================================================
     NOT FOUND / ACCESS STATE
  ======================================================= */

  if (!course) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center px-6 py-10">
        <Card className="w-full max-w-2xl text-center">
          <BookOpen className="mx-auto text-blue-500" size={52} />

          <h1 className="mt-6 text-2xl font-black text-slate-900 sm:text-3xl">
            Course unavailable
          </h1>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-600">
            Enrollment required! You need to enroll in this course to access the
            curriculum.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/courses">
              <Button>
                <ArrowLeft className="mr-2" size={18} />
                View All Courses
              </Button>
            </Link>
          </div>
        </Card>
      </section>
    );
  }

  return (
    <>
      {/* Course details page */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:45px_45px]" />

        <div className="relative mx-auto max-w-7xl px-6 py-16 sm:py-20 lg:py-24">
          <Link
            to="/courses"
            className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-blue-400 transition hover:text-blue-300"
          >
            <ArrowLeft size={18} />
            Back to Courses
          </Link>

          <div className="grid gap-12 lg:grid-cols-[1.4fr_.8fr] lg:gap-16">
            {/* LEFT */}

            <motion.div
              initial={{
                opacity: 0,
                y: 35,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
              }}
            >
              <div className="flex flex-wrap items-center gap-3">
                <Badge>{course.level || "Beginner"}</Badge>

                {course.category && (
                  <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-slate-200">
                    {course.category}
                  </span>
                )}

                {course.premium && (
                  <span className="rounded-full bg-yellow-500/20 px-4 py-2 text-sm font-semibold text-yellow-300">
                    Premium
                  </span>
                )}
              </div>

              <h1 className="mt-6 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                {course.title}
              </h1>

              <p className="mt-8 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                {course.description}
              </p>

              {tags.length > 0 && (
                <div className="mt-10 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>

            {/* PROGRESS CARD */}

            <motion.div
              initial={{
                opacity: 0,
                y: 35,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
                delay: 0.1,
              }}
            >
              <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
                {isEnrolled ? (
                  <>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-slate-300">
                          Your Progress
                        </p>

                        <p className="mt-2 text-4xl font-black">
                          {progressPercentage}%
                        </p>
                      </div>

                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/20">
                        {progressPercentage >= 100 ? (
                          <Trophy className="text-yellow-300" size={28} />
                        ) : (
                          <BookOpen className="text-blue-300" size={28} />
                        )}
                      </div>
                    </div>

                    <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 0.8 }}
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                      />
                    </div>

                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="text-slate-300">
                        {completedLessonsCount} of {totalLessons} lessons completed
                      </span>

                      <span className="font-semibold text-blue-300">
                        {progress?.status === "completed"
                          ? "Completed"
                          : progressPercentage > 0
                            ? "In Progress"
                            : "Not Started"}
                      </span>
                    </div>

                    {progressPercentage >= 100 && (
                      <div className="mt-6 rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-4">
                        <div className="flex items-start gap-3">
                          <Award
                            className="mt-0.5 shrink-0 text-yellow-300"
                            size={22}
                          />

                          <div>
                            <p className="font-bold text-yellow-100">
                              Lessons completed!
                            </p>

                            <p className="mt-1 text-sm leading-6 text-yellow-100/70">
                              Complete the required assessments and final
                              requirements to become certificate eligible.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div>
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/20">
                      <BookOpen className="text-blue-300" size={28} />
                    </div>

                    <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-blue-300">
                      Course Access
                    </p>

                    <h2 className="mt-2 text-2xl font-black">
                      {course?.premium
                        ? "Premium course access"
                        : "Enroll to start learning"}
                    </h2>

                    <p className="mt-3 text-sm leading-7 text-slate-300">
                      {course?.premium
                        ? "Purchase this course to unlock the protected curriculum, lessons, assessments, and learning progress."
                        : "Enroll for free to unlock the protected curriculum, lessons, assessments, and learning progress."}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {!isEnrolled && (
        <section className="bg-slate-50 px-6 py-10 sm:py-14">
          <div className="mx-auto max-w-5xl">
            <CoursePurchaseCard
              course={course}
              enrolled={isEnrolled}
              loading={enrollmentLoading || purchaseLoading}
              onEnroll={handleEnroll}
              onBuy={handleBuyCourse}
            />
          </div>
        </section>
      )}

      {/* ==================================================
          COURSE INFORMATION
      ================================================== */}

      <section className="py-10 sm:py-10">
        <div className="mx-auto max-w-5xl px-6">
          <Card>
            <div className="grid gap-8 sm:grid-cols-2">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-blue-50 p-3">
                  <Clock3 className="text-blue-600" size={22} />
                </div>

                <div>
                  <p className="text-sm text-slate-500">Course Duration</p>

                  <p className="mt-1 font-bold text-slate-900">
                    {formatCourseDuration(course.duration)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-blue-50 p-3">
                  <BookOpen className="text-blue-600" size={22} />
                </div>

                <div>
                  <p className="text-sm text-slate-500">Total Lessons</p>

                  <p className="mt-1 font-bold text-slate-900">
                    {totalLessons}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-blue-50 p-3">
                  <UserCheck className="text-blue-600" size={22} />
                </div>

                <div>
                  <p className="text-sm text-slate-500">Course Instructor</p>

                  <p className="mt-1 font-bold text-slate-900">
                    {instructorName(course.instructor)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-blue-50 p-3">
                  <CalendarDays className="text-blue-600" size={22} />
                </div>

                <div>
                  <p className="text-sm text-slate-500">Course Added</p>

                  <p className="mt-1 font-bold text-slate-900">
                    {formattedDate || "Recently"}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* ==================================================
          REQUIREMENTS
      ================================================== */}

      <section className="bg-slate-50 py-10 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionTitle
            title="Requirements"
            subtitle="What you need before starting."
          />

          {prerequisites.length > 0 ? (
            <div className="mt-12 space-y-4 lg:mt-16">
              {prerequisites.map((item, index) => (
                <Card
                  key={`${item}-${index}`}
                  className="flex items-start gap-4"
                >
                  <CheckCircle2
                    className="mt-0.5 shrink-0 text-green-500"
                    size={20}
                  />

                  <span className="leading-7 text-slate-700">{item}</span>
                </Card>
              ))}
            </div>
          ) : (
            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:mt-16">
              {[
                "Basic computer skills.",
                "Laptop or desktop computer.",
                "Reliable internet connection.",
                "Willingness to learn and practice.",
              ].map((item) => (
                <Card key={item} className="flex items-start gap-4">
                  <CheckCircle2
                    className="mt-0.5 shrink-0 text-green-500"
                    size={20}
                  />

                  <span className="leading-7 text-slate-700">{item}</span>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ==================================================
          WHAT YOU'LL LEARN
      ================================================== */}

      <section className="py-10 sm:py-10">
        <div className="mx-auto max-w-7xl px-6">
          <SectionTitle
            title="What You'll Learn"
            subtitle="Skills you'll gain by completing this course."
          />

          {outcomes.length > 0 ? (
            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:mt-16">
              {outcomes.map((item, index) => (
                <Card
                  key={`${item}-${index}`}
                  className="flex items-start gap-4"
                >
                  <CheckCircle2
                    className="mt-1 shrink-0 text-green-500"
                    size={22}
                  />

                  <p className="leading-7 text-slate-700">{item}</p>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="mx-auto mt-12 max-w-3xl text-center lg:mt-16">
              <BookOpen className="mx-auto text-blue-500" size={42} />

              <p className="mt-4 text-slate-600">
                Course learning outcomes will be added soon.
              </p>
            </Card>
          )}
        </div>
      </section>

      {/* ==================================================
          COURSE CURRICULUM
      ================================================== */}

      {isEnrolled && (
      <section className="bg-slate-50 py-10 sm:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <SectionTitle
            title="Course Curriculum"
            subtitle={`${modules.length} ${
              modules.length === 1 ? "module" : "modules"
            } â€¢ ${totalLessons} ${totalLessons === 1 ? "lesson" : "lessons"}`}
          />

          {currentLessonDetails && progressPercentage < 100 && (
            <div className="mt-8 overflow-hidden rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-50 via-white to-cyan-50 shadow-sm">
              <div className="p-5 sm:p-6">
                <div className="flex flex-col gap-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg">
                      <PlayCircle size={24} />
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                        Continue Learning
                      </p>

                      <h3 className="mt-1 text-lg font-black text-slate-900 sm:text-xl">
                        {currentLessonDetails.lesson.title || "Current Lesson"}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {currentLessonDetails.module?.title ||
                          "Course Curriculum"}
                      </p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={handleResumeLesson}
                    className="w-full sm:w-auto"
                  >
                    <PlayCircle className="mr-2" size={18} />
                    Resume Lesson
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Your course progress
                </p>

                <div className="mt-2 flex items-end gap-2">
                  <span className="text-3xl font-black text-slate-900">
                    {progressPercentage}%
                  </span>

                  <span className="pb-1 text-sm text-slate-500">completed</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-slate-600">
                <CheckCircle2 className="text-green-500" size={20} />
                <span>
                  {completedLessonsCount} of {totalLessons} lessons
                </span>
              </div>
            </div>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.7 }}
                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500"
              />
            </div>

            {totalLearningHours && (
              <div className="mt-4 inline-flex items-center gap-2 text-sm text-slate-500">
                <Clock3 size={16} />
                Approximately {totalLearningHours} hours of lesson content
              </div>
            )}
          </div>

          {modules.length > 0 ? (
            <div className="mt-10 space-y-4 lg:mt-12">
              {modules.map((module, moduleIndex) => {
                const moduleKey = module._id || `module-${moduleIndex}`;

                const lessons = Array.isArray(module.lessons)
                  ? [...module.lessons].sort(
                      (a, b) => Number(a?.order || 0) - Number(b?.order || 0),
                    )
                  : [];

                const isOpen = Boolean(openModules[moduleKey]);

                const moduleCompletedLessons = lessons.filter((lesson) =>
                  completedLessonIds.has(String(lesson._id)),
                ).length;

                const modulePercentage =
                  lessons.length > 0
                    ? Math.round(
                        (moduleCompletedLessons / lessons.length) * 100,
                      )
                    : 0;

                const assessment = module.assessment || null;

                return (
                  <Card key={moduleKey} className="overflow-hidden p-0">
                    <button
                      type="button"
                      onClick={() => toggleModule(moduleKey)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-5 p-5 text-left transition hover:bg-slate-50 sm:p-6"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 font-bold text-blue-700">
                          {moduleIndex + 1}
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate text-base font-bold text-slate-900 sm:text-lg">
                            {module.title || `Module ${moduleIndex + 1}`}
                          </h3>

                          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
                            <span>
                              {lessons.length}{" "}
                              {lessons.length === 1 ? "lesson" : "lessons"}
                            </span>

                            {lessons.length > 0 && (
                              <>
                                <span className="text-slate-300">â€¢</span>
                                <span>{moduleCompletedLessons} completed</span>
                              </>
                            )}

                            {assessment && (
                              <>
                                <span className="text-slate-300">â€¢</span>
                                <span className="inline-flex items-center gap-1 text-blue-600">
                                  <ClipboardCheck size={14} />
                                  Assessment
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-4">
                        {lessons.length > 0 && (
                          <span className="hidden text-xs font-bold text-blue-600 sm:block">
                            {modulePercentage}%
                          </span>
                        )}

                        {isOpen ? (
                          <ChevronUp className="text-slate-500" size={22} />
                        ) : (
                          <ChevronDown className="text-slate-500" size={22} />
                        )}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="border-t bg-white">
                        {module.description && (
                          <div className="border-b bg-slate-50/70 px-5 py-5 sm:px-6">
                            <p className="leading-7 text-slate-600">
                              {module.description}
                            </p>
                          </div>
                        )}

                        {lessons.length > 0 ? (
                          <div className="divide-y">
                            {lessons.map((lesson, lessonIndex) => {
                              const lessonId = lesson._id;
                              const isCompleted = lessonId
                                ? completedLessonIds.has(String(lessonId))
                                : false;
                              const isCurrent =
                                lessonId &&
                                currentLessonId === String(lessonId);

                              return (
                                <div
                                  ref={isCurrent ? currentLessonRef : null}
                                  key={
                                    lessonId ||
                                    `${moduleKey}-lesson-${lessonIndex}`
                                  }
                                  onClick={() => {
                                    if (lessonId) {
                                      handleSetCurrentLesson(lessonId);
                                    }
                                  }}
                                  className={`cursor-pointer border-l-4 px-5 py-5 transition sm:px-6 ${
                                    isCurrent
                                      ? "border-blue-600 bg-blue-50/70"
                                      : isCompleted
                                        ? "border-green-500 bg-green-50/40"
                                        : "border-transparent bg-white hover:bg-slate-50"
                                  }`}
                                >
                                  <div className="flex flex-col gap-5">
                                    <div className="flex min-w-0 items-start gap-4">
                                      <div
                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                                          isCompleted
                                            ? "bg-green-100"
                                            : "bg-blue-50"
                                        }`}
                                      >
                                        {isCompleted ? (
                                          <CheckCircle2
                                            className="text-green-600"
                                            size={21}
                                          />
                                        ) : (
                                          <PlayCircle
                                            className="text-blue-600"
                                            size={21}
                                          />
                                        )}
                                      </div>

                                      <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                          <h4 className="font-semibold text-slate-900">
                                            {lessonIndex + 1}.{" "}
                                            {lesson.title || "Untitled Lesson"}
                                          </h4>

                                          {isCompleted && (
                                            <span className="rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-green-700">
                                              Completed
                                            </span>
                                          )}

                                          {isCurrent && !isCompleted && (
                                            <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-blue-700">
                                              Current Lesson
                                            </span>
                                          )}
                                        </div>

                                        {lesson.description && (
                                          <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">
                                            {lesson.description}
                                          </p>
                                        )}

                                        {lesson.lessonContent && (
                                          <div
                                            className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                                            onClick={(event) =>
                                              event.stopPropagation()
                                            }
                                          >
                                            <div className="mb-3 flex items-center gap-2">
                                              <BookOpen
                                                size={18}
                                                className="text-blue-600"
                                              />
                                              <h5 className="font-bold text-slate-900">
                                                Lesson Content:
                                              </h5>
                                            </div>

                                            <div className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                                              {lesson.lessonContent}
                                            </div>
                                          </div>
                                        )}

                                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500">
                                          <span className="inline-flex items-center gap-1.5">
                                            <Clock3 size={14} />
                                            {formatLessonDuration(
                                              lesson.duration,
                                            )}
                                          </span>

                                          {lesson.videoUrl && (
                                            <a
                                              href={lesson.videoUrl}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                                            >
                                              Watch lesson
                                              <ExternalLink size={12} />
                                            </a>
                                          )}
                                        </div>

                                        {Array.isArray(lesson.resources) &&
                                          lesson.resources.length > 0 && (
                                            <div className="mt-3 flex flex-wrap gap-3">
                                              {lesson.resources.map(
                                                (resource, resourceIndex) => {
                                                  if (
                                                    typeof resource !==
                                                      "string" ||
                                                    !resource.trim()
                                                  ) {
                                                    return null;
                                                  }

                                                  return (
                                                    <a
                                                      key={`${resource}-${resourceIndex}`}
                                                      href={resource}
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                      className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
                                                    >
                                                      Resource{" "}
                                                      {resourceIndex + 1}
                                                      <ExternalLink size={12} />
                                                    </a>
                                                  );
                                                },
                                              )}
                                            </div>
                                          )}

                                        <div className="mt-5 border-t border-slate-200 pt-4">
                                          {openNoteLessonId ===
                                          String(lessonId) ? (
                                            <div
                                              className="rounded-2xl border border-blue-200 bg-blue-50/60 p-4"
                                              onClick={(event) =>
                                                event.stopPropagation()
                                              }
                                            >
                                              <div className="flex items-center gap-2">
                                                <StickyNote
                                                  size={18}
                                                  className="text-blue-600"
                                                />
                                                <p className="text-sm font-bold text-slate-900">
                                                  Lesson Note
                                                </p>
                                              </div>

                                              <textarea
                                                value={noteDraft}
                                                onChange={(event) =>
                                                  setNoteDraft(
                                                    event.target.value,
                                                  )
                                                }
                                                onClick={(event) =>
                                                  event.stopPropagation()
                                                }
                                                rows={4}
                                                placeholder="Write something you want to remember about this lesson..."
                                                className="mt-3 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                              />

                                              <div className="mt-3 flex flex-wrap items-center gap-3">
                                                <Button
                                                  type="button"
                                                  onClick={(event) => {
                                                    event.stopPropagation();
                                                    handleSaveNote(lessonId);
                                                  }}
                                                >
                                                  <Save
                                                    className="mr-2"
                                                    size={16}
                                                  />
                                                  Save Note
                                                </Button>

                                                <button
                                                  type="button"
                                                  onClick={(event) => {
                                                    event.stopPropagation();
                                                    handleCancelNote();
                                                  }}
                                                  className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                                                >
                                                  <X size={16} />
                                                  Cancel
                                                </button>
                                              </div>
                                            </div>
                                          ) : lessonNotes[String(lessonId)] ? (
                                            <div
                                              className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4"
                                              onClick={(event) =>
                                                event.stopPropagation()
                                              }
                                            >
                                              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                <div className="flex min-w-0 items-start gap-3">
                                                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100">
                                                    <StickyNote
                                                      size={17}
                                                      className="text-amber-600"
                                                    />
                                                  </div>

                                                  <div className="min-w-0">
                                                    <p className="text-xs font-bold uppercase tracking-wide text-amber-700">
                                                      My Note
                                                    </p>
                                                    <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                                                      {
                                                        lessonNotes[
                                                          String(lessonId)
                                                        ]
                                                      }
                                                    </p>
                                                  </div>
                                                </div>

                                                <div className="flex shrink-0 items-center gap-2">
                                                  <button
                                                    type="button"
                                                    onClick={(event) => {
                                                      event.stopPropagation();
                                                      handleOpenNote(lessonId);
                                                    }}
                                                    className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                                                  >
                                                    <Pencil size={14} />
                                                    Edit
                                                  </button>

                                                  <button
                                                    type="button"
                                                    onClick={(event) => {
                                                      event.stopPropagation();
                                                      handleDeleteNote(
                                                        lessonId,
                                                      );
                                                    }}
                                                    className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                                                  >
                                                    <Trash2 size={14} />
                                                    Delete
                                                  </button>
                                                </div>
                                              </div>
                                            </div>
                                          ) : (
                                            <button
                                              type="button"
                                              onClick={(event) => {
                                                event.stopPropagation();
                                                handleOpenNote(lessonId);
                                              }}
                                              className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                                            >
                                              <Plus size={17} />
                                              <StickyNote size={16} />
                                              Add Note
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="px-5 py-6 text-sm text-slate-500 sm:px-6">
                            Lessons for this module will be added soon.
                          </div>
                        )}

                        {assessment && (
                          <div className="border-t bg-gradient-to-br from-blue-50 to-slate-50 px-5 py-6 sm:px-6">
                            <div className="flex flex-col gap-5">
                              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                                <div className="flex min-w-0 items-start gap-4">
                                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100">
                                    <ClipboardCheck
                                      className="text-blue-600"
                                      size={22}
                                    />
                                  </div>

                                  <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <h4 className="font-bold text-slate-900">
                                        {assessment.title ||
                                          "Module Assessment"}
                                      </h4>

                                      <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-blue-700">
                                        {assessment.type === "project"
                                          ? "Project"
                                          : "Exercise"}
                                      </span>

                                      {assessment.required && (
                                        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-amber-700">
                                          Required
                                        </span>
                                      )}
                                    </div>

                                    {assessment.description && (
                                      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                                        {assessment.description}
                                      </p>
                                    )}

                                    {assessment.instructions && (
                                      <div className="mt-5">
                                        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                                          Instructions
                                        </p>
                                        <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                                          {assessment.instructions}
                                        </p>
                                      </div>
                                    )}

                                    {Array.isArray(assessment.requirements) &&
                                      assessment.requirements.length > 0 && (
                                        <div className="mt-5">
                                          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                                            Requirements
                                          </p>

                                          <ul className="mt-2 space-y-2">
                                            {assessment.requirements.map(
                                              (
                                                requirement,
                                                requirementIndex,
                                              ) => (
                                                <li
                                                  key={`${requirement}-${requirementIndex}`}
                                                  className="flex items-start gap-2 text-sm leading-6 text-slate-700"
                                                >
                                                  <CheckCircle2
                                                    className="mt-1 shrink-0 text-green-500"
                                                    size={16}
                                                  />
                                                  <span>{requirement}</span>
                                                </li>
                                              ),
                                            )}
                                          </ul>
                                        </div>
                                      )}

                                    {Array.isArray(assessment.resources) &&
                                      assessment.resources.length > 0 && (
                                        <div className="mt-5">
                                          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                                            Resources
                                          </p>

                                          <div className="mt-2 flex flex-wrap gap-3">
                                            {assessment.resources.map(
                                              (resource, resourceIndex) => {
                                                if (
                                                  typeof resource !==
                                                    "string" ||
                                                  !resource.trim()
                                                ) {
                                                  return null;
                                                }

                                                return (
                                                  <a
                                                    key={`${resource}-${resourceIndex}`}
                                                    href={resource}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-50"
                                                  >
                                                    Resource {resourceIndex + 1}
                                                    <ExternalLink size={13} />
                                                  </a>
                                                );
                                              },
                                            )}
                                          </div>
                                        </div>
                                      )}
                                  </div>
                                </div>

                                <div className="shrink-0">
                                  <span className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-500">
                                    <ClipboardCheck size={17} />
                                    Assessment
                                  </span>
                                </div>
                              </div>

                              {assessment.submissionType &&
                                assessment.submissionType !== "none" && (
                                  <div className="rounded-2xl border border-blue-200 bg-white p-5 shadow-sm">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                      <div>
                                        <p className="text-sm font-bold text-slate-900">
                                          Submit Your Assessment
                                        </p>
                                        <p className="mt-1 text-xs leading-5 text-slate-500">
                                          Submit your work before marking this
                                          module as complete.
                                        </p>
                                      </div>

                                      <span className="inline-flex w-fit items-center rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold capitalize text-blue-700">
                                        {assessment.submissionType === "url"
                                          ? "Project URL"
                                          : assessment.submissionType}
                                      </span>
                                    </div>

                                    {(() => {
                                      const submission =
                                        getAssessmentSubmission(module);
                                      const draft =
                                        getAssessmentDraft(moduleKey);
                                      const isSubmitting =
                                        String(submittingAssessment || "") ===
                                        String(moduleKey);

                                      return (
                                        <>
                                          {submission && (
                                            <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4">
                                              <div className="flex items-start gap-3">
                                                <CheckCircle2
                                                  className="mt-0.5 shrink-0 text-green-600"
                                                  size={20}
                                                />
                                                <div>
                                                  <p className="text-sm font-bold text-green-800">
                                                    Assessment Submitted
                                                  </p>
                                                  <p className="mt-1 text-xs text-green-700">
                                                    Status:{" "}
                                                    <span className="font-bold capitalize">
                                                      {submission.status ||
                                                        "submitted"}
                                                    </span>
                                                  </p>
                                                  {submission.submittedAt && (
                                                    <p className="mt-1 text-xs text-green-700/80">
                                                      Submitted{" "}
                                                      {formatDate(
                                                        submission.submittedAt,
                                                      )}
                                                    </p>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          )}

                                          {assessment.submissionType ===
                                            "text" && (
                                            <div className="mt-5">
                                              <label
                                                htmlFor={`assessment-text-${moduleKey}`}
                                                className="text-sm font-semibold text-slate-700"
                                              >
                                                Your Response
                                              </label>
                                              <textarea
                                                id={`assessment-text-${moduleKey}`}
                                                value={draft.text || ""}
                                                onChange={(event) =>
                                                  handleAssessmentDraftChange(
                                                    moduleKey,
                                                    "text",
                                                    event.target.value,
                                                  )
                                                }
                                                rows={7}
                                                placeholder="Enter your assessment response..."
                                                className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                                              />
                                            </div>
                                          )}

                                          {assessment.submissionType ===
                                            "url" && (
                                            <div className="mt-5">
                                              <label
                                                htmlFor={`assessment-url-${moduleKey}`}
                                                className="text-sm font-semibold text-slate-700"
                                              >
                                                Project URL
                                              </label>
                                              <input
                                                id={`assessment-url-${moduleKey}`}
                                                type="url"
                                                value={draft.url || ""}
                                                onChange={(event) =>
                                                  handleAssessmentDraftChange(
                                                    moduleKey,
                                                    "url",
                                                    event.target.value,
                                                  )
                                                }
                                                placeholder="https://github.com/username/project"
                                                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                                              />
                                            </div>
                                          )}

                                          {assessment.submissionType ===
                                            "file" && (
                                            <div className="mt-5">
                                              <label
                                                htmlFor={`assessment-file-${moduleKey}`}
                                                className="text-sm font-semibold text-slate-700"
                                              >
                                                Assessment File
                                              </label>

                                              <div className="mt-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 transition hover:border-blue-300 hover:bg-blue-50/40">
                                                <input
                                                  id={`assessment-file-${moduleKey}`}
                                                  type="file"
                                                  onChange={(event) =>
                                                    handleAssessmentFileChange(
                                                      moduleKey,
                                                      event.target.files?.[0] ||
                                                        null,
                                                    )
                                                  }
                                                  className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-700"
                                                />

                                                <p className="mt-2 text-xs text-slate-500">
                                                  Maximum file size: 10MB.
                                                </p>

                                                {assessmentFiles[moduleKey] && (
                                                  <p className="mt-3 text-xs font-semibold text-blue-600">
                                                    Selected:{" "}
                                                    {
                                                      assessmentFiles[moduleKey]
                                                        .name
                                                    }
                                                  </p>
                                                )}
                                              </div>
                                            </div>
                                          )}

                                          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                            <p className="text-xs leading-5 text-slate-500">
                                              You can resubmit your work if you
                                              need to make changes.
                                            </p>

                                            <Button
                                              type="button"
                                              onClick={(event) => {
                                                event.stopPropagation();
                                                handleSubmitAssessment(module);
                                              }}
                                              disabled={isSubmitting}
                                              className="w-full sm:w-auto"
                                            >
                                              {isSubmitting ? (
                                                <>
                                                  <Loader2
                                                    className="mr-2 animate-spin"
                                                    size={17}
                                                  />
                                                  Submitting...
                                                </>
                                              ) : (
                                                <>
                                                  <ClipboardCheck
                                                    className="mr-2"
                                                    size={17}
                                                  />
                                                  {submission
                                                    ? "Resubmit Assessment"
                                                    : "Submit Assessment"}
                                                </>
                                              )}
                                            </Button>
                                          </div>
                                        </>
                                      );
                                    })()}
                                  </div>
                                )}
                            </div>
                          </div>
                        )}

                        {(() => {
                          const completedModuleIds = new Set(
                            (progress?.completedModules || []).map((moduleId) =>
                              String(moduleId),
                            ),
                          );

                          const moduleIsCompleted = completedModuleIds.has(
                            String(module?._id),
                          );

                          const allLessonsCompleted =
                            lessons.length === 0 ||
                            lessons.every(
                              (lesson) =>
                                lesson?._id &&
                                completedLessonIds.has(String(lesson._id)),
                            );

                          const assessmentRequired =
                            Boolean(assessment?.required) &&
                            assessment?.submissionType !== "none";

                          const assessmentSubmission =
                            getAssessmentSubmission(module);
                          const assessmentSubmitted =
                            Boolean(assessmentSubmission);
                          const canCompleteModule =
                            allLessonsCompleted &&
                            (!assessmentRequired || assessmentSubmitted);

                          const isCompletingModule =
                            String(completingModule || "") ===
                            String(moduleKey);

                          return (
                            <div className="border-t bg-white px-5 py-5 sm:px-6">
                              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                  <p className="text-sm font-bold text-slate-900">
                                    Module Completion
                                  </p>

                                  {moduleIsCompleted ? (
                                    <p className="mt-1 text-xs leading-5 text-green-600">
                                      You have completed this module.
                                    </p>
                                  ) : !allLessonsCompleted ? (
                                    <p className="mt-1 text-xs leading-5 text-slate-500">
                                      Complete all lessons in this module first.
                                    </p>
                                  ) : assessmentRequired &&
                                    !assessmentSubmitted ? (
                                    <p className="mt-1 text-xs leading-5 text-amber-600">
                                      Submit the required assessment before
                                      completing this module.
                                    </p>
                                  ) : (
                                    <p className="mt-1 text-xs leading-5 text-slate-500">
                                      Your lessons and required assessment are
                                      complete. You can now mark this module as
                                      complete.
                                    </p>
                                  )}
                                </div>

                                {moduleIsCompleted ? (
                                  <div className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-100 px-4 py-2.5 text-sm font-semibold text-green-700">
                                    <CheckCircle2 size={17} />
                                    Module Complete
                                  </div>
                                ) : (
                                  <Button
                                    type="button"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      handleCompleteModule(module);
                                    }}
                                    disabled={
                                      !canCompleteModule ||
                                      Boolean(completingModule)
                                    }
                                    className="w-full sm:w-auto"
                                  >
                                    {isCompletingModule ? (
                                      <>
                                        <Loader2
                                          className="mr-2 animate-spin"
                                          size={17}
                                        />
                                        Completing...
                                      </>
                                    ) : (
                                      <>
                                        Mark Module Complete
                                        <CheckCircle2
                                          className="ml-2"
                                          size={17}
                                        />
                                      </>
                                    )}
                                  </Button>
                                )}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </Card>
                );
              })}

              {allLessons.length > 0 && (
                <div className="mt-8 flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={!previousLesson}
                    onClick={handlePreviousLesson}
                    className="w-full sm:w-auto"
                  >
                    <ArrowLeft className="mr-2" size={18} />
                    <span>
                      {previousLesson ? "Previous Lesson" : "First Lesson"}
                    </span>
                  </Button>

                  <div className="text-center">
                    {currentLessonIndex >= 0 && (
                      <p className="text-xs font-semibold text-slate-500">
                        Lesson {currentLessonIndex + 1} of {allLessons.length}
                      </p>
                    )}
                  </div>

                  <Button
                    type="button"
                    disabled={!nextLesson}
                    onClick={handleNextLesson}
                    className="w-full sm:w-auto"
                  >
                    <span>
                      {nextLesson ? "Next Lesson" : "Course Complete"}
                    </span>
                    {nextLesson && <ArrowRight className="ml-2" size={18} />}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <Card className="mt-12 text-center lg:mt-16">
              <BookOpen className="mx-auto text-blue-500" size={42} />

              <h3 className="mt-5 text-xl font-bold text-slate-900">
                Curriculum Coming Soon
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                The curriculum for this course is being prepared.
              </p>
            </Card>
          )}
        </div>
      </section>

      )}

      {/* ==================================================
          CERTIFICATE
      ================================================== */}

      {isEnrolled && (
      <section className="py-10 sm:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <Card className="text-center">
            <Award className="mx-auto text-yellow-500" size={60} />

            <h2 className="mt-8 text-3xl font-black text-slate-900 sm:text-4xl">
              Earn Your Certificate
            </h2>

            <p className="mx-auto mt-6 max-w-2xl leading-8 text-slate-600">
              Complete the required course lessons and assessments to receive
              your KanuorieTech Certificate of Completion.
            </p>

            {progressPercentage >= 100 && (
              <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-yellow-200 bg-yellow-50 p-5">
                <div className="flex items-center justify-center gap-2 font-bold text-yellow-800">
                  <Trophy size={20} />
                  Lesson requirements completed
                </div>

                <p className="mt-2 text-sm leading-6 text-yellow-700">
                  Your remaining assessments and final course requirements will
                  determine certificate eligibility.
                </p>
              </div>
            )}
          </Card>
        </div>
      </section>

      )}

      {/* ==================================================
          INSTRUCTOR
      ================================================== */}

      <section className="py-10 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionTitle
            title="Meet Your Instructor"
            subtitle="Learn from experienced professionals."
          />

          <Card className="mt-12 flex flex-col gap-7 sm:p-8 lg:mt-16 lg:flex-row lg:items-center">
            <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full bg-blue-100 sm:h-40 sm:w-40">
              <span className="text-4xl font-black text-blue-600">
                {(course.instructor || "K").charAt(0).toUpperCase()}
              </span>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                {course.instructor || "KanuorieTech"}
              </h3>

              <p className="mt-4 leading-8 text-slate-600">
                Experienced software engineer passionate about helping
                developers build practical skills through project-based
                learning. Learn practical, real-world development skills through
                structured lessons, projects, and production-focused workflows.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* ==================================================
          RELATED COURSES
      ================================================== */}

      {relatedCourses.length > 0 && (
        <section className="bg-slate-50 py-10 sm:py-24">
          <div className="mx-auto max-w-7xl px-6">
            <SectionTitle
              title="Related Courses"
              subtitle="Continue learning with these courses."
            />

            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:mt-16 lg:grid-cols-3">
              {relatedCourses.map((item) => (
                <Card key={item._id} hover className="overflow-hidden p-0">
                  <img
                    src={getImage(item.image)}
                    alt={item.title || "Course"}
                    className="h-52 w-full object-cover"
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = COURSE_IMAGE_FALLBACK;
                    }}
                  />

                  <div className="p-6">
                    <div className="flex flex-wrap items-center gap-2">
                      {item.level && (
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                          {item.level}
                        </span>
                      )}

                      {item.category && (
                        <span className="text-xs text-slate-500">
                          {item.category}
                        </span>
                      )}
                    </div>

                    <h3 className="mt-4 line-clamp-2 text-xl font-bold text-slate-900">
                      {item.title}
                    </h3>

                    <p className="mt-4 line-clamp-3 leading-7 text-slate-600">
                      {item.description}
                    </p>

                    <div className="mt-5 flex items-center gap-4 text-sm text-slate-500">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock3 size={15} />
                        {formatCourseDuration(item.duration)}
                      </span>
                    </div>

                    <Link
                      to={`/courses/${item.slug || item._id}`}
                      className="mt-6 block"
                    >
                      <Button fullWidth>
                        View Course
                        <ArrowRight className="ml-2" size={18} />
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
      <Newsletter />
      <CTA />
    </>
  );
}




