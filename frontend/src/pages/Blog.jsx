import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  Card,
  Button,
  Loader,
  Pagination,
  SectionTitle,
} from "../components/common";

import {
  SearchBar,
} from "../components/layout";

import {
  Newsletter,
  CTA,
} from "../components/home";

import { CalendarDays, ArrowRight } from "lucide-react";

import { getBlogs } from "../services";

const POSTS_PER_PAGE = 9;

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await getBlogs();
        setBlogs(res.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogs();
  }, []);

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) =>
      blog.title?.toLowerCase().includes(search.toLowerCase())
    );
  }, [blogs, search]);

  const featuredPost = filteredBlogs[0];

  const currentBlogs = filteredBlogs.slice(
    1 + (page - 1) * POSTS_PER_PAGE,
    1 + page * POSTS_PER_PAGE
  );

  const totalPages = Math.ceil(
    Math.max(filteredBlogs.length - 1, 0) / POSTS_PER_PAGE
  );

  if (loading) return <Loader />;

  return (
    <>
      {/* Hero */}

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 py-28 text-white">

        <div className="mx-auto max-w-5xl px-6 text-center">

          <span className="rounded-full bg-blue-500/10 px-5 py-2 text-sm font-medium text-blue-400">
            Tech Insights
          </span>

          <h1 className="mt-8 text-5xl font-black lg:text-7xl">
            KanuorieTech Blog
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-300">
            Discover practical programming tutorials,
            software engineering tips, industry news,
            career advice and technology insights.
          </p>

        </div>

      </section>

      {/* Search */}

      <section className="bg-white py-14">

        <div className="mx-auto max-w-7xl px-6">

          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search articles..."
          />

        </div>

      </section>

      {/* Featured */}

      {featuredPost && (

        <section className="bg-slate-50 py-20">

          <div className="mx-auto max-w-7xl px-6">

            <SectionTitle
              title="Featured Article"
              subtitle="Editor's pick"
            />

            <Card className="mt-12 overflow-hidden lg:grid lg:grid-cols-2">

              <img
                src={featuredPost.image}
                alt={featuredPost.title}
                className="h-full w-full object-cover"
              />

              <div className="p-10">

                <div className="mb-6 flex items-center gap-3 text-blue-600">

                  <CalendarDays size={18} />

                  <span>
                    {featuredPost.createdAt?.slice(0,10)}
                  </span>

                </div>

                <h2 className="text-4xl font-bold">

                  {featuredPost.title}

                </h2>

                <p className="mt-6 leading-8 text-slate-600">

                  {featuredPost.excerpt}

                </p>

                <Link
                  to={`/blog/${featuredPost._id}`}
                  className="mt-10 inline-block"
                >

                  <Button>

                    Read Article

                    <ArrowRight className="ml-2" size={18} />

                  </Button>

                </Link>

              </div>

            </Card>

          </div>

        </section>

      )}

      {/* Latest Articles */}

      <section className="py-24">

        <div className="mx-auto max-w-7xl px-6">

          <SectionTitle
            title="Latest Articles"
            subtitle="Stay updated with technology"
          />

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

            {currentBlogs.map((blog) => (

              <Card
                key={blog._id}
                hover
              >

                <img
                  src={blog.image}
                  alt={blog.title}
                  className="mb-5 h-56 w-full rounded-xl object-cover"
                />

                <h3 className="mb-3 text-2xl font-bold">

                  {blog.title}

                </h3>

                <p className="mb-6 text-slate-600">

                  {blog.excerpt?.slice(0,120)}...

                </p>

                <Link to={`/blog/${blog._id}`}>

                  <Button fullWidth>

                    Read More

                  </Button>

                </Link>

              </Card>

            ))}

          </div>

          {totalPages > 1 && (

            <div className="mt-16">

              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />

            </div>

          )}

        </div>

      </section>

      <Newsletter />

      <CTA />
    </>
  );
}