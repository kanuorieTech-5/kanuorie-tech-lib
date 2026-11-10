
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Palette,
  PenTool,
  Code2,
  Server,
  Workflow,
  BarChart3,
  ShieldCheck,
  Wrench,
  Layers,
  FlaskConical,
  Brain,
  Database,
  Gauge,
  Accessibility,
  Languages,
  Bot,
  Blocks,
  Smartphone,
  Search,
  ArrowRight,
  BookOpen,
  LoaderCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { getLearningPaths } from "../api/courseApi";

const categories = [
  {
    name: "General Computer Science",
    description: "Learn the fundamentals of computing.",
    aliases: ["computerscience", "generalcs", "cs"],
    icon: Code2,
  },
  {
    name: "Graphics Design",
    description: "Create professional visual designs.",
    aliases: ["graphicsdesign", "graphicdesign"],
    icon: Palette,
  },
  {
    name: "UI/UX Design",
    description: "Design intuitive digital experiences.",
    aliases: ["uiux", "userexperience", "userinterfacedesign"],
    icon: PenTool,
  },
  {
    name: "Frontend Development",
    description: "Build modern web applications.",
    aliases: ["frontend", "webfrontend"],
    icon: Code2,
  },
  {
    name: "Backend Development",
    description: "Build powerful server-side systems.",
    aliases: ["backend", "serverdevelopment"],
    icon: Server,
  },
  {
    name: "DevOps",
    description: "Automate and deploy applications.",
    aliases: ["devops"],
    icon: Workflow,
  },
  {
    name: "Data Science",
    description: "Discover insights using data.",
    aliases: ["datascience"],
    icon: BarChart3,
  },
  {
    name: "Data Analysis",
    description: "Transform data into insights.",
    aliases: ["dataanalysis"],
    icon: BarChart3,
  },
  {
    name: "Cyber Security",
    description: "Protect systems and applications.",
    aliases: ["security", "cybersecurity"],
    icon: ShieldCheck,
  },
  {
    name: "Tools",
    description: "Master essential industry tools.",
    aliases: ["tools", "developertools"],
    icon: Wrench,
  },
  {
    name: "Architecture",
    description: "Design scalable software systems.",
    aliases: ["architecture", "softwarearchitecture"],
    icon: Layers,
  },
  {
    name: "Testing",
    description: "Build reliable software.",
    aliases: ["testing", "softwaretesting", "qualityassurance"],
    icon: FlaskConical,
  },
  {
    name: "AI/ML",
    description: "Build intelligent machine learning systems.",
    aliases: ["aiml", "machinelearning"],
    icon: Brain,
  },
  {
    name: "Database",
    description: "Manage and optimize data systems.",
    aliases: ["database", "databases"],
    icon: Database,
  },
  {
    name: "Performance Optimization",
    description: "Optimize software performance.",
    aliases: ["performance", "performanceoptimization"],
    icon: Gauge,
  },
  {
    name: "Accessibility",
    description: "Build inclusive digital products.",
    aliases: ["accessibility", "a11y"],
    icon: Accessibility,
  },
  {
    name: "Localization",
    description: "Create multilingual applications.",
    aliases: ["localization", "internationalization", "i18n"],
    icon: Languages,
  },
  {
    name: "AI",
    description: "Build practical AI-powered solutions.",
    aliases: ["ai", "artificialintelligence"],
    icon: Bot,
  },
  {
    name: "Blockchain",
    description: "Explore Web3 and decentralized systems.",
    aliases: ["blockchain", "web3"],
    icon: Blocks,
  },
  {
    name: "Mobile App Development",
    description: "Develop modern mobile applications.",
    aliases: ["mobile", "mobiledevelopment", "appdevelopment"],
    icon: Smartphone,
  },
  {
    name: "fullstack development",
    description: "Build complete web applications.",
    aliases: ["fullstack", "fullstackdevelopment"],
    icon: Code2,
  },
];

const normalize = (value = "") =>
  String(value).toLowerCase().replace(/[^a-z0-9]/g, "");

