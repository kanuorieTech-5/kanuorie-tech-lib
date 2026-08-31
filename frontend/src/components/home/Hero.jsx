import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Code2,
  GraduationCap,
  Briefcase,
  Award,
  CheckCircle,
  ChevronDown,
} from "lucide-react";

import Button from "../common/Button";
import heroImage from "../../assets/WhatsApp Image 2026-08-06 at 12.35.26 PM (1).jpeg";

const stats = [
  {
    value: "120+",
    label: "Learning Resourses",
  },
  {
    value: "40+",
    label: "Professional Courses",
  },
  {
    value: "500+",
    label: "Students Trained",
  },
  {
    value: "98%",
    label: "Client Satisfaction",
  },
];

const technologies = [
  "React",
  "Node.js",
  "Express",
  "MongoDB",
  "Tailwind CSS",
  "JavaScript",
];

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-cover bg-center bg-no-repeat text-white"
      style={{
        backgroundImage: `linear-gradient(
          to bottom right,
          rgba(2, 6, 23, 0.45),
          rgba(15, 23, 42, 0.35),
          rgba(30, 58, 138, 0.30)
        ), url("${heroImage}")`,
      }}
    >
      {/* Background */}

      <div className="absolute inset-0">
        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-blue-600/20 blur-[140px]" />

        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-500/20 blur-[140px]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <div className="relative mx-auto grid h-screen items-center gap-20 px-4 py-4 lg:grid-cols-2">
        {/* LEFT */}

        <div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-5 py-2 text-sm font-medium text-blue-300 backdrop-blur-xl"
          >
            <GraduationCap size={18} />
            Empowering Businesses & Future Developers
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-4 text-5xl font-black leading-tight lg:text-7xl"
          >
            Build
            <span className="text-blue-400"> Smarter.</span>
            <br />
            Learn
            <span className="text-cyan-400"> Faster.</span>
            <br />
            Grow
            <span className="text-indigo-400"> Without Limits.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 max-w-2xl text-lg leading-8 text-slate-300"
          >
            KanuorieTech is a technology company helping businesses build modern
            digital solutions while empowering developers through practical
            training, real-world projects, and industry-focused learning.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mt-5 flex flex-wrap gap-5"
          >
            <Link to="/profile">
              <Button size="lg">Get Started</Button>
            </Link>
          </motion.div>
          {/* <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: .6 }}
            className="mt-3 grid grid-cols-2 gap-8 md:grid-cols-4"
          >
            {stats.map((item) => (
              <div key={item.label}>
                <h2 className="text-3xl font-bold text-blue-400">
                  {item.value}
                </h2>
                <p className="mt-1 text-sm text-slate-300">
                  {item.label}
                </p>
              </div>
            ))}
          </motion.div> */}
        </div>
        {/* RIGHT */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative hidden h-[650px] lg:block"
        >
          {/* Main Dashboard */}

          <motion.div
            animate={{
              y: [0, -12, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 6,
            }}
            className="absolute left-16 top-10 w-[360px] rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Student Dashboard</h3>

              <Award className="text-yellow-400" />
            </div>

            <div className="mt-8">
              <div className="mb-5 flex items-center justify-between">
                <span>React Masterclass</span>

                <span className="text-blue-400 font-semibold">75%</span>
              </div>

              <div className="h-3 rounded-full bg-slate-700">
                <div className="h-3 w-3/4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
              </div>
            </div>

            <div className="mt-10 space-y-5">
              <div className="flex items-center justify-between">
                <span>HTML & CSS</span>

                <CheckCircle size={20} className="text-green-400" />
              </div>

              <div className="flex items-center justify-between">
                <span>JavaScript</span>

                <CheckCircle size={20} className="text-green-400" />
              </div>

              <div className="flex items-center justify-between">
                <span>React</span>

                <span className="text-blue-400">In Progress</span>
              </div>
            </div>
          </motion.div>

          {/* Technology Card */}

          <motion.div
            animate={{
              y: [0, 15, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 5,
            }}
            className="absolute right-0 top-0 w-64 rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl"
          >
            <div className="mb-4 flex items-center gap-3">
              <Code2 className="text-blue-400" />

              <h3 className="font-semibold">Technologies</h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Company Card */}

          <motion.div
            animate={{
              y: [0, -15, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 7,
            }}
            className="absolute bottom-8 left-0 w-60 rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl"
          >
            <div className="flex items-center gap-3">
              <Briefcase className="text-cyan-400" />

              <div>
                <h3 className="font-semibold">Software Solutions</h3>

                <p className="text-sm text-slate-300">
                  Websites • APIs • Dashboards
                </p>
              </div>
            </div>
          </motion.div>

          {/* Achievement Card */}

          <motion.div
            animate={{
              y: [0, 12, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 5.5,
            }}
            className="absolute bottom-0 right-10 w-64 rounded-2xl border border-white/10 bg-gradient-to-r from-blue-600 to-cyan-500 p-5 shadow-2xl"
          >
            <h3 className="font-semibold">Your Future Starts Here</h3>

            <p className="mt-3 text-sm text-blue-100">
              Learn practical skills, build real projects, earn certificates and
              become job-ready.
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}

      <motion.div
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.8,
        }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 lg:flex flex-col items-center text-slate-200"
      >
        <span className="mb-2 text-sm tracking-wide">Scroll Down</span>

        <ChevronDown size={22} />
      </motion.div>
    </section>
  );
}
