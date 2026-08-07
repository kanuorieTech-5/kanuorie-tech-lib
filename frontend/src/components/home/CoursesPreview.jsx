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

export default function CoursesPreview() {

  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchCourses = async () => {

      try {

        const res = await getCourses();

        setCourses(res.data || []);

      } catch (error) {
        console.error(
          "Failed to load courses:",
          error
        );
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);
  if (loading) return <Loader />;
  return (

    <section className="bg-slate-950 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionTitle
          badge="KanuorieTech Academy"
          title="Learn Skills That Build Careers"
          subtitle="Practical technology courses designed to help learners build real-world projects."
        />
        {courses.length === 0 ? (

          <p className="
            mt-12
            text-center
            text-slate-400
          ">
            Courses coming soon.
          </p>

        ) : (
          <div className="
            mt-16
            grid
            gap-8
            md:grid-cols-2
            lg:grid-cols-3
          ">
            {courses.slice(0,3).map((course,index)=>(
              <motion.div

                key={course._id}

                initial={{
                  opacity:0,
                  y:30
                }}

                whileInView={{
                  opacity:1,
                  y:0
                }}

                transition={{
                  delay:index * 0.1
                }}

                viewport={{
                  once:true
                }}

              >
                <Card
                  className="
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
                  <h3 className="
                    mb-3
                    text-xl
                    font-semibold
                    text-white
                  ">
                    {course.title}
                  </h3>
                  <p className="
                    mb-6
                    text-slate-400
                  ">
                    {
                      course.description
                      ?.slice(0,100)
                      || "Explore this practical technology course."
                    }
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
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}