import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import logo from "../../assets/Logo.jpeg";
import {
  ArrowRight,
  BriefcaseBusiness,
  GraduationCap,
  Handshake,
  Lightbulb,
  CheckCircle2,
} from "lucide-react";

import { Card, Button, SectionTitle } from "../common";

const highlights = [
  "Custom Software & Web Development",
  "Digital Products & Business Solutions",
  "Practical Technology Education",
  "Professional IT & Digital Consulting",
  "Innovation, Automation & Emerging Technology",
];

const audiences = [
  {
    icon: BriefcaseBusiness,
    title: "For Businesses",
    description:
      "Build, improve, and scale with reliable digital products and technology solutions designed around real business needs.",
  },
  {
    icon: GraduationCap,
    title: "For Students",
    description:
      "Learn practical, career-focused technology skills through projects, courses, and hands-on learning experiences.",
  },
  {
    icon: Handshake,
    title: "For Collaborators",
    description:
      "Partner with a growing technology ecosystem to create products, programs, content, and opportunities.",
  },
  {
    icon: Lightbulb,
    title: "For Investors",
    description:
      "Explore opportunities around technology, digital education, products, and scalable solutions built for the digital economy.",
  },
];

export default function AboutPreview() {
  return (
    <section className="relative overflow-hidden bg-gray-900 py-10 text-white sm:py-20 lg:py-20">
      {/* Background accents */}
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section heading */}
        <SectionTitle
          Badge="About KanuorieTech"
          title="Building Technology. Developing People. Creating Opportunities."
          subtitle="KanuorieTech is a technology and digital innovation company helping businesses build better digital experiences while equipping individuals with practical skills for the future of work."
        />

        {/* Main story */}
        <div className="mt-16 grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-3 shadow-2xl backdrop-blur-xl">
              <img
                src={logo}
                alt="KanuorieTech — Technology, education and digital innovation"
                className="aspect-square w-full rounded-[1.5rem] object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-x-6 bottom-6 rounded-2xl border border-white/10 bg-slate-950/80 p-5 backdrop-blur-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                  Our Mission
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-200 sm:text-base">
                  To make technology more accessible, practical, and
                  impactful for businesses, learners, and communities.
                </p>
              </div>
            </div>

            {/* Floating card */}
            <Card className="absolute -bottom-8 -right-4 hidden w-64 border-white/10 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-xl lg:block">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10">
                  <Lightbulb className="h-5 w-5 text-cyan-400" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    Digital Innovation
                  </p>
                  <p className="text-xs text-slate-400">
                    Built for real-world impact
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Story */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300">
              Innovation • Technology • Education • Growth
            </span>

            <h3 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              More Than a Tech Company.
              <span className="block text-cyan-400">
                We Are Building a Digital Ecosystem.
              </span>
            </h3>

            <p className="mt-6 text-base leading-8 text-slate-400 sm:text-lg">
              KanuorieTech brings together software development, digital
              products, technology education, and consulting to solve real
              problems and create meaningful digital opportunities.
            </p>

            <p className="mt-5 text-base leading-8 text-slate-400">
              Whether you are a business looking for a technology partner, a
              student building your future, an organization seeking
              collaboration, or an investor exploring digital opportunities,
              KanuorieTech is creating the technology and learning ecosystem
              to move ideas forward.
            </p>

            {/* Highlights */}
            <div className="mt-8 space-y-4">
              {highlights.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-cyan-400" />

                  <span className="text-sm font-medium text-slate-300 sm:text-base">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/about">
                <Button>
                  Discover KanuorieTech
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              <Link to="/projects">
                <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Explore Our Work
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Audience cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7 }}
          className="mt-20 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {audiences.map((audience) => {
            const Icon = audience.icon;

            return (
              <div
                key={audience.title}
                className="group rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/[0.07]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 transition-colors duration-300 group-hover:bg-cyan-400/20">
                  <Icon className="h-5 w-5 text-cyan-400" />
                </div>

                <h4 className="mt-5 text-lg font-bold text-white">
                  {audience.title}
                </h4>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {audience.description}
                </p>
              </div>
            );
          })}
        </motion.div>

        {/* Bottom positioning statement */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-16 rounded-3xl border border-cyan-400/20 bg-gradient-to-r from-cyan-400/10 via-blue-500/10 to-transparent p-8 sm:p-10"
        >
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
              The KanuorieTech Vision
            </p>

            <h3 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
              Turning ideas into technology, and technology into opportunity.
            </h3>

            <p className="mt-4 max-w-3xl leading-7 text-slate-400">
              We believe the future belongs to people and organizations that
              can confidently use technology to solve problems, create value,
              and build new possibilities. That is the future we are working
              to create.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}