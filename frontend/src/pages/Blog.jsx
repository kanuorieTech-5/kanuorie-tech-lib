import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  ArrowRight,
  BookOpen,
} from "lucide-react";

import {
  Card,
  Button,
  Loader,
  Pagination,
  SectionTitle,
} from "../components/common";

import { SearchBar } from "../components/layout";

import {
  Newsletter,
  CTA,
} from "../components/home";

import { getBlogs } from "../services";

const POSTS_PER_PAGE = 9;

const FALLBACK_IMAGE = "/images/blog-placeholder.png";

const FALLBACK_EXCERPT =
  "Discover the latest technology insights, tutorials and updates from KanuorieTech.";

/* ==========================================
   API RESPONSE
========================================== */

const getBlogsData = (response) => {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.data?.blogs)) {
    return response.data.blogs;
  }

  if (Array.isArray(response?.blogs)) {
    return response.blogs;
  }

  return [];
};

/* ==========================================
   HELPERS
========================================== */

const getBlogId = (blog) => {
  return blog?._id || blog?.id || null;
};

const getExcerpt = (blog, length = null) => {
  const excerpt =
    blog?.excerpt?.trim() || FALLBACK_EXCERPT;

  if (!length || excerpt.length <= length) {
    return excerpt;
  }

  return `${excerpt.slice(0, length).trim()}...`;
};

