import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Input } from "../ui";

const USER_TYPES = [
  { value: "student", label: "Student / Learner" },
  { value: "career_seeker", label: "Career / Job Seeker" },
  { value: "developer", label: "Developer / Tech Professional" },
  { value: "partner", label: "Partner / Affiliate / Collaborator" },
  { value: "business_owner", label: "Business Owner / Entrepreneur" },
  { value: "general", label: "General User / Exploring" },
];

const INTERESTS = [
  { value: "web_development", label: "Web Development" },
  { value: "programming", label: "Programming" },
  { value: "online_courses", label: "Online Courses & Certifications" },
  { value: "books", label: "Books & Learning Resources" },
  { value: "software_services", label: "Website & Software Services" },
  { value: "ecommerce", label: "E-commerce Solutions" },
  { value: "mobile_apps", label: "Mobile Apps & Custom Applications" },
  { value: "jobs", label: "Job Opportunities" },
  { value: "internships", label: "Internships" },
  { value: "freelancing", label: "Freelancing & Career Growth" },
  { value: "community", label: "Community & Networking" },
  { value: "affiliate", label: "Affiliate Marketing & Partnerships" },
  { value: "ai", label: "Artificial Intelligence" },
  { value: "ui_ux", label: "UI/UX Design" },
];

const DISCOVERY_SOURCES = [
  { value: "google", label: "Google / Search Engine" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "whatsapp", label: "WhatsApp / Telegram" },
  { value: "friend", label: "Friend / Family / Colleague" },
  { value: "referral", label: "Referral Link" },
  { value: "community", label: "Online Community / Forum" },
  { value: "advertisement", label: "Advertisement" },
  { value: "event", label: "Event / Workshop / Training" },
  { value: "other", label: "Other" },
  { value: "unknown", label: "I don't remember" },
];

const LEARNING_LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "exploring", label: "Still exploring" },
];

const LEARNING_GOALS = [
  { value: "html_css", label: "HTML & CSS" },
  { value: "javascript", label: "JavaScript" },
  { value: "react", label: "React & Frontend Development" },
  { value: "backend", label: "Backend Development" },
  { value: "fullstack", label: "Full-Stack Development" },
  { value: "ui_ux", label: "UI/UX Design" },
  { value: "databases", label: "Databases & APIs" },
  { value: "python", label: "Python Programming" },
  { value: "ai", label: "AI & Machine Learning" },
  { value: "certification", label: "Professional Certifications" },
  { value: "portfolio", label: "Building a Portfolio" },
];

const BUSINESS_TYPES = [
  { value: "startup", label: "Startup" },
  { value: "small_business", label: "Small Business" },
  { value: "medium_business", label: "Medium-Sized Business" },
  { value: "enterprise", label: "Large Enterprise" },
  { value: "ecommerce", label: "E-commerce Business" },
  { value: "education", label: "Education / Training" },
  { value: "personal_brand", label: "Personal Brand" },
  { value: "nonprofit", label: "Nonprofit Organization" },
  { value: "other", label: "Other Business Type" },
];

const BUSINESS_NEEDS = [
  { value: "business_website", label: "Business Website" },
  { value: "ecommerce", label: "E-commerce Store" },
  { value: "web_app", label: "Web Application" },
  { value: "mobile_app", label: "Mobile Application" },
  { value: "automation", label: "Business Automation" },
  { value: "custom_software", label: "Custom Software" },
  { value: "maintenance", label: "Website Maintenance" },
  { value: "branding", label: "Branding & Digital Design" },
  { value: "marketing", label: "Digital Marketing" },
  { value: "consultation", label: "Technical Consultation" },
];

const PROJECT_TIMELINES = [
  { value: "immediately", label: "As soon as possible" },
  { value: "within_month", label: "Within one month" },
  { value: "within_three_months", label: "Within three months" },
  { value: "within_six_months", label: "Within six months" },
  { value: "researching", label: "Just researching for now" },
];

