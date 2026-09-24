import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, BookOpen, CalendarDays } from "lucide-react";

import { Loader, Card, Button, SectionTitle } from "../common";

import { getBlogs } from "../../services";

export default function BlogPreview() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchFeaturedBlogs = async () => {
      try {
        const response = await getBlogs({
          featured: true,
          limit: 6,
        });

        const result = response?.data;

        const data = Array.isArray(result?.items)
          ? result.items
          : Array.isArray(result)
            ? result
            : Array.isArray(response?.items)
              ? response.items
              : Array.isArray(response?.blogs)
                ? response.blogs
                : [];

        if (mounted) {
          setBlogs(data);
          setActiveIndex(0);
        }
      } catch (error) {
        console.error("Failed to load featured blogs:", error);

        if (mounted) {
          setBlogs([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchFeaturedBlogs();

    return () => {
      mounted = false;
    };
  }, []);

  /*
  ==========================================
  AUTO PLAY
  ==========================================
  */

  useEffect(() => {
    if (blogs.length <= 1 || isPaused) {
      return;
    }

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % blogs.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [blogs.length, isPaused]);

  /*
  ==========================================
  NAVIGATION
  ==========================================
  */

  const goToPrevious = () => {
    setActiveIndex((current) =>
      current === 0 ? blogs.length - 1 : current - 1,
    );
  };

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % blogs.length);
  };

  /*
  ==========================================
  LOADING
  ==========================================
  */

  if (loading) {
    return (
      <section className="bg-slate-900 py-16">
        <Loader />
      </section>
    );
  }

  /*
  ==========================================
  SECTION
  ==========================================
  */

  return (
    <section className="relative overflow-hidden bg-slate-900 py-10 text-white sm:py-24 dark:bg-slate-900 dark:text-white">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="pointer-events-none absolute -right-40 bottom-10 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative mx-auto px-6 lg:px-8 text-center">
        {/* Header */}
        <SectionTitle
          Badge="Knowledge Hub"
          title="Ideas, Insights & Technology"
          subtitle="Explore practical tutorials, company updates, technology insights and stories from the KanuorieTech ecosystem."
        />

        {blogs.length === 0 ? (
          <div className="mt-12 flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
            <BookOpen className="h-10 w-10 text-cyan-400" />

            <p className="mt-4 text-slate-400">
              Featured articles coming soon.
            </p>
          </div>
        ) : (
          <div
            className="relative mt-14"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Carousel */}
            <div className="relative overflow-hidden rounded-[2rem]">
              <AnimatePresence mode="wait">
                {blogs.map(
                  (blog, index) =>
                    index === activeIndex && (
                      <motion.div
                        key={
                          blog._id ||
                          blog.id ||
                          blog.slug ||
                          `featured-blog-${index}`
                        }
                        initial={{
                          opacity: 0,
                          x: 60,
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                        }}
                        exit={{
                          opacity: 0,
                          x: -60,
                        }}
                        transition={{
                          duration: 0.45,
                          ease: "easeInOut",
                        }}
                      >
                        <Card className="overflow-hidden border-white/10 bg-white/[0.04] p-0 backdrop-blur-xl">
                          <div className="grid lg:grid-cols-2">
                            {/* Image */}
                            <div className="relative min-h-[280px] overflow-hidden sm:min-h-[380px] lg:min-h-[500px]">
                              <motion.img
                                initial={{ scale: 1.08 }}
                                animate={{ scale: 1 }}
                                transition={{
                                  duration: 0.8,
                                  ease: "easeOut",
                                }}
                                src={
                                  blog.coverImage ||
                                  blog.image ||
                                  "/images/blog-placeholder.png"
                                }
                                alt={
                                  blog.title || "KanuorieTech featured article"
                                }
                                className="absolute inset-0 h-full w-full object-cover"
                                onError={(event) => {
                                  event.currentTarget.onerror = null;
                                  event.currentTarget.src =
                                    "/images/blog-placeholder.png";
                                }}
                              />

                              {/* Image overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                              {/* Featured label */}
                              <div className="absolute left-5 top-5 rounded-full border border-white/20 bg-slate-950/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-cyan-300 backdrop-blur-md">
                                Featured Insight
                              </div>
                            </div>

                            {/* Content */}
                            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
                              {/* Category */}
                              {blog.category && (
                                <span className="text-sm font-semibold uppercase tracking-[0.15em] text-cyan-400">
                                  {blog.category}
                                </span>
                              )}

                              {/* Title */}
                              <h3 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                                {blog.title}
                              </h3>

                              {/* Excerpt */}
                              <p className="mt-6 max-w-xl text-base leading-8 text-slate-400 sm:text-lg">
                                {blog.excerpt
                                  ? blog.excerpt.slice(0, 220)
                                  : "Discover practical insights, ideas and perspectives from KanuorieTech."}
                                {blog.excerpt?.length > 220 ? "..." : ""}
                              </p>

                              {/* Meta */}
                              <div className="mt-7 flex flex-wrap items-center gap-5 text-sm text-slate-500">
                                {blog.createdAt && (
                                  <span className="flex items-center gap-2">
                                    <CalendarDays className="h-4 w-4 text-cyan-400" />

                                    {new Date(
                                      blog.createdAt,
                                    ).toLocaleDateString("en-NG", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </span>
                                )}

                                <span className="flex items-center gap-2">
                                  <BookOpen className="h-4 w-4 text-cyan-400" />
                                  KanuorieTech Knowledge Hub
                                </span>
                              </div>

                              {/* CTA */}
                              <div className="mt-9">
                                <Link
                                  to={`/blog/${
                                    blog.slug || blog._id || blog.id
                                  }`}
                                >
                                  <Button>
                                    Read Full Article
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ),
                )}
              </AnimatePresence>
            </div>

            {/* Controls */}
            {blogs.length > 1 && (
              <div className="mt-7 flex items-center justify-between">
                {/* Dots */}
                <div className="flex items-center gap-2">
                  {blogs.map((blog, index) => (
                    <button
                      key={blog._id || blog.id || blog.slug || `dot-${index}`}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      aria-label={`Go to article ${index + 1}`}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === activeIndex
                          ? "w-8 bg-cyan-400"
                          : "w-2 bg-white/20 hover:bg-white/40"
                      }`}
                    />
                  ))}
                </div>

                {/* Arrows */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={goToPrevious}
                    aria-label="Previous featured article"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-all duration-300 hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-cyan-300"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>

                  <button
                    type="button"
                    onClick={goToNext}
                    aria-label="Next featured article"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-all duration-300 hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-cyan-300"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* View all */}
        {blogs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <Link to="/blog">
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                Explore All Articles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
