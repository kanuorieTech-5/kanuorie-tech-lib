import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Library,
  PlayCircle,
  Search,
  Sparkles,
  Bookmark,
} from "lucide-react";

import { Card, Button, Loader, Badge } from "../components/common";
import { getCourses, enrollCourse } from "../services/course.service";
import { getProgress } from "../services/progress.service";
import { useAuth } from "../contexts";

/* ==========================================
   HELPERS
========================================== */

const getListFromResponse = (response) => {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.data?.items)) {
    return response.data.items;
  }

  if (Array.isArray(response?.data?.courses)) {
    return response.data.courses;
  }

  if (Array.isArray(response?.data?.progress)) {
    return response.data.progress;
  }

  if (Array.isArray(response?.items)) {
    return response.items;
  }

  return [];
};

const getCourseId = (course) =>
  course?._id || course?.id || course?.course?._id || null;

const getCourseImage = (course) =>
  course?.image ||
  course?.cover ||
  "/images/course-placeholder.png";

const formatDuration = (duration) => {
  const hours = Number(duration || 0);

  if (!hours) {
    return "Self-paced";
  }

  return `${hours} ${hours === 1 ? "hour" : "hours"}`;
};

const getProgressPercentage = (item) => {
  const percentage = Number(item?.percentage);

  if (Number.isFinite(percentage)) {
    return Math.min(Math.max(Math.round(percentage), 0), 100);
  }

  return 0;
};

const getCompletedCount = (item) => {
  if (Array.isArray(item?.completedLessons)) {
    return item.completedLessons.length;
  }

  return 0;
};

const getTotalLessons = (item) => {
  const total = Number(item?.totalLessons);

  return Number.isFinite(total) && total > 0 ? total : 0;
};

/* ==========================================
   COURSE CARD
========================================== */