const CAREER_GOALS = [
  { value: "frontend_developer", label: "Frontend Developer" },
  { value: "backend_developer", label: "Backend Developer" },
  { value: "fullstack_developer", label: "Full-Stack Developer" },
  { value: "mobile_developer", label: "Mobile App Developer" },
  { value: "ui_ux_designer", label: "UI/UX Designer" },
  { value: "data_analyst", label: "Data Analyst" },
  { value: "ai_engineer", label: "AI / Machine Learning Engineer" },
  { value: "cybersecurity", label: "Cybersecurity Professional" },
  { value: "tech_entrepreneur", label: "Tech Entrepreneur" },
  { value: "other_tech", label: "Other Technology Career" },
];

const EXPERIENCE_LEVELS = [
  { value: "no_experience", label: "No experience yet" },
  { value: "entry_level", label: "Entry-level" },
  { value: "intermediate", label: "Intermediate" },
  { value: "experienced", label: "Experienced" },
  { value: "professional", label: "Professional" },
];

const OPPORTUNITIES = [
  { value: "full_time", label: "Full-Time Jobs" },
  { value: "part_time", label: "Part-Time Jobs" },
  { value: "remote", label: "Remote Opportunities" },
  { value: "onsite", label: "Onsite Opportunities" },
  { value: "hybrid", label: "Hybrid Opportunities" },
  { value: "internship", label: "Internships" },
  { value: "freelance", label: "Freelance Projects" },
  { value: "scholarships", label: "Scholarships" },
  { value: "mentorship", label: "Mentorship" },
];

const TECH_STACK = [
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "react", label: "React" },
  { value: "angular", label: "Angular" },
  { value: "vue", label: "Vue" },
  { value: "tailwind_css", label: "Tailwind CSS" },
  { value: "node_js", label: "Node.js" },
  { value: "express_js", label: "Express.js" },
  { value: "mongodb", label: "MongoDB" },
  { value: "sql", label: "SQL" },
  { value: "python", label: "Python" },
  { value: "git_github", label: "Git & GitHub" },
];

const COLLABORATION_INTERESTS = [
  { value: "affiliate", label: "Affiliate Programme" },
  { value: "business", label: "Business Partnership" },
  { value: "teaching", label: "Teaching / Training" },
  { value: "content", label: "Content Collaboration" },
  { value: "community", label: "Community Building" },
  { value: "technology", label: "Technology Projects" },
  { value: "open_source", label: "Open-Source Projects" },
  { value: "mentorship", label: "Mentorship" },
];

const OTHER_INTERESTS = [
  { value: "technology", label: "Technology" },
  { value: "entrepreneurship", label: "Entrepreneurship" },
  { value: "digital_creativity", label: "Digital Creativity" },
  { value: "research", label: "Research & Innovation" },
  { value: "education", label: "Education" },
  { value: "not_sure", label: "I'm still exploring" },
];

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const labelClass =
  "mb-2 block text-sm font-semibold text-slate-700";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",

  userType: "",
  interests: [],
  otherInterest: "",
  generalInterests: [],

  learningLevel: "",
  learningGoals: [],

  businessType: "",
  businessNeeds: [],
  projectTimeline: "",

  careerGoal: "",
  experienceLevel: "",
  preferredOpportunities: [],

  techStack: "",
  collaborationInterests: [],

  discoverySource: "",
  discoverySourceOther: "",
  marketingConsent: false,
};

