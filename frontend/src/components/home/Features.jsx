import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Laptop,
  GraduationCap,
  BookOpen,
  ShieldCheck,
  Rocket,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Card, SectionTitle } from "../common";

const features = [
  {
    icon: Rocket,
    title: "Innovation Driven",
    description:
      "We create modern digital solutions using emerging technologies and creative approaches.",
  },
  {
    icon: Users,
    title: "Experienced Team",
    description:
      "Our developers and digital experts build reliable solutions focused on real business needs.",
  },
  {
    icon: GraduationCap,
    title: "Practical Learning",
    description:
      "Industry-focused courses designed to help learners build real-world technology skills.",
  },
  {
    icon: Laptop,
    title: "Modern Technologies",
    description:
      "We work with powerful technologies to create fast, scalable and maintainable applications.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Solutions",
    description:
      "Applications designed with reliability, performance and future growth in mind.",
  },
  {
    icon: BookOpen,
    title: "Continuous Support",
    description:
      "We provide maintenance, updates and guidance beyond project delivery.",
  },
];

export default function Features() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const [isPaused, setIsPaused] = useState(false);

  const getVisibleCards = () => {
    if (typeof window === "undefined") {
      return 3;
    }

    if (window.innerWidth < 768) {
      return 1;
    }

    if (window.innerWidth < 1024) {
      return 2;
    }

    return 3;
  };

  const [visibleCards, setVisibleCards] = useState(getVisibleCards);

  /*
  ==========================================
  RESPONSIVE SLIDER
  ==========================================
  */

  useEffect(() => {
    const handleResize = () => {
      setVisibleCards(getVisibleCards());
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const maxIndex = Math.max(features.length - visibleCards, 0);

  /*
  ==========================================
  NEXT
  ==========================================
  */

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  /*
  ==========================================
  PREVIOUS
  ==========================================
  */

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  /*
  ==========================================
  AUTO SLIDE
  ==========================================
  */

  useEffect(() => {
    if (isPaused || features.length <= visibleCards) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4000);

    return () => {
      clearInterval(interval);
    };
  }, [isPaused, maxIndex, visibleCards]);

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

  return (
    <section className="bg-slate-900 py-24">
      <div className="px-6 text-center text-white">
        <SectionTitle
          center
          badge="Why Choose Us"
          title="Building Technology That Creates Impact"
          subtitle="We combine innovation, expertise and practical solutions to help businesses and learners grow."
        />

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
                x: `-${currentIndex * (100 / visibleCards)}%`,
              }}
              transition={{
                duration: 0.7,
                ease: "easeInOut",
              }}
            >
              {features.map((feature, index) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
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
                        delay: index * 0.08,
                      }}
                      viewport={{
                        once: true,
                        amount: 0.2,
                      }}
                      className="h-full"
                    >
                      <Card
                        className="
                            h-full
                            border-white/10
                            bg-white/5
                            text-left
                            backdrop-blur-xl
                            transition
                            duration-300
                            hover:border-cyan-400/40
                            hover:-translate-y-1
                          "
                      >
                        <Icon
                          size={42}
                          className="
                              mb-6
                              text-cyan-400
                            "
                        />

                        <h3 className="mb-3 text-xl font-semibold text-white">
                          {feature.title}
                        </h3>

                        <p className="leading-7 text-slate-400">
                          {feature.description}
                        </p>
                      </Card>
                    </motion.div>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* CONTROLS */}

          {features.length > visibleCards && (
            <>
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous features"
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

              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next features"
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

        {features.length > visibleCards && (
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({
              length: maxIndex + 1,
            }).map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to feature slide ${index + 1}`}
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