function ExploreCourseCard({
  course,
  enrolled,
  enrollingId,
  onEnroll,
}) {
  const courseId = getCourseId(course);
  const isEnrolling = enrollingId === courseId;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className="flex h-full flex-col overflow-hidden p-0">
        <div className="relative h-52 overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={getCourseImage(course)}
            alt={course?.title || "Course"}
            className="h-full w-full object-cover transition duration-500 hover:scale-105"
            onError={(event) => {
              event.currentTarget.src =
                "/images/course-placeholder.png";
            }}
          />

          <div className="absolute left-4 top-4">
            <Badge>{course?.category || "General"}</Badge>
          </div>

          {course?.premium && (
            <div className="absolute right-4 top-4">
              <Badge>Premium</Badge>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-6">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>{course?.level || "Beginner"}</span>

            <span>•</span>

            <span className="flex items-center gap-1">
              <Clock3 size={14} />
              {formatDuration(course?.duration)}
            </span>
          </div>

          <h3 className="mt-3 line-clamp-2 text-xl font-bold text-slate-900 dark:text-white">
            {course?.title || "Untitled Course"}
          </h3>

          <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
            {course?.description ||
              "Explore this course and start learning with KanuorieTech."}
          </p>

          <div className="mt-6 flex gap-3">
            {enrolled ? (
              <Link to={`/courses/${courseId}`} className="flex-1">
                <Button className="w-full">
                  Continue
                  <ArrowRight className="ml-2" size={17} />
                </Button>
              </Link>
            ) : (
              <Button
                className="flex-1"
                disabled={isEnrolling}
                onClick={() => onEnroll(courseId)}
              >
                {isEnrolling ? (
                  "Enrolling..."
                ) : (
                  <>
                    Enroll Now
                    <ArrowRight className="ml-2" size={17} />
                  </>
                )}
              </Button>
            )}

            <Link to={`/courses/${courseId}`}>
              <Button variant="outline">
                View
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

/* ==========================================
   LEARNING CARD
========================================== */

function LearningCard({ item }) {
  const course = item?.course;
  const courseId = getCourseId(course);

  const percentage = getProgressPercentage(item);
  const completed = getCompletedCount(item);
  const total = getTotalLessons(item);

  const isCompleted =
    percentage >= 100 || item?.status === "completed";

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className="flex h-full flex-col overflow-hidden p-0">
        <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={getCourseImage(course)}
            alt={course?.title || "Course"}
            className="h-full w-full object-cover transition duration-500 hover:scale-105"
            onError={(event) => {
              event.currentTarget.src =
                "/images/course-placeholder.png";
            }}
          />

          <div className="absolute left-4 top-4">
            {isCompleted ? (
              <Badge>Completed</Badge>
            ) : (
              <Badge>In Progress</Badge>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>{course?.category || "General"}</span>
            <span>•</span>
            <span>{course?.level || "Beginner"}</span>
          </div>

          <h3 className="mt-3 line-clamp-2 text-xl font-bold text-slate-900 dark:text-white">
            {course?.title || "Course"}
          </h3>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-600 dark:text-slate-400">
                Progress
              </span>

              <span className="font-bold text-blue-600 dark:text-blue-400">
                {percentage}%
              </span>
            </div>

            <div className="h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <BookOpen size={16} />

            {total > 0 ? (
              <span>
                {completed} of {total} lessons completed
              </span>
            ) : (
              <span>
                {completed} lessons completed
              </span>
            )}
          </div>

          <div className="mt-6">
            <Link to={`/courses/${courseId}`}>
              <Button className="w-full">
                {isCompleted ? (
                  <>
                    <CheckCircle2 className="mr-2" size={17} />
                    Review Course
                  </>
                ) : (
                  <>
                    <PlayCircle className="mr-2" size={17} />
                    Continue Learning
                  </>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

/* ==========================================
   EMPTY STATE
========================================== */

function EmptyLearningState() {
  return (
    <Card className="py-14 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
        <GraduationCap size={30} />
      </div>

      <h3 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">
        Your learning journey starts here
      </h3>

      <p className="mx-auto mt-3 max-w-xl text-slate-500 dark:text-slate-400">
        You haven't enrolled in a course yet. Explore the available
        courses below and start learning.
      </p>

      <a href="#explore-courses">
        <Button className="mt-6">
          Explore Courses
          <ArrowRight className="ml-2" size={17} />
        </Button>
      </a>
    </Card>
  );
}

/* ==========================================
   SAVED RESOURCES PLACEHOLDER

   The current backend does not yet have a
   user-specific saved-resource relationship.
   We therefore do not pretend that public
   books are "saved" by this user.
========================================== */

function SavedResourcesSection({ isAuthenticated }) {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Bookmark size={20} />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Personal Library
              </span>
            </div>

            <h2 className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
              Saved Resources
            </h2>

            <p className="mt-2 max-w-2xl text-slate-500 dark:text-slate-400">
              Keep useful learning resources close by for later.
            </p>
          </div>
        </div>

        <Card className="border-dashed py-12 text-center">
          <Library
            size={42}
            className="mx-auto text-slate-400 dark:text-slate-600"
          />

          <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
            No saved resources yet
          </h3>

          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500 dark:text-slate-400">
            {isAuthenticated
              ? "Your saved-resource collection will appear here when saving resources is enabled for your account."
              : "Log in to manage your personal learning library."}
          </p>
        </Card>
      </div>
    </section>
  );
}

/* ==========================================
   MAIN PAGE
========================================== */

export default function Books() {
  const { user } = useAuth();

  const isAuthenticated = Boolean(user);

  const [courses, setCourses] = useState([]);
  const [learning, setLearning] = useState([]);

  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingLearning, setLoadingLearning] = useState(
    isAuthenticated,
  );

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All");

  const [enrollingId, setEnrollingId] = useState(null);
  const [error, setError] = useState("");

  /* ==========================================
     LOAD PUBLIC COURSES
  ========================================== */

  useEffect(() => {
    let mounted = true;

    const loadCourses = async () => {
      try {
        setLoadingCourses(true);
        setError("");

        const response = await getCourses();

        if (!mounted) return;

        const items = getListFromResponse(response);

        const publishedCourses = items.filter(
          (course) => course?.published !== false,
        );

        setCourses(publishedCourses);
      } catch (err) {
        console.error("Failed to load courses:", err);

        if (mounted) {
          setError(
            err?.response?.data?.message ||
              "We couldn't load the course catalog.",
          );
        }
      } finally {
        if (mounted) {
          setLoadingCourses(false);
        }
      }
    };

    loadCourses();

    return () => {
      mounted = false;
    };
  }, []);

  /* ==========================================
     LOAD USER LEARNING PROGRESS
  ========================================== */

  useEffect(() => {
    let mounted = true;

    const loadLearning = async () => {
      if (!isAuthenticated) {
        setLearning([]);
        setLoadingLearning(false);
        return;
      }

      try {
        setLoadingLearning(true);

        const response = await getProgress();

        if (!mounted) return;

        setLearning(getListFromResponse(response));
      } catch (err) {
        console.error("Failed to load learning progress:", err);

        if (mounted) {
          setLearning([]);
        }
      } finally {
        if (mounted) {
          setLoadingLearning(false);
        }
      }
    };

    loadLearning();

    return () => {
      mounted = false;
    };
  }, [isAuthenticated]);

  /* ==========================================
     ENROLLED COURSE IDS
  ========================================== */

  const enrolledCourseIds = useMemo(() => {
    return new Set(
      learning
        .map((item) => getCourseId(item?.course))
        .filter(Boolean)
        .map(String),
    );
  }, [learning]);

  /* ==========================================
     COURSE CATEGORIES
  ========================================== */

  const categories = useMemo(() => {
    const values = courses
      .map((course) => course?.category)
      .filter(Boolean);

    return ["All", ...new Set(values)];
  }, [courses]);

  /* ==========================================
     FILTERED COURSES
  ========================================== */

  const filteredCourses = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return courses.filter((course) => {
      const matchesSearch =
        !normalizedSearch ||
        course?.title?.toLowerCase().includes(normalizedSearch) ||
        course?.description
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        course?.category
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        course?.instructor
          ?.toLowerCase()
          .includes(normalizedSearch);

      const matchesCategory =
        category === "All" ||
        course?.category === category;

      const matchesLevel =
        level === "All" ||
        course?.level === level;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesLevel
      );
    });
  }, [courses, search, category, level]);

  /* ==========================================
     CONTINUE LEARNING
  ========================================== */

  const continueLearning = useMemo(() => {
    return learning.filter((item) => {
      const percentage = getProgressPercentage(item);

      return (
        percentage < 100 &&
        item?.status !== "completed"
      );
    });
  }, [learning]);

  /* ==========================================
     COMPLETED COURSES
  ========================================== */

  const completedLearning = useMemo(() => {
    return learning.filter((item) => {
      const percentage = getProgressPercentage(item);

      return (
        percentage >= 100 ||
        item?.status === "completed"
      );
    });
  }, [learning]);

  /* ==========================================
     ENROLL
  ========================================== */

  const handleEnroll = async (courseId) => {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }

    if (!courseId) return;

    try {
      setEnrollingId(courseId);
      setError("");

      await enrollCourse(courseId);

      const response = await getProgress();

      setLearning(getListFromResponse(response));
    } catch (err) {
      console.error("Enrollment failed:", err);

      setError(
        err?.response?.data?.message ||
          "We couldn't enroll you in this course.",
      );
    } finally {
      setEnrollingId(null);
    }
  };

  /* ==========================================
     LOADING
  ========================================== */

  if (loadingCourses) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center">
        <Loader />
      </section>
    );
  }

  /* ==========================================
     PAGE
  ========================================== */

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* ========================================
          HERO
      ======================================== */}

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] bg-[size:45px_45px]" />

        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="absolute -bottom-40 left-10 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 text-blue-300">
              <Sparkles size={18} />

              <span className="text-sm font-semibold uppercase tracking-[0.18em]">
                KanuorieTech Learning Hub
              </span>
            </div>

            <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight sm:text-5xl lg:text-7xl">
              Your learning.
              <span className="block text-blue-400">
                Your progress.
              </span>
              Your next skill.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Continue your enrolled courses, track your real
              learning progress, and discover new courses built
              to help you grow with technology.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#my-learning">
                <Button>
                  <GraduationCap className="mr-2" size={18} />
                  My Learning
                </Button>
              </a>

              <a href="#explore-courses">
                <Button variant="outline">
                  Explore Courses
                  <ArrowRight className="ml-2" size={18} />
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========================================
          MY LEARNING
      ======================================== */}

      <section
        id="my-learning"
        className="scroll-mt-24 py-16 lg:py-20"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-10">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <GraduationCap size={20} />

              <span className="text-sm font-semibold uppercase tracking-wider">
                Personal Learning
              </span>
            </div>

            <h2 className="mt-2 text-3xl font-black text-slate-900 dark:text-white sm:text-4xl">
              My Learning
            </h2>

            <p className="mt-3 max-w-2xl text-slate-500 dark:text-slate-400">
              Pick up where you left off and keep building your
              skills.
            </p>
          </div>

          {!isAuthenticated ? (
            <Card className="py-14 text-center">
              <GraduationCap
                size={42}
                className="mx-auto text-slate-400"
              />

              <h3 className="mt-5 text-2xl font-bold text-slate-900 dark:text-white">
                Log in to see your learning
              </h3>

              <p className="mx-auto mt-3 max-w-lg text-slate-500 dark:text-slate-400">
                Your enrolled courses and progress are private to
                your account.
              </p>

              <Link to="/login">
                <Button className="mt-6">
                  Log In
                  <ArrowRight className="ml-2" size={17} />
                </Button>
              </Link>
            </Card>
          ) : loadingLearning ? (
            <div className="flex min-h-[240px] items-center justify-center">
              <Loader />
            </div>
          ) : learning.length === 0 ? (
            <EmptyLearningState />
          ) : (
            <>
              {continueLearning.length > 0 && (
                <div>
                  <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      Continue Learning
                    </h3>

                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {continueLearning.length}{" "}
                      {continueLearning.length === 1
                        ? "course"
                        : "courses"}
                    </span>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {continueLearning.map((item) => (
                      <LearningCard
                        key={item?._id || getCourseId(item?.course)}
                        item={item}
                      />
                    ))}
                  </div>
                </div>
              )}

              {completedLearning.length > 0 && (
                <div
                  className={
                    continueLearning.length > 0
                      ? "mt-14"
                      : ""
                  }
                >
                  <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      Completed
                    </h3>

                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {completedLearning.length}{" "}
                      {completedLearning.length === 1
                        ? "course"
                        : "courses"}
                    </span>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {completedLearning.map((item) => (
                      <LearningCard
                        key={item?._id || getCourseId(item?.course)}
                        item={item}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ========================================
          SAVED RESOURCES
      ======================================== */}

      <SavedResourcesSection
        isAuthenticated={isAuthenticated}
      />

      {/* ========================================
          EXPLORE COURSES
      ======================================== */}

      <section
        id="explore-courses"
        className="scroll-mt-24 border-t border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-900 lg:py-20"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-10">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <BookOpen size={20} />

              <span className="text-sm font-semibold uppercase tracking-wider">
                Course Catalog
              </span>
            </div>

            <h2 className="mt-2 text-3xl font-black text-slate-900 dark:text-white sm:text-4xl">
              Explore Courses
            </h2>

            <p className="mt-3 max-w-2xl text-slate-500 dark:text-slate-400">
              Discover published KanuorieTech courses and find
              your next learning opportunity.
            </p>
          </div>

          {/* SEARCH + FILTERS */}

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60 sm:p-5">
            <div className="relative">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search courses..."
                className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
              />
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <select
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item === "All"
                      ? "All Categories"
                      : item}
                  </option>
                ))}
              </select>

              <select
                value={level}
                onChange={(event) =>
                  setLevel(event.target.value)
                }
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              >
                <option value="All">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">
                  Intermediate
                </option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
              {error}
            </div>
          )}

          {/* COURSE RESULTS */}

          {filteredCourses.length === 0 ? (
            <Card className="mt-10 py-14 text-center">
              <Search
                size={42}
                className="mx-auto text-slate-400"
              />

              <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
                No courses found
              </h3>

              <p className="mt-2 text-slate-500 dark:text-slate-400">
                Try changing your search or filters.
              </p>
            </Card>
          ) : (
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredCourses.map((course) => {
                const courseId = getCourseId(course);

                const enrolled = enrolledCourseIds.has(
                  String(courseId),
                );

                return (
                  <ExploreCourseCard
                    key={courseId}
                    course={course}
                    enrolled={enrolled}
                    enrollingId={enrollingId}
                    onEnroll={handleEnroll}
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ========================================
          FOOTER CTA
      ======================================== */}

      <section className="bg-slate-950 py-16 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center lg:px-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/20 text-blue-400">
            <Sparkles size={27} />
          </div>

          <h2 className="mt-6 text-3xl font-black sm:text-4xl">
            Keep learning. Keep building.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-400">
            Build practical technology skills through structured
            courses and hands-on learning with KanuorieTech.
          </p>

          <a href="#explore-courses">
            <Button className="mt-7">
              Find Your Next Course
              <ArrowRight className="ml-2" size={18} />
            </Button>
          </a>
        </div>
      </section>
    </main>
  );
}