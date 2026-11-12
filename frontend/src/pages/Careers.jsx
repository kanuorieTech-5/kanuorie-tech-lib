import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Code2,
  GraduationCap,
  Handshake,
  Rocket,
  Users,
  UserPlus,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import TeamApplicationForm from "../components/forms/TeamApplicationForm";
import { submitCareerApplication } from "../api/careerApplicationApi";
/* ==========================================
   ANIMATION
========================================== */

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

/* ==========================================
   WHY JOIN KANUORIETECH
========================================== */

const benefits = [
  {
    icon: Code2,
    title: "Build Real Projects",
    description:
      "Contribute to practical technology projects and build experience solving real-world problems.",
  },
  {
    icon: GraduationCap,
    title: "Continuous Learning",
    description:
      "Develop your skills through hands-on experience, knowledge sharing, and continuous learning.",
  },
  {
    icon: Users,
    title: "Collaborative Team",
    description:
      "Work with developers, educators, creators, and other professionals who share ideas and learn together.",
  },
  {
    icon: Rocket,
    title: "Make an Impact",
    description:
      "Help create digital products and learning experiences that empower people through technology.",
  },
];

/* ==========================================
   HIRING PROCESS
========================================== */

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

/* ==========================================
   FAQ
========================================== */

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

/* ==========================================
   CAREERS PAGE
========================================== */

