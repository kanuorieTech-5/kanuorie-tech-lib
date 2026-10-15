import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getCourses } from "../api/courseApi";
import { getLearningResources } from "../api/LearningApi";
import { getProgress } from "../api/progressApi";
import { getSavedResources } from "../api/libraryApi";
import { getProducts } from "../api/productApi";
import { getServices } from "../api/servicesApi";

const EMPTY_DATA = {
  courses: [],
  learning: [],
  progress: [],
  saved: [],
  products: [],
  services: [],
};

function getArray(response, keys = []) {
  if (Array.isArray(response)) return response;

  const candidates = [
    response?.data,
    response?.data?.items,
    response?.data?.courses,
    response?.data?.resources,
    response?.data?.progress,
    response?.data?.savedResources,
    response?.items,
    response?.courses,
    response?.resources,
    response?.progress,
    response?.savedResources,
    response?.products,
    response?.services,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }

  for (const key of keys) {
    if (Array.isArray(response?.data?.[key])) return response.data[key];
    if (Array.isArray(response?.[key])) return response[key];
  }

  return [];
}

function getText(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) =>
        typeof item === "string"
          ? item
          : item?.name || item?.title || item?.label || "",
      )
      .filter(Boolean)
      .join(" ");
  }

  if (value && typeof value === "object") {
    return Object.values(value).filter((item) => typeof item === "string").join(" ");
  }

  return String(value || "");
}

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getItemText(item) {
  return normalizeText(
    [
      item?.title,
      item?.name,
      item?.description,
      item?.shortDescription,
      item?.summary,
      item?.category,
      item?.level,
      item?.difficulty,
      item?.experienceLevel,
      item?.tags,
      item?.interests,
      item?.skills,
      item?.techStack,
      item?.technologies,
      item?.type,
      item?.learningGoals,
      item?.businessNeeds,
      item?.careerGoal,
    ]
      .map(getText)
      .join(" "),
  );
}

function getPreferences(user) {
  const fields = [
    user?.interests,
    user?.generalInterests,
    user?.learningGoals,
    user?.businessNeeds,
    user?.preferredOpportunities,
    user?.collaborationInterests,
    user?.techStack,
    user?.careerGoal,
    user?.userType,
    user?.learningLevel,
    user?.experienceLevel,
    user?.businessType,
    user?.projectTimeline,
    user?.discoverySource,
    user?.otherInterest,
  ];

  return fields
    .flatMap((value) => {
      if (Array.isArray(value)) return value;

      // The backend stores techStack as a comma-separated string.
      if (typeof value === "string" && value.includes(",")) {
        return value.split(",");
      }

      return value ? [value] : [];
    })
    .map((value) =>
      normalizeText(
        typeof value === "object"
          ? value?.name || value?.label || value?.value || ""
          : value,
      ),
    )
  .filter(Boolean);
}

const PREFERENCE_ALIASES = {
  "web development": [
    "frontend",
    "backend",
    "full stack",
    "html",
    "css",
    "javascript",
    "react",
    "angular",
    "web design",
  ],
  programming: [
    "coding",
    "javascript",
    "python",
    "java",
    "software development",
    "algorithms",
  ],
  "online courses": [
    "course",
    "courses",
    "tutorial",
    "lessons",
    "learning",
  ],
  books: [
    "ebook",
    "ebooks",
    "reading",
    "digital books",
  ],
  ecommerce: [
    "e commerce",
    "online store",
    "online shopping",
    "bookstore",
    "payment integration",
  ],
  "mobile apps": [
    "mobile development",
    "android",
    "ios",
    "react native",
    "flutter",
  ],
  "software services": [
    "web design",
    "web development",
    "software development",
    "app development",
    "website development",
  ],
  freelancing: [
    "freelance",
    "remote work",
    "client projects",
    "contract work",
  ],
  internships: [
    "internship",
    "intern",
    "entry level",
    "work experience",
  ],
  jobs: [
    "job opportunities",
    "employment",
    "career",
    "hiring",
    "vacancies",
  ],
  community: [
    "networking",
    "discussion",
    "collaboration",
    "developers",
  ],
  developer: [
    "programming",
    "coding",
    "software development",
    "web development",
  ],
  student: [
    "learning",
    "education",
    "courses",
    "tutorial",
  ],
  "business owner": [
    "business",
    "ecommerce",
    "website development",
    "digital marketing",
    "business software",
  ],
  "career seeker": [
    "career",
    "jobs",
    "internships",
    "resume",
    "interview preparation",
  ],
  partner: [
    "partnership",
    "collaboration",
    "affiliate",
    "community",
  ],
};

