import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Input } from "../ui";

const USER_TYPES = [
  { value: "student", label: "Student / Learner" },
  { value: "business_owner", label: "Business Owner / Entrepreneur" },
  { value: "career_seeker", label: "Career / Job Seeker" },
  { value: "developer", label: "Developer / Tech Professional" },
  { value: "partner", label: "Partner / Affiliate / Collaborator" },
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

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const labelClass =
  "mb-2 block text-sm font-semibold text-slate-700";

export default function RegisterForm({
  onSubmit,
  loading = false,
}) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",

    userType: "",
    interests: [],
    discoverySource: "",
    discoverySourceOther: "",

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
    otherInterest: "",
    marketingConsent: false,
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (error) setError("");
  };

  const handleMultiSelect = (name, value, checked) => {
    setForm((prev) => ({
      ...prev,
      [name]: checked
        ? [...prev[name], value]
        : prev[name].filter((item) => item !== value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    if (form.password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }

    if (!form.userType) {
      setError("Please tell us which option best describes you.");
      return;
    }

    if (form.interests.length === 0) {
      setError("Please select at least one interest.");
      return;
    }

    if (!form.discoverySource) {
      setError("Please tell us how you discovered KanuorieTech.");
      return;
    }

    if (
      form.discoverySource === "other" &&
      !form.discoverySourceOther.trim()
    ) {
      setError("Please specify how you discovered KanuorieTech.");
      return;
    }

    // Send account and profile data to the existing registration handler.
    // Remove confirmPassword because it is only needed for frontend validation.
    const {
      confirmPassword,
      ...registrationData
    } = form;

    onSubmit?.({
      ...registrationData,
      discoverySourceOther:
        form.discoverySource === "other"
          ? form.discoverySourceOther.trim()
          : "",
      otherInterest: form.otherInterest.trim(),
      techStack: form.techStack.trim(),
    });
  };

  const showStudentFields =
    form.userType === "student" ||
    form.interests.some((item) =>
      ["online_courses", "books", "programming"].includes(item)
    );

  const showBusinessFields =
    form.userType === "business_owner" ||
    form.interests.some((item) =>
      ["software_services", "ecommerce", "mobile_apps"].includes(item)
    );

  const showCareerFields =
    form.userType === "career_seeker" ||
    form.interests.some((item) =>
      ["jobs", "internships", "freelancing"].includes(item)
    );

  const showDeveloperFields =
    form.userType === "developer" ||
    form.interests.includes("web_development");

  const showPartnerFields =
    form.userType === "partner" ||
    form.interests.includes("affiliate");

  const renderCheckboxGroup = (
    title,
    name,
    options,
    description
  ) => (
    <fieldset className="space-y-3">
      <legend className={labelClass}>{title}</legend>

      {description && (
        <p className="mb-3 text-sm text-slate-500">
          {description}
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((option) => (
          <label
            key={option.value}
            className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm transition ${
              form[name].includes(option.value)
                ? "border-blue-500 bg-blue-50 text-blue-800"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <input
              type="checkbox"
              name={name}
              value={option.value}
              checked={form[name].includes(option.value)}
              onChange={(e) =>
                handleMultiSelect(
                  name,
                  option.value,
                  e.target.checked
                )
              }
              className="mt-0.5 accent-blue-600"
            />

            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );

  return (
    <Card className="mx-auto p-5 sm:p-8">
      <div className="mb-8">
        <p className="mb-2 text-sm font-bold uppercase tracking-wider text-blue-600">
          Join our community
        </p>

        <h2 className="mb-2 text-3xl font-bold text-slate-900 sm:text-4xl">
          Create Your Account
        </h2>

        <p className="text-sm leading-6 text-slate-500 sm:text-base">
          Tell us a little about yourself so we can personalize
          your KanuorieTech experience.
        </p>

        <p className="mt-3 text-xs text-slate-500">
          Fields marked with * are required. Your additional
          profile information helps us recommend relevant
          resources and opportunities.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ACCOUNT DETAILS */}
        <section className="space-y-5">
          <h3 className="border-b border-slate-200 pb-3 text-lg font-bold text-slate-900">
            1. Account Details
          </h3>

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
        </section>

        {/* USER PROFILE */}
        <section className="space-y-5">
          <h3 className="border-b border-slate-200 pb-3 text-lg font-bold text-slate-900">
            2. Tell Us About Yourself
          </h3>

          <div>
            <label htmlFor="userType" className={labelClass}>
              Which best describes you? 
            </label>

            <select
              id="userType"
              name="userType"
              value={form.userType}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="">Select your category</option>

              {USER_TYPES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          {renderCheckboxGroup(
            "What are you interested in?",
            "interests",
            INTERESTS,
            "Choose all that apply. You can select more than one."
          )}

          <div>
            <label
              htmlFor="otherInterest"
              className={labelClass}
            >
              Any other interest? (Optional)
            </label>

            <textarea
              id="otherInterest"
              name="otherInterest"
              value={form.otherInterest}
              onChange={handleChange}
              rows={2}
              maxLength={300}
              placeholder="Tell us about anything else you'd like to explore..."
              className={inputClass}
            />
          </div>
        </section>

        {/* LEARNER QUESTIONS */}
        {showStudentFields && (
          <section className="space-y-5 rounded-2xl border border-blue-100 bg-blue-50/50 p-4 sm:p-5">
            <h3 className="text-lg font-bold text-slate-900">
              3. Your Learning Goals
            </h3>

            <div>
              <label
                htmlFor="learningLevel"
                className={labelClass}
              >
                What is your current learning level?
              </label>

              <select
                id="learningLevel"
                name="learningLevel"
                value={form.learningLevel}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select your level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="exploring">Still exploring</option>
              </select>
            </div>

            {renderCheckboxGroup(
              "What would you like to learn?",
              "learningGoals",
              [
                { value: "html_css", label: "HTML & CSS" },
                { value: "javascript", label: "JavaScript" },
                { value: "react", label: "React & Frontend" },
                { value: "backend", label: "Backend Development" },
                { value: "fullstack", label: "Full-Stack Development" },
                { value: "ui_ux", label: "UI/UX Design" },
                { value: "databases", label: "Databases & APIs" },
                { value: "other", label: "Other Tech Skills" },
              ]
            )}
          </section>
        )}

        {/* BUSINESS QUESTIONS */}
        {showBusinessFields && (
          <section className="space-y-5 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 sm:p-5">
            <h3 className="text-lg font-bold text-slate-900">
              {showStudentFields ? "4." : "3."} Your Business Needs
            </h3>

            <div>
              <label
                htmlFor="businessType"
                className={labelClass}
              >
                What type of business do you run?
              </label>

              <input
                id="businessType"
                name="businessType"
                value={form.businessType}
                onChange={handleChange}
                maxLength={150}
                placeholder="e.g. Retail, Education, Fashion, Healthcare"
                className={inputClass}
              />
            </div>

            {renderCheckboxGroup(
              "Which services interest you?",
              "businessNeeds",
              [
                { value: "business_website", label: "Business Website" },
                { value: "ecommerce", label: "E-commerce Store" },
                { value: "web_app", label: "Web Application" },
                { value: "mobile_app", label: "Mobile Application" },
                { value: "automation", label: "Business Automation" },
                { value: "custom_software", label: "Custom Software" },
                { value: "maintenance", label: "Website Maintenance" },
                { value: "consultation", label: "Technical Consultation" },
              ]
            )}

            <div>
              <label
                htmlFor="projectTimeline"
                className={labelClass}
              >
                When are you hoping to get started?
              </label>

              <select
                id="projectTimeline"
                name="projectTimeline"
                value={form.projectTimeline}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select a timeline</option>
                <option value="immediately">As soon as possible</option>
                <option value="within_month">Within a month</option>
                <option value="within_three_months">
                  Within 3 months
                </option>
                <option value="researching">Just researching</option>
              </select>
            </div>
          </section>
        )}

        {/* CAREER QUESTIONS */}
        {showCareerFields && (
          <section className="space-y-5 rounded-2xl border border-purple-100 bg-purple-50/40 p-4 sm:p-5">
            <h3 className="text-lg font-bold text-slate-900">
              Career & Opportunities
            </h3>

            <div>
              <label
                htmlFor="careerGoal"
                className={labelClass}
              >
                What role are you interested in?
              </label>

              <input
                id="careerGoal"
                name="careerGoal"
                value={form.careerGoal}
                onChange={handleChange}
                maxLength={150}
                placeholder="e.g. Frontend Developer, UI/UX Designer"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="experienceLevel"
                className={labelClass}
              >
                What is your experience level?
              </label>

              <select
                id="experienceLevel"
                name="experienceLevel"
                value={form.experienceLevel}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select experience level</option>
                <option value="no_experience">Just starting</option>
                <option value="entry_level">Entry-level</option>
                <option value="intermediate">Intermediate</option>
                <option value="experienced">Experienced</option>
              </select>
            </div>

            {renderCheckboxGroup(
              "What opportunities are you looking for?",
              "preferredOpportunities",
              [
                { value: "full_time", label: "Full-Time Jobs" },
                { value: "part_time", label: "Part-Time Jobs" },
                { value: "remote", label: "Remote Opportunities" },
                { value: "internship", label: "Internships" },
                { value: "freelance", label: "Freelance Projects" },
                { value: "mentorship", label: "Mentorship" },
              ]
            )}
          </section>
        )}

        {/* DEVELOPER QUESTIONS */}
        {showDeveloperFields && (
          <section className="space-y-5 rounded-2xl border border-amber-100 bg-amber-50/40 p-4 sm:p-5">
            <h3 className="text-lg font-bold text-slate-900">
              Your Technical Interests
            </h3>

            <div>
              <label htmlFor="techStack" className={labelClass}>
                Which technologies do you use or want to learn?
              </label>

              <textarea
                id="techStack"
                name="techStack"
                value={form.techStack}
                onChange={handleChange}
                rows={3}
                maxLength={500}
                placeholder="e.g. React, Node.js, MongoDB, Python..."
                className={inputClass}
              />
            </div>
          </section>
        )}

        {/* PARTNERSHIP QUESTIONS */}
        {showPartnerFields && (
          <section className="space-y-5 rounded-2xl border border-pink-100 bg-pink-50/40 p-4 sm:p-5">
            <h3 className="text-lg font-bold text-slate-900">
              Collaboration Interests
            </h3>

            {renderCheckboxGroup(
              "How would you like to collaborate?",
              "collaborationInterests",
              [
                { value: "affiliate", label: "Affiliate Programme" },
                { value: "business", label: "Business Partnership" },
                { value: "teaching", label: "Teaching / Training" },
                { value: "content", label: "Content Collaboration" },
                { value: "community", label: "Community Building" },
                { value: "technology", label: "Technology Projects" },
              ]
            )}
          </section>
        )}

        {/* DISCOVERY */}
        <section className="space-y-5">
          <h3 className="border-b border-slate-200 pb-3 text-lg font-bold text-slate-900">
            How Did You Find Us?
          </h3>

          <div>
            <label
              htmlFor="discoverySource"
              className={labelClass}
            >
              How did you hear about KanuorieTech?
            </label>

            <select
              id="discoverySource"
              name="discoverySource"
              value={form.discoverySource}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="">Select a source</option>

              {DISCOVERY_SOURCES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

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
                placeholder="Where did you hear about us?"
                className={inputClass}
              />
            </div>
          )}
        </section>

        {/* OPTIONAL COMMUNICATION CONSENT */}
        <section className="rounded-xl border border-slate-200 p-4">
          <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-600">
            <input
              type="checkbox"
              name="marketingConsent"
              checked={form.marketingConsent}
              onChange={handleChange}
              className="mt-1 accent-blue-600"
            />

            <span>
              I'd like to receive occasional KanuorieTech news,
              learning resources, product updates and relevant
              opportunities by email. I understand I can unsubscribe
              at any time.
            </span>
          </label>
        </section>

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <Button type="submit" loading={loading} fullWidth>
          Create My Account
        </Button>

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
          By creating an account, you agree to our applicable
          terms and privacy policy.
        </p>
      </form>
    </Card>
  );
}