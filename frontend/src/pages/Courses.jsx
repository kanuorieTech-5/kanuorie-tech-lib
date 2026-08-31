import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  BookOpen,
  Users,
  Clock3,
  Star,
  Filter,
  ArrowRight,
} from "lucide-react";

import {
  Card,
  Button,
  Loader,
  Pagination,
  SectionTitle,
} from "../components/common";

import { SearchBar } from "../components/layout";

import { Newsletter, CTA } from "../components/home";

import { getCourses } from "../services";

const PER_PAGE = 9;

const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [page, setPage] = useState(1);
  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await getCourses();
        setCourses(res.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, []);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        course.title?.toLowerCase().includes(search.toLowerCase()) ||
        course.description?.toLowerCase().includes(search.toLowerCase());

      const matchesDifficulty =
        difficulty === "All" || course.level === difficulty;

      return matchesSearch && matchesDifficulty;
    });
  }, [courses, search, difficulty]);

  const featuredCourse = filteredCourses[0];

  const totalPages = Math.ceil(
    Math.max(filteredCourses.length - 1, 0) / PER_PAGE,
  );

  const currentCourses = filteredCourses.slice(
    1 + (page - 1) * PER_PAGE,
    1 + page * PER_PAGE,
  );

  if (loading) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center">
        <Loader />
      </section>
    );
  }

  return (
    <>
      {/* Hero */}

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 py-8 text-white">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:45px_45px]" />

        <div className="relative px-6 text-center">
          <motion.span
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-2 text-sm font-medium text-blue-400"
          >
            <BookOpen size={16} />
            Learn Without Limits
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-8 text-5xl font-black leading-tight lg:text-7xl"
          >
            Explore Our
            <span className="text-blue-400"> Professional</span>
            <br />
            Technology Courses
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-300"
          >
            Master modern software development through practical, project-based
            learning designed to help you become job-ready and industry
            confident.
          </motion.p>
        </div>
      </section>

      {/* Search & Filters */}

      <section className="bg-slate-200 py-14">
        <div className=" px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search courses..."
            />
            <div className="flex flex-wrap gap-3">
              {difficulties.map((level) => (
                <button
                  key={level}
                  onClick={() => {
                    setDifficulty(level);
                    setPage(1);
                  }}
                  className={`rounded-full px-5 py-2 transition ${
                    difficulty === level
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 hover:bg-slate-200"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Course */}

      {featuredCourse && (
        <section className="bg-slate-200 py-24">
          <div className="px-6">
            <SectionTitle
              title="Featured Course"
              subtitle="Recommended for you"
            />

            <Card className="mt-14 overflow-hidden lg:grid lg:grid-cols-2">
              <img
                src={featuredCourse.thumbnail}
                alt={featuredCourse.title}
                className="h-full w-full object-cover"
              />

              <div className="p-10">
                <div className="mb-6 flex flex-wrap gap-4">
                  <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700">
                    {featuredCourse.level || "Beginner"}
                  </span>

                  <span className="flex items-center gap-2 text-slate-500">
                    <Clock3 size={18} />

                    {featuredCourse.duration || "8 Weeks"}
                  </span>

                  <span className="flex items-center gap-2 text-yellow-500">
                    <Star size={18} fill="currentColor" />

                    {featuredCourse.rating || "5.0"}
                  </span>
                </div>

                <h2 className="text-4xl font-black">{featuredCourse.title}</h2>

                <p className="mt-6 leading-8 text-slate-600">
                  {featuredCourse.description}
                </p>

                <div className="mt-10">
                  <Link to={`/courses/${featuredCourse._id}`}>
                    <Button>
                      Start Learning
                      <ArrowRight size={18} className="ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </section>
      )}
      {/* Course Catalog */}

      <section className="py-10 bg-slate-200">
        <div className="px-6">
          <SectionTitle
            title="Browse All Courses"
            subtitle={`${filteredCourses.length} course${
              filteredCourses.length !== 1 ? "s" : ""
            } available`}
          />

          {currentCourses.length === 0 ? (
            <Card className="mt-16 py-10 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
                <Search className="text-blue-600" size={36} />
              </div>

              <h3 className="mt-8 text-3xl font-bold text-slate-900">
                No Courses Found
              </h3>

              <p className="mx-auto mt-4 max-w-lg text-slate-600 leading-8">
                We couldn't find any courses matching your search. Try another
                keyword or change the selected difficulty.
              </p>

              <Button
                className="mt-8"
                onClick={() => {
                  setSearch("");
                  setDifficulty("All");
                }}
              >
                Reset Filters
              </Button>
              <Button className="mt-8 ml-4" onClick={() => setPage(1)}>
                Go to First Page
              </Button>
            </Card>
          ) : (
            <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {currentCourses.map((course, index) => (
                <motion.div
                  key={course._id}
                  initial={{
                    opacity: 0,
                    y: 40,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                  }}
                >
                  <Card hover className="overflow-hidden p-0">
                    <div className="relative">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="h-60 w-full object-cover transition duration-500 hover:scale-105"
                      />

                      <span className="absolute left-4 top-4 rounded-full bg-blue-600 px-4 py-1 text-sm font-semibold text-white">
                        {course.level || "Beginner"}
                      </span>
                    </div>

                    <div className="p-6">
                      <div className="mb-5 flex items-center justify-between text-sm text-slate-500">
                        <span className="flex items-center gap-2">
                          <Clock3 size={16} />

                          {course.duration || "8 Weeks"}
                        </span>

                        <span className="flex items-center gap-1 text-yellow-500">
                          <Star size={16} fill="currentColor" />

                          {course.rating || "5.0"}
                        </span>
                      </div>

                      <h3 className="text-2xl font-bold text-slate-900">
                        {course.title}
                      </h3>

                      <p className="mt-4 line-clamp-3 leading-7 text-slate-600">
                        {course.description}
                      </p>

                      <div className="mt-6 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-500">
                          <Users size={18} />

                          <span>{course.students || 0} Students</span>
                        </div>

                        <span className="text-lg font-bold text-blue-600">
                          {course.price ? `₦${course.price}` : "Free"}
                        </span>
                      </div>

                      <Link
                        to={`/courses/${course._id}`}
                        className="mt-8 block"
                      >
                        <Button fullWidth>
                          View Course
                          <ArrowRight size={18} className="ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-20 flex justify-center">
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>
      </section>

      {/* Learning Benefits */}

      <section className="bg-slate-50 py-24">
        <div className="px-6">
          <SectionTitle
            title="Why Learn With KanuorieTech?"
            subtitle="More than just video courses"
          />

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Project-Based Learning",
                description: "Build real-world applications while learning.",
              },
              {
                title: "Expert Instructors",
                description: "Learn from experienced software engineers.",
              },
              {
                title: "Certificates",
                description: "Earn certificates after completing courses.",
              },
              {
                title: "Career Ready",
                description: "Gain practical skills employers are looking for.",
              },
            ].map((item) => (
              <Card key={item.title} hover className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <BookOpen className="text-blue-600" size={28} />
                </div>

                <h3 className="mt-6 text-xl font-bold">{item.title}</h3>

                <p className="mt-4 leading-7 text-slate-600">
                  {item.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Newsletter />

      <CTA />
    </>
  );
}