function rankItems(items, preferences) {
  if (!preferences.length) return items;

  return items
    .map((item, index) => {
      const text = getItemText(item);

      const score = preferences.reduce((total, preference) => {
        if (!preference || preference.length < 2) {
          return total;
        }

        // A direct match receives the strongest score.
        if (text.includes(preference)) {
          return total + 4;
        }

        // Related terms help match relevant content with different tags.
        const aliases = PREFERENCE_ALIASES[preference] || [];

        const hasRelatedMatch = aliases.some((alias) =>
          text.includes(normalizeText(alias)),
        );

        return total + (hasRelatedMatch ? 2 : 0);
      }, 0);

      return { item, index, score };
    })
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ item }) => item);
}

function getId(item) {
  return item?._id || item?.id || item?.slug;
}

function getTitle(item) {
  return item?.title || item?.name || "Untitled resource";
}

function getDescription(item) {
  return (
    item?.shortDescription ||
    item?.description ||
    item?.summary ||
    "Explore this resource on KanuorieTech."
  );
}

function getCourseLevel(item) {
  return item?.level || item?.difficulty || item?.experienceLevel || "";
}

function getProgressValue(item) {
  const value = Number(
    item?.percentage ??
      item?.progress ??
      item?.progressPercentage ??
      0,
  );

  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

function getItemLink(item, type) {
  const id = getId(item);

  if (type === "course") return id ? `/courses/${id}` : "/courses";
  if (type === "learning") return id ? `/Learning/${id}` : "/Learning";
  if (type === "product") return id ? `/products/${id}` : "/products";
  if (type === "service") return id ? `/services/${id}` : "/services";

  return "/library";
}

function SectionHeading({ title, link, linkText = "View all" }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
        {title}
      </h2>

      <Link
        to={link}
        className="text-sm font-semibold text-blue-600 transition hover:text-blue-700 dark:text-blue-400"
      >
        {linkText} →
      </Link>
    </div>
  );
}

function ResourceCard({ item, type }) {
  const title = getTitle(item);
  const level = getCourseLevel(item);
  const image = item?.thumbnail || item?.coverImage || item?.image;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      {image && (
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="h-40 w-full object-cover"
        />
      )}

      <div className="flex flex-1 flex-col p-5">
        {item?.category && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
            {getText(item.category)}
          </p>
        )}

        <h3 className="font-bold text-slate-900 dark:text-white">
          {title}
        </h3>

        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
          {getDescription(item)}
        </p>

        {level && (
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            Level: {level}
          </p>
        )}

        <Link
          to={getItemLink(item, type)}
          className="mt-4 inline-flex items-center font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          Explore resource →
        </Link>
      </div>
    </article>
  );
}

function EmptySection({ children }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
      {children}
    </div>
  );
}

