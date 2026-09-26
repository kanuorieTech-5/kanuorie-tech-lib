import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  BookOpen,
  Users,
  Clock3,
  Star,
  ArrowRight,
  Award,
  LockKeyhole,
  ShoppingCart,
} from "lucide-react";
import { toast } from "react-hot-toast";

import {
  Card,
  Button,
  Loader,
  Pagination,
  SectionTitle,
} from "../components/common";

import { SearchBar } from "../components/layout";

import { Newsletter, CTA } from "../components/home";

import {
  getCourses,
  enrollCourse,
  initializePaystackCoursePayment,
} from "../services";

import { FaMoneyBill } from "react-icons/fa";

const PER_PAGE = 9;

const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

const COURSE_IMAGE_FALLBACK =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80";

function getCourseImage(course) {
  return course?.image || course?.thumbnail || COURSE_IMAGE_FALLBACK;
}

function getApiMessage(error, fallback = "Something went wrong.") {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
}

function formatPrice(course) {
  if (!course?.premium) return "Free";

  const price = Number(course?.price || 0);

  if (!price) return "Premium";

  const currency = course?.currency || "NGN";

  if (currency === "NGN") {
    return `₦${price.toLocaleString("en-NG")}`;
  }

  return `${currency} ${price.toLocaleString()}`;
}

function isPremiumCourse(course) {
  return Boolean(course?.premium);
}

