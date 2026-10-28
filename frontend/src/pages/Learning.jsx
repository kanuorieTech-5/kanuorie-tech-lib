import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  Bell,
  CalendarDays,
  Check,
  Flame,
  GraduationCap,
  Heart,
  Library,
  Sparkles,
  Trophy,
  Users,
  Wrench,
  Bookmark,
  X,
} from "lucide-react";

import { Card, Button, Loader, Badge } from "../components/common";
import { getCourses } from "../services/course.service";
import { getProgress } from "../services/progress.service";
import {
  getSavedResources,
  removeSavedResource,
} from "../services/library.service";
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

const getProgressCourseId = (progress) =>
  progress?.course?._id || progress?.course?.id || null;

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
   AUTO HORIZONTAL CAROUSEL
========================================== */

function AutoCarousel({
  children,
  speed = 30,
  className = "",
}) {
  const viewportRef = useRef(null);
  const animationRef = useRef(null);
  const pausedRef = useRef(false);
  const directionRef = useRef(1);

  useEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return undefined;
    }

    let lastTime = performance.now();

    const animate = (time) => {
      const delta = time - lastTime;
      lastTime = time;

      if (!pausedRef.current) {
        const maxScroll = viewport.scrollWidth - viewport.clientWidth;

        if (maxScroll > 0) {
          viewport.scrollLeft +=
            (speed * delta * directionRef.current) / 1000;

          if (viewport.scrollLeft >= maxScroll) {
            viewport.scrollLeft = maxScroll;
            directionRef.current = -1;
          } else if (viewport.scrollLeft <= 0) {
            viewport.scrollLeft = 0;
            directionRef.current = 1;
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [speed]);

  const pause = () => {
    pausedRef.current = true;
  };

  const resume = () => {
    pausedRef.current = false;
  };

  return (
    <div
      ref={viewportRef}
      className={`overflow-x-auto overscroll-x-contain pb-4 ${className}`}
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onTouchStart={pause}
      onTouchEnd={() => {
        window.setTimeout(resume, 1200);
      }}
      onFocus={pause}
      onBlur={resume}
    >
      <div className="flex w-max gap-6">
        {children}
      </div>
    </div>
  );
}

/* ==========================================
   ENROLLED COURSE CARD
========================================== */

function LearningCard({ item }) {
  const course = item?.course || item || {};
  const courseId = getCourseId(item);
  const title = course?.title || course?.name || "Untitled Course";
  const instructor =
    course?.instructor?.name ||
    course?.instructor ||
    course?.author?.name ||
    course?.author ||
    "KanuorieTech";
  const percentage = getProgressPercentage(item);
  const completedLessons = getCompletedCount(item);
  const totalLessons = getTotalLessons(item);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="w-[300px] shrink-0 sm:w-[340px]"
    >
      <Card className="flex h-full flex-col overflow-hidden p-0">
        <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={getCourseImage(course)}
            alt={title}
            className="h-full w-full object-cover transition duration-500 hover:scale-105"
            onError={(event) => {
              event.currentTarget.src = "/images/course-placeholder.png";
            }}
          />
          <span className="absolute left-4 top-4">
            <Badge className="border-blue-200 bg-blue-100 text-blue-800 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300">
              {percentage >= 100 ? "Completed" : "In progress"}
            </Badge>
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h4 className="line-clamp-2 text-lg font-bold text-slate-900 dark:text-white">
            {title}
          </h4>
          <p className="mt-2 truncate text-sm text-slate-500 dark:text-slate-400">
            {instructor}
          </p>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
              <span>
                {totalLessons > 0
                  ? `${completedLessons} of ${totalLessons} lessons`
                  : formatDuration(course?.duration)}
              </span>
              <span>{percentage}%</span>
            </div>
            <div
              className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
              role="progressbar"
              aria-label={`${title} progress`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={percentage}
            >
              <div
                className="h-full rounded-full bg-blue-600 transition-[width]"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          <Link
            to={courseId ? `/courses/${courseId}` : "/courses"}
            className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {percentage >= 100 ? "Review course" : "Continue learning"}
            <ArrowRight size={16} />
          </Link>
        </div>
      </Card>
    </motion.div>
  );
}

function RecommendedCourseCard({ course }) {
  const courseId = getCourseId(course);
  const title = course?.title || course?.name || "Recommended course";

  return (
    <Card className="flex w-[280px] shrink-0 flex-col overflow-hidden bg-white p-0 dark:bg-slate-900 sm:w-[320px]">
      <img
        src={getCourseImage(course)}
        alt={title}
        className="h-40 w-full object-cover"
        onError={(event) => {
          event.currentTarget.src = "/images/course-placeholder.png";
        }}
      />
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">
          {course?.category || "Recommended for you"}
        </p>
        <h3 className="mt-2 line-clamp-2 text-lg font-bold text-slate-900 dark:text-white">
          {title}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-slate-600 dark:text-slate-300">
          {course?.description || "Build on the skills you are already learning."}
        </p>
        <Link
          to={courseId ? `/courses/${courseId}` : "/courses"}
          className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200"
        >
          View course <ArrowRight size={16} />
        </Link>
      </div>
    </Card>
  );
}

/* ==========================================
   SAVED RESOURCE CARD
========================================== */

function SavedResourceCard({
  resource,
  removingId,
  onRemove,
}) {
  const resourceId = String(
    resource?.resourceId || ""
  );

  const resourceType =
    resource?.resourceType || "external";

  const key = `${resourceType}:${resourceId}`;

  const title =
    resource?.title || "Untitled Resource";

  const description =
    resource?.description ||
    "Saved learning resource.";

  const category =
    resource?.category || "General";

  const image =
    resource?.image ||
    "/images/course-placeholder.png";

  const link = resource?.link || "";

  const isRemoving = removingId === key;

  const isCourse = resourceType === "course";
  const isBook = resourceType === "book";

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="w-[300px] shrink-0 sm:w-[340px] lg:w-[380px]"
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
              {isCourse
                ? "Course"
                : isBook
                ? "Book"
                : "Resource"}
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
                  <ArrowRight
                    className="ml-2"
                    size={17}
                  />
                </Button>
              </a>
            ) : isCourse ? (
              <Link
                to={`/courses/${resourceId}`}
                className="flex-1"
              >
                <Button className="w-full">
                  View Course
                  <ArrowRight
                    className="ml-2"
                    size={17}
                  />
                </Button>
              </Link>
            ) : isBook ? (
              <Link
                to={`/books/${resourceId}`}
                className="flex-1"
              >
                <Button className="w-full">
                  View Book
                  <ArrowRight
                    className="ml-2"
                    size={17}
                  />
                </Button>
              </Link>
            ) : null}

            <Button
              variant="outline"
              disabled={isRemoving}
              onClick={() => onRemove(resource)}
            >
              {isRemoving
                ? "Removing..."
                : "Remove"}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

/* ==========================================
   SAVED RESOURCES SECTION
========================================== */

function SavedResourcesSection({
  isAuthenticated,
}) {
  const [savedResources, setSavedResources] =
    useState([]);

  const [loading, setLoading] =
    useState(isAuthenticated);

  const [removingId, setRemovingId] =
    useState(null);

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

      const response =
        await getSavedResources();

      const items =
        response?.data?.items ||
        response?.data?.resources ||
        (Array.isArray(response?.data) ? response.data : null) ||
        response?.items ||
        [];

      setSavedResources(
        Array.isArray(items) ? items : []
      );
    } catch (err) {
      console.error(
        "Failed to load saved resources:",
        err
      );

      setSavedResources([]);

      setError(
        err?.response?.data?.message ||
          "We couldn't load your saved resources."
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

    window.addEventListener(
      "library-update",
      handleLibraryUpdate
    );

    return () => {
      window.removeEventListener(
        "library-update",
        handleLibraryUpdate
      );
    };
  }, [isAuthenticated]);

  const handleRemove = async (resource) => {
    if (!resource?.resourceId) {
      return;
    }

    const key = `${resource.resourceType}:${resource.resourceId}`;

    try {
      setRemovingId(key);
      setError("");

      await removeSavedResource(
        resource.resourceId,
        resource.resourceType
      );

      setSavedResources((current) =>
        current.filter(
          (item) =>
            !(
              String(item?.resourceId) ===
                String(resource.resourceId) &&
              item?.resourceType ===
                resource.resourceType
            )
        )
      );

      window.dispatchEvent(
        new Event("library-update")
      );
    } catch (err) {
      console.error(
        "Failed to remove saved resource:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "We couldn't remove this saved resource."
      );
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <section className="py-16">
      <div className="mx-auto px-6 lg:px-8">
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
              Keep useful learning resources close by
              for later.
            </p>
          </div>

          {isAuthenticated &&
            savedResources.length > 0 && (
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {savedResources.length}{" "}
                {savedResources.length === 1
                  ? "resource"
                  : "resources"}
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
              Your saved resources are private to
              your account.
            </p>

            <Link to="/login">
              <Button className="mt-6">
                Log In
                <ArrowRight
                  className="ml-2"
                  size={17}
                />
              </Button>
            </Link>
          </Card>
        ) : loading ? (
          <div className="flex min-h-[220px] items-center justify-center">
            <Loader />
          </div>
        ) : error ? (
          <Card className="border-red-200 bg-red-50 py-12 text-center dark:border-red-900/50 dark:bg-red-950/20">
            <Library
              size={42}
              className="mx-auto text-red-400"
            />

            <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
              Unable to load saved resources
            </h3>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-red-600 dark:text-red-300">
              {error}
            </p>

            <Button
              className="mt-6"
              onClick={loadSavedResources}
            >
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
              Save useful courses, books, and learning
              resources from the Library page and they
              will appear here.
            </p>

            <Link to="/library">
              <Button className="mt-6">
                Browse Library
                <ArrowRight
                  className="ml-2"
                  size={17}
                />
              </Button>
            </Link>
          </Card>
        ) : (
          <AutoCarousel speed={28}>
            {savedResources.map((resource) => (
              <SavedResourceCard
                key={`${resource?.resourceType}:${resource?.resourceId}`}
                resource={resource}
                removingId={removingId}
                onRemove={handleRemove}
              />
            ))}
          </AutoCarousel>
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
  completedLearning,
  wishlist,
  onToggleWishlist,
}) {
  const [streak, setStreak] = useState(() => {
    const saved = getStoredObject(
      STREAK_STORAGE_KEY,
      {
        count: 0,
        lastDate: null,
      }
    );

    return Number(saved.count || 0);
  });

  const [schedule, setSchedule] = useState(
    () =>
      getStoredObject(
        SCHEDULE_STORAGE_KEY,
        {
          day: "Monday",
          time: "18:00",
          duration: "60",
        }
      )
  );

  const [remindersEnabled, setRemindersEnabled] =
    useState(
      () =>
        localStorage.getItem(
          REMINDER_STORAGE_KEY
        ) === "true"
    );

  const [showSchedule, setShowSchedule] =
    useState(false);

  const [showWishlist, setShowWishlist] =
    useState(false);

  const wishlistCourses = useMemo(() => {
    return wishlist
      .map((id) =>
        courses.find(
          (course) =>
            String(getCourseId(course)) ===
            String(id)
        )
      )
      .filter(Boolean);
  }, [wishlist, courses]);

  const startStreak = () => {
    const today = getTodayKey();
    const yesterday = getYesterdayKey();

    const saved = getStoredObject(
      STREAK_STORAGE_KEY,
      {
        count: 0,
        lastDate: null,
      }
    );

    let nextCount = Number(
      saved.count || 0
    );

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
    if (
      !remindersEnabled &&
      "Notification" in window
    ) {
      if (
        Notification.permission === "default"
      ) {
        try {
          await Notification.requestPermission();
        } catch (error) {
          console.error(
            "Notification permission request failed:",
            error
          );

          return;
        }
      }

      if (
        Notification.permission !== "granted"
      ) {
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
      <div className="mx-auto px-6 lg:px-8">
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
            Organize your learning, stay consistent,
            and keep your next skill within reach.
          </p>
        </div>

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
                  Build a daily learning habit and
                  keep your momentum going.
                </p>
              </div>

              <div className="text-right">
                <p className="text-3xl font-black text-orange-600 dark:text-orange-400">
                  {streak}
                </p>

                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {streak === 1 ? "day" : "days"}
                </p>
              </div>
            </div>

            <Button
              className="mt-5 w-full"
              onClick={startStreak}
            >
              <Flame
                className="mr-2"
                size={17}
              />

              {streak > 0
                ? "Keep My Streak"
                : "Start Learning Streak"}
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
              Track courses you've completed and
              celebrate your progress.
            </p>

            <div className="mt-5 flex items-center justify-between">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Courses completed
              </span>

              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {completedLearning.length}
              </span>
            </div>

            <Link
              to="/certificates"
              className="mt-5 block"
            >
              <Button
                variant="outline"
                className="w-full"
              >
                <Award
                  className="mr-2"
                  size={17}
                />
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
              Keep courses you want to learn next
              in one place.
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
              onClick={() =>
                setShowWishlist(
                  (value) => !value
                )
              }
            >
              <Heart
                className="mr-2"
                size={17}
              />

              {showWishlist
                ? "Hide Wishlist"
                : "View Wishlist"}
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
              <Link to="/Learning">
                <Button
                  variant="outline"
                  className="w-full text-xs"
                >
                  <GraduationCap
                    className="mr-1.5"
                    size={15}
                  />
                  Learning
                </Button>
              </Link>

              <Link to="/library">
                <Button
                  variant="outline"
                  className="w-full text-xs"
                >
                  <Library
                    className="mr-1.5"
                    size={15}
                  />
                  Library
                </Button>
              </Link>

              <a href="#saved-resources">
                <Button
                  variant="outline"
                  className="w-full text-xs"
                >
                  <Bookmark
                    className="mr-1.5"
                    size={15}
                  />
                  Saved
                </Button>
              </a>

              <Link to="/community">
                <Button
                  variant="outline"
                  className="w-full text-xs"
                >
                  <Users
                    className="mr-1.5"
                    size={15}
                  />
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
              Set aside dedicated time for your
              next learning session.
            </p>

            <Button
              variant="outline"
              className="mt-5 w-full"
              onClick={() =>
                setShowSchedule(
                  (value) => !value
                )
              }
            >
              <CalendarDays
                className="mr-2"
                size={17}
              />

              {showSchedule
                ? "Close Schedule"
                : "Set Learning Time"}
            </Button>

            {showSchedule && (
              <div className="mt-5 space-y-3">
                <select
                  value={schedule.day}
                  onChange={(event) =>
                    setSchedule(
                      (current) => ({
                        ...current,
                        day: event.target.value,
                      })
                    )
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
                    <option
                      key={day}
                      value={day}
                    >
                      {day}
                    </option>
                  ))}
                </select>

                <input
                  type="time"
                  value={schedule.time}
                  onChange={(event) =>
                    setSchedule(
                      (current) => ({
                        ...current,
                        time: event.target.value,
                      })
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />

                <select
                  value={schedule.duration}
                  onChange={(event) =>
                    setSchedule(
                      (current) => ({
                        ...current,
                        duration:
                          event.target.value,
                      })
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="30">
                    30 minutes
                  </option>
                  <option value="60">
                    1 hour
                  </option>
                  <option value="90">
                    1.5 hours
                  </option>
                  <option value="120">
                    2 hours
                  </option>
                </select>

                <Button
                  className="w-full"
                  onClick={saveSchedule}
                >
                  <Check
                    className="mr-2"
                    size={17}
                  />
                  Save Schedule
                </Button>
              </div>
            )}

            {!showSchedule &&
              schedule.day && (
                <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm dark:bg-slate-800/70">
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {schedule.day} at{" "}
                    {schedule.time}
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
              Get browser reminders when it's time
              to focus on your learning.
            </p>

            <Button
              variant={
                remindersEnabled
                  ? "primary"
                  : "outline"
              }
              className="mt-5 w-full"
              onClick={toggleReminders}
            >
              <Bell
                className="mr-2"
                size={17}
              />

              {remindersEnabled
                ? "Reminders On"
                : "Turn On Reminders"}
            </Button>

            {remindersEnabled && (
              <p className="mt-3 text-center text-xs text-emerald-600 dark:text-emerald-400">
                Reminders are enabled for this
                browser.
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
                  Courses you're planning to
                  learn next.
                </p>
              </div>

              <span className="text-sm text-slate-500 dark:text-slate-400">
                {wishlistCourses.length}{" "}
                {wishlistCourses.length === 1
                  ? "course"
                  : "courses"}
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
                  Add courses from the course
                  catalog and they will appear here.
                </p>

                <Link to="/courses">
                  <Button className="mt-5">
                    Explore Courses
                    <ArrowRight
                      className="ml-2"
                      size={17}
                    />
                  </Button>
                </Link>
              </Card>
            ) : (
              <AutoCarousel speed={26}>
                {wishlistCourses.map(
                  (course) => {
                    const courseId =
                      getCourseId(course);

                    return (
                      <Card
                        key={courseId}
                        className="w-[300px] shrink-0 sm:w-[340px]"
                      >
                        <div className="flex items-start gap-4">
                          <img
                            src={getCourseImage(
                              course
                            )}
                            alt={
                              course?.title ||
                              "Course"
                            }
                            className="h-20 w-20 rounded-xl object-cover"
                            onError={(event) => {
                              event.currentTarget.src =
                                "/images/course-placeholder.png";
                            }}
                          />

                          <div className="min-w-0 flex-1">
                            <h4 className="line-clamp-2 font-bold text-slate-900 dark:text-white">
                              {course?.title ||
                                "Course"}
                            </h4>

                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                              {course?.category ||
                                "General"}{" "}
                              •{" "}
                              {course?.level ||
                                "Beginner"}
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
                              <ArrowRight
                                className="ml-2"
                                size={16}
                              />
                            </Button>
                          </Link>

                          <Button
                            variant="outline"
                            onClick={() =>
                              onToggleWishlist(
                                courseId
                              )
                            }
                            aria-label="Remove course from wishlist"
                            title="Remove from wishlist"
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      </Card>
                    );
                  }
                )}
              </AutoCarousel>
            )}
          </div>
        )}

        <p className="mt-6 text-xs text-slate-400 dark:text-slate-600">
          Your streak, wishlist, schedule, and browser
          reminders are currently stored on this device.
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

  const [loadingLearning, setLoadingLearning] =
    useState(isAuthenticated);

  /* ==========================================
     LOAD COURSES FOR WISHLIST
  ========================================== */

  useEffect(() => {
    let mounted = true;
    getCourses()
      .then((response) => {
        if (!mounted) return;
        const items = getListFromResponse(response);
        setCourses(items.filter((course) => course?.published !== false));
      })
      .catch((err) => console.error("Failed to load courses:", err));
    return () => { mounted = false; };
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

        const response =
          await getProgress();

        if (!mounted) return;

        setLearning(
          getListFromResponse(response).filter(
            (progress) =>
              Boolean(progress?._id || progress?.id) &&
              Boolean(getProgressCourseId(progress)) &&
              typeof progress?.course === "object"
          )
        );
      } catch (err) {
        console.error(
          "Failed to load learning progress:",
          err
        );

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
     LOAD WISHLIST
  ========================================== */

  useEffect(() => {
    if (!isAuthenticated) {
      setWishlist([]);
      return;
    }

    setWishlist(
      getStoredArray(
        WISHLIST_STORAGE_KEY
      )
    );
  }, [isAuthenticated]);

  /* ==========================================
     CONTINUE LEARNING
  ========================================== */

  const continueLearning = useMemo(() => {
    return learning.filter((item) => {
      const percentage =
        getProgressPercentage(item);

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
      const percentage =
        getProgressPercentage(item);

      return (
        percentage >= 100 ||
        item?.status === "completed"
      );
    });
  }, [learning]);

  const latestEnrollment = useMemo(() => {
    return [...learning].sort((first, second) => {
      const firstDate = new Date(first?.createdAt || first?.lastAccessed || 0).getTime();
      const secondDate = new Date(second?.createdAt || second?.lastAccessed || 0).getTime();
      return secondDate - firstDate;
    })[0] || null;
  }, [learning]);

  const recommendedCourses = useMemo(() => {
    const sourceCourse = latestEnrollment?.course;

    if (!sourceCourse) return [];

    const enrolledIds = new Set(
      learning.map((item) => String(getProgressCourseId(item)))
    );
    const availableCourses = courses.filter((course) => {
      const id = getCourseId(course);
      return id && !enrolledIds.has(String(id));
    });
    const category = String(sourceCourse?.category || "").trim().toLowerCase();
    const sameCategory = category
      ? availableCourses.filter(
          (course) => String(course?.category || "").trim().toLowerCase() === category
        )
      : [];
    const sourceLevel = String(sourceCourse?.level || "").trim().toLowerCase();
    const sameLevel = sourceLevel
      ? availableCourses.filter(
          (course) => String(course?.level || "").trim().toLowerCase() === sourceLevel
        )
      : [];

    const suggested = sameCategory.length
      ? sameCategory
      : sameLevel.length
        ? sameLevel
        : [...availableCourses].sort(
            (first, second) =>
              Number(second?.enrollments || second?.students || 0) -
              Number(first?.enrollments || first?.students || 0)
          );

    return suggested.slice(0, 6);
  }, [learning, courses, latestEnrollment]);

  /* ==========================================
     WISHLIST
  ========================================== */

  const toggleWishlist = (courseId) => {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }

    if (!courseId) return;

    setWishlist((current) => {
      const exists = current.some(
        (id) =>
          String(id) ===
          String(courseId)
      );

      const updated = exists
        ? current.filter(
            (id) =>
              String(id) !==
              String(courseId)
          )
        : [...current, courseId];

      localStorage.setItem(
        WISHLIST_STORAGE_KEY,
        JSON.stringify(updated)
      );

      return updated;
    });
  };

  return (
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] bg-[size:45px_45px]" />

        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="absolute -bottom-40 left-10 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative mx-auto px-3 py-2 lg:px-8 lg:py-20">
          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
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
              Continue your enrolled courses, track
              your real learning progress, and discover
              new courses built to help you grow with
              technology.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#my-learning">
                <Button>
                  <GraduationCap
                    className="mr-2"
                    size={18}
                  />
                  My Learning
                </Button>
              </a>

              <Link to="/courses">
                <Button variant="outline">
                  Explore Courses
                  <ArrowRight
                    className="ml-2"
                    size={18}
                  />
                </Button>
              </Link>

              <a href="#saved-resources">
                <Button variant="outline">
                  Saved Resources
                  <ArrowRight
                    className="ml-2"
                    size={18}
                  />
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ======================================
          DASHBOARD
      ====================================== */}

      <LearningDashboard
        isAuthenticated={isAuthenticated}
        courses={courses}
        completedLearning={completedLearning}
        wishlist={wishlist}
        onToggleWishlist={toggleWishlist}
      />

      {/* ======================================
          MY LEARNING
      ====================================== */}

      <section
        id="my-learning"
        className="scroll-mt-24 py-16 lg:py-20"
      >
        <div className="mx-auto px-6 lg:px-8">
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
              Pick up where you left off and keep
              building your skills.
            </p>
          </div>

          {!isAuthenticated ? (
            <Card className="py-14 text-center">
              <GraduationCap
                size={42}
                className="mx-auto text-slate-400 dark:text-slate-500"
              />

              <h3 className="mt-5 text-2xl font-bold text-slate-900 dark:text-white">
                Log in to see your learning
              </h3>

              <p className="mx-auto mt-3 max-w-lg text-slate-500 dark:text-slate-400">
                Your enrolled courses and progress
                are private to your account.
              </p>

              <Link to="/login">
                <Button className="mt-6">
                  Log In
                  <ArrowRight
                    className="ml-2"
                    size={17}
                  />
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
              {/* CONTINUE LEARNING */}

              {continueLearning.length > 0 && (
                <div>
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        Continue Learning
                      </h3>

                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Keep moving forward with
                        your active courses.
                      </p>
                    </div>

                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {continueLearning.length}{" "}
                      {continueLearning.length === 1
                        ? "course"
                        : "courses"}
                    </span>
                  </div>

                  <AutoCarousel speed={30}>
                    {continueLearning.map(
                      (item) => (
                        <LearningCard
                          key={
                            item?._id ||
                            getCourseId(
                              item?.course
                            )
                          }
                          item={item}
                        />
                      )
                    )}
                  </AutoCarousel>
                </div>
              )}

              {/* COMPLETED */}

              {completedLearning.length > 0 && (
                <div
                  className={
                    continueLearning.length >
                    0
                      ? "mt-14"
                      : ""
                  }
                >
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        Completed Courses
                      </h3>

                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Courses you've completed
                        through your learning journey.
                      </p>
                    </div>

                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {completedLearning.length}{" "}
                      {completedLearning.length ===
                      1
                        ? "course"
                        : "courses"}
                    </span>
                  </div>

                  <AutoCarousel speed={24}>
                    {completedLearning.map(
                      (item) => (
                        <LearningCard
                          key={
                            item?._id ||
                            getCourseId(
                              item?.course
                            )
                          }
                          item={item}
                        />
                      )
                    )}
                  </AutoCarousel>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {isAuthenticated && learning.length > 0 && (
        <section className="py-14 lg:py-16" aria-labelledby="recommended-courses-heading">
          <div className="mx-auto px-6 lg:px-8">
            <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                  <Sparkles size={19} />
                  <span className="text-sm font-semibold uppercase tracking-wider">Picked for your learning path</span>
                </div>
                <h2 id="recommended-courses-heading" className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
                  Recommended Courses
                </h2>
                <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">
                  Based on your latest enrollment{latestEnrollment?.course?.title ? ` in ${latestEnrollment.course.title}` : ""}.
                </p>
              </div>
              <Link to="/courses" className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200">
                Browse all courses <ArrowRight size={16} />
              </Link>
            </div>
            {recommendedCourses.length > 0 ? (
              <div className="flex gap-5 overflow-x-auto pb-4">
                {recommendedCourses.map((course) => (
                  <RecommendedCourseCard key={getCourseId(course)} course={course} />
                ))}
              </div>
            ) : (
              <Card className="bg-white py-8 text-center dark:bg-slate-900">
                <p className="text-slate-600 dark:text-slate-300">
                  We’ll suggest your next course as more learning options become available.
                </p>
                <Link to="/courses" className="mt-4 inline-flex items-center gap-2 font-bold text-blue-700 dark:text-blue-300">
                  Explore courses <ArrowRight size={16} />
                </Link>
              </Card>
            )}
          </div>
        </section>
      )}

      {/* ======================================
          SAVED RESOURCES
      ====================================== */}

      <section id="saved-resources">
        <SavedResourcesSection
          isAuthenticated={
            isAuthenticated
          }
        />
      </section>

      {/* ======================================
          COURSES CTA
      ====================================== */}

      <section className="relative isolate overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-950 py-5 text-white sm:py-20">
        <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl" />
        <div className="relative mx-auto max-w-5xl px-6 text-center lg:px-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-blue-100">
            <GraduationCap size={28} />
          </div>
          <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-blue-100">Your next step starts here</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            Ready to build skills that move you forward?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg">
            Explore the full KanuorieTech course catalog, find a course that fits your goals, and start learning at your own pace.
          </p>
          <Link to="/courses" className="mt-8 inline-flex items-center justify-center gap-3 rounded-xl bg-white dark:bg-slate-900 px-7 py-4 text-base font-bold text-blue-800 shadow-xl shadow-blue-950/20 transition hover:-translate-y-0.5 hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-white/30">
            Explore all courses <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
