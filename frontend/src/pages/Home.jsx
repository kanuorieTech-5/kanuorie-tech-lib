import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Mail, UserPlus, } from "lucide-react";
import AboutPreview from "../components/home/AboutPreview";
import Features from "../components/home/Features";
import PlatformFeatures from "../components/home/FeaturesSlider";
import ServicesPreview from "../components/home/ServicesPreview";
import ProjectsPreview from "../components/home/ProjectsPreview";
import CoursesPreview from "../components/home/CoursesPreview";
import BooksPreview from "../components/home/BooksPreview";
import ProductsPreview from "../components/home/ProductsPreview";
import Testimonials from "../components/home/Testimonials";
import BlogPreview from "../components/home/BlogPreview";
import TechStack from "../components/home/TechStack";
import TeamPreview from "../components/home/TeamPreview";
import Newsletter from "../components/home/Newsletter";
import CTA from "../components/home/CTA";


const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
      <CTA />
      <AboutPreview />
      <Features />
      <PlatformFeatures />
      <ServicesPreview />
      <ProjectsPreview />
      <CoursesPreview />
      <BooksPreview />
      <ProductsPreview />
      <BlogPreview />
      <Testimonials />
      <TechStack />
      <TeamPreview />
      <section className="">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={reveal}
          className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 px-6 py-10 text-white sm:px-10 sm:py-14 lg:px-14"
        >
          <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="relative flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-200">
                <Mail className="h-4 w-4" />
                Let’s talk
              </span>
              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                Have a goal in mind?
              </h2>
              <p className="mt-3 leading-7 text-slate-300">
                Tell us what you’re working toward. We’ll help you find the right next step.
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white dark:bg-slate-900 px-6 py-3.5 font-bold text-blue-900 transition hover:-translate-y-0.5 hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-white/30"
            >
              Talk to our team <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* =========================================
          FINAL CTA
      ========================================= */}

      <section className="bg-slate-950">
        <div className="mx-auto px-6 py-16 text-center lg:px-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
            <UserPlus className="h-7 w-7" />
          </div>

          <h2 className="mt-5 text-3xl font-black text-white sm:text-4xl">
            Your next opportunity could start here.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-400">
            Explore opportunities, share your skills, and become part of the
            KanuorieTech journey.
          </p>
          <Link to="/careers"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-blue-500"
          >
            Join the Talent Network
            <ArrowRight className="h-4 w-4" />
          </Link>    
        </div>
      </section>
      <Newsletter />
    </main>
  );
}
