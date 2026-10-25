import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts";
import { getCourses } from "../api/courseApi";
import { getLearningResources } from "../api/LearningApi";
import { getProgress } from "../api/progressApi";
import { getSavedResources } from "../api/libraryApi";
import {
  User,
  Mail,
  Phone,
  Camera,
  Edit3,
  X,
  Save,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Award,
  Bookmark,
  Users,
  Handshake,
  CreditCard,
  ArrowUpRight,
} from "lucide-react";
export default function Profile() {
  const { user, updateProfile, uploadAvatar, loading: authLoading } = useAuth();
  const [stats, setStats] = useState({
    courses: 0,
    learning: 0,
    saved: 0,
    inProgress: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const fileInputRef = useRef(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",

    userType: "general",
    interests: [],
    generalInterests: [],
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
    techStack: [],
    collaborationInterests: [],
    otherInterest: "",
    marketingConsent: false,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const buildFormData = (profile = {}) => ({
    firstName: profile.firstName || "",
    lastName: profile.lastName || "",
    email: profile.email || "",
    phone: profile.phone || "",
    bio: profile.bio || "",
    userType: profile.userType || "general",
    interests: Array.isArray(profile.interests) ? profile.interests : [],
    generalInterests: Array.isArray(profile.generalInterests)
      ? profile.generalInterests
      : [],
    discoverySource: profile.discoverySource || "",
    discoverySourceOther: profile.discoverySourceOther || "",
    learningLevel: profile.learningLevel || "",
    learningGoals: Array.isArray(profile.learningGoals)
      ? profile.learningGoals
      : [],
    businessType: profile.businessType || "",
    businessNeeds: Array.isArray(profile.businessNeeds)
      ? profile.businessNeeds
      : [],
    projectTimeline: profile.projectTimeline || "",
    careerGoal: profile.careerGoal || "",
    experienceLevel: profile.experienceLevel || "",
    preferredOpportunities: Array.isArray(profile.preferredOpportunities)
      ? profile.preferredOpportunities
      : [],
    techStack: Array.isArray(profile.techStack)
      ? profile.techStack
      : typeof profile.techStack === "string" && profile.techStack.trim()
        ? profile.techStack.split(",").map((item) => item.trim()).filter(Boolean)
        : [],
    collaborationInterests: Array.isArray(profile.collaborationInterests)
      ? profile.collaborationInterests
      : [],
    otherInterest: profile.otherInterest || "",
    marketingConsent: profile.marketingConsent === true,
  });

  useEffect(() => {
  let cancelled = false;

  const loadProfileStats = async () => {
    setStatsLoading(true);

    try {
      const [coursesResult, learningResult, savedResult, progressResult] =
        await Promise.allSettled([
          getCourses({ limit: 100 }),
          getLearningResources({ limit: 100 }),
          getSavedResources(),
          getProgress(),
        ]);

      if (cancelled) return;

      const extractArray = (result) => {
        if (result.status !== "fulfilled") return [];

        const response = result.value;

        if (Array.isArray(response)) return response;

        const data = response?.data;

        if (Array.isArray(data)) return data;

        if (Array.isArray(data?.courses)) return data.courses;
        if (Array.isArray(data?.learning)) return data.learning;
        if (Array.isArray(data?.resources)) return data.resources;
        if (Array.isArray(data?.savedResources)) return data.savedResources;
        if (Array.isArray(data?.progress)) return data.progress;

        return [];
      };

      const courses = extractArray(coursesResult);
      const learning = extractArray(learningResult);
      const saved = extractArray(savedResult);
      const progress = extractArray(progressResult);

      const inProgress = progress.filter((item) => {
        const status = String(item?.status || "").toLowerCase();
        const percentage = Number(item?.percentage || 0);

        return (
          status === "in_progress" ||
          status === "in-progress" ||
          (percentage > 0 && percentage < 100)
        );
      });

      setStats({
        courses: courses.length,
        learning: learning.length,
        saved: saved.length,
        inProgress: inProgress.length,
      });
    } catch (error) {
      console.error("Failed to load profile statistics:", error);
    } finally {
      if (!cancelled) {
        setStatsLoading(false);
      }
    }
  };

  loadProfileStats();

  return () => {
    cancelled = true;
  };
}, []);

  /* ==========================================
     LOAD USER INTO FORM
  ========================================== */

  useEffect(() => {
    if (!user) return;

    setFormData(buildFormData(user));
  }, [user]);

  /* ==========================================
     CLEANUP IMAGE PREVIEW
  ========================================== */

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  /* ==========================================
     OPEN MODAL
  ========================================== */

  const openEditModal = () => {
    setErrorMessage("");
    setSuccessMessage("");

    setFormData(buildFormData(user));

    setSelectedFile(null);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
    }

    setIsEditModalOpen(true);
  };

  /* ==========================================
     CLOSE MODAL
  ========================================== */

  const closeEditModal = () => {
    if (saving || uploadingAvatar) return;

    setIsEditModalOpen(false);
    setErrorMessage("");
    setSuccessMessage("");
    setSelectedFile(null);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
    }
  };

  /* ==========================================
     FORM CHANGE
  ========================================== */

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "userType") {
      setFormData((previous) => ({
        ...previous,
        userType: value,
        learningLevel: "",
        learningGoals: [],
        businessType: "",
        businessNeeds: [],
        projectTimeline: "",
        careerGoal: "",
        experienceLevel: "",
        preferredOpportunities: [],
        techStack: [],
        collaborationInterests: [],
        generalInterests: [],
      }));
      return;
    }

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleArrayChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    }));
  };

  const handlePreferenceArrayChange = (name, values) => {
    setFormData((previous) => ({
      ...previous,
      [name]: values,
    }));
  };

  /* ==========================================
     AVATAR FILE SELECTION
  ========================================== */

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setErrorMessage("");
    setSuccessMessage("");

    /* Validate file type */

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file.");

      event.target.value = "";
      return;
    }

    /* Validate file size */

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setErrorMessage("Image must be smaller than 5MB.");

      event.target.value = "";
      return;
    }

    setSelectedFile(file);

    const url = URL.createObjectURL(file);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(url);
  };

  /* ==========================================
     UPLOAD AVATAR
  ========================================== */

  const handleAvatarUpload = async () => {
    if (!selectedFile) return;

    setUploadingAvatar(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const formData = new FormData();

      formData.append("avatar", selectedFile);

      const response = await uploadAvatar(formData);

      const uploadedAvatar =
        response?.data?.avatar ||
        response?.avatar ||
        response?.data?.user?.avatar;

      if (!uploadedAvatar) {
        throw new Error("Avatar uploaded but no image URL was returned.");
      }

      /*
       * Update the profile avatar immediately.
       *
       * This also keeps AuthContext and localStorage
       * synchronized.
       */

      await updateProfile({
        avatar: uploadedAvatar,
      });

      setSelectedFile(null);

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl("");
      }

      setSuccessMessage("Profile photo updated successfully.");
    } catch (error) {
      console.error("Avatar upload error:", error);

      setErrorMessage(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to upload profile photo.",
      );
    } finally {
      setUploadingAvatar(false);
    }
  };

  /* ==========================================
     SAVE PROFILE
  ========================================== */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        bio: formData.bio.trim(),
        userType: formData.userType,
        interests: formData.interests,
        generalInterests: formData.generalInterests,
        discoverySource: formData.discoverySource.trim(),
        discoverySourceOther: formData.discoverySourceOther.trim(),
        learningLevel: formData.learningLevel.trim(),
        learningGoals: formData.learningGoals,
        businessType: formData.businessType.trim(),
        businessNeeds: formData.businessNeeds,
        projectTimeline: formData.projectTimeline.trim(),
        careerGoal: formData.careerGoal.trim(),
        experienceLevel: formData.experienceLevel.trim(),
        preferredOpportunities: formData.preferredOpportunities,
        techStack: formData.techStack.join(","),
        collaborationInterests: formData.collaborationInterests,
        otherInterest: formData.otherInterest.trim(),
        marketingConsent: formData.marketingConsent,
      };

      if (!payload.firstName) {
        throw new Error("First name is required.");
      }

      if (!payload.lastName) {
        throw new Error("Last name is required.");
      }

      if (!payload.email) {
        throw new Error("Email address is required.");
      }

      if (
        payload.userType === "business_owner" &&
        (!payload.businessType || payload.businessNeeds.length === 0)
      ) {
        throw new Error(
          "Business owners must choose a business type and at least one service need."
        );
      }

      const isBecomingBusinessOwner =
        user?.userType !== "business_owner" &&
        payload.userType === "business_owner";

      await updateProfile(payload);

      setSuccessMessage(
        isBecomingBusinessOwner
          ? "Profile updated and your business service request was sent to Admin."
          : "Profile updated successfully."
      );

      /*
       * Give the user a moment to see the success
       * message before closing the modal.
       */

      setTimeout(() => {
        setIsEditModalOpen(false);
        setSuccessMessage("");
      }, 1000);
    } catch (error) {
      console.error("Profile update error:", error);

      setErrorMessage(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update profile.",
      );
    } finally {
      setSaving(false);
    }
  };

  const formatLabel = (value = "") =>
    value
      .replace(/_/g, " ")
      .replace(/\b\w/g, (character) => character.toUpperCase());

  const registrationDetails = [
    {
      label: "Account Type",
      value: user?.userType,
    },
    {
      label: "Interests",
      value: user?.interests,
    },
    {
      label: "General Interests",
      value: user?.generalInterests,
    },
    {
      label: "How You Found Us",
      value:
        user?.discoverySource === "other"
          ? user?.discoverySourceOther || "Other"
          : user?.discoverySource,
    },
    {
      label: "Learning Level",
      value: user?.learningLevel,
    },
    {
      label: "Learning Goals",
      value: user?.learningGoals,
    },
    {
      label: "Business Type",
      value: user?.businessType,
    },
    {
      label: "Business Needs",
      value: user?.businessNeeds,
    },
    {
      label: "Project Timeline",
      value: user?.projectTimeline,
    },
    {
      label: "Career Goal",
      value: user?.careerGoal,
    },
    {
      label: "Experience Level",
      value: user?.experienceLevel,
    },
    {
      label: "Preferred Opportunities",
      value: user?.preferredOpportunities,
    },
    {
      label: "Technology Stack",
      value: user?.techStack,
    },
    {
      label: "Collaboration Interests",
      value: user?.collaborationInterests,
    },
    {
      label: "Other Interests",
      value: user?.otherInterest,
    },
    {
      label: "Marketing Emails",
      value:
        typeof user?.marketingConsent === "boolean"
          ? user.marketingConsent
            ? "Opted in"
            : "Not opted in"
          : "",
    },
  ].filter((item) => {
    if (Array.isArray(item.value)) {
      return item.value.length > 0;
    }

    return (
      item.value !== undefined &&
      item.value !== null &&
      String(item.value).trim() !== ""
    );
  });

  /* ==========================================
     AVATAR DISPLAY
  ========================================== */

  const displayAvatar = previewUrl || user?.avatar || "";

  const initials =
    `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`.toUpperCase() ||
    "U";

  /* ==========================================
     NO USER
  ========================================== */

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin" />

          <p className="text-gray-500 dark:text-slate-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  const PREFERENCE_OPTIONS = {
  userType: [
    { label: "Student / Learner", value: "student" },
    { label: "Career / Job Seeker", value: "career_seeker" },
    { label: "Developer / Tech Professional", value: "developer" },
    { label: "Partner / Affiliate / Collaborator", value: "partner" },
    { label: "Business Owner / Entrepreneur", value: "business_owner" },
    { label: "General User / Exploring", value: "general" },
  ],

  interests: [
    { label: "Web Development", value: "web_development" },
    { label: "Programming", value: "programming" },
    { label: "Online Courses & Certifications", value: "online_courses" },
    { label: "Books & Learning Resources", value: "books" },
    { label: "Website & Software Services", value: "software_services" },
    { label: "E-commerce Solutions", value: "ecommerce" },
    { label: "Mobile Apps & Custom Applications", value: "mobile_apps" },
    { label: "Job Opportunities", value: "jobs" },
    { label: "Internships", value: "internships" },
    { label: "Freelancing & Career Growth", value: "freelancing" },
    { label: "Community & Networking", value: "community" },
    { label: "Affiliate Marketing & Partnerships", value: "affiliate" },
    { label: "Artificial Intelligence", value: "ai" },
    { label: "UI/UX Design", value: "ui_ux" },
  ],

  otherInterest: [
    { label: "Technology", value: "technology" },
    { label: "Entrepreneurship", value: "entrepreneurship" },
    { label: "Digital Creativity", value: "digital_creativity" },
    { label: "Research & Innovation", value: "research" },
    { label: "Education", value: "education" },
    { label: "I'm still exploring", value: "not_sure" },
  ],

  discoverySource: [
    { label: "Google / Search Engine", value: "google" },
    { label: "YouTube", value: "youtube" },
    { label: "TikTok", value: "tiktok" },
    { label: "Instagram", value: "instagram" },
    { label: "Facebook", value: "facebook" },
    { label: "LinkedIn", value: "linkedin" },
    { label: "WhatsApp / Telegram", value: "whatsapp" },
    { label: "Friend / Family / Colleague", value: "friend" },
    { label: "Referral Link", value: "referral" },
    { label: "Online Community / Forum", value: "community" },
    { label: "Advertisement", value: "advertisement" },
    { label: "Event / Workshop / Training", value: "event" },
    { label: "Other", value: "other" },
    { label: "I don't remember", value: "unknown" },
  ],

  learningLevel: [
    { label: "Beginner", value: "beginner" },
    { label: "Intermediate", value: "intermediate" },
    { label: "Advanced", value: "advanced" },
    { label: "Still exploring", value: "exploring" },
  ],

  learningGoals: [
    { label: "HTML & CSS", value: "html_css" },
    { label: "JavaScript", value: "javascript" },
    { label: "React & Frontend Development", value: "react" },
    { label: "Backend Development", value: "backend" },
    { label: "Full-Stack Development", value: "fullstack" },
    { label: "UI/UX Design", value: "ui_ux" },
    { label: "Databases & APIs", value: "databases" },
    { label: "Python Programming", value: "python" },
    { label: "AI & Machine Learning", value: "ai" },
    { label: "Professional Certifications", value: "certification" },
    { label: "Building a Portfolio", value: "portfolio" },
  ],

  generalInterests: [
    { label: "Technology", value: "technology" },
    { label: "Entrepreneurship", value: "entrepreneurship" },
    { label: "Digital Creativity", value: "digital_creativity" },
    { label: "Research & Innovation", value: "research" },
    { label: "Education", value: "education" },
    { label: "I'm still exploring", value: "not_sure" },
  ],

  businessType: [
    { label: "Startup", value: "startup" },
    { label: "Small Business", value: "small_business" },
    { label: "Medium-Sized Business", value: "medium_business" },
    { label: "Large Enterprise", value: "enterprise" },
    { label: "E-commerce Business", value: "ecommerce" },
    { label: "Education / Training", value: "education" },
    { label: "Personal Brand", value: "personal_brand" },
    { label: "Nonprofit Organization", value: "nonprofit" },
    { label: "Other Business Type", value: "other" },
  ],

  businessNeeds: [
    { label: "Business Website", value: "business_website" },
    { label: "E-commerce Store", value: "ecommerce" },
    { label: "Web Application", value: "web_app" },
    { label: "Mobile Application", value: "mobile_app" },
    { label: "Business Automation", value: "automation" },
    { label: "Custom Software", value: "custom_software" },
    { label: "Website Maintenance", value: "maintenance" },
    { label: "Branding & Digital Design", value: "branding" },
    { label: "Digital Marketing", value: "marketing" },
    { label: "Technical Consultation", value: "consultation" },
  ],

  projectTimeline: [
    { label: "As soon as possible", value: "immediately" },
    { label: "Within one month", value: "within_month" },
    { label: "Within three months", value: "within_three_months" },
    { label: "Within six months", value: "within_six_months" },
    { label: "Just researching for now", value: "researching" },
  ],

  careerGoal: [
    { label: "Frontend Developer", value: "frontend_developer" },
    { label: "Backend Developer", value: "backend_developer" },
    { label: "Full-Stack Developer", value: "fullstack_developer" },
    { label: "Mobile App Developer", value: "mobile_developer" },
    { label: "UI/UX Designer", value: "ui_ux_designer" },
    { label: "Data Analyst", value: "data_analyst" },
    { label: "AI / Machine Learning Engineer", value: "ai_engineer" },
    { label: "Cybersecurity Professional", value: "cybersecurity" },
    { label: "Tech Entrepreneur", value: "tech_entrepreneur" },
    { label: "Other Technology Career", value: "other_tech" },
  ],

  experienceLevel: [
    { label: "No experience yet", value: "no_experience" },
    { label: "Entry-level", value: "entry_level" },
    { label: "Intermediate", value: "intermediate" },
    { label: "Experienced", value: "experienced" },
    { label: "Professional", value: "professional" },
  ],

  preferredOpportunities: [
    { label: "Full-Time Jobs", value: "full_time" },
    { label: "Part-Time Jobs", value: "part_time" },
    { label: "Remote Opportunities", value: "remote" },
    { label: "Onsite Opportunities", value: "onsite" },
    { label: "Hybrid Opportunities", value: "hybrid" },
    { label: "Internships", value: "internship" },
    { label: "Freelance Projects", value: "freelance" },
    { label: "Scholarships", value: "scholarships" },
    { label: "Mentorship", value: "mentorship" },
  ],

  techStack: [
    { label: "HTML", value: "html" },
    { label: "CSS", value: "css" },
    { label: "JavaScript", value: "javascript" },
    { label: "TypeScript", value: "typescript" },
    { label: "React", value: "react" },
    { label: "Angular", value: "angular" },
    { label: "Vue", value: "vue" },
    { label: "Tailwind CSS", value: "tailwind_css" },
    { label: "Node.js", value: "node_js" },
    { label: "Express.js", value: "express_js" },
    { label: "MongoDB", value: "mongodb" },
    { label: "SQL", value: "sql" },
    { label: "Python", value: "python" },
    { label: "Git & GitHub", value: "git_github" },
  ],

  collaborationInterests: [
    { label: "Affiliate Programme", value: "affiliate" },
    { label: "Business Partnership", value: "business" },
    { label: "Teaching / Training", value: "teaching" },
    { label: "Content Collaboration", value: "content" },
    { label: "Community Building", value: "community" },
    { label: "Technology Projects", value: "technology" },
    { label: "Open-Source Projects", value: "open_source" },
    { label: "Mentorship", value: "mentorship" },
  ],
};

