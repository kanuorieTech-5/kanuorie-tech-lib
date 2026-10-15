import { useEffect, useState } from "react";

const serviceOptions = [
  { value: "web", label: "Web Development" },
  { value: "mobile", label: "Mobile App Development" },
  { value: "uiux", label: "UI/UX Design" },
  { value: "consulting", label: "Technology Consulting" },
  { value: "ecommerce", label: "E-commerce Website" },
  { value: "redesign", label: "Website Redesign" },
  { value: "api", label: "API Integration" },
  { value: "maintenance", label: "Website Maintenance & Support" },
  { value: "other", label: "Other" },
];

const budgetOptions = [
  "Below ₦100,000",
  "₦100,000 – ₦250,000",
  "₦250,000 – ₦500,000",
  "₦500,000 – ₦1,000,000",
  "₦1,000,000 – ₦3,000,000",
  "Above ₦3,000,000",
  "Not sure yet",
];

const timelines = [
  "As soon as possible",
  "Within 2 weeks",
  "Within 1 month",
  "1–3 months",
  "More than 3 months",
  "Flexible / not decided",
];

const projectTypes = [
  "New project",
  "Improve an existing project",
  "Website or app redesign",
  "Ongoing support",
  "Consultation only",
];

const ecommerceFeatures = [
  "Online payments",
  "Product management",
  "Shopping cart and checkout",
  "Delivery integration",
  "Customer accounts",
  "Order tracking",
];

const initialForm = {
  name: "",
  email: "",
  phone: "",
  company: "",
  service: "",
  projectType: "",
  message: "",
  budget: "",
  timeline: "",
  preferredContact: "email",
  referenceUrl: "",
  additionalRequirements: "",
  projectRequirements: [],
  platform: "",
  designType: "",
  apiDetails: "",
  maintenanceNeeds: "",
  websiteType: "",
};

const inputClass =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white";

const labelClass =
  "block text-sm font-semibold text-slate-700 dark:text-slate-200";

function Field({ label, required = false, hint, children }) {
  return (
    <div>
      <label className={labelClass}>
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      {children}

      {hint && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {hint}
        </p>
      )}
    </div>
  );
}

function Section({ title, description, children }) {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="font-bold text-slate-900 dark:text-white">
          {title}
        </h3>

        {description && (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {description}
          </p>
        )}
      </div>

      {children}
    </section>
  );
}

