import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import { Card, Button, Loader, SectionTitle } from "../common";

import { getProjects } from "../../services";

export default function ProjectsPreview() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(1);

  /* ========================================
     RESPONSIVE VISIBLE CARDS
  ======================================== */
  useEffect(() => {
    const updateVisibleCards = () => {
      if (window.innerWidth >= 1024) {
        setVisibleCards(3);
      } else if (window.innerWidth >= 768) {
        setVisibleCards(2);
      } else {
        setVisibleCards(1);
      }
    };

    updateVisibleCards();

    window.addEventListener("resize", updateVisibleCards);

    return () => {
      window.removeEventListener("resize", updateVisibleCards);
    };
  }, []);

  /* ========================================
     FETCH PROJECTS
  ======================================== */
  useEffect(() => {
    let mounted = true;

    const fetchProjects = async () => {
      try {
        const res = await getProjects();

        const data = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
            ? res.data
            : Array.isArray(res?.data?.projects)
              ? res.data.projects
              : [];

        if (mounted) {
          setProjects(data);
        }
      } catch (error) {
        console.error("Failed to load projects:", error);

        if (mounted) {
          setProjects([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchProjects();

    return () => {
      mounted = false;
    };
  }, []);

  /* ========================================
     CALCULATE MAX SLIDE
  ======================================== */
  const maxIndex = Math.max(
    projects.length - visibleCards,
    0,
  );

  /* ========================================
     KEEP INDEX VALID WHEN SCREEN RESIZES
  ======================================== */
  useEffect(() => {
    setCurrentIndex((previous) =>
      Math.min(previous, maxIndex),
    );
  }, [maxIndex]);

  /* ========================================
     RESET WHEN PROJECTS CHANGE
  ======================================== */
  useEffect(() => {
    setCurrentIndex(0);
  }, [projects.length]);

  /* ========================================
     NEXT SLIDE
  ======================================== */
  const nextSlide = () => {
    setCurrentIndex((previous) =>
      previous >= maxIndex ? 0 : previous + 1,
    );
  };

  /* ========================================
     PREVIOUS SLIDE
  ======================================== */
  const prevSlide = () => {
    setCurrentIndex((previous) =>
      previous <= 0 ? maxIndex : previous - 1,
    );
  };

  /* ========================================
     AUTOPLAY
  ======================================== */
  useEffect(() => {
    if (projects.length <= visibleCards) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex((previous) =>
        previous >= maxIndex ? 0 : previous + 1,
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [projects.length, visibleCards, maxIndex]);

  /* ========================================
     LOADING
  ======================================== */
  if (loading) {
    return (
      <section className="bg-slate-200 py-10">
        <div className="mx-auto flex max-w-7xl justify-center px-6">
          <Loader />
        </div>
      </section>
    );
  }

  /* ========================================
     EMPTY STATE
  ======================================== */
  if (!projects.length) {
    return (
      <section className="bg-slate-900 py-10 text-white">
        <div className="px-6">
          <SectionTitle
            Badge="Our Portfolio"
            title="Projects That Create Real Impact"
            subtitle="Explore some of the digital solutions, platforms and products we have built."
          />

          <div className="mt-16 rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
            <h3 className="text-xl font-bold">
              Projects Coming Soon
            </h3>

            <p className="mx-auto mt-3 max-w-lg text-slate-400">
              We're currently updating our portfolio. Check back
              soon to explore projects built by KanuorieTech.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-slate-950 py-10 text-white">
      <div className="px-6 text-center">
        <SectionTitle
          Badge="Our Portfolio"
          title="Projects That Create Real Impact"
          subtitle="Explore some of the digital solutions, platforms and products we have built."
        />

        {/* ========================================
            PROJECT SLIDER
        ======================================== */}
        <div className="relative mt-16 overflow-hidden">
          <motion.div
            className="flex"
            animate={{
              x: `-${currentIndex * (100 / visibleCards)}%`,
            }}
            transition={{
              duration: 0.7,
              ease: "easeInOut",
            }}
          >
            {projects.map((project, index) => {
              const projectId = project._id || project.id;

              const description =
                project.description?.trim() ||
                "A technology solution designed to solve real-world challenges.";

              const shortDescription =
                description.length > 120
                  ? `${description.slice(0, 120).trim()}...`
                  : description;

              return (
                <div
                  key={projectId || `${project.title}-${index}`}
                  className="
                    w-full
                    shrink-0
                    px-2
                    md:w-1/2
                    lg:w-1/3
                  "
                >
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 30,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.5,
                    }}
                    viewport={{
                      once: true,
                    }}
                    className="h-full"
                  >
                    <Card
                      className="
                        flex
                        h-full
                        flex-col
                        overflow-hidden
                        border-white/10
                        bg-white/5
                        p-0
                        backdrop-blur-xl
                      "
                    >
                      <img
                        src={
                          project.image ||
                          "/images/project-placeholder.png"
                        }
                        alt={
                          project.title
                            ? `${project.title} project`
                            : "KanuorieTech project"
                        }
                        className="
                          h-60
                          w-full
                          object-cover
                          transition-transform
                          duration-500
                          hover:scale-105
                        "
                        loading="lazy"
                      />

                      <div className="flex flex-1 flex-col p-6">
                        <h3 className="mb-3 text-2xl font-bold text-white">
                          {project.title}
                        </h3>

                        <p className="mb-8 flex-1 leading-7 text-slate-400">
                          {shortDescription}
                        </p>

                        {projectId && (
                          <Link
                            to={`/projects/${projectId}`}
                            className="mt-auto"
                          >
                            <Button>View Project</Button>
                          </Link>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* ========================================
            SLIDER CONTROLS
        ======================================== */}
        {projects.length > visibleCards && (
          <>
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
                aria-label="Previous projects"
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
                aria-label="Next projects"
              >
                →
              </button>
            </div>

            {/* ========================================
                SLIDE INDICATORS
            ======================================== */}
            <div className="mt-6 flex justify-center gap-2">
              {Array.from({ length: maxIndex + 1 }).map(
                (_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentIndex(index)}
                    aria-label={`Go to project slide ${index + 1}`}
                    className={`
                      h-2
                      rounded-full
                      transition-all
                      duration-300
                      ${
                        currentIndex === index
                          ? "w-8 bg-white"
                          : "w-2 bg-white/30 hover:bg-white/60"
                      }
                    `}
                  />
                ),
              )}
            </div>
          </>
        )}

        {/* ========================================
            VIEW ALL PROJECTS
        ======================================== */}
        {projects.length > 3 && (
          <div className="mt-12 text-center">
            <Link to="/projects">
              <Button variant="secondary">
                View All Projects
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

