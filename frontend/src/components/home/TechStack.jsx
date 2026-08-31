import { color, motion } from "framer-motion";

import {
  SiReact,
  SiNodedotjs,
  SiMongodb,
  SiJavascript,
  SiExpress,
  SiGooglecloud,
  SiPython,
  SiGithub,
} from "react-icons/si";

const technologies = [
  {
    name: "React",
    icon: SiReact,
    color: "text-[#61DAFB]",
    hover: "group-hover:text-[#61DAFB]",
  },
  {
    name: "Node.js",
    icon: SiNodedotjs,
    color: "text-[#339933]",
    hover: "group-hover:text-[#339933]",
  },
  {
    name: "MongoDB",
    icon: SiMongodb,
    color: "text-[#47A248]",
    hover: "group-hover:text-[#47A248]",
  },
  {
    name: "JavaScript",
    icon: SiJavascript,
    color: "text-[#FF9900]",
    hover: "group-hover:text-[#FF9900]",
  },
  {
    name: "Express",
    icon: SiExpress,
    color: "text-[#F25022]",
    hover: "group-hover:text-[#F25022]",
  },
  {
    name: "python",
    icon: SiPython,
    color: "text-[#FF9900]",
  },
  {
    name: "Git & Github",
    icon: SiGithub,
    color: "text-[#4285F4]",
  },
  {
    name: "Google Cloud",
    icon: SiGooglecloud,
    color: "text-[#4285F4]",
    hover: "group-hover:text-[#4285F4]",
  },
];

export default function TechStack() {
  return (
    <section className="relative overflow-hidden bg-slate-900 py-24">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-14 text-center"
        >
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
            Our Technology Stack
          </p>

          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Built With Modern Technology
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            We leverage reliable, modern technologies and cloud platforms to
            build scalable digital solutions.
          </p>
        </motion.div>

        {/* Technology cards */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-6">
          {technologies.map((technology, index) => {
            const Icon = technology.icon;

            return (
              <motion.div
                key={technology.name}
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
                }}
                whileHover={{
                  y: -8,
                }}
                className="
                  group
                  flex
                  flex-col
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/5
                  px-4
                  py-7
                  backdrop-blur-xl
                  transition-all
                  duration-300
                  hover:border-white/20
                  hover:bg-white/10
                  hover:shadow-xl
                  hover:shadow-cyan-500/10
                "
              >
                <Icon
                  className={`
                    mb-4
                    h-12
                    w-12
                    ${technology.color}
                    transition-transform
                    duration-300
                    group-hover:scale-110
                    ${technology.hover}
                  `}
                />

                <span className="text-center text-sm font-semibold text-slate-300 transition-colors duration-300 group-hover:text-white">
                  {technology.name}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
