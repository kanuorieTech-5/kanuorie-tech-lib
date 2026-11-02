import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const featuresData = [
  {
    title: "Self-Paced Courses",
    desc: "Explore practical technology courses, enroll in a learning path and continue lessons at your own pace.",
    img: "/images/courses.png",
  },
  {
    title: "Learning Progress & Certificates",
    desc: "Track your enrolled courses, monitor progress and access certificates when you complete eligible learning.",
    img: "/images/courses.png",
  },
  {
    title: "Digital Library",
    desc: "Browse books, notes, guides and other educational materials from one central library.",
    img: "/images/library.png",
  },
  {
    title: "Saved Resources",
    desc: "Bookmark useful learning resources and return to them from your personal saved resources page.",
    img: "/images/resources.png",
  },
  {
    title: "Learner Community",
    desc: "Connect with other learners, share updates and engage with posts through likes, comments and saves.",
    img: "/images/profile.png",
  },
  {
    title: "Personalized User Profiles",
    desc: "Manage your account, learning preferences and interests from a profile that stays with you.",
    img: "/images/profile.png",
  },
  {
    title: "Business & Service Requests",
    desc: "Businesses can share what they need and request digital services tailored to their goals.",
    img: "/images/admin.png",
  },
  {
    title: "Digital Products",
    desc: "Discover digital products and helpful tools built to support your work and learning.",
    img: "/images/resources.png",
  },
  {
    title: "Project Portfolio",
    desc: "Explore delivered projects and examples of our design, development and technology work.",
    img: "/images/library.png",
  },
  {
    title: "Professional Services",
    desc: "Review our technology services, view design examples and send an enquiry when you are ready.",
    img: "/images/admin.png",
  },
  {
    title: "Career Opportunities",
    desc: "Find published opportunities and view their details to learn how to take the next step.",
    img: "/images/profile.png",
  },
  {
    title: "Articles & Updates",
    desc: "Read platform news, insights and educational articles from the KanuorieTech team.",
    img: "/images/library.png",
  },
  {
    title: "Secure Payments",
    desc: "Manage billing information and make payments for services, courses and other offerings.",
    img: "/images/security.png",
  },
  {
    title: "Administration Dashboard",
    desc: "Authorized administrators can manage users, courses, resources, services and other platform content.",
    img: "/images/admin.png",
  },
  {
    title: "Protected Accounts",
    desc: "Account authentication and role-based access help keep personal and administrative areas protected.",
    img: "/images/resources.png",
  },
];

export default function FeaturesSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(1);
  const [activeImage, setActiveImage] = useState(null);

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
    const maxIndex = Math.max(featuresData.length - visibleCards, 0);

    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [visibleCards, currentIndex]);

  /* ==========================================
     NEXT SLIDE
  ========================================== */

  const nextSlide = () => {
    const maxIndex = Math.max(featuresData.length - visibleCards, 0);

    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  /* ==========================================
     PREVIOUS SLIDE
  ========================================== */

  const prevSlide = () => {
    const maxIndex = Math.max(featuresData.length - visibleCards, 0);

    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
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

  useEffect(() => {
    if (!activeImage) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setActiveImage(null);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activeImage]);

  return (
    <section className="overflow-hidden bg-transparent py-10">
      <div className="rounded-3xl bg-white/5 p-3 lg:p-16">

        <div className="text-center">
          <span className="rounded-full bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-400">
            Platform Features
          </span>

          <h2 className="mt-6 text-4xl font-bold text-white">
            Everything You Need In One Platform
          </h2>

          <p className="mt-4 text-slate-400">
            Powerful tools designed for learners, creators and administrators.
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
                  <button
                    type="button"
                    onClick={() => setActiveImage(item)}
                    aria-label={`View ${item.title} image`}
                    className="group block w-full overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-400"
                  >
                    <img
                      src={item.img}
                      alt={item.title}
                      loading="lazy"
                      className="h-56 w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  </button>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white">
                      {item.title}
                    </h3>

                    <p className="mt-3 leading-7 text-slate-400">{item.desc}</p>
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
            length: Math.max(featuresData.length - visibleCards + 1, 1),
          }).map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2 rounded-full transition-all ${
                currentIndex === index ? "w-6 bg-cyan-400" : "w-2 bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>

      {activeImage && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setActiveImage(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${activeImage.title} image`}
            className="relative flex max-h-[90vh] max-w-6xl flex-col items-center"
          >
            <button
              type="button"
              onClick={() => setActiveImage(null)}
              aria-label="Close image viewer"
              className="absolute -right-2 -top-12 rounded-full bg-white/10 px-4 py-2 text-2xl text-white transition hover:bg-white/20 sm:right-0"
            >
              &times;
            </button>
            <img
              src={activeImage.img}
              alt={activeImage.title}
              className="max-h-[78vh] max-w-full rounded-xl object-contain"
            />
            <p className="mt-3 text-sm font-medium text-white">
              {activeImage.title}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