export default function Dashboard() {
  const { user, loadUser } = useAuth();

  const [data, setData] = useState(EMPTY_DATA);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      setLoading(true);

      // Refresh the saved user preferences without blocking dashboard content.
      try {
        await loadUser();
      } catch (error) {
        console.warn("Unable to refresh profile preferences:", error);
      }

      const requests = [
        ["courses", getCourses],
        ["learning", getLearningResources],
        ["progress", getProgress],
        ["saved", getSavedResources],
        ["products", getProducts],
        ["services", getServices],
      ];

      const results = await Promise.allSettled(
        requests.map(([, request]) => request()),
      );

      if (!active) return;

      const nextData = { ...EMPTY_DATA };
      const failedSections = [];

      results.forEach((result, index) => {
        const key = requests[index][0];

        if (result.status === "fulfilled") {
          nextData[key] = getArray(result.value, [key]);
        } else {
          failedSections.push(key);
          console.warn(`Dashboard ${key} request failed:`, result.reason);
        }
      });

      setData(nextData);
      setErrors(failedSections);
      setLoading(false);
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, [loadUser]);

  const preferences = useMemo(() => getPreferences(user), [user]);

  const recommendedCourses = useMemo(
    () => rankItems(data.courses, preferences).slice(0, 3),
    [data.courses, preferences],
  );

  const recommendedLearning = useMemo(
    () => rankItems(data.learning, preferences).slice(0, 3),
    [data.learning, preferences],
  );

  const recommendedProducts = useMemo(
    () => rankItems(data.products, preferences).slice(0, 3),
    [data.products, preferences],
  );

  const recommendedServices = useMemo(
    () => rankItems(data.services, preferences).slice(0, 3),
    [data.services, preferences],
  );

  const firstName =
    user?.firstName ||
    user?.firstname ||
    user?.name?.split(" ")?.[0] ||
    "there";

  const displayProgress = data.progress.filter(
    (item) => getProgressValue(item) > 0,
  );

  const formatPreference = (value) =>
    String(value || "")
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());

  const profileGroups = [
    {
      label: "Account type",
      values: user?.userType ? [user.userType] : [],
    },
    {
      label: "Interests",
      values: user?.interests || [],
    },
    {
      label: "General interests",
      values: user?.generalInterests || [],
    },
    {
      label: "Learning goals",
      values: user?.learningGoals || [],
    },
    {
      label: "Learning level",
      values: user?.learningLevel ? [user.learningLevel] : [],
    },
    {
      label: "Career goal",
      values: user?.careerGoal ? [user.careerGoal] : [],
    },
    {
      label: "Experience level",
      values: user?.experienceLevel ? [user.experienceLevel] : [],
    },
    {
      label: "Technology stack",
      values: Array.isArray(user?.techStack)
        ? user.techStack
        : String(user?.techStack || "")
            .split(",")
            .filter(Boolean),
    },
    {
      label: "Preferred opportunities",
      values: user?.preferredOpportunities || [],
    },
    {
      label: "Business needs",
      values: user?.businessNeeds || [],
    },
    {
      label: "Collaboration interests",
      values: user?.collaborationInterests || [],
    },
  ].filter((group) => group.values.length > 0);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 pb-10">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 p-6 text-white shadow-lg sm:p-9">
        <p className="text-sm font-medium text-blue-100">
          YOUR KANUORIETECH SPACE
        </p>

        <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Welcome back, {firstName}!
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
          Pick up where you left off, discover resources that fit your goals,
          and keep building your future with technology.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/profile"
            className="rounded-xl border border-white/40 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            My profile
          </Link>
        </div>
      </section>

      

      {errors.length > 0 && (
        <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
          Some dashboard sections couldn't be loaded. Other available sections
          are still shown. Refresh the page to try again.
        </p>
      )}

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
  <div className="flex flex-wrap items-start justify-between gap-4">
    <div>
      <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
        PERSONALIZED EXPERIENCE
      </p>

      <h2 className="mt-2 text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
        Your profile preferences
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
        Your saved interests, learning goals, and career preferences help
        personalize your KanuorieTech experience.
      </p>
    </div>

    <Link
      to="/profile"
      className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
    >
      Edit profile
    </Link>
  </div>

  {profileGroups.length > 0 ? (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {profileGroups.map((group) => (
        <div
          key={group.label}
          className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700"
        >
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {group.label}
          </h3>

          <div className="mt-3 flex flex-wrap gap-2">
            {group.values.map((value, index) => (
              <span
                key={`${group.label}-${value}-${index}`}
                className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
              >
                {formatPreference(value)}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="mt-6 rounded-2xl border border-dashed border-slate-300 p-6 text-center dark:border-slate-700">
      <p className="font-semibold text-slate-800 dark:text-white">
        Your preferences haven't been added yet.
      </p>

      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        Complete your profile to personalize your recommendations.
      </p>

      <Link
        to="/profile"
        className="mt-4 inline-block font-semibold text-blue-600 dark:text-blue-400"
      >
        Complete your profile →
      </Link>
    </div>
  )}
</section>

<section>
        <SectionHeading title="Services for your goals" link="/services" />

        {loading ? (
          <EmptySection>Loading services…</EmptySection>
        ) : recommendedServices.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {recommendedServices.map((item, index) => (
              <ResourceCard
                key={getId(item) || `${getTitle(item)}-${index}`}
                item={item}
                type="service"
              />
            ))}
          </div>
        ) : (
          <EmptySection>
            No services are available to recommend right now.
          </EmptySection>
        )}
      </section>

      <section>
        <SectionHeading title="Recommended Courses for you" link="/courses" />

        <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
          {preferences.length
            ? "Recommendations are prioritized using your saved interests, goals, and experience."
            : "Explore available content. Add your interests and goals to your profile for more personalized recommendations."}
        </p>

        {loading ? (
          <EmptySection>Loading recommended courses…</EmptySection>
        ) : recommendedCourses.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {recommendedCourses.map((item, index) => (
              <ResourceCard
                key={getId(item) || `${getTitle(item)}-${index}`}
                item={item}
                type="course"
              />
            ))}
          </div>
        ) : (
          <EmptySection>
            No courses are available to recommend right now. Visit the courses
            page to check the current catalog.
          </EmptySection>
        )}
      </section>

      <section>
        <SectionHeading
          title="Continue your learning"
          link="/courses"
          linkText="Browse courses"
        />

        {loading ? (
          <EmptySection>Loading your learning progress…</EmptySection>
        ) : displayProgress.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {displayProgress.slice(0, 4).map((item, index) => {
              const courseId =
                item?.course?._id ||
                item?.course?.id ||
                item?.courseId ||
                item?._id;

              const percentage = getProgressValue(item);

              return (
                <article
                  key={getId(item) || `${courseId || "progress"}-${index}`}
                  className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
                >
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    {getTitle(item?.course || item)}
                  </h3>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    {percentage}% complete
                  </p>

                  <Link
                    to={courseId ? `/courses/${courseId}` : "/courses"}
                    className="mt-3 inline-block text-sm font-semibold text-blue-600 dark:text-blue-400"
                  >
                    Continue course →
                  </Link>
                </article>
              );
            })}
          </div>
        ) : (
          <EmptySection>
            You don't have any recorded course progress yet. Enroll in a course
            to start learning and track your progress here.
          </EmptySection>
        )}
      </section>

      <section>
        <SectionHeading
          title="Learning resources"
          link="/Learning"
          linkText="Explore library"
        />

        {loading ? (
          <EmptySection>Loading learning resources…</EmptySection>
        ) : recommendedLearning.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {recommendedLearning.map((item, index) => (
              <ResourceCard
                key={getId(item) || `${getTitle(item)}-${index}`}
                item={item}
                type="learning"
              />
            ))}
          </div>
        ) : (
          <EmptySection>
            No learning resources are available to recommend right now.
          </EmptySection>
        )}
      </section>

      <section>
        <SectionHeading
          title="Your saved resources"
          link="/library"
        />

        {loading ? (
          <EmptySection>Loading your saved resources…</EmptySection>
        ) : data.saved.length ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {data.saved.slice(0, 6).map((entry, index) => {
              const resource = entry?.resource || entry;
              const title = getTitle(resource);

              return (
                <article
                  key={getId(entry) || `${title}-${index}`}
                  className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
                >
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {title}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
                    {getDescription(resource)}
                  </p>

                  <Link
                    to="/library"
                    className="mt-3 inline-block text-sm font-semibold text-blue-600 dark:text-blue-400"
                  >
                    Open library →
                  </Link>
                </article>
              );
            })}
          </div>
        ) : (
          <EmptySection>
            Your saved resources will appear here when you save items from the
            library.
          </EmptySection>
        )}
      </section>

      <section>
        <SectionHeading title="Products and tools" link="/products" />

        {loading ? (
          <EmptySection>Loading products…</EmptySection>
        ) : recommendedProducts.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {recommendedProducts.map((item, index) => (
              <ResourceCard
                key={getId(item) || `${getTitle(item)}-${index}`}
                item={item}
                type="product"
              />
            ))}
          </div>
        ) : (
          <EmptySection>
            There are no products to recommend right now.
          </EmptySection>
        )}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Link
          to="/careers"
          className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
        >
          <h3 className="font-bold text-slate-900 dark:text-white">
            Careers and opportunities
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Explore the opportunities currently listed on KanuorieTech.
          </p>
          <span className="mt-4 inline-block text-sm font-semibold text-blue-600 dark:text-blue-400">
            Explore careers →
          </span>
        </Link>

        <Link
          to="/community"
          className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
        >
          <h3 className="font-bold text-slate-900 dark:text-white">
            Community and collaboration
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Connect with the KanuorieTech community and explore collaboration.
          </p>
          <span className="mt-4 inline-block text-sm font-semibold text-blue-600 dark:text-blue-400">
            Visit community →
          </span>
        </Link>

        <Link
          to="/profile"
          className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
        >
          <h3 className="font-bold text-slate-900 dark:text-white">
            Improve your recommendations
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Update your interests, career goals, learning level, and business
            needs.
          </p>
          <span className="mt-4 inline-block text-sm font-semibold text-blue-600 dark:text-blue-400">
            Update profile →
          </span>
        </Link>
      </section>
    </div>
  );
}