function SelectField({
  label,
  name,
  value,
  options,
  onChange,
  required = false,
}) {
  return (
    <div>
      <label htmlFor={name} className={labelClass}>
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={inputClass}
      >
        <option value="">Choose an option</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function CheckboxGroup({
  title,
  name,
  options,
  values = [],
  onChange,
  description,
}) {
  return (
    <fieldset className="space-y-3">
      <legend className={labelClass}>{title}</legend>

      {description && (
        <p className="-mt-1 text-sm leading-6 text-slate-500">
          {description}
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((option) => {
          const checked = values.includes(option.value);

          return (
            <label
              key={option.value}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm transition ${
                checked
                  ? "border-blue-500 bg-blue-50 text-blue-800"
                  : "border-slate-200 hover:border-blue-300"
              }`}
            >
              <input
                type="checkbox"
                name={name}
                value={option.value}
                checked={checked}
                onChange={(event) =>
                  onChange(name, option.value, event.target.checked)
                }
                className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600"
              />

              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function RegisterForm({
  onSubmit,
  loading = false,
}) {
  const [form, setForm] = useState(initialForm);
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  const updateField = (name, value) => {
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    updateField(name, type === "checkbox" ? checked : value);
  };

  const handleMultiSelect = (name, value, checked) => {
    setForm((previous) => {
      const currentValues = previous[name];

      return {
        ...previous,
        [name]: checked
          ? currentValues.includes(value)
            ? currentValues
            : [...currentValues, value]
          : currentValues.filter((item) => item !== value),
      };
    });

    setError("");
  };

  const validateStep = () => {
    if (step === 1) {
      if (
        !form.firstName.trim() ||
        !form.lastName.trim() ||
        !form.email.trim() ||
        !form.password ||
        !form.confirmPassword
      ) {
        setError("Please complete all account details before continuing.");
        return false;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
        setError("Please enter a valid email address.");
        return false;
      }

      if (form.password.length < 8) {
        setError("Your password must contain at least 8 characters.");
        return false;
      }

      console.log("Password check:", {
        passwordLength: form.password.length,
        confirmPasswordLength: form.confirmPassword.length,
        passwordsMatch: form.password === form.confirmPassword,
      });

      if (form.password !== form.confirmPassword) {
        setError("Your passwords do not match.");
        return false;
      }
    }

    if (step === 2) {
      if (!form.userType) {
        setError("Please select the option that best describes you.");
        return false;
      }

      if (form.interests.length === 0) {
        setError("Please select at least one interest.");
        return false;
      }
    }

    if (step === 4) {
      if (!form.discoverySource) {
        setError("Please tell us how you discovered KanuorieTech.");
        return false;
      }

      if (
        form.discoverySource === "other" &&
        !form.discoverySourceOther.trim()
      ) {
        setError("Please specify how you discovered KanuorieTech.");
        return false;
      }
    }

    setError("");
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;

    setStep((current) => Math.min(current + 1, 4));

    if (step === 2) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setError("");
    setStep((current) => Math.max(current - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (event) => {
  event.preventDefault();
  setError("");

  if (step !== 4) {
    handleNext();
    return;
  }

  if (!validateStep()) return;

  // Keep confirmPassword for validation in Register.jsx.
  // Register.jsx removes it before sending data to the backend.
  const payload = {
    ...form,
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    email: form.email.trim().toLowerCase(),
    discoverySourceOther:
      form.discoverySource === "other"
        ? form.discoverySourceOther.trim()
        : "",
    otherInterest: form.otherInterest,
    techStack: form.techStack,
  };

  try {
    await onSubmit?.(payload);
  } catch (submitError) {
    setError(
      submitError?.response?.data?.message ||
        submitError?.message ||
        "We couldn't create your account. Please try again."
    );
  }
};

  const renderCheckboxGroup = (
    title,
    name,
    options,
    description
  ) => (
    <CheckboxGroup
      title={title}
      name={name}
      options={options}
      values={form[name]}
      onChange={handleMultiSelect}
      description={description}
    />
  );

  const renderRoleQuestions = () => {
    switch (form.userType) {
      case "student":
        return (
          <section className="space-y-6 rounded-2xl border border-blue-100 bg-blue-50/50 p-4 sm:p-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Your Learning Journey
              </h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Help us recommend courses and resources that fit your goals.
              </p>
            </div>

            <SelectField
              label="What is your current learning level?"
              name="learningLevel"
              value={form.learningLevel}
              options={LEARNING_LEVELS}
              onChange={handleChange}
            />

            {renderCheckboxGroup(
              "What would you like to learn?",
              "learningGoals",
              LEARNING_GOALS,
              "Select all the skills you want to develop."
            )}
          </section>
        );

      case "career_seeker":
        return (
          <section className="space-y-6 rounded-2xl border border-purple-100 bg-purple-50/50 p-4 sm:p-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Your Career Goals
              </h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Tell us about your preferred career path and opportunities.
              </p>
            </div>

            <SelectField
              label="Which role are you interested in?"
              name="careerGoal"
              value={form.careerGoal}
              options={CAREER_GOALS}
              onChange={handleChange}
            />

            <SelectField
              label="What is your experience level?"
              name="experienceLevel"
              value={form.experienceLevel}
              options={EXPERIENCE_LEVELS}
              onChange={handleChange}
            />

            {renderCheckboxGroup(
              "What opportunities interest you?",
              "preferredOpportunities",
              OPPORTUNITIES
            )}
          </section>
        );

      case "developer":
        return (
          <section className="space-y-6 rounded-2xl border border-amber-100 bg-amber-50/50 p-4 sm:p-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Your Developer Profile
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Select your experience level and the technologies you currently
                use or want to learn.
              </p>
            </div>

            <SelectField
              label="What is your experience level?"
              name="experienceLevel"
              value={form.experienceLevel}
              options={EXPERIENCE_LEVELS}
              onChange={handleChange}
            />

            <CheckboxGroup
              title="Which technologies do you use or want to learn?"
              name="techStack"
              options={TECH_STACK}
              values={selectedTechStack}
              onChange={setTechStack}
            />
          </section>
        );

      case "partner":
        return (
          <section className="space-y-6 rounded-2xl border border-pink-100 bg-pink-50/50 p-4 sm:p-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Let's Collaborate
              </h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Choose the ways you would like to work with KanuorieTech.
              </p>
            </div>

            {renderCheckboxGroup(
              "How would you like to collaborate?",
              "collaborationInterests",
              COLLABORATION_INTERESTS
            )}
          </section>
        );

      case "business_owner":
        return (
          <section className="space-y-6 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 sm:p-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Tell Us About Your Business
              </h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                This helps us understand your business and recommend suitable
                digital solutions.
              </p>
            </div>

            <SelectField
              label="What type of business do you run?"
              name="businessType"
              value={form.businessType}
              options={BUSINESS_TYPES}
              onChange={handleChange}
            />

            {renderCheckboxGroup(
              "What services does your business need?",
              "businessNeeds",
              BUSINESS_NEEDS
            )}

            <SelectField
              label="When are you hoping to get started?"
              name="projectTimeline"
              value={form.projectTimeline}
              options={PROJECT_TIMELINES}
              onChange={handleChange}
            />
          </section>
        );

      default:
        return (
          <section className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-4">
            <h3 className="text-xl font-bold text-slate-900">
              Explore KanuorieTech
            </h3>

            <p className="text-sm leading-6 text-slate-600">
              You can explore our learning library, books, technology services,
              community and other resources. You can update your preferences
              later in your Profile.
            </p>

            {renderCheckboxGroup(
              "What else interests you?",
              "generalInterests",
              OTHER_INTERESTS
            )}
          </section>
        );
    }
  };

  // Keep the selected options in the form state while presenting them
  // as a comma-separated string to the existing backend field.
  const selectedTechStack = form.techStack
    ? form.techStack.split(",").filter(Boolean)
    : [];

  const setTechStack = (name, value, checked) => {
    setForm((previous) => {
      const current = previous.techStack
        ? previous.techStack.split(",").filter(Boolean)
        : [];

      const updated = checked
        ? [...new Set([...current, value])]
        : current.filter((item) => item !== value);

      return {
        ...previous,
        techStack: updated.join(","),
      };
    });

    setError("");
  };

  const progress = (step / 4) * 100;

  return (
    <Card className="p-1 sm:p-5">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Create Your Account
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
          A few quick steps to personalize your KanuorieTech experience.
        </p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-blue-700">
            Step {step} of 4
          </span>

          <span className="text-xs text-slate-500">
            {Math.round(progress)}% complete
          </span>
        </div>

        <div
          className="h-2 overflow-hidden rounded-full bg-slate-100"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={4}
          aria-valuenow={step}
          aria-label="Registration progress"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2">
          {[
            "Account",
            "About you",
            "Your goals",
            "Finish",
          ].map((title, index) => {
            const number = index + 1;
            const active = step === number;
            const completed = step > number;

            return (
              <button
                key={title}
                type="button"
                onClick={() => {
                  if (number < step) {
                    setError("");
                    setStep(number);
                  }
                }}
                disabled={number >= step || loading}
                className={`rounded-lg px-1 py-2 text-center text-xs font-semibold transition sm:text-sm ${
                  active
                    ? "bg-blue-600 text-white"
                    : completed
                      ? "bg-blue-50 text-blue-700"
                      : "bg-slate-50 text-slate-400"
                }`}
              >
                {completed ? "✓ " : ""}
                {title}
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-7" noValidate>
        {/* STEP 1: ACCOUNT DETAILS */}
        {step === 1 && (
          <section className="space-y-5">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Your Account Details
              </h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Start with the details you'll use to access your account.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="First Name"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                autoComplete="given-name"
                required
              />

              <Input
                label="Last Name"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                autoComplete="family-name"
                required
              />
            </div>

            <Input
              label="Email Address"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Password (at least 8 characters)"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />

              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
            </div>

            <p className="text-xs leading-5 text-slate-500">
              Use a strong password you haven't used on another website.
            </p>
          </section>
        )}

        {/* STEP 2: ABOUT YOU */}
        {step === 2 && (
          <section className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Tell Us About Yourself
              </h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Choose the category that best describes you. We'll tailor the
                next questions to your selection.
              </p>
            </div>

            <SelectField
              label="What best describes you?"
              name="userType"
              value={form.userType}
              options={USER_TYPES}
              onChange={(event) => {
                const nextType = event.target.value;

                setForm((previous) => ({
                  ...previous,
                  userType: nextType,
                  learningLevel: "",
                  learningGoals: [],
                  businessType: "",
                  businessNeeds: [],
                  projectTimeline: "",
                  careerGoal: "",
                  experienceLevel: "",
                  preferredOpportunities: [],
                  techStack: "",
                  collaborationInterests: [],
                  generalInterests: [],
                }));
                setError("");
              }}
              required
            />

            {renderCheckboxGroup(
              "What are you interested in?",
              "interests",
              INTERESTS,
              "Choose all that apply. These interests help personalize your recommendations."
            )}

            <div>
              <label htmlFor="otherInterest" className={labelClass}>
                Other interests (optional)
              </label>

              <select
                id="otherInterest"
                name="otherInterest"
                value={form.otherInterest}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select an additional interest</option>

                {OTHER_INTERESTS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </section>
        )}

        {/* STEP 3: ROLE-SPECIFIC QUESTIONS */}

        {step === 3 && (
          <section className="space-y-5">
            {renderRoleQuestions()}
          </section>
        )}

        {/* STEP 4: DISCOVERY AND CONSENT */}
        {step === 4 && (
          <section className="space-y-6">
            
            <SelectField
              label="How did you discover KanuorieTech?"
              name="discoverySource"
              value={form.discoverySource}
              options={DISCOVERY_SOURCES}
              onChange={handleChange}
              required
            />

            {form.discoverySource === "other" && (
              <div>
                <label
                  htmlFor="discoverySourceOther"
                  className={labelClass}
                >
                  Please specify *
                </label>

                <input
                  id="discoverySourceOther"
                  name="discoverySourceOther"
                  value={form.discoverySourceOther}
                  onChange={handleChange}
                  required
                  maxLength={150}
                  className={inputClass}
                  placeholder="Tell us where you found us"
                />
              </div>
            )}

            <div className="rounded-xl border border-slate-200 p-4">
              <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-slate-600">
                <input
                  type="checkbox"
                  name="marketingConsent"
                  checked={form.marketingConsent}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 accent-blue-600"
                />

                <span>
                  I'd like to receive occasional KanuorieTech news, project updates, learning
                  resources, product updates and relevant opportunities by
                  email. I understand I can unsubscribe at any time.
                </span>
              </label>
            </div>

            <div className="rounded-xl bg-blue-50 p-4 text-sm leading-6 text-blue-900">
              <strong>Great!</strong>
              <p className="mt-1">
                Your preferences will help us personalize your experience.
                You can edit and update your profile details and preferences anytime.
              </p>
            </div>
          </section>
        )}

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {/* NAVIGATION */}
        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-between">
          {step > 1 ? (
            <Button
              type="button"
              onClick={handleBack}
              disabled={loading}
              fullWidth
            >
              Back
            </Button>
          ) : (
            <div className="hidden sm:block" />
          )}

          {step < 4 ? (
            <Button
              type="button"
              onClick={handleNext}
              disabled={loading}
              fullWidth
            >
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              loading={loading}
              disabled={loading}
              fullWidth
            >
              Create My Account
            </Button>
          )}
        </div>

        <p className="text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Login
          </Link>
        </p>

        <p className="text-center text-xs leading-5 text-slate-500">
          By creating an account, you agree to our applicable terms and privacy
          policy.
        </p>
      </form>
    </Card>
  );
}