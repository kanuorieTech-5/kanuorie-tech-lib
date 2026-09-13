import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import { Loader, Card, Button, SectionTitle } from "../common";

import { getBlogs } from "../../services";

export default function BlogPreview() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchFeaturedBlogs = async () => {
      try {
        // Ask the backend specifically for featured blogs
        const response = await getBlogs({
          featured: true,
          limit: 3,
        });

        /*
        ==========================================
        NORMALIZE API RESPONSE
        ==========================================

        Backend response:

        {
          success: true,
          data: {
            items: [...],
            pagination: {...}
          }
        }
        */

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

  if (loading) {
    return (
      <section className="py-20">
        <Loader />
      </section>
    );
  }

  return (
    <section className="bg-slate-900 py-24 text-gray-900 dark:bg-slate-900 dark:text-white">
      <div className="px-6">
        <SectionTitle
          Badge="Knowledge Hub"
          title="Featured Technology Insights"
          subtitle="Explore featured tutorials, company updates and industry insights from KanuorieTech."
        />

        {blogs.length === 0 ? (
          <p className="mt-12 text-center text-slate-400">
            Featured articles coming soon.
          </p>
        ) : (
          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {blogs.map((blog, index) => (
              <motion.div
                key={
                  blog._id ||
                  blog.id ||
                  blog.slug ||
                  `featured-blog-${index}`
                }
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.1,
                }}
                viewport={{
                  once: true,
                }}
              >
                <Card className="overflow-hidden border-white/10 bg-white/5 backdrop-blur-xl">
                  <img
                    src={
                      blog.coverImage ||
                      blog.image ||
                      "/images/blog-placeholder.png"
                    }
                    alt={blog.title || "KanuorieTech article"}
                    className="mb-5 h-56 w-full rounded-2xl object-cover"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src =
                        "/images/blog-placeholder.png";
                    }}
                  />

                  <div className="px-1">
                    {blog.category && (
                      <span className="mb-3 inline-block text-sm font-medium text-blue-400">
                        {blog.category}
                      </span>
                    )}

                    <h3 className="mb-4 text-xl font-bold text-white">
                      {blog.title}
                    </h3>

                    <p className="mb-6 leading-7 text-slate-400">
                      {blog.excerpt
                        ? blog.excerpt.slice(0, 120)
                        : "Read the latest insights from KanuorieTech."}
                      ...
                    </p>

                    <Link
                      to={`/blog/${blog.slug || blog._id || blog.id}`}
                    >
                      <Button>Read More</Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}