import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Clock3,
  GraduationCap,
  PlayCircle,
  Sparkles,
} from "lucide-react";

import { Card, Button, SectionTitle, Loader } from "../common";
import { getCourses } from "../../services";

const COURSES_TO_SHOW = 6;
const COURSE_IMAGE_FALLBACK = "/images/course-placeholder.png";

export default function CoursesPreview() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  /*
  ==========================================
  FETCH COURSES
  ==========================================
  */

  useEffect(() => {
    let mounted = true;

    const fetchCourses = async () => {
      try {
        const res = await getCourses({
          limit: COURSES_TO_SHOW,
        });

        const data = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
            ? res.data
            : Array.isArray(res?.data?.courses)
              ? res.data.courses
              : Array.isArray(res?.data?.items)
                ? res.data.items
                : Array.isArray(res?.items)
                  ? res.items
                  : [];

        if (mounted) {
          setCourses(data.slice(0, COURSES_TO_SHOW));
          setCurrentIndex(0);
        }
      } catch (error) {
        console.error("Failed to load courses:", error);

        if (mounted) {
          setCourses([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchCourses();

    return () => {
      mounted = false;
    };
  }, []);

  /*
  ==========================================
  RESPONSIVE VISIBLE COUNT
  ==========================================
  */

  const getVisibleCount = () => {
    if (typeof window === "undefined") {
      return 1;
    }

    if (window.innerWidth >= 1024) {
      return 3;
    }

    if (window.innerWidth >= 768) {
      return 2;
    }

    return 1;
  };

  const [visibleCount, setVisibleCount] = useState(
    getVisibleCount,
  );

  useEffect(() => {
    const handleResize = () => {
      setVisibleCount(getVisibleCount());
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const maxIndex = Math.max(
    courses.length - visibleCount,
    0,
  );

  /*
  ==========================================
  NAVIGATION
  ==========================================
  */

  const nextSlide = () => {
    setCurrentIndex((previous) =>
      previous >= maxIndex ? 0 : previous + 1,
    );
  };

  const prevSlide = () => {
    setCurrentIndex((previous) =>
      previous <= 0 ? maxIndex : previous - 1,
    );
  };

  /*
  ==========================================
  RESET POSITION WHEN SCREEN CHANGES
  ==========================================
  */

  useEffect(() => {
    setCurrentIndex((previous) =>
      Math.min(previous, maxIndex),
    );
  }, [maxIndex]);

  /*
  ==========================================
  AUTO PLAY
  ==========================================
  */

  useEffect(() => {
    if (
      courses.length <= visibleCount ||
      isPaused
    ) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex((previous) =>
        previous >= maxIndex ? 0 : previous + 1,
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [
    courses.length,
    visibleCount,
    maxIndex,
    isPaused,
  ]);

  /*
  ==========================================
  PAGINATION
  ==========================================
  */

  const totalSlides = useMemo(
    () => Math.max(maxIndex + 1, 1),
    [maxIndex],
  );

  /*
  ==========================================
  IMAGE HANDLER
  ==========================================
  */

  const getCourseImage = (course) => {
    if (
      typeof course?.image === "string" &&
      course.image.trim()
    ) {
      return course.image.trim();
    }

    return COURSE_IMAGE_FALLBACK;
  };

  /*
  ==========================================
  DURATION FORMATTER
  ==========================================
  */

  const formatDuration = (duration) => {
    if (
      duration === undefined ||
      duration === null ||
      duration === ""
    ) {
      return null;
    }

    const hours = Number(duration);

    if (Number.isNaN(hours) || hours <= 0) {
      return null;
    }

    return `${hours} ${
      hours === 1 ? "hour" : "hours"
    }`;
  };

  /*
  ==========================================
  LOADING
  ==========================================
  */

  if (loading) {
    return (
      <section className="bg-slate-950 py-16 text-white">
        <div className="flex justify-center">
          <Loader />
        </div>
      </section>
    );
  }

  /*
  ==========================================
  SECTION
  ==========================================
  */

  return (
    <section className="relative overflow-hidden bg-slate-900 py-15 text-white sm:py-24 dark:bg-slate-900 dark:text-white">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative mx-autol px-6 lg:px-8 text-center">
        {/* Header */}
        <SectionTitle
          Badge="KanuorieTech Academy"
          title="Learn Skills That Build Careers"
          subtitle="Practical, project-based technology courses designed to help you build real skills, real projects, and real opportunities."
        />

        {courses.length === 0 ? (
          <div className="mt-12 flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
            <GraduationCap className="h-10 w-10 text-cyan-400" />

            <p className="mt-4 text-slate-400">
              Courses coming soon.
            </p>
          </div>
        ) : (
          <div
            className="relative mt-14"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Carousel viewport */}
            <div className="overflow-hidden">
              <motion.div
                className="flex"
                animate={{
                  x: `-${
                    currentIndex *
                    (100 / visibleCount)
                  }%`,
                }}
                transition={{
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {courses.map((course, index) => {
                  const image = getCourseImage(course);
                  const duration = formatDuration(
                    course.duration,
                  );

                  return (
                    <div
                      key={
                        course._id ||
                        course.id ||
                        `course-${index}`
                      }
                      className="w-full shrink-0 px-2 md:w-1/2 lg:w-1/3"
                    >
                      <motion.div
                        whileHover={{ y: -6 }}
                        transition={{
                          duration: 0.25,
                        }}
                        className="h-full"
                      >
                        <Card
                          className="
                            group
                            flex
                            h-full
                            flex-col
                            overflow-hidden
                            border-white/10
                            bg-white/[0.04]
                            p-0
                            backdrop-blur-xl
                            transition-all
                            duration-300
                            hover:border-cyan-400/30
                            hover:bg-white/[0.06]
                          "
                        >
                          {/* Thumbnail */}
                          <div className="relative h-56 overflow-hidden bg-slate-900">
                            <img
                              src={image}
                              alt={
                                course.title ||
                                "KanuorieTech course"
                              }
                              className="
                                h-full
                                w-full
                                object-cover
                                transition-transform
                                duration-500
                                group-hover:scale-105
                              "
                              loading="lazy"
                              onError={(event) => {
                                if (
                                  event.currentTarget
                                    .src.endsWith(
                                      COURSE_IMAGE_FALLBACK,
                                    )
                                ) {
                                  return;
                                }

                                event.currentTarget.src =
                                  COURSE_IMAGE_FALLBACK;
                              }}
                            />

                            {/* Image overlay */}
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                            {/* Course badge */}
                            {course.featured && (
                              <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/20 bg-slate-950/70 px-3 py-1.5 text-xs font-semibold text-cyan-300 backdrop-blur-md">
                                <Sparkles className="h-3.5 w-3.5" />
                                Featured Course
                              </div>
                            )}

                            {/* Premium badge */}
                            {course.premium && (
                              <div className="absolute right-4 top-4 rounded-full bg-amber-400 px-3 py-1.5 text-xs font-bold text-slate-950">
                                PREMIUM
                              </div>
                            )}

                            {/* Play icon */}
                            <div className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-slate-950/70 backdrop-blur-md">
                              <PlayCircle className="h-5 w-5 text-white" />
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex flex-1 flex-col p-6">
                            {/* Category */}
                            {course.category && (
                              <span className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-cyan-400">
                                {course.category}
                              </span>
                            )}

                            {/* Title */}
                            <h3 className="line-clamp-2 text-xl font-bold leading-tight text-white">
                              {course.title}
                            </h3>

                            {/* Description */}
                            <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400">
                              {course.description ||
                                "Explore this practical technology course and build skills through hands-on learning."}
                            </p>

                            {/* Course information */}
                            <div className="mt-5 flex flex-wrap gap-4 text-xs text-slate-500">
                              {course.level && (
                                <span className="flex items-center gap-1.5">
                                  <GraduationCap className="h-4 w-4 text-cyan-400" />
                                  {course.level}
                                </span>
                              )}

                              {duration && (
                                <span className="flex items-center gap-1.5">
                                  <Clock3 className="h-4 w-4 text-cyan-400" />
                                  {duration}
                                </span>
                              )}

                              {course.modules?.length > 0 && (
                                <span className="flex items-center gap-1.5">
                                  <BookOpen className="h-4 w-4 text-cyan-400" />
                                  {course.modules.length}{" "}
                                  {course.modules.length ===
                                  1
                                    ? "Module"
                                    : "Modules"}
                                </span>
                              )}
                            </div>

                            {/* CTA */}
                            <div className="mt-auto pt-7">
                              <Link
                                to={`/courses/${
                                  course._id ||
                                  course.id
                                }`}
                              >
                                <Button fullWidth>
                                  Explore Course
                                  <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    </div>
                  );
                })}
              </motion.div>
            </div>

            {/* Controls */}
            {courses.length > visibleCount && (
              <div className="mt-8 flex items-center justify-between">
                {/* Pagination */}
                <div className="flex items-center gap-2">
                  {Array.from({
                    length: totalSlides,
                  }).map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() =>
                        setCurrentIndex(index)
                      }
                      aria-label={`Go to course slide ${
                        index + 1
                      }`}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === currentIndex
                          ? "w-8 bg-cyan-400"
                          : "w-2 bg-white/20 hover:bg-white/40"
                      }`}
                    />
                  ))}
                </div>

                {/* Navigation */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={prevSlide}
                    aria-label="Previous courses"
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-white/10
                      bg-white/5
                      text-white
                      transition-all
                      duration-300
                      hover:border-cyan-400/40
                      hover:bg-cyan-400/10
                      hover:text-cyan-300
                    "
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>

                  <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Next courses"
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-white/10
                      bg-white/5
                      text-white
                      transition-all
                      duration-300
                      hover:border-cyan-400/40
                      hover:bg-cyan-400/10
                      hover:text-cyan-300
                    "
                  >
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Academy CTA */}
        {courses.length > 0 && (
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.6,
            }}
            className="mt-14 text-center"
          >
            <p className="mb-5 text-sm text-slate-500">
              Ready to start building your future?
            </p>

            <Link to="/courses">
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                Explore KanuorieTech Academy
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}