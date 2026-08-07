import { motion } from "framer-motion";
import { StatCard } from "../common";

import {
  Users,
  BookOpen,
  FolderOpen,
  Award,
} from "lucide-react";


export default function Stats() {

  const stats = [
    {
      title: "Students",
      value: "10,000+",
      icon: Users,
    },
    {
      title: "Books",
      value: "500+",
      icon: BookOpen,
    },
    {
      title: "Projects",
      value: "150+",
      icon: FolderOpen,
    },
    {
      title: "Awards",
      value: "20+",
      icon: Award,
    },
  ];


  return (
    <section className="bg-slate-950 py-20">

      <div className="mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-2 lg:grid-cols-4">

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
              delay: index * 0.1,
            }}
            viewport={{
              once: true,
            }}
          >

            <StatCard
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
            />

          </motion.div>

        ))}

      </div>

    </section>
  );
}