const formatDate = (date) => {
  if (!date) {
    return "Recently published";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Recently published";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(parsedDate);
};

/* ==========================================
   COMPONENT
========================================== */

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  /* ==========================================
     LOAD BLOGS
  ========================================== */

  useEffect(() => {
    let isMounted = true;

    const fetchBlogs = async () => {
      try {
        const response = await getBlogs();

        const data = getBlogsData(response);

        if (isMounted) {
          setBlogs(data);
        }
      } catch (error) {
        console.error("Failed to load blogs:", error);

        if (isMounted) {
          setBlogs([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchBlogs();

    return () => {
      isMounted = false;
    };
  }, []);

  /* ==========================================
     FILTER BLOGS
  ========================================== */

  const filteredBlogs = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return blogs;
    }

    return blogs.filter((blog) => {
      const title =
        blog?.title?.toLowerCase() || "";

      const excerpt =
        blog?.excerpt?.toLowerCase() || "";

      const content =
        blog?.content?.toLowerCase() || "";

      return (
        title.includes(query) ||
        excerpt.includes(query) ||
        content.includes(query)
      );
    });
  }, [blogs, search]);

  /* ==========================================
     FEATURED POST
  ========================================== */

  const featuredPost = filteredBlogs[0] || null;

  /* ==========================================
     PAGINATION
  ========================================== */

  const totalArticles = Math.max(
    filteredBlogs.length - 1,
    0
  );

  const totalPages = Math.ceil(
    totalArticles / POSTS_PER_PAGE
  );

  const currentBlogs = useMemo(() => {
    const startIndex =
      1 + (page - 1) * POSTS_PER_PAGE;

    return filteredBlogs.slice(
      startIndex,
      startIndex + POSTS_PER_PAGE
    );
  }, [filteredBlogs, page]);

  /* ==========================================
     RESET PAGE WHEN SEARCH CHANGES
  ========================================== */

  useEffect(() => {
    setPage(1);
  }, [search]);

  /* ==========================================
     PROTECT AGAINST INVALID PAGE
  ========================================== */

  useEffect(() => {
    if (totalPages > 0 && page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  /* ==========================================
     LOADING
  ========================================== */

  if (loading) {
    return (
      <section
        className="
          flex
          min-h-[60vh]
          items-center
          justify-center
          bg-slate-950
          px-6
        "
        aria-label="Loading blog articles"
      >
        <Loader />
      </section>
    );
  }

  /* ==========================================
     PAGE
  ========================================== */

  return (
    <>
      {/* ======================================
          HERO
      ====================================== */}

      <section
        className="
          relative
          overflow-hidden
          bg-gradient-to-br
          from-slate-950
          via-slate-900
          to-blue-950
          py-24
          text-white
          lg:py-28
        "
      >
        {/* Background grid */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            opacity-50
            bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)]
            bg-[size:45px_45px]
          "
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-5xl px-6 text-center">

          <span
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-blue-500/30
              bg-blue-500/10
              px-5
              py-2
              text-sm
              font-medium
              text-blue-400
            "
          >
            <BookOpen size={16} />
            Tech Insights
          </span>

          <h1
            className="
              mt-8
              text-5xl
              font-black
              leading-tight
              lg:text-7xl
            "
          >
            KanuorieTech{" "}
            <span className="text-blue-400">
              Blog
            </span>
          </h1>

          <p
            className="
              mx-auto
              mt-8
              max-w-3xl
              text-lg
              leading-8
              text-slate-300
            "
          >
            Discover practical programming tutorials,
            software engineering tips, industry news,
            career advice and technology insights.
          </p>

        </div>
      </section>

      {/* ======================================
          SEARCH
      ====================================== */}

      <section className="bg-white py-12 lg:py-14">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <label
            htmlFor="blog-search"
            className="sr-only"
          >
            Search articles
          </label>

          <SearchBar
            id="blog-search"
            value={search}
            onChange={setSearch}
            placeholder="Search articles..."
          />

        </div>
      </section>

      {/* ======================================
          FEATURED ARTICLE
      ====================================== */}

      {featuredPost ? (
        <section className="bg-slate-50 py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">

            <SectionTitle
              title="Featured Article"
              subtitle="Editor's pick"
            />

            <Card
              className="
                mt-12
                overflow-hidden
                border-slate-200
                bg-white
                lg:grid
                lg:grid-cols-2
              "
            >

              {/* IMAGE */}

              <div className="overflow-hidden">
                <img
                  src={
                    featuredPost?.image ||
                    FALLBACK_IMAGE
                  }
                  alt={
                    featuredPost?.title ||
                    "Featured article"
                  }
                  className="
                    h-72
                    w-full
                    object-cover
                    lg:h-full
                  "
                  loading="eager"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src =
                      FALLBACK_IMAGE;
                  }}
                />
              </div>

              {/* CONTENT */}

              <div className="flex flex-col p-8 lg:p-10">

                <div
                  className="
                    mb-6
                    flex
                    items-center
                    gap-3
                    text-blue-600
                  "
                >
                  <CalendarDays size={18} />

                  <time
                    dateTime={
                      featuredPost?.createdAt || undefined
                    }
                  >
                    {formatDate(
                      featuredPost?.createdAt
                    )}
                  </time>
                </div>

                <h2 className="text-3xl font-bold text-slate-900 lg:text-4xl">
                  {featuredPost?.title ||
                    "Featured Article"}
                </h2>

                <p className="mt-6 leading-8 text-slate-600">
                  {getExcerpt(featuredPost)}
                </p>

                {getBlogId(featuredPost) && (
                  <Link
                    to={`/blog/${getBlogId(
                      featuredPost
                    )}`}
                    className="mt-10 inline-flex"
                  >
                    <Button>
                      Read Article
                      <ArrowRight
                        className="ml-2"
                        size={18}
                      />
                    </Button>
                  </Link>
                )}

              </div>

            </Card>
          </div>
        </section>
      ) : (
        <section className="bg-slate-50 py-20">
          <div className="mx-auto max-w-4xl px-6">

            <Card className="p-12 text-center">
              <h2 className="text-2xl font-bold text-slate-900">
                No articles found
              </h2>

              <p className="mt-3 text-slate-600">
                Try a different search term.
              </p>

              {search && (
                <Button
                  variant="secondary"
                  className="mt-6"
                  onClick={() => setSearch("")}
                >
                  Clear Search
                </Button>
              )}
            </Card>

          </div>
        </section>
      )}

      {/* ======================================
          LATEST ARTICLES
      ====================================== */}

      {currentBlogs.length > 0 && (
        <section className="bg-white py-24">

          <div className="mx-auto max-w-7xl px-6 lg:px-8">

            <SectionTitle
              title="Latest Articles"
              subtitle="Stay updated with technology"
            />

            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

              {currentBlogs.map((blog) => {
                const blogId = getBlogId(blog);

                if (!blogId) {
                  return null;
                }

                const title =
                  blog?.title?.trim() ||
                  "Technology Article";

                return (
                  <Card
                    key={blogId}
                    hover
                    className="
                      group
                      overflow-hidden
                      border-slate-200
                      bg-white
                    "
                  >

                    {/* IMAGE */}

                    <div className="overflow-hidden">
                      <img
                        src={
                          blog?.image ||
                          FALLBACK_IMAGE
                        }
                        alt={title}
                        loading="lazy"
                        decoding="async"
                        className="
                          h-56
                          w-full
                          object-cover
                          transition-transform
                          duration-500
                          group-hover:scale-105
                        "
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src =
                            FALLBACK_IMAGE;
                        }}
                      />
                    </div>

                    {/* CONTENT */}

                    <div className="p-1">

                      {/* DATE */}

                      <div
                        className="
                          mb-4
                          mt-5
                          flex
                          items-center
                          gap-2
                          text-sm
                          text-blue-600
                        "
                      >
                        <CalendarDays size={16} />

                        <time
                          dateTime={
                            blog?.createdAt ||
                            undefined
                          }
                        >
                          {formatDate(
                            blog?.createdAt
                          )}
                        </time>
                      </div>

                      {/* TITLE */}

                      <h3 className="mb-3 text-2xl font-bold text-slate-900">
                        {title}
                      </h3>

                      {/* EXCERPT */}

                      <p className="mb-6 line-clamp-3 text-slate-600">
                        {getExcerpt(blog, 120)}
                      </p>

                      {/* ACTION */}

                      <Link
                        to={`/blog/${blogId}`}
                        className="block"
                      >
                        <Button fullWidth>
                          Read More
                        </Button>
                      </Link>

                    </div>

                  </Card>
                );
              })}

            </div>

            {/* PAGINATION */}

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
      )}

      {/* ======================================
          NO ADDITIONAL ARTICLES
      ====================================== */}

      {featuredPost && currentBlogs.length === 0 && (
        <section className="bg-white pb-20">
          <div className="mx-auto max-w-4xl px-6 text-center">

            {filteredBlogs.length === 1 && (
              <p className="text-slate-500">
                This is currently the only article
                available.
              </p>
            )}

          </div>
        </section>
      )}

      {/* ======================================
          NEWSLETTER
      ====================================== */}

      <Newsletter />

      {/* ======================================
          CTA
      ====================================== */}

      <CTA />
    </>
  );
}