export default function Careers() {
  const [selectedOpportunity, setSelectedOpportunity] = useState("");
  const [openFaq, setOpenFaq] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  
  /* ==========================================
     OPEN APPLICATION MODAL
  ========================================== */

  const openApplication = (position = "") => {
    if (loading) return;

    setSelectedOpportunity(position);
    setSubmitted(false);
    setError("");
    setIsApplicationOpen(true);
  };

  /* ==========================================
     CLOSE APPLICATION MODAL
  ========================================== */

  const closeApplication = () => {
    if (loading) return;

    setIsApplicationOpen(false);
  };
  /* ==========================================
     MODAL SCROLL LOCK + ESCAPE KEY
  ========================================== */

  useEffect(() => {
    if (!isApplicationOpen) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape" && !loading) {
        setIsApplicationOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isApplicationOpen, loading]);

  /* ==========================================
     SUBMIT APPLICATION
  ========================================== */

  const handleApplication = async (form) => {
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const application = {
        ...form,
        position:
          form.position?.trim() || selectedOpportunity || "General Application",
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

  /* ==========================================
     RESET MODAL
  ========================================== */

  const finishApplication = () => {
    if (loading) return;

    setIsApplicationOpen(false);
    setSelectedOpportunity("");
    setSubmitted(false);
    setError("");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.25),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(59,130,246,0.16),transparent_35%)]" />
        <div className="relative mx-auto px-6 py-10 sm:py-10 lg:px-8 lg:py-10">
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
              <Link
                to="/opportunities"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/10"
              >
                Explore Open Opportunities
              </Link>

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
      
      {/* ==========================================
          EXPLORE OPPORTUNITIES
      ========================================== */}

      <div className="border-y border-slate-200 dark:border-slate-700">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-blue-800 p-8 shadow-xl sm:p-12"
          >
            {/* Background decorations */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />
            <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />

            <div className="relative z-10 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-blue-200">
                  <BriefcaseBusiness className="h-4 w-4" />
                  Explore Job Opportunities
                </div>

                <h2 className="mt-6 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                  Your next opportunity starts here.
                </h2>

                <p className="mt-5 text-base leading-8 text-blue-100 sm:text-lg">
                  Discover exciting career opportunities, internships,
                  scholarships, grants, fellowships, volunteer programs,
                  and collaborations. Find an opportunity that matches
                  your skills, interests, and ambitions.
                </p>
              </div>

              <div className="shrink-0">
                <Link
                  to="/opportunities"
                  className="inline-flex items-center justify-center gap-3 rounded-xl bg-white px-7 py-4 text-sm font-black text-blue-800 shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-blue-50 hover:shadow-xl"
                >
                  Browse All Opportunities
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <section className="mx-auto px-6 py-16 lg:px-8">
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
              We're interested in creating practical opportunities for students,
              interns, graduates, and junior professionals who want to gain
              experience and build their portfolios.
            </p>

            <button
              type="button"
              onClick={() => openApplication("Internship / Early Career")}
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white dark:bg-slate-900 px-5 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
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
            className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-7 shadow-sm sm:p-9"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Handshake className="h-6 w-6" />
            </div>

            <h2 className="mt-6 text-2xl font-black sm:text-3xl">
              Build with us
            </h2>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              Not looking for a traditional job? We also welcome freelancers,
              educators, creators, developers, designers, cybersecurity
              professionals, and other specialists interested in collaborating
              with KanuorieTech.
            </p>

            <button
              type="button"
              onClick={() => openApplication("Freelance / Collaboration")}
              className="mt-7 inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-5 py-3 text-sm font-bold text-slate-900 dark:text-slate-100 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
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

      <section className="border-y border-slate-200 dark:border-slate-700">
        <div className="mx-auto px-6 py-16 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-7 shadow-sm sm:p-9">
            <div className="mb-6 max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
                Teach with us
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                Turn your expertise into practical learning
              </h2>

              <p className="mt-4 max-w-2xl leading-7 text-slate-600 dark:text-slate-400">
                KanuorieTech is building a learning ecosystem for developers and
                technology professionals. If you have valuable expertise, you
                can contribute courses, workshops, tutorials, and other learning
                resources.
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
          </motion.div>
        </div>
      </section>

      {/* =========================================
          HIRING PROCESS
      ========================================= */}

      <section className="mx-auto px- py-16 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
            Our Process
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            What happens after you apply?
          </h2>
        </div>

        <div className="mt-12 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {process.map((step, index) => (
            <motion.div
              key={step.number}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ delay: index * 0.05 }}
              className=" border-b border-slate-200 dark:border-slate-700 p-6 text-center sm:p-8"
            >
              <span className="text-sm font-black text-blue-600">
                {step.number}
              </span>

              <h3 className="mt-4 text-lg font-bold">{step.title}</h3>

              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                {step.description}
              </p>
            </motion.div>
          ))}
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
                className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left sm:px-6"
                >
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {faq.question}
                  </span>

                  <span className="text-xl text-slate-400">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {isOpen && (
                  <div className="border-t border-slate-100 px-5 pb-5 pt-4 sm:px-6">
                    <p className="text-sm leading-7 text-slate-600 dark:text-slate-400">
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
          APPLICATION MODAL
      ========================================= */}
      <AnimatePresence>
        {isApplicationOpen && (
          <motion.div
            key="application-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                closeApplication();
              }
            }}
            className="fixed inset-0 z-[200] flex items-center justify-center overflow-y-auto bg-slate-950/70 p-3 backdrop-blur-sm sm:p-6"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="application-modal-title"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="relative my-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl"
            >
              {/* Modal header */}
              <div className="flex items-start justify-between gap-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-5 py-5 sm:px-8">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                    Careers at KanuorieTech
                  </p>

                  <h2
                    id="application-modal-title"
                    className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl"
                  >
                    {submitted
                      ? "Application received"
                      : "Apply for an opportunity"}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    {submitted
                      ? "Thank you for your interest in joining our team."
                      : "Tell us about yourself, your skills, and what you can contribute."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeApplication}
                  disabled={loading}
                  aria-label="Close application form"
                  className="shrink-0 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-500 dark:text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal body */}
              <div className="max-h-[calc(100dvh-140px)] overflow-y-auto p-5 sm:p-8">
                {submitted ? (
                  <div className="py-8 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>

                    <h3 className="mt-5 text-xl font-black text-slate-900 dark:text-slate-100">
                      Your application was submitted!
                    </h3>

                    <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-600 dark:text-slate-400">
                      Our team will review your application and contact you if
                      there is a suitable next step.
                    </p>

                    <button
                      type="button"
                      onClick={finishApplication}
                      className="mt-6 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <>
                    {selectedOpportunity && (
                      <div className="mb-5 flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                          <BriefcaseBusiness className="h-5 w-5" />
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-blue-600">
                            Applying for
                          </p>

                          <p className="mt-1 font-bold text-blue-950">
                            {selectedOpportunity}
                          </p>
                        </div>
                      </div>
                    )}

                    {error && (
                      <div
                        role="alert"
                        className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                      >
                        {error}
                      </div>
                    )}

                    <TeamApplicationForm
                      loading={loading}
                      onSubmit={handleApplication}
                    />
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