export default function ServiceInquiryForm({
  onSubmit,
  loading = false,
  initialService = "",
}) {
  const [form, setForm] = useState(() => ({
    ...initialForm,
    service: initialService,
  }));

  useEffect(() => {
    if (initialService) {
      const matchedService = serviceOptions.find(
        (option) =>
          option.value === initialService ||
          option.label.toLowerCase() ===
            String(initialService).toLowerCase(),
      );

      if (matchedService) {
        setForm((previous) => ({
          ...previous,
          service: matchedService.value,
        }));
      }
    }
  }, [initialService]);

  const updateField = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const toggleFeature = (feature) => {
    setForm((previous) => ({
      ...previous,
      projectRequirements:
        previous.projectRequirements.includes(feature)
          ? previous.projectRequirements.filter(
              (item) => item !== feature,
            )
          : [...previous.projectRequirements, feature],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    const payload = {
      ...form,
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      company: form.company.trim(),
      message: form.message.trim(),
      referenceUrl: form.referenceUrl.trim(),
      additionalRequirements: form.additionalRequirements.trim(),
      apiDetails: form.apiDetails.trim(),
      maintenanceNeeds: form.maintenanceNeeds.trim(),
    };

    await onSubmit(payload);
  };

  const isWeb = form.service === "web";
  const isMobile = form.service === "mobile";
  const isEcommerce = form.service === "ecommerce";
  const isUIUX = form.service === "uiux";
  const isRedesign = form.service === "redesign";
  const isAPI = form.service === "api";
  const isMaintenance = form.service === "maintenance";
  const isConsulting = form.service === "consulting";

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-950/30">
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
          Tell us a little about your project. We will ask only the
          additional questions relevant to the service you choose.
        </p>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          Fields marked with * are required.
        </p>
      </div>

      <Section
        title="Your details"
        description="How can we contact you about your project?"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" required>
            <input
              name="name"
              value={form.name}
              onChange={updateField}
              className={inputClass}
              placeholder="Your full name"
              autoComplete="name"
              maxLength={100}
              required
            />
          </Field>

          <Field label="Email address" required>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={updateField}
              className={inputClass}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </Field>

          <Field label="Phone / WhatsApp">
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={updateField}
              className={inputClass}
              placeholder="+234 800 000 0000"
              autoComplete="tel"
              maxLength={30}
            />
          </Field>

          <Field label="Company or business">
            <input
              name="company"
              value={form.company}
              onChange={updateField}
              className={inputClass}
              placeholder="Business name (optional)"
              autoComplete="organization"
              maxLength={150}
            />
          </Field>
        </div>
      </Section>

      <div className="border-t border-slate-200 dark:border-slate-800" />

      <Section
        title="What do you need?"
        description="Choose a service to see relevant project questions."
      >
        <Field label="Service required" required>
          <select
            name="service"
            value={form.service}
            onChange={updateField}
            className={inputClass}
            required
          >
            <option value="">Select a service</option>

            {serviceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>

        {isWeb && (
          <Field label="What kind of website do you need?">
            <select
              name="websiteType"
              value={form.websiteType}
              onChange={updateField}
              className={inputClass}
            >
              <option value="">Choose website type</option>
              <option value="Business website">Business website</option>
              <option value="Portfolio">Portfolio</option>
              <option value="Blog or publication">Blog or publication</option>
              <option value="Web application">Web application</option>
              <option value="Landing page">Landing page</option>
              <option value="Other">Other</option>
            </select>
          </Field>
        )}

        {isMobile && (
          <Field label="Which platform do you need?">
            <select
              name="platform"
              value={form.platform}
              onChange={updateField}
              className={inputClass}
            >
              <option value="">Choose a platform</option>
              <option value="Android">Android</option>
              <option value="iOS">iOS</option>
              <option value="Android and iOS">Android and iOS</option>
              <option value="Not sure yet">Not sure yet</option>
            </select>
          </Field>
        )}

        {isUIUX && (
          <Field label="What design work do you need?">
            <select
              name="designType"
              value={form.designType}
              onChange={updateField}
              className={inputClass}
            >
              <option value="">Choose design work</option>
              <option value="Website design">Website design</option>
              <option value="Mobile app design">Mobile app design</option>
              <option value="Dashboard design">Dashboard design</option>
              <option value="Wireframes and prototypes">
                Wireframes and prototypes
              </option>
              <option value="Complete UI/UX">Complete UI/UX</option>
            </select>
          </Field>
        )}

        {isEcommerce && (
          <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
            <p className={labelClass}>
              Which features do you need?
            </p>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {ecommerceFeatures.map((feature) => (
                <label
                  key={feature}
                  className="flex cursor-pointer items-center gap-3 text-sm text-slate-700 dark:text-slate-300"
                >
                  <input
                    type="checkbox"
                    checked={form.projectRequirements.includes(feature)}
                    onChange={() => toggleFeature(feature)}
                    className="h-4 w-4 accent-blue-600"
                  />
                  {feature}
                </label>
              ))}
            </div>
          </div>
        )}

        {isRedesign && (
          <Field label="Current website URL">
            <input
              type="url"
              name="referenceUrl"
              value={form.referenceUrl}
              onChange={updateField}
              className={inputClass}
              placeholder="https://yourwebsite.com"
            />
          </Field>
        )}

        {isAPI && (
          <Field label="Which API or integration do you need?">
            <textarea
              name="apiDetails"
              value={form.apiDetails}
              onChange={updateField}
              className={`${inputClass} min-h-24`}
              placeholder="For example: payment gateway, external API, CRM or another service..."
              maxLength={2000}
            />
          </Field>
        )}

        {isMaintenance && (
          <Field label="What needs maintenance or fixing?">
            <textarea
              name="maintenanceNeeds"
              value={form.maintenanceNeeds}
              onChange={updateField}
              className={`${inputClass} min-h-24`}
              placeholder="Describe the current website, issue or support needed..."
              maxLength={2000}
            />
          </Field>
        )}

        {isConsulting && (
          <Field label="What do you need advice about?">
            <select
              name="designType"
              value={form.designType}
              onChange={updateField}
              className={inputClass}
            >
              <option value="">Choose a topic</option>
              <option value="Technology strategy">Technology strategy</option>
              <option value="Architecture and scalability">
                Architecture and scalability
              </option>
              <option value="Technical review">Technical review</option>
              <option value="Product planning">Product planning</option>
              <option value="General consultation">General consultation</option>
            </select>
          </Field>
        )}

        <Field
          label="Briefly describe your project"
          required
          hint="What are you trying to build, improve or achieve?"
        >
          <textarea
            name="message"
            value={form.message}
            onChange={updateField}
            className={`${inputClass} min-h-28 resize-y`}
            placeholder="Describe your idea and the result you want..."
            minLength={10}
            maxLength={5000}
            required
          />
          <p className="mt-1 text-right text-xs text-slate-400">
            {form.message.length}/5000
          </p>
        </Field>

        {form.service && (
          <Field label="Project type" required>
            <select
              name="projectType"
              value={form.projectType}
              onChange={updateField}
              className={inputClass}
              required
            >
              <option value="">Select project type</option>
              {projectTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </Field>
        )}
      </Section>

      <div className="border-t border-slate-200 dark:border-slate-800" />

      <Section
        title="Budget and timing"
        description="A rough estimate is fine if you are not sure yet."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Estimated budget" required>
            <select
              name="budget"
              value={form.budget}
              onChange={updateField}
              className={inputClass}
              required
            >
              <option value="">Choose your budget</option>
              {budgetOptions.map((budget) => (
                <option key={budget} value={budget}>
                  {budget}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Project timeline" required>
            <select
              name="timeline"
              value={form.timeline}
              onChange={updateField}
              className={inputClass}
              required
            >
              <option value="">When do you need it?</option>
              {timelines.map((timeline) => (
                <option key={timeline} value={timeline}>
                  {timeline}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </Section>

      <div className="border-t border-slate-200 dark:border-slate-800" />

      <Section title="Final details">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Preferred contact method" required>
            <select
              name="preferredContact"
              value={form.preferredContact}
              onChange={updateField}
              className={inputClass}
              required
            >
              <option value="email">Email</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="phone">Phone call</option>
            </select>
          </Field>

          {!isRedesign && (
            <Field label="Reference website (optional)">
              <input
                type="url"
                name="referenceUrl"
                value={form.referenceUrl}
                onChange={updateField}
                className={inputClass}
                placeholder="https://example.com"
              />
            </Field>
          )}
        </div>

        <Field label="Anything else we should know?">
          <textarea
            name="additionalRequirements"
            value={form.additionalRequirements}
            onChange={updateField}
            className={`${inputClass} min-h-20 resize-y`}
            placeholder="Optional notes, special requirements or preferences..."
            maxLength={3000}
          />
        </Field>
      </Section>

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Submitting enquiry..." : "Submit Project Enquiry"}
      </button>

      <p className="text-center text-xs leading-5 text-slate-500 dark:text-slate-400">
        Your information will be used to respond to your project enquiry.
      </p>
    </form>
  );
}