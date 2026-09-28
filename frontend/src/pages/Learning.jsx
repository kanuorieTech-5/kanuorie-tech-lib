import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Flame,
  GraduationCap,
  Heart,
  Library,
  PlayCircle,
  Search,
  Sparkles,
  Trophy,
  Users,
  Wrench,
  Bookmark,
  X,
} from "lucide-react";

import { Card, Button, Loader, Badge } from "../components/common";
import { getCourses, enrollCourse } from "../services/course.service";
import { getProgress } from "../services/progress.service";
import { getSavedResources, removeSavedResource,} from "../services/library.service";
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

/* ==========================================
   LEARNING DASHBOARD HELPERS
========================================== */

const WISHLIST_STORAGE_KEY = "kanuorietech-learning-wishlist";
const STREAK_STORAGE_KEY = "kanuorietech-learning-streak";
const SCHEDULE_STORAGE_KEY = "kanuorietech-learning-schedule";
const REMINDER_STORAGE_KEY = "kanuorietech-learning-reminders";

const getStoredArray = (key) => {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};

const getStoredObject = (key, fallback = {}) => {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "null");
    return value && typeof value === "object" ? value : fallback;
  } catch {
    return fallback;
  }
};

const getTodayKey = () => {
  const date = new Date();

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
};

const getYesterdayKey = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
};

const getCourseId = (course) =>
  course?._id || course?.id || course?.course?._id || null;

