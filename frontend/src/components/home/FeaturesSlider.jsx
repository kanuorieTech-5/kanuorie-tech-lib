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

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= featuresData.length - 3 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? featuresData.length - 3 : prev - 1,
    );
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-slate-900 py-24 overflow-hidden">
      <div className="px-6">
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
        {/* Slider */}
        <div className="mt-14 overflow-hidden">
          <motion.div
            className="flex"
            animate={{
              x: `-${currentIndex * 33.333}%`,
            }}
            transition={{
              duration: 0.7,
            }}
          >
            {featuresData.map((item) => (
              <div
                key={item.title}
                className="w-full flex-shrink-0 px-3 md:w-1/2 lg:w-1/3"
              >
                <div className=" overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="h-56 w-full object-cover"
                  />
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
        {/* Controls */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={prevSlide}
            className="rounded-full border border-white/20 px-5 py-2 text-white transition hover:bg-white/10"
          >
            ←
          </button>
          <button
            onClick={nextSlide}
            className=" rounded-full border border-white/20 px-5 py-2 text-white transition hover:bg-white/10"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}
