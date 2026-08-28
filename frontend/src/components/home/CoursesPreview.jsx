import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
  Card,
  Button,
  SectionTitle,
  Loader,
} from "../common";

import { getCourses } from "../../services";

const VISIBLE = 3;

export default function CoursesPreview() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let mounted = true;

    const fetchCourses = async () => {
      try {
        const res = await getCourses();

        const data = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.data?.courses)
          ? res.data.courses
          : [];

        if (mounted) {
          setCourses(data);
        }
      } catch (error) {
        console.error(
          "Failed to load courses:",
          error
        );

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

  const maxIndex = Math.max(
    courses.length - VISIBLE,
    0
  );

  const nextSlide = () => {
    setCurrentIndex((previous) =>
      previous >= maxIndex ? 0 : previous + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((previous) =>
      previous <= 0 ? maxIndex : previous - 1
    );
  };

  useEffect(() => {
    if (courses.length <= VISIBLE) return;

    const interval = setInterval(() => {
      setCurrentIndex((previous) =>
        previous >= maxIndex ? 0 : previous + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [courses.length, maxIndex]);

  if (loading) {
    return (
      <section className="bg-slate-950 py-24">
        <div className="flex justify-center">
          <Loader />
        </div>
      </section>
    );
  }

  return (
    <section className="bg-slate-900 py-24">
      <div className="px-6">

        <SectionTitle
          Badge="KanuorieTech Academy"
          title="Learn Skills That Build Careers"
          subtitle="Practical technology courses designed to help learners build real-world projects."
        />

        {courses.length === 0 ? (
          <p className="mt-12 text-center text-slate-400">
            Courses coming soon.
          </p>
        ) : (
          <>
            <div className="mt-16 overflow-hidden">

              <motion.div
                className="flex"
                animate={{
                  x: `-${currentIndex * (100 / VISIBLE)}%`,
                }}
                transition={{
                  duration: 0.7,
                  ease: "easeInOut",
                }}
              >

                {courses.map((course, index) => (
                  <div
                    key={
                      course._id ||
                      course.id ||
                      index
                    }
                    className="
                      w-full
                      shrink-0
                      px-2
                      md:w-1/2
                      lg:w-1/3
                    "
                  >
                    <Card
                      className="
                        h-full
                        overflow-hidden
                        border-white/10
                        bg-white/5
                        backdrop-blur-xl
                        hover:border-cyan-400/40
                      "
                    >

                      <img
                        src={
                          course.thumbnail ||
                          "/images/course-placeholder.png"
                        }
                        alt={course.title}
                        className="
                          mb-5
                          h-52
                          w-full
                          rounded-2xl
                          object-cover
                          shadow-2xl
                        "
                      />

                      <h3 className="mb-3 text-xl font-semibold text-white">
                        {course.title}
                      </h3>

                      <p className="mb-6 text-slate-400">
                        {course.description?.slice(
                          0,
                          100
                        ) ||
                          "Explore this practical technology course."}
                        ...
                      </p>

                      <Link
                        to={`/courses/${course._id}`}
                      >
                        <Button fullWidth>
                          View Course
                        </Button>
                      </Link>

                    </Card>
                  </div>
                ))}

              </motion.div>
            </div>

            {courses.length > VISIBLE && (
              <div className="mt-10 flex justify-center gap-4">

                <button
                  type="button"
                  onClick={prevSlide}
                  className="
                    rounded-full
                    border
                    border-white/20
                    px-5
                    py-2
                    text-white
                    transition
                    hover:bg-white/10
                  "
                >
                  ←
                </button>

                <button
                  type="button"
                  onClick={nextSlide}
                  className="
                    rounded-full
                    border
                    border-white/20
                    px-5
                    py-2
                    text-white
                    transition
                    hover:bg-white/10
                  "
                >
                  →
                </button>

              </div>
            )}
          </>
        )}

      </div>
    </section>
  );
}