import { motion } from "framer-motion";
import { Users, BookOpen, FolderOpen, Award } from "lucide-react";

import { StatCard } from "../common";

export default function Stats() {
  const stats = [
    {
      icon: Users,
      value: "1,000+",
      title: "Students",
      description:
        "Learners building practical technology skills through courses, digital resources, and hands-on learning experiences.",
    },
    {
      icon: BookOpen,
      value: "100+",
      title: "Books",
      description:
        "Digital books, guides, notes, and educational resources designed to support continuous learning and professional growth.",
    },
    {
      icon: FolderOpen,
      value: "150+",
      title: "Projects",
      description:
        "Digital projects and solutions showcasing practical development, creativity, problem-solving, and innovative technology applications.",
    },
    {
      icon: Award,
      value: "20+",
      title: "Awards",
      description:
        "Recognitions celebrating excellence, innovation, creativity, and meaningful contributions to technology and digital learning.",
    },
  ];

  return (
    <section className="bg-slate-950 py-2 sm:py-6">
      <div className="mx-auto grid max-w-7xl gap-6 px-6 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
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
              delay: index * 0.1,
              ease: "easeOut",
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
          >
            <StatCard
              icon={stat.icon}
              value={stat.value}
              title={stat.title}
              description={stat.description}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}