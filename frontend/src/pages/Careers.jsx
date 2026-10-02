import { motion } from "framer-motion";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Code2,
  GraduationCap,
  Handshake,
  Laptop,
  Mail,
  MapPin,
  Rocket,
  Users,
  UserPlus,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import TeamApplicationForm from "../components/forms/TeamApplicationForm";
import { submitCareerApplication } from "../api/careerApplicationApi";

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const opportunities = [
  {
    title: "Frontend Developer",
    category: "Engineering",
    type: "Full-time / Contract",
    location: "Remote",
    description:
      "Build responsive, accessible, and engaging web experiences using modern frontend technologies.",
    icon: Code2,
  },
  {
    title: "Backend Developer",
    category: "Engineering",
    type: "Full-time / Contract",
    location: "Remote",
    description:
      "Help build reliable APIs, services, databases, and backend systems powering KanuorieTech products.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Technical Content Creator",
    category: "Content",
    type: "Part-time / Contract",
    location: "Remote",
    description:
      "Create practical technology content, tutorials, short-form videos, and educational resources.",
    icon: Laptop,
  },
  {
    title: "Technology Instructor",
    category: "Education",
    type: "Part-time / Contract",
    location: "Remote",
    description:
      "Share your expertise by creating practical courses, lessons, workshops, and learning resources.",
    icon: GraduationCap,
  },
];

const benefits = [
  {
    title: "Learn & Grow",
    description:
      "Develop your skills through practical projects, collaboration, and continuous learning.",
    icon: GraduationCap,
  },
  {
    title: "Real-World Projects",
    description:
      "Work on digital products, educational platforms, and technology solutions with practical impact.",
    icon: Rocket,
  },
  {
    title: "Remote-Friendly",
    description:
      "Collaborate from wherever you work best while staying connected with the wider team.",
    icon: Laptop,
  },
  {
    title: "Build Together",
    description:
      "Work with developers, educators, designers, creators, and technology professionals.",
    icon: Users,
  },
];

const process = [
  {
    number: "01",
    title: "Apply",
    description:
      "Tell us about yourself, your skills, and the opportunity you're interested in.",
  },
  {
    number: "02",
    title: "Application Review",
    description:
      "We review your experience, portfolio, projects, and how your interests align with the opportunity.",
  },
  {
    number: "03",
    title: "Conversation",
    description:
      "Selected applicants may be invited to a conversation, interview, or practical assessment.",
  },
  {
    number: "04",
    title: "Join & Build",
    description:
      "Successful applicants receive the next steps and begin working with the KanuorieTech team.",
  },
];

const faqs = [
  {
    question: "Are KanuorieTech opportunities remote?",
    answer:
      "Many opportunities can be performed remotely. The working arrangement will be specified for each position or collaboration opportunity.",
  },
  {
    question: "Can I apply if there is no suitable open position?",
    answer:
      "Yes. You can use the talent network section to introduce yourself and share your portfolio for future opportunities.",
  },
  {
    question: "Do you accept interns and junior developers?",
    answer:
      "Yes. KanuorieTech can create opportunities for learners, interns, graduates, and junior professionals as suitable programs become available.",
  },
  {
    question: "Can I become a KanuorieTech instructor?",
    answer:
      "Yes. We welcome experienced professionals and educators who can create practical, high-quality technology learning content.",
  },
  {
    question: "Can I collaborate with KanuorieTech as a freelancer?",
    answer:
      "Yes. Freelancers, specialists, creators, developers, designers, cybersecurity professionals, and other collaborators can introduce themselves for suitable projects.",
  },
];

