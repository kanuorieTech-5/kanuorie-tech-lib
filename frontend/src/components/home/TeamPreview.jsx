import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Loader, Card, SectionTitle, } from "../common";
import { getTeamMembers } from "../../services";
import CEOImage from "../../assets/CEO.jpeg";

const FALLBACK_TEAM = [
  {
    _id: "fallback-1",
    name: "KanuorieTech Team",
    position: "Digital Solutions",
    image: CEOImage,
  },
  {
    _id: "fallback-2",
    name: "Development Team",
    position: "Software Development",
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4",
  },
  {
    _id: "fallback-3",
    name: "Creative Team",
    position: "Design & Digital Experience",
    image:
      "https://cdn-icons-png.flaticon.com/512/1828/1828884.png",
  },
  {
    _id: "fallback-4",
    name: "Education Team",
    position: "Technology & Learning",
    image:
      "https://cdn-icons-png.flaticon.com/512/2721/2721296.png",
  },
];

export default function TeamPreview() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  /*
  ==========================================
  FETCH TEAM
  ==========================================
  */

  useEffect(() => {
    let mounted = true;

    const fetchTeam = async () => {
      try {
        const res = await getTeamMembers();

        const data = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.data?.team)
          ? res.data.team
          : [];

        if (mounted) {
          setTeam(data);
        }
      } catch (error) {
        console.error(
          "Failed to load team:",
          error
        );

        if (mounted) {
          setTeam([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchTeam();

    return () => {
      mounted = false;
    };
  }, []);

  /*
  ==========================================
  TEAM DATA
  ==========================================
  */

  const members =
    team.length > 0
      ? team
      : FALLBACK_TEAM;

  /*
  ==========================================
  RESPONSIVE SLIDES
  ==========================================
  */

  const getVisibleCards = () => {
    if (typeof window === "undefined") {
      return 4;
    }

    if (window.innerWidth < 768) {
      return 1;
    }

    if (window.innerWidth < 1024) {
      return 2;
    }

    return 4;
  };

  const [visibleCards, setVisibleCards] =
    useState(getVisibleCards);

  useEffect(() => {
    const handleResize = () => {
      setVisibleCards(getVisibleCards());
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, []);

  /*
  ==========================================
  SLIDER LIMIT
  ==========================================
  */

  const maxIndex = Math.max(
    members.length - visibleCards,
    0
  );

  /*
  ==========================================
  NEXT SLIDE
  ==========================================
  */

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev >= maxIndex ? 0 : prev + 1
    );
  };

  /*
  ==========================================
  PREVIOUS SLIDE
  ==========================================
  */

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev <= 0 ? maxIndex : prev - 1
    );
  };

  /*
  ==========================================
  AUTO SLIDE
  ==========================================
  */

  useEffect(() => {
    if (isPaused || members.length <= visibleCards) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev >= maxIndex ? 0 : prev + 1
      );
    }, 4000);

    return () => {
      clearInterval(interval);
    };
  }, [
    isPaused,
    maxIndex,
    members.length,
    visibleCards,
  ]);

  /*
  ==========================================
  KEEP INDEX VALID
  ==========================================
  */

  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(0);
    }
  }, [currentIndex, maxIndex]);

  /*
  ==========================================
  LOADING
  ==========================================
  */

  if (loading) {
    return (
      <section className="bg-slate-950 py-24">
        <div className="mx-auto flex max-w-7xl justify-center px-6">
          <Loader />
        </div>
      </section>
    );
  }

  /*
  ==========================================
  RENDER
  ==========================================
  */

  return (
    <section className="bg-slate-950 py-24 text-white">
      <div className="px-6">

        <SectionTitle
          Badge="Our Team"
          title="Meet The People Behind KanuorieTech"
          subtitle="A team of passionate developers, educators and creators building digital solutions for the future."
        />

        {team.length === 0 && (
          <p className="mt-8 text-center text-sm text-slate-500">
            Our team profiles are being updated.
          </p>
        )}

        <div
          className="relative mt-16"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >

          {/* SLIDER */}

          <div className="overflow-hidden">

            <motion.div
              className="flex"
              animate={{
                x: `-${
                  currentIndex *
                  (100 / visibleCards)
                }%`,
              }}
              transition={{
                duration: 0.7,
                ease: "easeInOut",
              }}
            >

              {members.map(
                (member, index) => (
                  <div
                    key={
                      member._id ||
                      member.id ||
                      `${member.name}-${index}`
                    }
                    className="shrink-0 px-3"
                    style={{
                      width: `${100 / visibleCards}%`,
                    }}
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
                        delay:
                          index * 0.08,
                      }}
                      viewport={{
                        once: true,
                        amount: 0.2,
                      }}
                    >

                      <Card
                        className="
                          h-full
                          overflow-hidden
                          border-white/10
                          bg-white/5
                          p-0
                          text-center
                          backdrop-blur-xl
                        "
                      >

                        <img
                          src={
                            member.image ||
                            "/images/team-placeholder.png"
                          }
                          alt={
                            member.name
                              ? `${member.name} - ${
                                  member.position ||
                                  "KanuorieTech team member"
                                }`
                              : "KanuorieTech team member"
                          }
                          className="
                            h-64
                            w-full
                            object-cover
                            transition-transform
                            duration-500
                            hover:scale-105
                          "
                          loading="lazy"
                        />

                        <div className="p-6">

                          <h3 className="text-xl font-bold text-white">
                            {member.name}
                          </h3>

                          {member.position && (
                            <p className="mt-2 text-cyan-400">
                              {member.position}
                            </p>
                          )}

                          {member.bio && (
                            <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-400">
                              {member.bio}
                            </p>
                          )}

                        </div>

                      </Card>

                    </motion.div>

                  </div>
                )
              )}

            </motion.div>

          </div>

          {/* PREVIOUS */}

          {members.length > visibleCards && (
            <>
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous team members"
                className="
                  absolute
                  left-0
                  top-1/2
                  z-10
                  flex
                  h-11
                  w-11
                  -translate-y-1/2
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/10
                  bg-slate-900/80
                  text-white
                  shadow-lg
                  backdrop-blur
                  transition
                  hover:bg-cyan-500
                "
              >
                <ChevronLeft size={22} />
              </button>

              {/* NEXT */}

              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next team members"
                className="
                  absolute
                  right-0
                  top-1/2
                  z-10
                  flex
                  h-11
                  w-11
                  -translate-y-1/2
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/10
                  bg-slate-900/80
                  text-white
                  shadow-lg
                  backdrop-blur
                  transition
                  hover:bg-cyan-500
                "
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}

        </div>

        {/* DOTS */}

        {members.length > visibleCards && (
          <div className="mt-8 flex justify-center gap-2">

            {Array.from({
              length: maxIndex + 1,
            }).map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() =>
                  setCurrentIndex(index)
                }
                aria-label={`Go to team slide ${
                  index + 1
                }`}
                className={`
                  h-2
                  rounded-full
                  transition-all
                  duration-300
                  ${
                    currentIndex === index
                      ? "w-8 bg-cyan-400"
                      : "w-2 bg-slate-600"
                  }
                `}
              />
            ))}

          </div>
        )}

      </div>
    </section>
  );
}