const getCourseImage = (course) =>
  course?.image || course?.cover || "/images/course-placeholder.png";

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
  isWishlisted,
  onToggleWishlist,
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
              event.currentTarget.src = "/images/course-placeholder.png";
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

          <button
            type="button"
            onClick={() => onToggleWishlist(courseId)}
            aria-label={
              isWishlisted
                ? "Remove course from wishlist"
                : "Add course to wishlist"
            }
            title={
              isWishlisted
                ? "Remove from wishlist"
                : "Add to wishlist"
            }
            className={`absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full border shadow-lg backdrop-blur-md transition-all duration-200 ${
              isWishlisted
                ? "border-pink-200 bg-pink-500 text-white hover:bg-pink-600"
                : "border-white/30 bg-black/40 text-white hover:bg-black/60"
            }`}
          >
            <Heart
              size={20}
              fill={isWishlisted ? "currentColor" : "none"}
            />
          </button>
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
              <Button variant="outline">View</Button>
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

  const isCompleted = percentage >= 100 || item?.status === "completed";

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
              event.currentTarget.src = "/images/course-placeholder.png";
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
              <span>{completed} lessons completed</span>
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
        You haven't enrolled in a course yet. Explore the available courses
        below and start learning.
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
  const [savedResources, setSavedResources] = useState([]);
  const [loading, setLoading] = useState(isAuthenticated);
  const [removingId, setRemovingId] = useState(null);
  const [error, setError] = useState("");

  const loadSavedResources = async () => {
    if (!isAuthenticated) {
      setSavedResources([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await getSavedResources();

      const items =
        response?.data?.items ||
        response?.data?.resources ||
        response?.items ||
        [];

      setSavedResources(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error("Failed to load saved resources:", err);

      setSavedResources([]);

      setError(
        err?.response?.data?.message ||
          "We couldn't load your saved resources.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSavedResources();

    const handleLibraryUpdate = () => {
      loadSavedResources();
    };

    window.addEventListener("library-update", handleLibraryUpdate);

    return () => {
      window.removeEventListener("library-update", handleLibraryUpdate);
    };
  }, [isAuthenticated]);

  const handleRemove = async (resource) => {
    if (!resource?.resourceId) return;

    const key = `${resource.resourceType}:${resource.resourceId}`;

    try {
      setRemovingId(key);
      setError("");

      await removeSavedResource(resource.resourceId, resource.resourceType);

      setSavedResources((current) =>
        current.filter(
          (item) =>
            !(
              String(item?.resourceId) === String(resource.resourceId) &&
              item?.resourceType === resource.resourceType
            ),
        ),
      );

      window.dispatchEvent(new Event("library-update"));
    } catch (err) {
      console.error("Failed to remove saved resource:", err);

      setError(
        err?.response?.data?.message ||
          "We couldn't remove this saved resource.",
      );
    } finally {
      setRemovingId(null);
    }
  };

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

          {isAuthenticated && savedResources.length > 0 && (
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {savedResources.length}{" "}
              {savedResources.length === 1 ? "resource" : "resources"}
            </span>
          )}
        </div>

        {!isAuthenticated ? (
          <Card className="border-dashed py-12 text-center">
            <Library
              size={42}
              className="mx-auto text-slate-400 dark:text-slate-600"
            />

            <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
              Log in to view your saved resources
            </h3>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500 dark:text-slate-400">
              Your saved resources are private to your account.
            </p>

            <Link to="/login">
              <Button className="mt-6">
                Log In
                <ArrowRight className="ml-2" size={17} />
              </Button>
            </Link>
          </Card>
        ) : loading ? (
          <div className="flex min-h-[220px] items-center justify-center">
            <Loader />
          </div>
        ) : error ? (
          <Card className="border-red-200 bg-red-50 py-12 text-center dark:border-red-900/50 dark:bg-red-950/20">
            <Library size={42} className="mx-auto text-red-400" />

            <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
              Unable to load saved resources
            </h3>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-red-600 dark:text-red-300">
              {error}
            </p>

            <Button className="mt-6" onClick={loadSavedResources}>
              Try Again
            </Button>
          </Card>
        ) : savedResources.length === 0 ? (
          <Card className="border-dashed py-12 text-center">
            <Library
              size={42}
              className="mx-auto text-slate-400 dark:text-slate-600"
            />

            <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
              No saved resources yet
            </h3>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500 dark:text-slate-400">
              Save useful courses, books, and learning resources from the
              Library page and they will appear here.
            </p>

            <Link to="/library">
              <Button className="mt-6">
                Browse Library
                <ArrowRight className="ml-2" size={17} />
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {savedResources.map((resource) => {
              const resourceId = String(resource?.resourceId || "");

              const resourceType = resource?.resourceType || "external";

              const key = `${resourceType}:${resourceId}`;

              const title = resource?.title || "Untitled Resource";

              const description =
                resource?.description || "Saved learning resource.";

              const category = resource?.category || "General";

              const image = resource?.image || "/images/course-placeholder.png";

              const link = resource?.link || "";

              const isRemoving = removingId === key;

              const isCourse = resourceType === "course";

              const isBook = resourceType === "book";

              return (
                <motion.div
                  key={key}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  <Card className="flex h-full flex-col overflow-hidden p-0">
                    <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img
                        src={image}
                        alt={title}
                        className="h-full w-full object-cover transition duration-500 hover:scale-105"
                        onError={(event) => {
                          event.currentTarget.src =
                            "/images/course-placeholder.png";
                        }}
                      />

                      <div className="absolute left-4 top-4">
                        <Badge>{category}</Badge>
                      </div>

                      <div className="absolute right-4 top-4">
                        <Badge>
                          {isCourse ? "Course" : isBook ? "Book" : "Resource"}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="line-clamp-2 text-xl font-bold text-slate-900 dark:text-white">
                        {title}
                      </h3>

                      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
                        {description}
                      </p>

                      <div className="mt-6 flex gap-3">
                        {link ? (
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1"
                          >
                            <Button className="w-full">
                              Open Resource
                              <ArrowRight className="ml-2" size={17} />
                            </Button>
                          </a>
                        ) : isCourse ? (
                          <Link
                            to={`/courses/${resourceId}`}
                            className="flex-1"
                          >
                            <Button className="w-full">
                              View Course
                              <ArrowRight className="ml-2" size={17} />
                            </Button>
                          </Link>
                        ) : isBook ? (
                          <Link to={`/books/${resourceId}`} className="flex-1">
                            <Button className="w-full">
                              View Book
                              <ArrowRight className="ml-2" size={17} />
                            </Button>
                          </Link>
                        ) : null}

                        <Button
                          variant="outline"
                          disabled={isRemoving}
                          onClick={() => handleRemove(resource)}
                        >
                          {isRemoving ? "Removing..." : "Remove"}
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

/* ==========================================
   LEARNING DASHBOARD
========================================== */

function LearningDashboard({
  isAuthenticated,
  courses,
  learning,
  completedLearning,
  wishlist,
  onToggleWishlist,
}) {
  setWishlist(getStoredArray(WISHLIST_STORAGE_KEY));
  const [streak, setStreak] = useState(0);
  const [schedule, setSchedule] = useState({
    day: "Monday",
    time: "18:00",
    duration: "60",
  });
  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    setWishlist(getStoredArray(WISHLIST_STORAGE_KEY));

    const savedStreak = getStoredObject(STREAK_STORAGE_KEY, {
      count: 0,
      lastDate: null,
    });

    setStreak(Number(savedStreak.count || 0));

    const savedSchedule = getStoredObject(SCHEDULE_STORAGE_KEY);

    if (savedSchedule?.day) {
      setSchedule(savedSchedule);
    }

    const savedReminder = localStorage.getItem(REMINDER_STORAGE_KEY);

    setRemindersEnabled(savedReminder === "true");
  }, [isAuthenticated]);

  const wishlistCourses = useMemo(() => {
    return wishlist
      .map((id) =>
        courses.find(
          (course) => String(getCourseId(course)) === String(id)
        )
      )
      .filter(Boolean);
  }, [wishlist, courses]);

  const isWishlisted = (courseId) =>
    wishlist.some((id) => String(id) === String(courseId));

  const startStreak = () => {
    const today = getTodayKey();
    const yesterday = getYesterdayKey();

    const saved = getStoredObject(STREAK_STORAGE_KEY, {
      count: 0,
      lastDate: null,
    });

    let nextCount = Number(saved.count || 0);

    if (saved.lastDate === today) {
      setStreak(nextCount);
      return;
    }

    if (saved.lastDate === yesterday) {
      nextCount += 1;
    } else {
      nextCount = 1;
    }

    const updated = {
      count: nextCount,
      lastDate: today,
    };

    localStorage.setItem(
      STREAK_STORAGE_KEY,
      JSON.stringify(updated)
    );

    setStreak(nextCount);
  };

  const saveSchedule = () => {
    localStorage.setItem(
      SCHEDULE_STORAGE_KEY,
      JSON.stringify(schedule)
    );

    setShowSchedule(false);
  };

  const toggleReminders = async () => {
    if (!remindersEnabled && "Notification" in window) {
      if (Notification.permission === "default") {
        await Notification.requestPermission();
      }

      if (Notification.permission !== "granted") {
        return;
      }
    }

    const nextValue = !remindersEnabled;

    localStorage.setItem(
      REMINDER_STORAGE_KEY,
      String(nextValue)
    );

    setRemindersEnabled(nextValue);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <section className="border-y border-slate-200 bg-white py-10 dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Sparkles size={20} />

            <span className="text-sm font-semibold uppercase tracking-wider">
              Learning Dashboard
            </span>
          </div>

          <h2 className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
            Make learning a habit
          </h2>

          <p className="mt-2 max-w-2xl text-slate-500 dark:text-slate-400">
            Organize your learning, stay consistent, and keep your next
            skill within reach.
          </p>
        </div>

        {/* QUICK TOOLS */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* STREAK */}
          <Card className="overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
                  <Flame size={22} />
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
                  Start a Streak
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Build a daily learning habit and keep your momentum going.
                </p>
              </div>

              <div className="text-right">
                <p className="text-3xl font-black text-orange-600 dark:text-orange-400">
                  {streak}
                </p>

                <p className="text-xs font-medium text-slate-500">
                  {streak === 1 ? "day" : "days"}
                </p>
              </div>
            </div>

            <Button className="mt-5 w-full" onClick={startStreak}>
              <Flame className="mr-2" size={17} />
              {streak > 0 ? "Keep My Streak" : "Start Learning Streak"}
            </Button>
          </Card>

          {/* ACHIEVED */}
          <Card>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
              <Trophy size={22} />
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
              Achieved
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Track courses you've completed and celebrate your progress.
            </p>

            <div className="mt-5 flex items-center justify-between">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Courses completed
              </span>

              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {completedLearning.length}
              </span>
            </div>

            <Link to="/certificates" className="mt-5 block">
              <Button variant="outline" className="w-full">
                <Award className="mr-2" size={17} />
                View Certificates
              </Button>
            </Link>
          </Card>

          {/* WISHLIST */}
          <Card>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-100 text-pink-600 dark:bg-pink-950/40 dark:text-pink-400">
              <Heart size={22} />
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
              Wishlist
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Keep courses you want to learn next in one place.
            </p>

            <div className="mt-5 flex items-center justify-between">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Saved courses
              </span>

              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {wishlist.length}
              </span>
            </div>

            <Button
              variant="outline"
              className="mt-5 w-full"
              onClick={() => setShowWishlist((value) => !value)}
            >
              <Heart className="mr-2" size={17} />
              {showWishlist ? "Hide Wishlist" : "View Wishlist"}
            </Button>
          </Card>

          {/* LEARNING TOOLS */}
          <Card className="sm:col-span-2 lg:col-span-1">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
              <Wrench size={22} />
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
              Learning Tools
            </h3>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <Link to="/my-learning">
                <Button variant="outline" className="w-full text-xs">
                  <GraduationCap className="mr-1.5" size={15} />
                  Learning
                </Button>
              </Link>

              <Link to="/library">
                <Button variant="outline" className="w-full text-xs">
                  <Library className="mr-1.5" size={15} />
                  Library
                </Button>
              </Link>

              <Link to="/Learning">
                <Button variant="outline" className="w-full text-xs">
                  <Bookmark className="mr-1.5" size={15} />
                  Saved
                </Button>
              </Link>

              <Link to="/community">
                <Button variant="outline" className="w-full text-xs">
                  <Users className="mr-1.5" size={15} />
                  Community
                </Button>
              </Link>
            </div>
          </Card>

          {/* SCHEDULE */}
          <Card>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
              <CalendarDays size={22} />
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
              Schedule Learning Time
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Set aside dedicated time for your next learning session.
            </p>

            <Button
              variant="outline"
              className="mt-5 w-full"
              onClick={() => setShowSchedule((value) => !value)}
            >
              <CalendarDays className="mr-2" size={17} />
              {showSchedule ? "Close Schedule" : "Set Learning Time"}
            </Button>

            {showSchedule && (
              <div className="mt-5 space-y-3">
                <select
                  value={schedule.day}
                  onChange={(event) =>
                    setSchedule((current) => ({
                      ...current,
                      day: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  {[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ].map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>

                <input
                  type="time"
                  value={schedule.time}
                  onChange={(event) =>
                    setSchedule((current) => ({
                      ...current,
                      time: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />

                <select
                  value={schedule.duration}
                  onChange={(event) =>
                    setSchedule((current) => ({
                      ...current,
                      duration: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="90">1.5 hours</option>
                  <option value="120">2 hours</option>
                </select>

                <Button className="w-full" onClick={saveSchedule}>
                  <Check className="mr-2" size={17} />
                  Save Schedule
                </Button>
              </div>
            )}

            {!showSchedule && schedule.day && (
              <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm dark:bg-slate-800/70">
                <p className="font-semibold text-slate-900 dark:text-white">
                  {schedule.day} at {schedule.time}
                </p>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {schedule.duration} minutes
                </p>
              </div>
            )}
          </Card>

          {/* REMINDERS */}
          <Card>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <Bell size={22} />
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
              Learning Reminders
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Get browser reminders when it's time to focus on your learning.
            </p>

            <Button
              variant={remindersEnabled ? "primary" : "outline"}
              className="mt-5 w-full"
              onClick={toggleReminders}
            >
              <Bell className="mr-2" size={17} />
              {remindersEnabled ? "Reminders On" : "Turn On Reminders"}
            </Button>

            {remindersEnabled && (
              <p className="mt-3 text-center text-xs text-emerald-600 dark:text-emerald-400">
                Reminders are enabled for this browser.
              </p>
            )}
          </Card>
        </div>

        {/* WISHLIST COURSES */}
        {showWishlist && (
          <div className="mt-8">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Your Wishlist
                </h3>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Courses you're planning to learn next.
                </p>
              </div>

              <span className="text-sm text-slate-500 dark:text-slate-400">
                {wishlistCourses.length}{" "}
                {wishlistCourses.length === 1 ? "course" : "courses"}
              </span>
            </div>

            {wishlistCourses.length === 0 ? (
              <Card className="border-dashed py-10 text-center">
                <Heart
                  size={38}
                  className="mx-auto text-slate-400 dark:text-slate-600"
                />

                <h4 className="mt-4 font-bold text-slate-900 dark:text-white">
                  Your wishlist is empty
                </h4>

                <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
                  Add courses from the course catalog and they will appear here.
                </p>

                <a href="#explore-courses">
                  <Button className="mt-5">
                    Explore Courses
                    <ArrowRight className="ml-2" size={17} />
                  </Button>
                </a>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {wishlistCourses.map((course) => {
                  const courseId = getCourseId(course);

                  return (
                    <Card key={courseId}>
                      <div className="flex items-start gap-4">
                        <img
                          src={getCourseImage(course)}
                          alt={course?.title || "Course"}
                          className="h-20 w-20 rounded-xl object-cover"
                        />

                        <div className="min-w-0 flex-1">
                          <h4 className="line-clamp-2 font-bold text-slate-900 dark:text-white">
                            {course?.title || "Course"}
                          </h4>

                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {course?.category || "General"} •{" "}
                            {course?.level || "Beginner"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <Link
                          to={`/courses/${courseId}`}
                          className="flex-1"
                        >
                          <Button className="w-full">
                            View Course
                            <ArrowRight className="ml-2" size={16} />
                          </Button>
                        </Link>

                        <Button
                          variant="outline"
                          onClick={() => onToggleWishlist(courseId)}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* NOTE */}
        <p className="mt-6 text-xs text-slate-400 dark:text-slate-600">
          Your streak, wishlist, schedule, and browser reminders are currently
          stored on this device.
        </p>
      </div>
    </section>
  );
}
/* ==========================================
   MAIN PAGE
========================================== */

export default function Learning() {
  const { user } = useAuth();

  const isAuthenticated = Boolean(user);

  const [courses, setCourses] = useState([]);
  const [learning, setLearning] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingLearning, setLoadingLearning] = useState(isAuthenticated);

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

  useEffect(() => {
    if (!isAuthenticated) {
      setWishlist([]);
      return;
    }

    setWishlist(getStoredArray(WISHLIST_STORAGE_KEY));
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
    const values = courses.map((course) => course?.category).filter(Boolean);

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
        course?.description?.toLowerCase().includes(normalizedSearch) ||
        course?.category?.toLowerCase().includes(normalizedSearch) ||
        course?.instructor?.toLowerCase().includes(normalizedSearch);

      const matchesCategory =
        category === "All" || course?.category === category;

      const matchesLevel = level === "All" || course?.level === level;

      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [courses, search, category, level]);

  /* ==========================================
     CONTINUE LEARNING
  ========================================== */

  const continueLearning = useMemo(() => {
    return learning.filter((item) => {
      const percentage = getProgressPercentage(item);

      return percentage < 100 && item?.status !== "completed";
    });
  }, [learning]);

  /* ==========================================
     COMPLETED COURSES
  ========================================== */

  const completedLearning = useMemo(() => {
    return learning.filter((item) => {
      const percentage = getProgressPercentage(item);

      return percentage >= 100 || item?.status === "completed";
    });
  }, [learning]);

  const toggleWishlist = (courseId) => {
  if (!isAuthenticated) {
    window.location.href = "/login";
    return;
  }

  if (!courseId) return;

  setWishlist((current) => {
    const exists = current.some(
      (id) => String(id) === String(courseId)
    );

    const updated = exists
      ? current.filter((id) => String(id) !== String(courseId))
      : [...current, courseId];

    localStorage.setItem(
      WISHLIST_STORAGE_KEY,
      JSON.stringify(updated)
    );

    return updated;
  });
};

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
              <span className="block text-blue-400">Your progress.</span>
              Your next skill.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Continue your enrolled courses, track your real learning progress,
              and discover new courses built to help you grow with technology.
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

              <a href="#saved-resources">
                <Button variant="outline">
                  Saved Resources
                  <ArrowRight className="ml-2" size={18} />
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <LearningDashboard
        isAuthenticated={isAuthenticated}
        courses={courses}
        learning={learning}
        completedLearning={completedLearning}
        wishlist={wishlist}
        onToggleWishlist={toggleWishlist}
      />
      
      <section id="my-learning" className="scroll-mt-24 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-10">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <GraduationCap size={20} />

              <span className="text-sm font-semibold uppercase tracking-wider">
                Personal Learning
              </span>
            </div>

            <h2 className="mt-2 text-3xl font-black text-slate-900 dark:text-white sm:text-4xl">
              Enrolled Courses
            </h2>

            <p className="mt-3 max-w-2xl text-slate-500 dark:text-slate-400">
              Pick up where you left off and keep building your skills.
            </p>
          </div>

          {!isAuthenticated ? (
            <Card className="py-14 text-center">
              <GraduationCap size={42} className="mx-auto text-slate-400" />

              <h3 className="mt-5 text-2xl font-bold text-slate-900 dark:text-white">
                Log in to see your learning
              </h3>

              <p className="mx-auto mt-3 max-w-lg text-slate-500 dark:text-slate-400">
                Your enrolled courses and progress are private to your account.
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
                      {continueLearning.length === 1 ? "course" : "courses"}
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
                <div className={continueLearning.length > 0 ? "mt-14" : ""}>
                  <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      Completed
                    </h3>

                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {completedLearning.length}{" "}
                      {completedLearning.length === 1 ? "course" : "courses"}
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

      <section id="saved-resources">
        <SavedResourcesSection isAuthenticated={isAuthenticated} />
      </section>
      
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
              Explore More Courses
            </h2>

            <p className="mt-3 max-w-2xl text-slate-500 dark:text-slate-400">
              Discover published KanuorieTech courses and find your next
              learning opportunity.
            </p>
          </div>

          {/* COURSE RESULTS */}

          {filteredCourses.length === 0 ? (
            <Card className="mt-10 py-14 text-center">
              <Search size={42} className="mx-auto text-slate-400" />

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

                const enrolled = enrolledCourseIds.has(String(courseId));

                return (
                 <ExploreCourseCard
                    key={courseId}
                    course={course}
                    enrolled={enrolled}
                    enrollingId={enrollingId}
                    onEnroll={handleEnroll}
                    isWishlisted={wishlist.some(
                      (id) => String(id) === String(courseId)
                    )}
                    onToggleWishlist={toggleWishlist}
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
            Build practical technology skills through structured courses and
            hands-on learning with KanuorieTech.
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