function getCategoryPaths(category, paths) {
  const aliases = category.aliases.map(normalize);

  return paths
    .map((path) => {
      const backendCategory = normalize(path.category);
      const backendTitle = normalize(path.title);
      const backendSlug = normalize(path.slug);

      let score = 0;

      if (aliases.includes(backendCategory)) {
        score = 100;
      } else if (
        aliases.includes(backendTitle) ||
        aliases.includes(backendSlug)
      ) {
        score = 80;
      } else if (
        aliases.some(
          (alias) =>
            alias.length >= 4 &&
            (backendTitle.startsWith(alias) ||
              backendSlug.startsWith(alias))
        )
      ) {
        score = 50;
      }

      return { path, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.path);
}

export default function Courses() {
  const navigate = useNavigate();

  const [learningPaths, setLearningPaths] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadLearningPaths() {
      try {
        const response = await getLearningPaths();

        if (active) {
          setLearningPaths(
            Array.isArray(response?.data) ? response.data : []
          );
          setLoadError(false);
        }
      } catch (error) {
        console.error("Failed to load learning pathways:", error);

        if (active) {
          setLoadError(true);
          toast.error("Unable to load pathway information.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadLearningPaths();

    return () => {
      active = false;
    };
  }, []);

  const filteredCategories = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return categories;

    return categories.filter(
      (category) =>
        category.name.toLowerCase().includes(term) ||
        category.description.toLowerCase().includes(term)
    );
  }, [search]);

  const handleExplorePathway = (category) => {
    const matchingPaths = getCategoryPaths(category, learningPaths);

    if (!matchingPaths.length) {
      toast("This learning pathway is being prepared. Check back soon!");
      return;
    }

    // Backend results are already ordered by displayOrder.
    const selectedPath = matchingPaths[0];

    navigate(`/courses/pathways/${selectedPath.slug}`);
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">

      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-6 py-20 text-white sm:py-28">

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] bg-[size:45px_45px]" />

        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-yellow-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-5xl text-center">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-5 py-2 text-sm font-semibold text-blue-300"
          >
            <BookOpen size={17} />
            KANUORIETECH LEARNING HUB
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-8 text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-7xl"
          >
            Explore Professional
            <span className="block bg-gradient-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent">
              Learning Pathways
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg"
          >
            Choose your career path. Master practical skills. Earn
            professional certifications.
          </motion.p>

          {/* SEARCH */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mx-auto mt-10 max-w-2xl"
          >
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white px-5 py-4 shadow-2xl shadow-black/20">

              <Search className="shrink-0 text-slate-400" size={21} />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search learning categories..."
                aria-label="Search learning categories"
                className="w-full border-0 bg-transparent text-slate-900 outline-none placeholder:text-slate-400 focus:ring-0"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                >
                  Clear
                </button>
              )}
            </div>
          </motion.div>

        </div>
      </section>

      {/* CATEGORY GRID */}
      <section className="px-5 py-14 sm:px-8 sm:py-20 lg:px-12">

        <div className="mx-auto">

          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                Find your direction
              </p>

              <h2 className="mt-3 text-3xl font-black text-slate-900 dark:text-white sm:text-4xl">
                Explore Learning Categories
              </h2>

              <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
                Discover structured learning experiences designed to
                help you build practical skills and grow professionally.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              {filteredCategories.length} of {categories.length} categories
            </div>

          </div>

          {loadError && (
            <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
              Pathway information could not be loaded. Categories remain
              available, but pathway details may be temporarily unavailable.
            </div>
          )}

          {filteredCategories.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

              {filteredCategories.map((category, index) => {
                const Icon = category.icon;
                const matchingPaths = getCategoryPaths(
                  category,
                  learningPaths
                );

                const courseCount = matchingPaths.reduce(
                  (total, path) =>
                    total +
                    Number(
                      path.publishedCourseCount ?? path.count ?? 0
                    ),
                  0
                );

                const hasPathway = matchingPaths.length > 0;
                const canExplore = !loading && !loadError && hasPathway;
                return (
                  <motion.article
                    key={category.name}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{
                      duration: 0.4,
                      delay: (index % 4) * 0.06,
                    }}
                    className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700"
                  >

                    <div className="flex items-start justify-between gap-3">

                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white dark:bg-blue-950/60 dark:text-blue-400 dark:group-hover:bg-blue-600 dark:group-hover:text-white">
                        <Icon size={27} strokeWidth={1.8} />
                      </div>

                      {loading ? (
                        <LoaderCircle
                          size={17}
                          className="animate-spin text-slate-400"
                        />
                      ) : loadError ? (
                        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
                          Unavailable
                        </span>
                      ) : hasPathway ? (
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                          Available
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          Coming soon
                        </span>
                      )}

                    </div>

                    <h3 className="mt-6 text-xl font-extrabold text-slate-900 dark:text-white">
                      {category.name}
                    </h3>

                    <p className="mt-3 min-h-12 text-sm leading-6 text-slate-600 dark:text-slate-400">
                      {category.description}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400">

                      <span>
                        {matchingPaths.length}{" "}
                        {matchingPaths.length === 1
                          ? "pathway"
                          : "pathways"}
                      </span>

                      <span>
                        {courseCount}{" "}
                        {courseCount === 1 ? "course" : "courses"}
                      </span>

                    </div>

                    <div className="mt-auto pt-6">

                      <button
                        type="button"
                        onClick={() => handleExplorePathway(category)}
                        disabled={!canExplore}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 dark:disabled:bg-slate-800 dark:disabled:text-slate-500"
                      >
                        Explore pathway
                        <ArrowRight size={17} />
                      </button>

                    </div>

                  </motion.article>
                );
              })}

            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center dark:border-slate-800 dark:bg-slate-900">

              <Search className="mx-auto text-slate-400" size={40} />

              <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
                No learning categories found
              </h3>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Try searching with a different category name.
              </p>

              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-6 font-semibold text-blue-600 hover:text-blue-700"
              >
                Clear search
              </button>

            </div>
          )}

        </div>
      </section>

      {/* BOTTOM CTA */}
        <section
          id="learning-categories"
          className="px-5 py-14 sm:px-8 sm:py-20 lg:px-12"
        >        
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-slate-950 px-6 py-12 text-center text-white sm:px-12 sm:py-16">

          <h2 className="text-3xl font-black sm:text-4xl">
            Your Next Career Chapter Starts Here.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-300">
            Choose a learning pathway, develop practical skills, complete
            real-world projects, and work towards professional recognition.
          </p>

          <a
            href="#learning-categories"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-7 py-3.5 font-bold text-slate-950 transition hover:bg-yellow-300"
          >
            Explore Categories
            <ArrowRight size={18} />
          </a>

        </div>
      </section>

    </main>
  );
}