export default function Courses() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [page, setPage] = useState(1);

  const [enrollingId, setEnrollingId] = useState(null);
  const [purchasingId, setPurchasingId] = useState(null);

  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await getCourses();

        setCourses(res?.data || []);
      } catch (error) {
        console.error("Failed to load courses:", error);

        toast.error(getApiMessage(error, "Unable to load courses right now."));
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, []);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const searchTerm = search.trim().toLowerCase();

      const matchesSearch =
        !searchTerm ||
        course.title?.toLowerCase().includes(searchTerm) ||
        course.description?.toLowerCase().includes(searchTerm) ||
        course.instructor?.toLowerCase().includes(searchTerm) ||
        course.category?.toLowerCase().includes(searchTerm) ||
        course.level?.toLowerCase().includes(searchTerm);

      const matchesDifficulty =
        difficulty === "All" || course.level === difficulty;

      return matchesSearch && matchesDifficulty;
    });
  }, [courses, search, difficulty]);

  const featuredCourse = useMemo(() => {
    return (
      filteredCourses.find((course) => course.featured) ||
      filteredCourses[0] ||
      null
    );
  }, [filteredCourses]);

  const catalogCourses = useMemo(() => {
    if (!featuredCourse) return [];

    return filteredCourses.filter(
      (course) => course._id !== featuredCourse._id,
    );
  }, [filteredCourses, featuredCourse]);

  const totalPages = Math.ceil(catalogCourses.length / PER_PAGE);

  const currentCourses = catalogCourses.slice(
    (page - 1) * PER_PAGE,
    page * PER_PAGE,
  );

  /* ==========================================
     FREE COURSE ENROLLMENT
  ========================================== */

  const handleEnroll = async (course) => {
    if (!course?._id || enrollingId || purchasingId) return;

    /*
     * Premium courses MUST NEVER use the free enrollment endpoint.
     *
     * The backend also blocks this with HTTP 402, but we prevent
     * the incorrect action from the UI as well.
     */
    if (isPremiumCourse(course)) {
      return handleBuyCourse(course);
    }

    setEnrollingId(course._id);

    try {
      await enrollCourse(course._id);

      toast.success("Enrollment successful! Your course is now unlocked.");

      navigate(`/courses/${course._id}`);
    } catch (error) {
      console.error("Enrollment failed:", error);

      const status = error?.response?.status;

      if (status === 401) {
        toast.error("Please log in to enroll in this course.");

        navigate("/login", {
          state: {
            from: `/courses/${course._id}`,
          },
        });

        return;
      }

      if (status === 409) {
        toast.success("You are already enrolled in this course.");

        navigate(`/courses/${course._id}`);

        return;
      }

      if (status === 402) {
        toast.error(
          "This is a premium course. Please complete payment before enrolling.",
        );

        return;
      }

      toast.error(
        getApiMessage(
          error,
          "Unable to enroll in this course. Please try again.",
        ),
      );
    } finally {
      setEnrollingId(null);
    }
  };

  /* ==========================================
     PREMIUM COURSE PAYSTACK CHECKOUT
  ========================================== */

  const handleBuyCourse = async (course) => {
    if (!course?._id || purchasingId || enrollingId) return;

    setPurchasingId(course._id);

    try {
      const response = await initializePaystackCoursePayment(course._id);

      const authorizationUrl =
        response?.data?.paystack?.authorization_url;

      if (!authorizationUrl) {
        throw new Error(
          "Payment checkout could not be initialized. Please try again.",
        );
      }

      /*
       * Redirect directly to the Paystack-hosted checkout.
       *
       * Enrollment is NOT created here.
       * The backend creates enrollment only after verified payment.
       */
      window.location.assign(authorizationUrl);
    } catch (error) {
      console.error("Course payment initialization failed:", error);

      const status = error?.response?.status;

      if (status === 401) {
        toast.error("Please log in to purchase this course.");

        navigate("/login", {
          state: {
            from: `/courses/${course._id}`,
          },
        });

        return;
      }

      if (status === 409) {
        toast.success("You already have access to this course.");

        navigate(`/courses/${course._id}`);

        return;
      }

      toast.error(
        getApiMessage(
          error,
          "Unable to start payment. Please try again.",
        ),
      );
    } finally {
      setPurchasingId(null);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setDifficulty("All");
    setPage(1);
  };

  if (loading) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center">
        <Loader />
      </section>
    );
  }

  return (
    <>
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

      {/* ==========================================
          COURSE CATALOG
      ========================================== */}

      <section className="bg-slate-200 py-10 text-slate-900 dark:bg-slate-900 dark:text-white lg:py-20">
        <div className="px-6">
          <SectionTitle
            title="Browse All Courses"
            subtitle={`${filteredCourses.length} course${
              filteredCourses.length !== 1 ? "s" : ""
            } available`}
          />

          {/* Filters */}
          <section className="bg-slate-200 py-1">
            <div className="px-6">
              <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
                <SearchBar
                  value={search}
                  onChange={(value) => {
                    setSearch(value);
                    setPage(1);
                  }}
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

          {/* ==========================================
              FEATURED COURSE
          ========================================== */}

          {featuredCourse && (
            <section className="mt-16">
              <SectionTitle
                title="Featured Course"
                subtitle="Explore this featured learning experience"
              />

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="overflow-hidden p-0">
                  <div className="grid lg:grid-cols-[1.15fr_.85fr]">
                    {/* Image */}
                    <div className="relative min-h-[320px]">
                      <img
                        src={getCourseImage(featuredCourse)}
                        alt={featuredCourse.title}
                        className="h-full min-h-[320px] w-full object-cover"
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = COURSE_IMAGE_FALLBACK;
                        }}
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                      {featuredCourse.featured && (
                        <div className="absolute left-5 top-5 rounded-full bg-yellow-400 px-4 py-2 text-xs font-bold text-slate-950 shadow-lg">
                          Featured Course
                        </div>
                      )}

                      <div className="absolute right-5 top-5">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold shadow-lg ${
                            isPremiumCourse(featuredCourse)
                              ? "bg-blue-600 text-white"
                              : "bg-emerald-500 text-white"
                          }`}
                        >
                          {isPremiumCourse(featuredCourse) ? (
                            <>
                              <LockKeyhole size={14} />
                              Premium
                            </>
                          ) : (
                            "Free"
                          )}
                        </span>
                      </div>

                      <div className="absolute bottom-6 left-6 right-6 text-white">
                        <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold">
                          {featuredCourse.level || "Beginner"}
                        </span>

                        <h3 className="mt-4 text-3xl font-black sm:text-4xl">
                          {featuredCourse.title}
                        </h3>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-6 p-6 sm:p-8">
                      <div>
                        <p className="leading-7 text-slate-600">
                          {featuredCourse.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-2xl bg-slate-50 p-4">
                          <Clock3 size={20} className="text-blue-600" />

                          <p className="mt-2 text-sm text-slate-500">
                            Duration
                          </p>

                          <strong className="text-slate-900">
                            {featuredCourse.duration || "8 Weeks"}
                          </strong>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4">
                          <Star
                            size={20}
                            className="text-yellow-500"
                            fill="currentColor"
                          />

                          <p className="mt-2 text-sm text-slate-500">
                            Rating
                          </p>

                          <strong className="text-slate-900">
                            {featuredCourse.rating || "5.0"}
                          </strong>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4">
                          <FaMoneyBill
                            size={20}
                            className="text-yellow-500"
                            fill="currentColor"
                          />

                          <p className="text-sm text-slate-500">
                            Course Access
                          </p>

                          <span className="text-2xl font-black text-blue-600">
                            {isPremiumCourse(featuredCourse)
                              ? "Premium"
                              : "Free"}
                          </span>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4">
                          <Award size={20} className="text-yellow-500" />

                          <p className="mt-2 text-sm text-slate-500">
                            Certificate
                          </p>

                          <strong className="text-slate-900">
                            Available
                          </strong>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <span className="text-2xl font-black text-slate-900">
                          {formatPrice(featuredCourse)}
                        </span>
                      </div>

                      <div className="space-y-3">
                        {isPremiumCourse(featuredCourse) ? (
                          <Button
                            fullWidth
                            loading={purchasingId === featuredCourse._id}
                            disabled={
                              Boolean(enrollingId) ||
                              Boolean(purchasingId)
                            }
                            onClick={() => handleBuyCourse(featuredCourse)}
                          >
                            {purchasingId === featuredCourse._id ? (
                              "Opening Checkout..."
                            ) : (
                              <>
                                <ShoppingCart size={18} />
                                Buy Course
                              </>
                            )}
                          </Button>
                        ) : (
                          <Button
                            fullWidth
                            loading={enrollingId === featuredCourse._id}
                            disabled={
                              Boolean(enrollingId) ||
                              Boolean(purchasingId)
                            }
                            onClick={() => handleEnroll(featuredCourse)}
                          >
                            {enrollingId === featuredCourse._id
                              ? "Enrolling..."
                              : "Enroll Now"}
                          </Button>
                        )}

                        <Link
                          to={`/courses/${featuredCourse._id}`}
                          className="block"
                        >
                          <Button
                            fullWidth
                            variant="outline"
                            disabled={
                              Boolean(enrollingId) ||
                              Boolean(purchasingId)
                            }
                          >
                            <ArrowRight size={18} />
                            View Course
                          </Button>
                        </Link>
                      </div>

                      {isPremiumCourse(featuredCourse) && (
                        <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                          <LockKeyhole
                            size={18}
                            className="mt-0.5 shrink-0 text-blue-600"
                          />

                          <p className="text-sm leading-6 text-slate-600">
                            This is a premium course. Complete payment through
                            Paystack to unlock enrollment and access the
                            curriculum.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            </section>
          )}

          {/* ==========================================
              COURSE CARDS
          ========================================== */}

          {catalogCourses.length > 0 ? (
            currentCourses.length > 0 ? (
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
                      {/* Image */}
                      <div className="relative">
                        <img
                          src={getCourseImage(course)}
                          alt={course.title}
                          className="h-60 w-full object-cover transition duration-500 hover:scale-105"
                          onError={(event) => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.src = COURSE_IMAGE_FALLBACK;
                          }}
                        />

                        <span className="absolute left-4 top-4 rounded-full bg-blue-600 px-4 py-1 text-sm font-semibold text-white">
                          {course.level || "Beginner"}
                        </span>

                        {course.featured && (
                          <span className="absolute right-4 top-4 rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold text-slate-950">
                            Featured
                          </span>
                        )}

                        <span
                          className={`absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold shadow-lg ${
                            isPremiumCourse(course)
                              ? "bg-slate-950/90 text-white"
                              : "bg-emerald-500 text-white"
                          }`}
                        >
                          {isPremiumCourse(course) && (
                            <LockKeyhole size={13} />
                          )}

                          {isPremiumCourse(course) ? "Premium" : "Free"}
                        </span>
                      </div>

                      {/* Content */}
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

                            <span>
                              {course.students || course.enrollments || 0}{" "}
                              Students
                            </span>
                          </div>

                          <span className="text-lg font-bold text-blue-600">
                            {formatPrice(course)}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="mt-8 grid gap-3 sm:grid-cols-2">
                          {isPremiumCourse(course) ? (
                            <Button
                              fullWidth
                              loading={purchasingId === course._id}
                              disabled={
                                Boolean(enrollingId) ||
                                Boolean(purchasingId)
                              }
                              onClick={() => handleBuyCourse(course)}
                            >
                              {purchasingId === course._id ? (
                                "Checkout..."
                              ) : (
                                <>
                                  <ShoppingCart size={17} />
                                  Buy Course
                                </>
                              )}
                            </Button>
                          ) : (
                            <Button
                              fullWidth
                              loading={enrollingId === course._id}
                              disabled={
                                Boolean(enrollingId) ||
                                Boolean(purchasingId)
                              }
                              onClick={() => handleEnroll(course)}
                            >
                              {enrollingId === course._id
                                ? "Enrolling..."
                                : "Enroll Now"}
                            </Button>
                          )}

                          <Link
                            to={`/courses/${course._id}`}
                            className="block"
                          >
                            <Button
                              fullWidth
                              variant="outline"
                              disabled={
                                Boolean(enrollingId) ||
                                Boolean(purchasingId)
                              }
                            >
                              View Course
                              <ArrowRight size={18} className="ml-2" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : null
          ) : filteredCourses.length === 0 ? (
            <Card className="mt-16 py-10 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
                <Search className="text-blue-600" size={36} />
              </div>

              <h3 className="mt-8 text-3xl font-bold text-slate-900">
                No Courses Found
              </h3>

              <p className="mx-auto mt-4 max-w-lg leading-8 text-slate-600">
                We couldn't find any courses matching your search. Try another
                keyword or change the selected difficulty.
              </p>

              <Button className="mt-8" onClick={resetFilters}>
                Reset Filters
              </Button>
            </Card>
          ) : null}

          {/* Pagination */}
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

      {/* ==========================================
          LEARNING BENEFITS
      ========================================== */}

      <section className="bg-slate-50 py-10 lg:py-20">
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