const PreferenceSelect = ({
  label,
  name,
  value,
  options,
  onChange,
}) => (
  <label className="block space-y-2">
    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
      {label}
    </span>

    <select
      name={name}
      value={value || ""}
      onChange={onChange}
      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
    >
      <option value="">Select an option</option>

      {options.map((option) => {
        const item =
          typeof option === "string"
            ? { label: option, value: option }
            : option;

        return (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        );
      })}
    </select>
  </label>
);

const PreferenceCheckboxGroup = ({
  label,
  name,
  options,
  values = [],
  onChange,
}) => (
  <fieldset className="space-y-3">
    <legend className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
      {label}
    </legend>

    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {options.map((option) => {
        const item =
          typeof option === "string"
            ? { label: option, value: option }
            : option;

        const checked = values.includes(item.value);

        return (
          <label
            key={item.value}
            className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition ${
              checked
                ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40"
                : "border-slate-200 hover:border-blue-400 dark:border-slate-700"
            }`}
          >
            <input
              type="checkbox"
              name={name}
              value={item.value}
              checked={checked}
              onChange={(event) => {
                const nextValues = event.target.checked
                  ? [...new Set([...values, item.value])]
                  : values.filter((value) => value !== item.value);

                onChange(name, nextValues);
              }}
              className="h-4 w-4 shrink-0 accent-blue-600"
            />

            <span className="text-slate-700 dark:text-slate-200">
              {item.label}
            </span>
          </label>
        );
      })}
    </div>
  </fieldset>
);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
            Account
          </p>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                My Profile
              </h1>

              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Manage your personal information and account details.
              </p>
            </div>
          </div>
        </div>
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 sm:h-40" />
            <div className="px-1 pb-7 sm:px-5 lg:px-7">
              <div className="-mt-16 flex flex-col gap-5 sm:-mt-20 sm:flex-row sm:items-end sm:justify-between">
                {/* AVATAR */}
                <div className="flex items-end gap-4">
                  <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gray-100 text-3xl font-bold text-gray-600 shadow-md dark:border-gray-900 dark:bg-gray-800 dark:text-gray-300 sm:h-36 sm:w-36">
                    {displayAvatar ? (
                      <img
                        src={displayAvatar}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </div>
                  <div className="pb-2">
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {user.firstName} {user.lastName}
                      </h2>

                      {user.role === "admin" && (
                        <ShieldCheck className="h-5 w-5 text-blue-600" />
                      )}
                    </div>

                    <p className="mt-1 text-gray-500 dark:text-gray-400">
                      {user.role === "admin"
                        ? "Administrator"
                        : "KanuorieTech User"}
                    </p>
                  </div>
                </div>
              </div>

              {/* INFORMATION */}
              <div className="mt-10 grid gap-5 md:grid-cols-2">
                {/* EMAIL */}
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-950">
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-950">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Email Address
                      </p>
                      <p className="mt-1 break-all font-semibold text-gray-900 dark:text-white">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* PHONE */}

                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-950">
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-green-100 p-3 text-green-600 dark:bg-green-950">
                      <Phone className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Phone Number
                      </p>

                      <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                        {user.phone || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ROLE */}

                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-950">
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-purple-100 p-3 text-purple-600 dark:bg-purple-950">
                      <User className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Account Role
                      </p>

                      <p className="mt-1 font-semibold capitalize text-gray-900 dark:text-white">
                        {user.role || "user"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* STATUS */}

                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-950">
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-emerald-100 p-3 text-emerald-600 dark:bg-emerald-950">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Account Status
                      </p>

                      <p className="mt-1 font-semibold text-emerald-600">
                        Active
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* BIO */}
              <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-950">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  About Me
                </p>

                <p className="mt-2 whitespace-pre-wrap leading-7 text-gray-700 dark:text-gray-300">
                  {user.bio || "You haven't added a bio yet."}
                </p>
              </div>

              {/* REGISTRATION PREFERENCES */}
              {registrationDetails.length > 0 && (
                <section className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-950 sm:p-6">
                  <div className="mb-5">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Interests & Preferences
                    </h3>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      A summary of your registration preferences and interests.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {registrationDetails.map((item) => (
                      <div
                        key={item.label}
                        className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
                      >
                        <p className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                          {item.label}
                        </p>

                        {Array.isArray(item.value) ? (
                          <div className="flex flex-wrap gap-2">
                            {item.value.map((value) => (
                              <span
                                key={value}
                                className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                              >
                                {formatLabel(value)}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="break-words text-sm font-semibold text-gray-900 dark:text-white">
                            {formatLabel(String(item.value))}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            <button
              type="button"
              onClick={openEditModal}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
              <Edit3 className="h-4 w-4" />
              Edit Profile
            </button>
          </div>
        </div>
        {/* PROFILE STATISTICS */}
        <section className="mt-6">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Learning Overview
            </h3>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              A quick look at your learning activity on KanuorieTech.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: "Available Courses",
                value: stats.courses,
                href: "/courses",
                icon: BookOpen,
                color: "text-blue-600 bg-blue-100 dark:bg-blue-950",
              },
              {
                label: "Learning Resources",
                value: stats.learning,
                href: "/Learning",
                icon: BookOpen,
                color: "text-purple-600 bg-purple-100 dark:bg-purple-950",
              },
              {
                label: "Saved Resources",
                value: stats.saved,
                href: "/Learning",
                icon: Bookmark,
                color: "text-amber-600 bg-amber-100 dark:bg-amber-950",
              },
              {
                label: "Courses in Progress",
                value: stats.inProgress,
                href: "/courses",
                icon: Award,
                color: "text-green-600 bg-green-100 dark:bg-green-950",
              },
            ].map((stat) => {
              const Icon = stat.icon;

              return (
                <Link
                  key={stat.label}
                  to={stat.href}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {stat.label}
                    </span>

                    <span className={`rounded-xl p-2 ${stat.color}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>

                  <p className="mt-3 text-3xl font-extrabold text-gray-900 dark:text-white">
                    {statsLoading ? "—" : stat.value}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      </div>

      {/* ======================================
          QUICK ACCESS
      ====================================== */}

      <div className="mt-8 md:hidden">
        <div className="mb-4">
          {/* <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Quick Access
          </p> */}

          <h3 className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
            Your KanuorieTech
            <span className="text-blue-600"> Hub</span>
          </h3>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Quickly access your learning, certificates, community and account
            services.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {/* MY LEARNING */}

          <Link
            to="/Learning"
            className="group rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-700"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                <BookOpen className="h-5 w-5" />
              </div>

              <ArrowUpRight className="h-4 w-4 text-gray-400 transition group-hover:text-blue-600" />
            </div>

            <p className="mt-4 font-semibold text-gray-900 dark:text-white">
              My Learning
            </p>

            <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
              Continue your courses
            </p>
          </Link>

          {/* CERTIFICATES */}

          <Link
            to="/certificates"
            className="group rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-amber-700"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
                <Award className="h-5 w-5" />
              </div>

              <ArrowUpRight className="h-4 w-4 text-gray-400 transition group-hover:text-amber-600" />
            </div>

            <p className="mt-4 font-semibold text-gray-900 dark:text-white">
              Certificates
            </p>

            <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
              View your achievements
            </p>
          </Link>

          {/* SAVED RESOURCES */}

          <Link
            to="/Learning"
            className="group rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-purple-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-purple-700"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
                <Bookmark className="h-5 w-5" />
              </div>

              <ArrowUpRight className="h-4 w-4 text-gray-400 transition group-hover:text-purple-600" />
            </div>

            <p className="mt-4 font-semibold text-gray-900 dark:text-white">
              Saved Resources
            </p>

            <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
              Access saved materials
            </p>
          </Link>

          {/* COMMUNITY */}

          <Link
            to="/community"
            className="group rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-green-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-green-700"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600 dark:bg-green-950/60 dark:text-green-400">
                <Users className="h-5 w-5" />
              </div>

              <ArrowUpRight className="h-4 w-4 text-gray-400 transition group-hover:text-green-600" />
            </div>

            <p className="mt-4 font-semibold text-gray-900 dark:text-white">
              Community
            </p>

            <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
              Connect and discuss
            </p>
          </Link>

          {/* AFFILIATE */}

          <Link
            to="/affiliate"
            className="group rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-700"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                <Handshake className="h-5 w-5" />
              </div>

              <ArrowUpRight className="h-4 w-4 text-gray-400 transition group-hover:text-indigo-600" />
            </div>

            <p className="mt-4 font-semibold text-gray-900 dark:text-white">
              Affiliate
            </p>

            <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
              Manage your referrals
            </p>
          </Link>

          {/* ACCOUNTS & PAYMENTS */}

          <Link
            to="/payments"
            className="group rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-cyan-700"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100 text-cyan-600 dark:bg-cyan-950/60 dark:text-cyan-400">
                <CreditCard className="h-5 w-5" />
              </div>

              <ArrowUpRight className="h-4 w-4 text-gray-400 transition group-hover:text-cyan-600" />
            </div>

            <p className="mt-4 font-semibold text-gray-900 dark:text-white">
              Accounts & Payments
            </p>

            <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
              Manage payments and orders
            </p>
          </Link>
        </div>
      </div>

      {/* ========================================
          EDIT PROFILE MODAL
      ======================================== */}

      {isEditModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeEditModal();
            }
          }}
        >
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl dark:bg-gray-900">
            {/* MODAL HEADER */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-5 dark:border-gray-800 dark:bg-gray-900">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Edit Profile
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Update your personal information.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditModal}
                disabled={saving || uploadingAvatar}
                className="rounded-xl p-2 text-gray-500 dark:text-slate-400 transition hover: hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* MODAL BODY */}

            <div className="p-6">
              {/* ALERTS */}

              {errorMessage && (
                <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

                  <p>{errorMessage}</p>
                </div>
              )}

              {successMessage && (
                <div className="mb-5 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

                  <p>{successMessage}</p>
                </div>
              )}

              {/* =================================
                  AVATAR
              ================================= */}

              <div className="mb-7 flex flex-col items-center">
                <div className="relative">
                  <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-gray-100 bg-gray-100 text-2xl font-bold text-gray-500 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-300">
                    {displayAvatar ? (
                      <img
                        src={displayAvatar}
                        alt="Profile preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar || saving}
                    className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-blue-600 text-white shadow-md transition hover:bg-blue-700 disabled:opacity-50 dark:border-gray-900"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />

                <p className="mt-3 text-center text-xs text-gray-500 dark:text-slate-400">
                  JPG, PNG or WEBP. Maximum 5MB.
                </p>

                {selectedFile && (
                  <button
                    type="button"
                    onClick={handleAvatarUpload}
                    disabled={uploadingAvatar}
                    className="mt-3 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
                  >
                    {uploadingAvatar ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Camera className="h-4 w-4" />
                        Upload Photo
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* =================================
                  FORM
              ================================= */}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* NAME */}

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                    >
                      First Name
                    </label>

                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                    >
                      Last Name
                    </label>

                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                    />
                  </div>
                </div>

                {/* EMAIL */}

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                  />
                </div>

                {/* PHONE */}

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                  />
                </div>

                {/* BIO */}

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="bio"
                      className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
                    >
                      Bio
                    </label>

                    <span className="text-xs text-gray-400">
                      {formData.bio.length}/500
                    </span>
                  </div>

                  <textarea
                    id="bio"
                    name="bio"
                    rows={5}
                    maxLength={500}
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us a little about yourself..."
                    className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                  />
                </div>

                {/* REGISTRATION PREFERENCES */}

                <section className="space-y-5 border-t border-gray-200 pt-6 dark:border-gray-800">
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Your Preferences
                    </h3>

                    <PreferenceSelect
                      label="What best describes you?"
                      name="userType"
                      value={formData.userType}
                      options={PREFERENCE_OPTIONS.userType}
                      onChange={handleChange}
                    />

                    <PreferenceCheckboxGroup
                      label="What are you interested in?"
                      name="interests"
                      options={PREFERENCE_OPTIONS.interests}
                      values={formData.interests}
                      onChange={handlePreferenceArrayChange}
                    />

                    <PreferenceSelect
                      label="Other interests (optional)"
                      name="otherInterest"
                      value={formData.otherInterest}
                      options={PREFERENCE_OPTIONS.otherInterest}
                      onChange={handleChange}
                    />

                    {formData.userType === "general" && (
                      <PreferenceCheckboxGroup
                        label="What else interests you?"
                        name="generalInterests"
                        options={PREFERENCE_OPTIONS.generalInterests}
                        values={formData.generalInterests}
                        onChange={handlePreferenceArrayChange}
                      />
                    )}

                    <PreferenceSelect
                      label="How did you discover KanuorieTech?"
                      name="discoverySource"
                      value={formData.discoverySource}
                      options={PREFERENCE_OPTIONS.discoverySource}
                      onChange={handleChange}
                    />

                    {formData.discoverySource === "other" && (
                      <label className="block space-y-2">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                          Please specify your discovery source
                        </span>

                        <input
                          name="discoverySourceOther"
                          value={formData.discoverySourceOther}
                          onChange={handleChange}
                          placeholder="Enter your source"
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900"
                        />
                      </label>
                    )}

                    {formData.userType === "student" && <>
                    <PreferenceSelect
                      label="What is your learning level?"
                      name="learningLevel"
                      value={formData.learningLevel}
                      options={PREFERENCE_OPTIONS.learningLevel}
                      onChange={handleChange}
                    />

                    <PreferenceCheckboxGroup
                      label="What do you want to achieve?"
                      name="learningGoals"
                      options={PREFERENCE_OPTIONS.learningGoals}
                      values={formData.learningGoals}
                      onChange={handlePreferenceArrayChange}
                    />
                    </>}

                    {formData.userType === "business_owner" && <>
                    <PreferenceSelect
                      label="What type of business do you have?"
                      name="businessType"
                      value={formData.businessType}
                      options={PREFERENCE_OPTIONS.businessType}
                      onChange={handleChange}
                    />

                    <PreferenceCheckboxGroup
                      label="What services does your business need?"
                      name="businessNeeds"
                      options={PREFERENCE_OPTIONS.businessNeeds}
                      values={formData.businessNeeds}
                      onChange={handlePreferenceArrayChange}
                    />

                    <PreferenceSelect
                      label="When do you plan to start your project?"
                      name="projectTimeline"
                      value={formData.projectTimeline}
                      options={PREFERENCE_OPTIONS.projectTimeline}
                      onChange={handleChange}
                    />
                    </>}

                    {formData.userType === "career_seeker" && <>
                    <PreferenceSelect
                      label="What is your career goal?"
                      name="careerGoal"
                      value={formData.careerGoal}
                      options={PREFERENCE_OPTIONS.careerGoal}
                      onChange={handleChange}
                    />

                    <PreferenceSelect
                      label="How much experience do you have?"
                      name="experienceLevel"
                      value={formData.experienceLevel}
                      options={PREFERENCE_OPTIONS.experienceLevel}
                      onChange={handleChange}
                    />

                    <PreferenceCheckboxGroup
                      label="What opportunities interest you?"
                      name="preferredOpportunities"
                      options={PREFERENCE_OPTIONS.preferredOpportunities}
                      values={formData.preferredOpportunities}
                      onChange={handlePreferenceArrayChange}
                    />
                    </>}

                    {formData.userType === "developer" && <>
                    <PreferenceSelect
                      label="What is your experience level?"
                      name="experienceLevel"
                      value={formData.experienceLevel}
                      options={PREFERENCE_OPTIONS.experienceLevel}
                      onChange={handleChange}
                    />

                    <PreferenceCheckboxGroup
                      label="Which technologies do you use or want to learn?"
                      name="techStack"
                      options={PREFERENCE_OPTIONS.techStack}
                      values={formData.techStack}
                      onChange={handlePreferenceArrayChange}
                    />
                    </>}

                    {formData.userType === "partner" && (
                    <PreferenceCheckboxGroup
                      label="How would you like to collaborate?"
                      name="collaborationInterests"
                      options={PREFERENCE_OPTIONS.collaborationInterests}
                      values={formData.collaborationInterests}
                      onChange={handlePreferenceArrayChange}
                    />
                    )}

                    <label className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                      <input
                        type="checkbox"
                        checked={formData.marketingConsent}
                        onChange={(event) =>
                          setFormData((previous) => ({
                            ...previous,
                            marketingConsent: event.target.checked,
                          }))
                        }
                        className="mt-1 h-4 w-4 accent-blue-600"
                      />

                      <span className="text-sm text-slate-700 dark:text-slate-200">
                        I agree to receive KanuorieTech updates, learning resources, and
                        relevant opportunities.
                      </span>
                    </label>

                    {formData.userType === "business_owner" && (
                      <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm leading-6 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200">
                        {user?.userType === "business_owner"
                          ? "Your business service request has been sent to Admin. These details help the team understand your needs, pls note that our team will contact you through email soon."
                          : "Saving this profile as a business owner sends your selected services to Admin as a service request."}
                      </p>
                    )}
                  </div>
                </section>

                {/* ACTIONS */}

                <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end dark:border-gray-800">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    disabled={saving || uploadingAvatar}
                    className="rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving || uploadingAvatar || authLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


