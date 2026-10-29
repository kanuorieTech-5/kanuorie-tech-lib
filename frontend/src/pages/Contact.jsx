import { useState } from "react";
import {
  ArrowRight,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Linkedin,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Globe,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { Newsletter } from "../components/home";
import { sendContactMessage, submitContactReport } from "../services";

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportForm, setReportForm] = useState({
    name: "",
    email: "",
    category: "Complaint",
    subject: "",
    message: "",
  });
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const change = ({ target }) => {
    setForm((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();

    if (loading) return;

    try {
      setLoading(true);

      await sendContactMessage(form);

      toast.success("Message sent successfully!");

      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Contact form submission failed:", error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to send your message. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      value: "hello@kanuorietech.com",
      description: "Send us your questions and enquiries.",
      href: "mailto:hello@kanuorietech.com",
    },
    {
      icon: MapPin,
      title: "Our Location",
      value: "Nigeria",
      description: "Building digital solutions for a global audience.",
    },
    {
      icon: Clock,
      title: "Working Hours",
      value: "Monday – Friday",
      description: "We aim to respond within one business day.",
    },
  ];

  const benefits = [
    {
      icon: Clock,
      title: "Timely Communication",
      description: "We aim to respond to enquiries within one business day.",
    },
    {
      icon: ShieldCheck,
      title: "Professional Support",
      description: "Get thoughtful guidance tailored to your needs and goals.",
    },
    {
      icon: Sparkles,
      title: "Solutions Built Around You",
      description:
        "We consider your requirements before recommending a solution.",
    },
  ];

  const socialLinks = [
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/",
      icon: Linkedin,
      color: "hover:bg-blue-600",
    },
    {
      name: "Facebook",
      href: "https://www.facebook.com/",
      icon: Facebook,
      color: "hover:bg-blue-700",
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/",
      icon: Instagram,
      color: "hover:bg-pink-600",
    },
    {
      name: "YouTube",
      href: "https://www.youtube.com/",
      icon: Youtube,
      color: "hover:bg-red-600",
    },
    {
      name: "X",
      href: "https://x.com/",
      icon: Twitter,
      color: "hover:bg-slate-900",
    },
    {
      name: "Website",
      href: "https://kanuorietech.netlify.app/",
      icon: Globe,
      color: "hover:bg-indigo-600",
    },
  ];

  const page = darkMode
    ? "bg-[#080d1b] text-slate-100"
    : "bg-white text-slate-900";

  const muted = darkMode ? "text-slate-400" : "text-slate-600";

  const card = darkMode
    ? "border-white/10 bg-white/[0.04]"
    : "border-slate-200 bg-white";

  const inputClass = `w-full rounded-xl border px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 ${
    darkMode
      ? "border-white/10 bg-slate-900/80 text-white"
      : "border-slate-200 bg-slate-50 text-slate-900 focus:bg-white"
  }`;
  const changeReport = ({ target }) => {
    setReportForm((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));
  };

  const submitReport = async (e) => {
    e.preventDefault();

    if (reportLoading) return;

    try {
      setReportLoading(true);

      await submitContactReport({
        name: reportForm.name.trim(),
        email: reportForm.email.trim().toLowerCase(),
        category: reportForm.category,
        subject: reportForm.subject.trim(),
        message: reportForm.message.trim(),
      });

      toast.success("Your submission has been received.");

      setReportForm({
        name: "",
        email: "",
        category: "Complaint",
        subject: "",
        message: "",
      });

      setReportOpen(false);
    } catch (error) {
      console.error("Report submission failed:", error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to submit your report. Please try again.",
      );
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <main
      className={`min-h-screen overflow-hidden transition-colors duration-300 ${page}`}
    >
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950">
        <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-blue-500/20 blur-[100px]" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-indigo-500/20 blur-[100px]" />

        <div className="relative px-5 pb-10 pt-8 sm:px-8 sm:pb-10 lg:px-8">
          <div className="mx-auto mt-12 text-center sm:mt-16">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-400/10 px-4 py-2 text-sm font-medium text-blue-200">
              <MessageCircle className="h-4 w-4" />
              Let&apos;s start a conversation
            </span>

            <h1 className="mt-7 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-7xl">
              Let&apos;s build something{" "}
              <span className="bg-gradient-to-r from-blue-300 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
                meaningful.
              </span>
            </h1>

            <p className="mx-auto mt-6 text-base leading-8 text-slate-300 sm:text-lg">
              Have a project in mind, need a digital solution, or want to
              explore learning opportunities? Tell us what you&apos;re working
              on. We&apos;d love to hear from you.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-4 text-sm text-slate-300">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Project enquiries
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Learning opportunities
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Partnerships
              </span>
            </div>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />
      </section>

      {/* CONTACT FORM AND INFORMATION */}
      <section className="relative py-16 sm:py-20 lg:py-24">
        <div className="mx-auto  gap-10 px-5 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14 lg:px-12">
          {/* FORM */}
          <div>
            <div className="mb-8">
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-blue-500">
                Send a message
              </span>

              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Tell us about your idea.
              </h2>

              <p className={`mt-4 max-w-xl leading-7 ${muted}`}>
                Share a few details and we&apos;ll get back to you about the
                next steps.
              </p>
            </div>

            <div
              className={`rounded-3xl border p-5 shadow-xl shadow-slate-950/[0.03] sm:p-8 ${card}`}
            >
              <form onSubmit={submit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="mb-2 block text-sm font-semibold"
                    >
                      Full name <span className="text-blue-500">*</span>
                    </label>

                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={form.name}
                      onChange={change}
                      placeholder="Your full name"
                      className={inputClass}
                      required
                      maxLength={100}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="mb-2 block text-sm font-semibold"
                    >
                      Email address <span className="text-blue-500">*</span>
                    </label>

                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={change}
                      placeholder="you@example.com"
                      className={inputClass}
                      required
                      maxLength={254}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-subject"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Subject <span className="text-blue-500">*</span>
                  </label>

                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    value={form.subject}
                    onChange={change}
                    placeholder="What would you like to discuss?"
                    className={inputClass}
                    required
                    maxLength={200}
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Your message <span className="text-blue-500">*</span>
                  </label>

                  <textarea
                    id="contact-message"
                    name="message"
                    rows={6}
                    value={form.message}
                    onChange={change}
                    placeholder="Tell us about your project, goals, questions, or how we can help..."
                    className={`${inputClass} min-h-40 resize-y`}
                    required
                    minLength={10}
                    maxLength={5000}
                  />

                  <p className={`mt-2 text-xs ${muted}`}>
                    {form.message.length}/5000 characters
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group inline-flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-600/30 focus:outline-none focus:ring-4 focus:ring-blue-500/25 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {loading ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Sending your message...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Send Message
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>

                <p className={`text-center text-xs leading-5 ${muted}`}>
                  Your message will be submitted securely through our contact
                  service.
                </p>
              </form>
            </div>
          </div>

          {/* CONTACT INFORMATION */}
          <div className="space-y-7 lg:pt-2">
            <div className="rounded-3xl p-5 shadow-xl shadow-slate-950/[0.03] sm:p-8 lg:pt-10 lg:pb-12 lg:px-10">
              <div className="relative">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
                  <MessageCircle className="h-6 w-6" />
                </span>

                <h2 className="mt-5 text-2xl font-bold">
                  We&apos;re here to help.
                </h2>

                <p className={`mt-3 leading-7 ${muted}`}>
                  Whether you&apos;re a business looking for digital solutions,
                  a learner exploring technology, or a potential partner,
                  we&apos;re happy to hear from you.
                </p>

                <div className="mt-8 space-y-6">
                  {contactInfo.map((item) => {
                    const Icon = item.icon;

                    const content = (
                      <div className="flex items-start gap-4">
                        <span
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                            darkMode
                              ? "bg-white/[0.07] text-blue-400"
                              : "bg-blue-50 text-blue-600"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </span>

                        <div className="min-w-0">
                          <h3 className="font-semibold">{item.title}</h3>

                          <p className="mt-1 break-words text-sm font-medium text-blue-500">
                            {item.value}
                          </p>

                          <p className={`mt-1 text-sm leading-6 ${muted}`}>
                            {item.description}
                          </p>
                        </div>
                      </div>
                    );

                    return (
                      <div key={item.title}>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="block rounded-xl outline-none transition hover:opacity-80 focus-visible:ring-2 focus-visible:ring-blue-500"
                          >
                            {content}
                          </a>
                        ) : (
                          content
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <section className="px-5 py-12 sm:px-8 lg:px-12">
              <div className="mx-auto">
                <div className="mx-auto max-w-2xl text-center">
                  <span className="inline-flex items-center rounded-full bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-500">
                    Stay Connected
                  </span>

                  <h2
                    className={`mt-5 text-2xl font-bold sm:text-3xl ${
                      darkMode ? "text-white" : "text-slate-900"
                    }`}
                  >
                    Connect with KanuorieTech
                  </h2>

                  <p className={`mx-auto mt-4 max-w-2xl ${muted}`}>
                    Follow us for technology insights, learning resources,
                    company updates, development tips, and new opportunities.
                  </p>

                  <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                    {socialLinks.map((social) => {
                      const Icon = social.icon;

                      return (
                        <a
                          key={social.name}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Visit KanuorieTech on ${social.name}`}
                          title={social.name}
                          className={`flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition-all duration-300 hover:-translate-y-1 hover:text-white ${social.color}`}
                        >
                          <Icon className="h-5 w-5" />
                        </a>
                      );
                    })}
                  </div>

                  <p className={`mt-6 text-sm ${muted}`}>
                    Let’s learn, build, and grow together.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>

      {/* COMPLAINTS, COMPLIANCE & FEEDBACK CENTRE */}
      <section className="px-5 pb-16 sm:px-8 lg:px-12">
        <div className="relative mx-auto overflow-hidden rounded-3xl px-6 py-14 text-center shadow-2xl sm:px-12 sm:py-16">
          {/* <div className="pointer-events-none absolute -left-16 -top-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" /> */}
          {/* <div className="pointer-events-none absolute -bottom-20 -right-16 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" /> */}

          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/150 bg-white/10 px-4 py-2 text-sm font-medium text-blue-400">
              <ShieldCheck className="h-4 w-4" />
              Accountability & Continuous Improvement
            </span>

            <h2 className="mt-6 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Your voice matters to us.
            </h2>

            <p className="mx-auto mt-5 leading-8 text-slate-500 dark:text-slate-400">
              Have a complaint, a compliance concern, or feedback to share? Help
              us improve KanuorieTech by letting us know. We welcome
              constructive feedback and encourage concerns to be raised
              responsibly.
            </p>

            <div className="mt-8 grid gap-4 text-left sm:grid-cols-3 bg-slate-950/5 rounded-2xl p-6 sm:p-8 border border-slate-950/10">
              {[
                {
                  icon: MessageCircle,
                  title: "Complaints",
                  text: "Raise concerns about your experience or our services.",
                },
                {
                  icon: ShieldCheck,
                  title: "Compliance",
                  text: "Report potential policy, ethical, or compliance issues.",
                },
                {
                  icon: Sparkles,
                  title: "Feedback",
                  text: "Share suggestions that could help us improve.",
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-slate-950/10 bg-white/[0.06] p-5 backdrop-blur-sm"
                  >
                    <Icon className="h-6 w-6 text-blue-300" />

                    <h3 className="mt-4 font-bold">{item.title}</h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setReportOpen(true)}
              className="mt-9 inline-flex items-center justify-center gap-3 rounded-xl bg-white dark:bg-slate-900 px-7 py-4 font-bold text-blue-800 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-400/30"
            >
              Submit a Complaint or Feedback
              <ArrowRight className="h-5 w-5" />
            </button>

            <p className="mt-4 text-xs leading-5 text-slate-400">
              Please provide accurate information. Avoid including passwords or
              unnecessary sensitive personal information.
            </p>
          </div>
        </div>
      </section>
      {/* WHY CONTACT US */}
      <div className="mx-auto px-5 pb-16 sm:px-8 lg:px-12">
        <h2 className="text-xl font-bold">Why work with KanuorieTech?</h2>

        <p className={`mt-3 text-sm leading-7 ${muted}`}>
          We bring technology, creativity, and practical learning together to
          help people and businesses move forward.
        </p>

        <div className="mt-7 space-y-6">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div key={benefit.title} className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                  <Icon className="h-5 w-5" />
                </span>

                <div>
                  <h3 className="font-semibold">{benefit.title}</h3>
                  <p className={`mt-1 text-sm leading-6 ${muted}`}>
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* COMPLAINT / COMPLIANCE / FEEDBACK MODAL */}
      {reportOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/75 p-4 backdrop-blur-sm sm:p-6"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !reportLoading) {
              setReportOpen(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="report-modal-title"
            className={`relative my-auto w-full max-w-2xl rounded-3xl border p-6 shadow-2xl sm:p-9 ${
              darkMode
                ? "border-white/10 bg-[#0d1528] text-white"
                : "border-slate-200 bg-white text-slate-900"
            }`}
          >
            <button
              type="button"
              onClick={() => setReportOpen(false)}
              disabled={reportLoading}
              aria-label="Close submission form"
              className={`absolute right-5 top-5 rounded-xl p-2 transition disabled:opacity-40 ${
                darkMode
                  ? "text-slate-400 hover:bg-white/10 hover:text-white"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-7 pr-8">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
                <ShieldCheck className="h-6 w-6" />
              </span>

              <h2
                id="report-modal-title"
                className="mt-5 text-2xl font-black sm:text-3xl"
              >
                Complaints & Feedback
              </h2>

              <p className={`mt-3 text-sm leading-7 ${muted}`}>
                Tell us what happened, raise a concern, or share a suggestion.
                Please provide enough detail for our team to understand your
                submission.
              </p>
            </div>

            <form onSubmit={submitReport} className="space-y-5">
              <div>
                <label
                  htmlFor="report-category"
                  className="mb-2 block text-sm font-semibold"
                >
                  Submission type <span className="text-blue-500">*</span>
                </label>

                <select
                  id="report-category"
                  name="category"
                  value={reportForm.category}
                  onChange={changeReport}
                  className={inputClass}
                  required
                >
                  <option value="Complaint">Complaint</option>
                  <option value="Compliance Concern">Compliance concern</option>
                  <option value="Feedback">Feedback or suggestion</option>
                  <option value="Other Concern">Other concern</option>
                </select>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="report-name"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Full name <span className="text-blue-500">*</span>
                  </label>

                  <input
                    id="report-name"
                    name="name"
                    value={reportForm.name}
                    onChange={changeReport}
                    className={inputClass}
                    placeholder="Your name"
                    autoComplete="name"
                    maxLength={100}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="report-email"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Email address <span className="text-blue-500">*</span>
                  </label>

                  <input
                    id="report-email"
                    name="email"
                    type="email"
                    value={reportForm.email}
                    onChange={changeReport}
                    className={inputClass}
                    placeholder="you@example.com"
                    autoComplete="email"
                    maxLength={254}
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="report-subject"
                  className="mb-2 block text-sm font-semibold"
                >
                  Subject <span className="text-blue-500">*</span>
                </label>

                <input
                  id="report-subject"
                  name="subject"
                  value={reportForm.subject}
                  onChange={changeReport}
                  className={inputClass}
                  placeholder="Briefly describe your concern"
                  maxLength={200}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="report-message"
                  className="mb-2 block text-sm font-semibold"
                >
                  Details <span className="text-blue-500">*</span>
                </label>

                <textarea
                  id="report-message"
                  name="message"
                  value={reportForm.message}
                  onChange={changeReport}
                  className={`${inputClass} min-h-36 resize-y`}
                  placeholder="Describe your complaint, compliance concern, or feedback..."
                  rows={5}
                  minLength={10}
                  maxLength={5000}
                  required
                />

                <p className={`mt-2 text-xs ${muted}`}>
                  {reportForm.message.length}/5000 characters
                </p>
              </div>

              <div
                className={`rounded-xl p-4 text-sm leading-6 ${
                  darkMode
                    ? "bg-white/[0.05] text-slate-400"
                    : "bg-slate-50 text-slate-600"
                }`}
              >
                Please submit truthful information and avoid including passwords
                or unnecessary sensitive data. Do not assume a submission is
                anonymous or confidential; this form collects your name and
                email address.
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  disabled={reportLoading}
                  onClick={() => setReportOpen(false)}
                  className={`rounded-xl border px-5 py-3 font-semibold transition disabled:opacity-50 ${
                    darkMode
                      ? "border-white/10 hover:bg-white/5"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={reportLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-semibold text-white transition hover:from-blue-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {reportLoading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Submit Report
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Newsletter />
    </main>
  );
}
