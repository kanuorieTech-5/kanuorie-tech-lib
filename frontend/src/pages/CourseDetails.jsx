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
  User,
  CalendarDays,
} from "lucide-react";

import {
  Loader,
  Button,
  Card,
  SectionTitle,
  Badge,
} from "../components/common";

import {
  Newsletter,
  CTA,
} from "../components/home";

import {
  getCourse,
  enrollCourse,
  getCourses,
} from "../services";

export default function CourseDetails() {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [relatedCourses, setRelatedCourses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    async function loadCourse() {
      try {
        const [courseRes, coursesRes] = await Promise.all([
          getCourse(id),
          getCourses(),
        ]);

        setCourse(courseRes.data);

        setRelatedCourses(
          (coursesRes.data || [])
            .filter((item) => item._id !== id)
            .slice(0, 3)
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadCourse();
  }, [id]);

  const totalLessons = useMemo(
    () => course?.lessons?.length || 0,
    [course]
  );

  const handleEnroll = async () => {
    try {
      setEnrolling(true);

      await enrollCourse(id);

      toast.success("Successfully enrolled!");

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Enrollment failed."
      );
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center">
        <Loader />
      </section>
    );
  }

  if (!course) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center px-6">
        <Card className="max-w-lg text-center">

          <BookOpen
            size={56}
            className="mx-auto mb-6 text-blue-600"
          />

          <h2 className="text-3xl font-bold">
            Course Not Found
          </h2>

          <p className="mt-4 text-slate-600">
            The course you're looking for
            doesn't exist or may have been removed.
          </p>

          <Link
            to="/courses"
            className="mt-8 inline-block"
          >
            <Button>
              Back To Courses
            </Button>
          </Link>

        </Card>
      </section>
    );
  }

  return (
    <>
      {/* Hero */}

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white">

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:45px_45px]" />

        <div className="relative mx-auto max-w-7xl px-6 py-24">

          <Link
            to="/courses"
            className="mb-10 inline-flex items-center gap-2 text-blue-400 transition hover:text-blue-300"
          >
            <ArrowLeft size={18} />
            Back to Courses
          </Link>

          <div className="grid gap-16 lg:grid-cols-[1.4fr_.8fr]">

            {/* LEFT */}

            <motion.div
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
            >

              <Badge>

                {course.level || "Beginner"}

              </Badge>

              <h1 className="mt-6 text-5xl font-black leading-tight lg:text-6xl">

                {course.title}

              </h1>

              <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-300">

                {course.description}

              </p>

              <div className="mt-10 flex flex-wrap gap-8">

                <div className="flex items-center gap-3">

                  <Clock3 size={20} />

                  <span>

                    {course.duration || "8 Weeks"}

                  </span>

                </div>

                <div className="flex items-center gap-3">

                  <BookOpen size={20} />

                  <span>

                    {totalLessons} Lessons

                  </span>

                </div>

                <div className="flex items-center gap-3">

                  <Users size={20} />

                  <span>

                    {course.students || 0} Students

                  </span>

                </div>

                <div className="flex items-center gap-3">

                  <Star
                    size={20}
                    fill="currentColor"
                  />

                  <span>

                    {course.rating || "5.0"}

                  </span>

                </div>

              </div>

            </motion.div>

            {/* RIGHT */}

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
            >

              <Card className="overflow-hidden p-0">

                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="h-72 w-full object-cover"
                />

                <div className="space-y-6 p-8">

                  <div className="flex items-center justify-between">

                    <span className="text-3xl font-black text-blue-600">

                      {course.price
                        ? `₦${course.price}`
                        : "Free"}

                    </span>

                    <Award
                      className="text-yellow-500"
                      size={30}
                    />

                  </div>

                  <Button
                    fullWidth
                    loading={enrolling}
                    onClick={handleEnroll}
                  >

                    Enroll Now

                  </Button>

                  <div className="space-y-4 border-t pt-6">

                    <div className="flex items-center justify-between">

                      <span>Instructor</span>

                      <strong>

                        {course.instructor || "KanuorieTech"}

                      </strong>

                    </div>

                    <div className="flex items-center justify-between">

                      <span>Level</span>

                      <strong>

                        {course.level || "Beginner"}

                      </strong>

                    </div>

                    <div className="flex items-center justify-between">

                      <span>Certificate</span>

                      <strong>

                        Yes

                      </strong>

                    </div>

                    <div className="flex items-center justify-between">

                      <span>Access</span>

                      <strong>

                        Lifetime

                      </strong>

                    </div>

                  </div>

                </div>

              </Card>

            </motion.div>

          </div>

        </div>

      </section>
            {/* What You'll Learn */}

      <section className="py-24">

        <div className="mx-auto max-w-7xl px-6">

          <SectionTitle
            title="What You'll Learn"
            subtitle="Skills you'll gain by completing this course."
          />

          <div className="mt-16 grid gap-6 md:grid-cols-2">

            {(course.learningOutcomes?.length
              ? course.learningOutcomes
              : [
                  "Build real-world projects.",
                  "Understand modern development workflows.",
                  "Write clean and maintainable code.",
                  "Deploy production-ready applications.",
                  "Work with REST APIs.",
                  "Become job-ready."
                ]).map((item, index) => (

              <Card
                key={index}
                className="flex items-start gap-4"
              >

                <CheckCircle2
                  className="mt-1 text-green-500"
                  size={22}
                />

                <p className="leading-7 text-slate-700">
                  {item}
                </p>

              </Card>

            ))}

          </div>

        </div>

      </section>

      {/* Course Curriculum */}

      <section className="bg-slate-50 py-24">

        <div className="mx-auto max-w-7xl px-6">

          <SectionTitle
            title="Course Curriculum"
            subtitle={`${totalLessons} lessons included`}
          />

          <div className="mt-16 space-y-5">

            {course.lessons?.map((lesson, index) => (

              <Card
                key={lesson._id || index}
                hover
                className="flex items-center justify-between"
              >

                <div className="flex items-center gap-5">

                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">

                    <PlayCircle
                      className="text-blue-600"
                      size={24}
                    />

                  </div>

                  <div>

                    <h3 className="font-semibold text-slate-900">

                      {index + 1}. {lesson.title}

                    </h3>

                    <p className="text-sm text-slate-500">

                      Video Lesson

                    </p>

                  </div>

                </div>

                <span className="text-sm text-slate-500">

                  {lesson.duration || "10 min"}

                </span>

              </Card>

            ))}

          </div>

        </div>

      </section>

      {/* Instructor */}

      <section className="py-24">

        <div className="mx-auto max-w-7xl px-6">

          <SectionTitle
            title="Meet Your Instructor"
            subtitle="Learn from experienced professionals."
          />

          <Card className="mt-16 flex flex-col gap-8 lg:flex-row lg:items-center">

            <img
              src={
                course.instructorImage ||
                "/images/instructor-placeholder.jpg"
              }
              alt={course.instructor}
              className="h-40 w-40 rounded-full object-cover"
            />

            <div>

              <h3 className="text-3xl font-bold">

                {course.instructor || "KanuorieTech"}

              </h3>

              <p className="mt-5 leading-8 text-slate-600">

                {course.instructorBio ||
                  "Experienced software engineer passionate about helping developers build practical skills through project-based learning."}

              </p>

            </div>

          </Card>

        </div>

      </section>

      {/* Requirements */}

      <section className="bg-slate-50 py-24">

        <div className="mx-auto max-w-7xl px-6">

          <SectionTitle
            title="Requirements"
            subtitle="What you need before starting."
          />

          <div className="mt-16 space-y-5">

            {(course.requirements?.length
              ? course.requirements
              : [
                  "Basic computer skills.",
                  "Laptop or desktop computer.",
                  "Internet connection.",
                  "Willingness to learn."
                ]).map((item, index) => (

              <Card
                key={index}
                className="flex items-center gap-4"
              >

                <CheckCircle2
                  className="text-green-500"
                  size={20}
                />

                <span>{item}</span>

              </Card>

            ))}

          </div>

        </div>

      </section>

      {/* Certificate */}

      <section className="py-24">

        <div className="mx-auto max-w-5xl px-6">

          <Card className="text-center">

            <Award
              className="mx-auto text-yellow-500"
              size={60}
            />

            <h2 className="mt-8 text-4xl font-black">

              Earn Your Certificate

            </h2>

            <p className="mx-auto mt-6 max-w-2xl leading-8 text-slate-600">

              Complete every lesson and pass the course
              assessments to receive your KanuorieTech
              Certificate of Completion.

            </p>

          </Card>

        </div>

      </section>

      {/* Related Courses */}

      {relatedCourses.length > 0 && (

        <section className="bg-slate-50 py-24">

          <div className="mx-auto max-w-7xl px-6">

            <SectionTitle
              title="Related Courses"
              subtitle="Continue learning with these courses."
            />

            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

              {relatedCourses.map((item) => (

                <Card
                  key={item._id}
                  hover
                  className="overflow-hidden p-0"
                >

                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="h-52 w-full object-cover"
                  />

                  <div className="p-6">

                    <h3 className="text-xl font-bold">

                      {item.title}

                    </h3>

                    <p className="mt-4 line-clamp-3 text-slate-600">

                      {item.description}

                    </p>

                    <Link
                      to={`/courses/${item._id}`}
                      className="mt-6 block"
                    >

                      <Button fullWidth>

                        View Course

                        <ArrowRight
                          className="ml-2"
                          size={18}
                        />

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