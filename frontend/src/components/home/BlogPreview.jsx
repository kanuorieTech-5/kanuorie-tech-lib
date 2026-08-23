import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
  Loader,
  Card,
  Button,
  SectionTitle,
} from "../common";

import { getBlogs } from "../../services";

export default function BlogPreview() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchBlogs = async () => {
      try {
        const response = await getBlogs();

        /*
        ==========================================
        NORMALIZE API RESPONSE
        ==========================================

        Possible API responses:

        1. [...]
        2. { data: [...] }
        3. { data: { blogs: [...] } }
        4. { blogs: [...] }
        */

        const data = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.data?.blogs)
          ? response.data.blogs
          : Array.isArray(response?.blogs)
          ? response.blogs
          : [];

        if (mounted) {
          setBlogs(data);
        }
      } catch (error) {
        console.error(
          "Failed to load blogs:",
          error
        );

        if (mounted) {
          setBlogs([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchBlogs();

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
    <section className="bg-slate-950 py-24">
      <div className="px-6">

        <SectionTitle
          Badge="Knowledge Hub"
          title="Latest Technology Insights"
          subtitle="Explore tutorials, company updates and industry insights from KanuorieTech."
        />

        {blogs.length === 0 ? (
          <p
            className="
              mt-12
              text-center
              text-slate-400
            "
          >
            Articles coming soon.
          </p>
        ) : (
          <div
            className="
              mt-16
              grid
              gap-8
              lg:grid-cols-3
            "
          >
            {blogs.slice(0, 3).map((blog, index) => (
              <motion.div
                key={
                  blog._id ||
                  blog.id ||
                  blog.slug ||
                  `blog-${index}`
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
                <Card
                  className="
                    overflow-hidden
                    border-white/10
                    bg-white/5
                    backdrop-blur-xl
                  "
                >
                  <img
                    src={
                      blog.image ||
                      blog.coverImage ||
                      "/images/blog-placeholder.png"
                    }
                    alt={
                      blog.title ||
                      "KanuorieTech article"
                    }
                    className="
                      mb-5
                      h-56
                      w-full
                      rounded-2xl
                      object-cover
                    "
                  />

                  <h3
                    className="
                      mb-4
                      text-xl
                      font-bold
                      text-white
                    "
                  >
                    {blog.title}
                  </h3>

                  <p
                    className="
                      mb-6
                      leading-7
                      text-slate-400
                    "
                  >
                    {blog.excerpt
                      ? blog.excerpt.slice(0, 120)
                      : "Read the latest insights from KanuorieTech."}
                    ...
                  </p>

                  <Link
                    to={`/blog/${
                      blog.slug || blog._id || blog.id
                    }`}
                  >
                    <Button>
                      Read More
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}