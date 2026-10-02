import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const featuresData = [
  {
    title: "E-Library Access",
    desc: "Browse and access books, notes, guides and educational resources in one centralized digital library.",
    img: "/images/library.png",
  },
  {
    title: "Course Management",
    desc: "Enroll in courses, track progress and continue learning from your personalized dashboard.",
    img: "/images/courses.png",
  },
  {
    title: "User Profiles",
    desc: "Create your learning identity, manage your profile and personalize your experience.",
    img: "/images/profile.png",
  },
  {
    title: "Secure Authentication",
    desc: "Protected accounts and secure access keep user information safe.",
    img: "/images/security.png",
  },
  {
    title: "Admin Control Panel",
    desc: "Manage users, courses, books and platform content from one dashboard.",
    img: "/images/admin.png",
  },
  {
    title: "Resource Management",
    desc: "Upload and organize learning materials with a structured content system.",
    img: "/images/resources.png",
  },
];

export default function FeaturesSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(1);

  /* ==========================================
     RESPONSIVE CARD COUNT
  ========================================== */

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

  /* ==========================================
     KEEP INDEX VALID WHEN SCREEN SIZE CHANGES
  ========================================== */

  useEffect(() => {
    const maxIndex = Math.max(
      featuresData.length - visibleCards,
      0,
    );

    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [visibleCards, currentIndex]);

  /* ==========================================
     NEXT SLIDE
  ========================================== */

  const nextSlide = () => {
    const maxIndex = Math.max(
      featuresData.length - visibleCards,
      0,
    );

    setCurrentIndex((prev) =>
      prev >= maxIndex ? 0 : prev + 1,
    );
  };

  /* ==========================================
     PREVIOUS SLIDE
  ========================================== */

  const prevSlide = () => {
    const maxIndex = Math.max(
      featuresData.length - visibleCards,
      0,
    );

    setCurrentIndex((prev) =>
      prev <= 0 ? maxIndex : prev - 1,
    );
  };

  /* ==========================================
     AUTO SLIDE
  ========================================== */

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [visibleCards]);

  return (
    <section className="overflow-hidden bg-slate-900 py-10">
      <div className="px-6">
        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="text-center">
          <span className="rounded-full bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-400">
            Platform Features
          </span>

          <h2 className="mt-6 text-4xl font-bold text-white">
            Everything You Need In One Platform
          </h2>

          <p className="mt-4 text-slate-400">
            Powerful tools designed for learners, creators and
            administrators.
          </p>
        </div>

        {/* ==========================================
            SLIDER
        ========================================== */}

        <div className="mt-14 overflow-hidden">
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
            {featuresData.map((item) => (
              <div
                key={item.title}
                className="w-full flex-shrink-0 px-3 md:w-1/2 lg:w-1/3"
              >
                <div className="h-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="h-56 w-full object-cover"
                  />

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white">
                      {item.title}
                    </h3>

                    <p className="mt-3 leading-7 text-slate-400">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ==========================================
            CONTROLS
        ========================================== */}

        <div className="mt-8 flex justify-center gap-4">
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous feature"
            className="rounded-full border border-white/20 px-5 py-2 text-white transition hover:bg-white/10"
          >
            ←
          </button>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next feature"
            className="rounded-full border border-white/20 px-5 py-2 text-white transition hover:bg-white/10"
          >
            →
          </button>
        </div>

        {/* ==========================================
            SLIDE INDICATORS
        ========================================== */}

        <div className="mt-5 flex justify-center gap-2">
          {Array.from({
            length: Math.max(
              featuresData.length - visibleCards + 1,
              1,
            ),
          }).map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2 rounded-full transition-all ${
                currentIndex === index
                  ? "w-6 bg-cyan-400"
                  : "w-2 bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}