export default function Careers() {
  const [selectedOpportunity, setSelectedOpportunity] = useState("");
  const [openFaq, setOpenFaq] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleApplication = async (form) => {
  if (loading) return;

  setLoading(true);
  setError("");

  try {
    const application = {
      ...form,
      position:
        form.position?.trim() ||
        selectedOpportunity ||
        "General Application",
    };

    await submitCareerApplication(application);

    setSubmitted(true);
  } catch (err) {
    console.error("Career application submission failed:", err);

    setError(
      err.response?.data?.message ||
        err.response?.data?.error ||
        "Unable to submit your application right now. Please try again.",
    );
  } finally {
    setLoading(false);
  }
};

  const openApplication = (position = "") => {
    setSelectedOpportunity(position);
    setSubmitted(false);

    window.setTimeout(() => {
      document
        .getElementById("apply")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* =========================================
          HERO
      ========================================= */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.25),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(59,130,246,0.16),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-24 lg:px-8 lg:py-28">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="max-w-4xl"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300">
              <Rocket className="h-4 w-4" />
              Careers at KanuorieTech
            </div>

            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Build the future of{" "}
              <span className="text-blue-400">technology and learning.</span>
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">
              Join KanuorieTech and help create digital products, educational
              experiences, and technology solutions that empower people to
              learn, build, and grow.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => openApplication()}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-blue-500"
              >
                Explore Opportunities
                <ArrowRight className="h-4 w-4" />
              </button>

              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/10"
              >
                About KanuorieTech
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =========================================
          WHY JOIN
      ========================================= */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={fadeUp}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
            Why KanuorieTech
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Grow while building meaningful technology
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            We're creating an environment where technology professionals,
            educators, creators, and learners can contribute, collaborate, and
            keep developing their skills.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;

            return (
              <motion.div
                key={benefit.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                variants={fadeUp}
                transition={{ delay: index * 0.05 }}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="mt-5 text-lg font-bold">{benefit.title}</h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* =========================================
          OPEN OPPORTUNITIES
      ========================================= */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
                Opportunities
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                Find your next opportunity
              </h2>

              <p className="mt-3 max-w-2xl text-slate-600">
                Explore the types of opportunities available across
                engineering, education, content, and collaboration.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-600">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              Opportunities updated as roles become available
            </div>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {opportunities.map((opportunity, index) => {
              const Icon = opportunity.icon;

              return (
                <motion.article
                  key={opportunity.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  variants={fadeUp}
                  transition={{ delay: index * 0.05 }}
                  className="group rounded-2xl border border-slate-200 bg-slate-50 p-6 transition duration-300 hover:border-blue-200 hover:bg-white hover:shadow-lg sm:p-7"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                        <Icon className="h-6 w-6" />
                      </div>

                      <div>
                        <h3 className="text-xl font-bold">
                          {opportunity.title}
                        </h3>

                        <p className="mt-1 text-sm font-medium text-blue-600">
                          {opportunity.category}
                        </p>
                      </div>
                    </div>

                    <span className="w-fit rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm">
                      {opportunity.type}
                    </span>
                  </div>

                  <p className="mt-5 text-sm leading-7 text-slate-600">
                    {opportunity.description}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {opportunity.location}
                    </span>

                    <span className="inline-flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      Applications welcome
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => openApplication(opportunity.title)}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-600 transition group-hover:text-blue-700"
                  >
                    Apply for this opportunity
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================
          EARLY CAREER + COLLABORATION
      ========================================= */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="rounded-3xl bg-gradient-to-br from-blue-600 to-slate-950 p-7 text-white sm:p-9"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              <GraduationCap className="h-6 w-6" />
            </div>

            <h2 className="mt-6 text-2xl font-black sm:text-3xl">
              Start your technology career
            </h2>

            <p className="mt-4 leading-7 text-blue-100">
              We're interested in creating practical opportunities for
              students, interns, graduates, and junior professionals who want
              to gain experience and build their portfolios.
            </p>

            <button
              type="button"
              onClick={() => openApplication("Internship / Early Career")}
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
            >
              Explore Early Career Opportunities
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Handshake className="h-6 w-6" />
            </div>

            <h2 className="mt-6 text-2xl font-black sm:text-3xl">
              Build with us
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              Not looking for a traditional job? We also welcome freelancers,
              educators, creators, developers, designers, cybersecurity
              professionals, and other specialists interested in collaborating
              with KanuorieTech.
            </p>

            <button
              type="button"
              onClick={() => openApplication("Freelance / Collaboration")}
              className="mt-7 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-900 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              Join Our Talent Network
              <UserPlus className="h-4 w-4" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* =========================================
          INSTRUCTOR
      ========================================= */}
      <section className="border-y border-slate-200 bg-slate-100">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
                Teach with us
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                Turn your expertise into practical learning
              </h2>

              <p className="mt-4 max-w-2xl leading-7 text-slate-600">
                KanuorieTech is building a learning ecosystem for developers
                and technology professionals. If you have valuable expertise,
                you can contribute courses, workshops, tutorials, and other
                learning resources.
              </p>
            </div>

            <button
              type="button"
              onClick={() => openApplication("Technology Instructor")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              Become an Instructor
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================
          HIRING PROCESS
      ========================================= */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
            Our Process
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            What happens after you apply?
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {process.map((step, index) => (
            <motion.div
              key={step.number}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ delay: index * 0.05 }}
              className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <span className="text-sm font-black text-blue-600">
                {step.number}
              </span>

              <h3 className="mt-4 text-lg font-bold">{step.title}</h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* =========================================
          APPLICATION
      ========================================= */}
      <section id="apply" className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div className="lg:sticky lg:top-24">
              <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
                Join KanuorieTech
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                Tell us what you can build.
              </h2>

              <p className="mt-4 leading-7 text-slate-600">
                Whether you're applying for a role, internship, instructor
                opportunity, or collaboration, introduce yourself and show us
                what you can bring.
              </p>

              <div className="mt-7 space-y-4">
                <div className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                  <p className="text-sm text-slate-600">
                    Tell us about your experience and interests.
                  </p>
                </div>

                <div className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                  <p className="text-sm text-slate-600">
                    Share your portfolio, GitHub, or relevant work.
                  </p>
                </div>

                <div className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                  <p className="text-sm text-slate-600">
                    We'll review your application and contact you if there's
                    a suitable next step.
                  </p>
                </div>
              </div>

              <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5">
                <div className="flex gap-3">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

                  <div>
                    <p className="font-semibold text-blue-950">
                      Prefer email?
                    </p>

                    <p className="mt-1 text-sm leading-6 text-blue-800">
                      You can also contact the KanuorieTech team directly
                      through the contact page.
                    </p>

                    <Link
                      to="/contact"
                      className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-blue-700"
                    >
                      Contact us
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div>
              {submitted ? (
                <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>

                  <h3 className="mt-5 text-2xl font-black text-emerald-950">
                    Application received
                  </h3>

                  <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-emerald-800">
                    Thank you for your interest in KanuorieTech. Your
                    application has been submitted successfully. Our team will
                    review your application and contact you if there is a
                    suitable next step.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setSelectedOpportunity("");
                      setError("");
                    }}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
                  >
                    Submit another application
                  </button>
                </div>
              ) : (
                <div>
                  {error && (
                    <div
                      role="alert"
                      className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                    >
                      {error}
                    </div>
                  )}

                  {selectedOpportunity && (
                    <div className="mb-4 flex items-center justify-between rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                          Applying for
                        </p>

                        <p className="mt-1 text-sm font-bold text-blue-950">
                          {selectedOpportunity}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedOpportunity("")}
                        className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-100"
                        aria-label="Clear selected position"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  <TeamApplicationForm
                    loading={loading}
                    onSubmit={handleApplication}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          FAQ
      ========================================= */}
      <section className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
            FAQ
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Frequently asked questions
          </h2>
        </div>

        <div className="mt-10 space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;

            return (
              <div
                key={faq.question}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenFaq(isOpen ? null : index)
                  }
                  className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left sm:px-6"
                >
                  <span className="font-semibold text-slate-900">
                    {faq.question}
                  </span>

                  <span className="text-xl text-slate-400">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {isOpen && (
                  <div className="border-t border-slate-100 px-5 pb-5 pt-4 sm:px-6">
                    <p className="text-sm leading-7 text-slate-600">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================
          FINAL CTA
      ========================================= */}
      <section className="bg-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-16 text-center lg:px-8">
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

          <button
            type="button"
            onClick={() => openApplication()}
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-blue-500"
          >
            Join the Talent Network
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}

