import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import {
  BookOpen,
  Clock3,
  Star,
  Users,
  Award,
  PlayCircle,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";

import {
  Loader,
  Button,
  Card,
  SectionTitle,
  Badge,
} from "../components/common";

import { Newsletter, CTA } from "../components/home";

import { getCourse, enrollCourse, getCourses } from "../services";

/* ==========================================
   HELPERS
========================================== */

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

/* ==========================================
   COMPONENT
========================================== */

export default function CourseDetails() {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [relatedCourses, setRelatedCourses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  const [openModules, setOpenModules] = useState({});

  /* ==========================================
     LOAD COURSE
  ========================================== */

  useEffect(() => {
    let isMounted = true;

    const loadCourse = async () => {
      setLoading(true);
      setCourse(null);
      setRelatedCourses([]);

      try {
        const [courseRes, coursesRes] = await Promise.all([
          getCourse(id),
          getCourses(),
        ]);

        if (!isMounted) {
          return;
        }

        const fetchedCourse = courseRes?.data || null;
        const fetchedCourses = Array.isArray(coursesRes?.data)
          ? coursesRes.data
          : [];

        setCourse(fetchedCourse);

        if (fetchedCourse) {
          /*
           * Open the first module by default.
           */
          const firstModule = fetchedCourse.modules?.[0];

          if (firstModule) {
            setOpenModules({
              [firstModule._id || firstModule.order || 0]: true,
            });
          }

          /*
           * Related courses:
           *
           * Prefer the same category, then fill the
           * remaining slots with other courses.
           */
          const availableCourses = fetchedCourses.filter(
            (item) => item?._id && item._id !== fetchedCourse._id,
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

          setRelatedCourses(
            [...sameCategory, ...otherCourses]
              .filter((item) => item?.published !== false)
              .slice(0, 3),
          );
        }
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

  /* ==========================================
     COURSE CALCULATIONS
  ========================================== */

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

  const rating = Number(course?.rating || 0);
  const enrollments = Number(course?.enrollments || 0);

  const formattedDate = formatDate(course?.createdAt);

  /* ==========================================
     MODULE ACCORDION
  ========================================== */

  const toggleModule = (moduleKey) => {
    setOpenModules((previous) => ({
      ...previous,
      [moduleKey]: !previous[moduleKey],
    }));
  };

  /* ==========================================
     ENROLL
  ========================================== */

  const handleEnroll = async () => {
    if (!id || enrolling) {
      return;
    }

    try {
      setEnrolling(true);

      await enrollCourse(id);

      toast.success("Successfully enrolled in this course!");

      /*
       * Update the local enrollment count immediately
       * so the page reflects the successful enrollment.
       */
      setCourse((previous) => {
        if (!previous) {
          return previous;
        }

        return {
          ...previous,
          enrollments: Number(previous.enrollments || 0) + 1,
        };
      });
    } catch (error) {
      console.error("Course enrollment failed:", error);

      const message = getApiMessage(error, "Unable to enroll in this course.");

      toast.error(message);
    } finally {
      setEnrolling(false);
    }
  };

  /* ==========================================
     LOADING STATE
  ========================================== */

  if (loading) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center px-6">
        <Loader />
      </section>
    );
  }

  /* ==========================================
     NOT FOUND STATE
  ========================================== */

  if (!course) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_.8fr] lg:gap-16">
            {/* LEFT */}

            <motion.div
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
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

              {/* Tags */}
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
          </div>
      </section>
    );
  }

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:45px_45px]" />

        <div className="relative mx-auto max-w-7xl px-6 py-16 sm:py-20 lg:py-24">
          {/* Back link */}

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
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
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

              {/* Tags */}
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
          </div>
        </div>
      </section>
      
      {/* ========================================
          COURSE INFORMATION
      ======================================== */}

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
                  <p className="text-sm text-slate-500">Lessons</p>

                  <p className="mt-1 font-bold text-slate-900">
                    {totalLessons}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-blue-50 p-3">
                  <Users className="text-blue-600" size={22} />
                </div>

                <div>
                  <p className="text-sm text-slate-500">Enrolled Students</p>

                  <p className="mt-1 font-bold text-slate-900">
                    {enrollments.toLocaleString()}
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

      {/* ========================================
          REQUIREMENTS
      ======================================== */}

      <section className="bg-slate-50 py-20 sm:py-24">
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

      {/* ========================================
          WHAT YOU'LL LEARN
      ======================================== */}

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

      {/* ========================================
          COURSE CURRICULUM
      ======================================== */}

      <section className="bg-slate-50 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <SectionTitle
            title="Course Curriculum"
            subtitle={`${modules.length} ${
              modules.length === 1 ? "module" : "modules"
            } • ${totalLessons} ${totalLessons === 1 ? "lesson" : "lessons"}`}
          />

          {/* Curriculum summary */}

          {totalLearningHours && (
            <div className="mt-8 flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
                <Clock3 size={16} />
                Approximately {totalLearningHours} hours of lesson content
              </div>
            </div>
          )}

          {modules.length > 0 ? (
            <div className="mt-12 space-y-4 lg:mt-16">
              {modules.map((module, moduleIndex) => {
                const moduleKey = module._id || `module-${moduleIndex}`;

                const lessons = Array.isArray(module.lessons)
                  ? [...module.lessons].sort(
                      (a, b) => Number(a?.order || 0) - Number(b?.order || 0),
                    )
                  : [];

                const isOpen = Boolean(openModules[moduleKey]);

                return (
                  <Card key={moduleKey} className="overflow-hidden p-0">
                    {/* Module header */}

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

                          <p className="mt-1 text-sm text-slate-500">
                            {lessons.length}{" "}
                            {lessons.length === 1 ? "lesson" : "lessons"}
                          </p>
                        </div>
                      </div>

                      {isOpen ? (
                        <ChevronUp
                          className="shrink-0 text-slate-500"
                          size={22}
                        />
                      ) : (
                        <ChevronDown
                          className="shrink-0 text-slate-500"
                          size={22}
                        />
                      )}
                    </button>

                    {/* Module content */}

                    {isOpen && (
                      <div className="border-t bg-white">
                        {module.description && (
                          <div className="border-b px-5 py-5 sm:px-6">
                            <p className="leading-7 text-slate-600">
                              {module.description}
                            </p>
                          </div>
                        )}

                        {lessons.length > 0 ? (
                          <div className="divide-y">
                            {lessons.map((lesson, lessonIndex) => (
                              <div
                                key={
                                  lesson._id ||
                                  `${moduleKey}-lesson-${lessonIndex}`
                                }
                                className="flex items-center justify-between gap-5 px-5 py-5 sm:px-6"
                              >
                                <div className="flex min-w-0 items-center gap-4">
                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50">
                                    <PlayCircle
                                      className="text-blue-600"
                                      size={21}
                                    />
                                  </div>

                                  <div className="min-w-0">
                                    <h4 className="font-semibold text-slate-900">
                                      {lessonIndex + 1}.{" "}
                                      {lesson.title || "Untitled Lesson"}
                                    </h4>

                                    {lesson.description && (
                                      <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">
                                        {lesson.description}
                                      </p>
                                    )}

                                    {Array.isArray(lesson.resources) &&
                                      lesson.resources.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-3">
                                          {lesson.resources.map(
                                            (resource, resourceIndex) => {
                                              if (
                                                typeof resource !== "string" ||
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
                                                  Resource {resourceIndex + 1}
                                                  <ExternalLink size={12} />
                                                </a>
                                              );
                                            },
                                          )}
                                        </div>
                                      )}
                                  </div>
                                </div>

                                <span className="shrink-0 text-xs font-medium text-slate-500 sm:text-sm">
                                  {formatLessonDuration(lesson.duration)}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="px-5 py-6 text-sm text-slate-500 sm:px-6">
                            Lessons for this module will be added soon.
                          </div>
                        )}
                      </div>
                    )}
                  </Card>
                );
              })}
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

      {/* ========================================
          CERTIFICATE
      ======================================== */}

      <section className="py-20 sm:py-24">
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
          </Card>
        </div>
      </section>

      {/* ========================================
          INSTRUCTOR
      ======================================== */}

      <section className="py-20 sm:py-24">
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

      {/* ========================================
          RELATED COURSES
      ======================================== */}

      {relatedCourses.length > 0 && (
        <section className="bg-slate-50 py-20 sm:py-24">
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

                      <span className="inline-flex items-center gap-1.5">
                        <BookOpen size={15} />
                        {Array.isArray(item.modules)
                          ? item.modules.reduce(
                              (total, module) =>
                                total +
                                (Array.isArray(module?.lessons)
                                  ? module.lessons.length
                                  : 0),
                              0,
                            )
                          : 0}{" "}
                        lessons
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

      {/* ========================================
          NEWSLETTER / CTA
      ======================================== */}

      <Newsletter />

      <CTA />
    </>
  );
}
