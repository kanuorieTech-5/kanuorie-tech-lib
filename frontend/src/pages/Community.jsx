import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  Users,
  MessageCircle,
  Heart,
  Share2,
  Bookmark,
  Megaphone,
  HelpCircle,
  Code2,
  BriefcaseBusiness,
  Lightbulb,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import {
  getCommunityPosts,
  createCommunityPost,
} from "../services/community.service";

/* ==========================================
   COMMUNITY CATEGORIES
========================================== */

const categories = [
  {
    name: "All Discussions",
    icon: MessageCircle,
  },
  {
    name: "Announcements",
    icon: Megaphone,
  },
  {
    name: "Questions & Help",
    icon: HelpCircle,
  },
  {
    name: "Web Development",
    icon: Code2,
  },
  {
    name: "Career & Jobs",
    icon: BriefcaseBusiness,
  },
  {
    name: "Projects & Ideas",
    icon: Lightbulb,
  },
];

/* ==========================================
   ANIMATION
========================================== */

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 18,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};

/* ==========================================
   DATE FORMATTER
========================================== */

const formatPostDate = (date) => {
  if (!date) {
    return "";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

/* ==========================================
   AUTHOR INITIAL
========================================== */

const getAuthorInitial = (author) => {
  if (!author) {
    return "K";
  }

  if (typeof author === "string") {
    return author.charAt(0).toUpperCase();
  }

  return (
    author.firstName?.charAt(0)?.toUpperCase() ||
    author.fullName?.charAt(0)?.toUpperCase() ||
    "K"
  );
};

/* ==========================================
   AUTHOR NAME
========================================== */

const getAuthorName = (author) => {
  if (!author) {
    return "KanuorieTech Member";
  }

  if (typeof author === "string") {
    return author;
  }

  if (author.fullName) {
    return author.fullName;
  }

  return (
    `${author.firstName || ""} ${
      author.lastName || ""
    }`.trim() || "KanuorieTech Member"
  );
};

/* ==========================================
   COMMUNITY PAGE
========================================== */

export default function Community() {
  /* ========================================
     FEED STATE
  ======================================== */

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ========================================
     FILTER STATE
  ======================================== */

  const [activeCategory, setActiveCategory] =
    useState("All Discussions");

  const [search, setSearch] = useState("");

  /* ========================================
     CREATE POST STATE
  ======================================== */

  const [showCreatePost, setShowCreatePost] =
    useState(false);

  const [postTitle, setPostTitle] = useState("");

  const [postContent, setPostContent] =
    useState("");

  const [postCategory, setPostCategory] =
    useState("Questions & Help");

  const [creatingPost, setCreatingPost] =
    useState(false);

  const [createError, setCreateError] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  /* ========================================
     LOAD COMMUNITY POSTS
  ======================================== */

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCommunityPosts({
        page: 1,
        limit: 50,
      });

      const items = response?.data?.items;

      setPosts(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error(
        "Failed to load community posts:",
        err,
      );

      setError(
        err?.response?.data?.message ||
          "Unable to load community discussions right now.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  /* ========================================
     FILTER POSTS
  ======================================== */

  const filteredPosts = useMemo(() => {
    let result = [...posts];

    /* ======================================
       CATEGORY
    ====================================== */

    if (activeCategory !== "All Discussions") {
      result = result.filter(
        (post) =>
          post.category === activeCategory,
      );
    }

    /* ======================================
       SEARCH
    ====================================== */

    const query = search.trim().toLowerCase();

    if (query) {
      result = result.filter((post) => {
        const title =
          post.title?.toLowerCase() || "";

        const content =
          post.content?.toLowerCase() || "";

        const category =
          post.category?.toLowerCase() || "";

        const author =
          getAuthorName(post.author)
            .toLowerCase();

        return (
          title.includes(query) ||
          content.includes(query) ||
          category.includes(query) ||
          author.includes(query)
        );
      });
    }

    return result;
  }, [
    posts,
    activeCategory,
    search,
  ]);

  /* ========================================
     OPEN CREATE POST MODAL
  ======================================== */

  const openCreatePost = () => {
    setCreateError("");
    setSuccessMessage("");
    setPostTitle("");
    setPostContent("");
    setPostCategory(
      activeCategory !== "All Discussions"
        ? activeCategory
        : "Questions & Help",
    );

    setShowCreatePost(true);
  };

  /* ========================================
     CLOSE CREATE POST MODAL
  ======================================== */

  const closeCreatePost = () => {
    if (creatingPost) {
      return;
    }

    setShowCreatePost(false);
    setCreateError("");
    setPostTitle("");
    setPostContent("");
  };

  /* ========================================
     CREATE POST
  ======================================== */

  const handleCreatePost = async (event) => {
    event.preventDefault();

    setCreateError("");
    setSuccessMessage("");

    const title = postTitle.trim();
    const content = postContent.trim();

    if (!title) {
      setCreateError(
        "Please enter a title for your post.",
      );

      return;
    }

    if (!content) {
      setCreateError(
        "Please enter something to share with the community.",
      );

      return;
    }

    try {
      setCreatingPost(true);

      const response =
        await createCommunityPost({
          title,
          content,
          category: postCategory,
        });

      const createdPost =
        response?.data?.post;

      if (createdPost) {
        setPosts((currentPosts) => [
          createdPost,
          ...currentPosts,
        ]);
      } else {
        await loadPosts();
      }

      setPostTitle("");
      setPostContent("");
      setPostCategory("Questions & Help");
      setShowCreatePost(false);

      setSuccessMessage(
        "Your post was published successfully.",
      );

      window.setTimeout(() => {
        setSuccessMessage("");
      }, 4000);
    } catch (err) {
      console.error(
        "Failed to create community post:",
        err,
      );

      setCreateError(
        err?.response?.data?.message ||
          "Unable to publish your post. Please try again.",
      );
    } finally {
      setCreatingPost(false);
    }
  };

  /* ========================================
     RETRY
  ======================================== */

  const handleRetry = () => {
    loadPosts();
  };

  /* ========================================
     RENDER
  ======================================== */

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* =========================================
            PAGE HEADER
        ========================================= */}

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mb-6"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                <Users className="h-4 w-4" />
                KanuorieTech Community
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Learn, connect & grow together.
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Connect with other learners, ask
                questions, share projects, exchange
                ideas, and grow your technology
                skills together.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreatePost}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Plus className="h-5 w-5" />
              Create Post
            </button>
          </div>
        </motion.div>

        {/* =========================================
            SUCCESS MESSAGE
        ========================================= */}

        {successMessage && (
          <motion.div
            initial={{
              opacity: 0,
              y: -8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
          >
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            {successMessage}
          </motion.div>
        )}

        {/* =========================================
            SEARCH
        ========================================= */}

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.05 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search discussions..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </motion.div>

        {/* =========================================
            CATEGORY NAVIGATION
        ========================================= */}

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.1 }}
          className="mb-6 overflow-x-auto pb-1"
        >
          <div className="flex min-w-max gap-2">
            {categories.map((category) => {
              const Icon = category.icon;

              const active =
                activeCategory ===
                category.name;

              return (
                <button
                  key={category.name}
                  type="button"
                  onClick={() =>
                    setActiveCategory(
                      category.name,
                    )
                  }
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-blue-600 text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* =========================================
            MAIN CONTENT
        ========================================= */}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          {/* =========================================
              FEED
          ========================================= */}

          <motion.main
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: 0.15 }}
          >
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              {/* =====================================
                  LOADING
              ===================================== */}

              {loading ? (
                <div className="flex min-h-[360px] items-center justify-center px-6">
                  <div className="flex flex-col items-center gap-3 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />

                    <p className="text-sm font-medium text-slate-600">
                      Loading community
                      discussions...
                    </p>
                  </div>
                </div>
              ) : error ? (
                /* =====================================
                   ERROR
                ===================================== */

                <div className="flex min-h-[360px] flex-col items-center justify-center px-6 py-16 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
                    <AlertCircle className="h-8 w-8 text-red-500" />
                  </div>

                  <h2 className="mt-5 text-lg font-semibold text-slate-900">
                    Unable to load the community
                  </h2>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                    {error}
                  </p>

                  <button
                    type="button"
                    onClick={handleRetry}
                    className="mt-6 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Try Again
                  </button>
                </div>
              ) : filteredPosts.length >
                0 ? (
                /* =====================================
                   POSTS
                ===================================== */

                <div className="divide-y divide-slate-100">
                  {filteredPosts.map((post) => {
                    const author =
                      post.author;

                    const authorName =
                      getAuthorName(author);

                    const authorInitial =
                      getAuthorInitial(
                        author,
                      );

                    return (
                      <article
                        key={
                          post._id ||
                          post.id
                        }
                        className="p-5 sm:p-6"
                      >
                        <div className="flex gap-3">
                          {/* =================================
                              AVATAR
                          ================================= */}

                          {author?.avatar ? (
                            <img
                              src={author.avatar}
                              alt={authorName}
                              className="h-10 w-10 shrink-0 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                              {authorInitial}
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-sm font-semibold text-slate-900">
                                {authorName}
                              </span>

                              {author?.isVerified && (
                                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600">
                                  Verified
                                </span>
                              )}

                              <span className="text-xs text-slate-400">
                                {formatPostDate(
                                  post.createdAt,
                                )}
                              </span>
                            </div>

                            <div className="mt-2">
                              <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                                {post.category}
                              </span>
                            </div>

                            <h2 className="mt-3 text-base font-semibold text-slate-900">
                              {post.title}
                            </h2>

                            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                              {post.content}
                            </p>

                            <div className="mt-5 flex items-center gap-5 text-sm text-slate-500">
                              <button
                                type="button"
                                className="inline-flex items-center gap-1.5 transition hover:text-red-500"
                              >
                                <Heart className="h-4 w-4" />
                                {post.likesCount ||
                                  0}
                              </button>

                              <button
                                type="button"
                                className="inline-flex items-center gap-1.5 transition hover:text-blue-600"
                              >
                                <MessageCircle className="h-4 w-4" />
                                {post.commentsCount ||
                                  0}
                              </button>

                              <button
                                type="button"
                                className="inline-flex items-center gap-1.5 transition hover:text-blue-600"
                              >
                                <Share2 className="h-4 w-4" />
                                Share
                              </button>

                              <button
                                type="button"
                                className="ml-auto transition hover:text-blue-600"
                                aria-label="Save post"
                              >
                                <Bookmark className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                /* =====================================
                   EMPTY STATE
                ===================================== */

                <div className="px-6 py-16 text-center sm:py-20">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>

                  <h2 className="mt-5 text-lg font-semibold text-slate-900">
                    {search.trim() ||
                    activeCategory !==
                      "All Discussions"
                      ? "No discussions found"
                      : "The community is getting ready"}
                  </h2>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                    {search.trim() ||
                    activeCategory !==
                      "All Discussions"
                      ? "Try another search term or choose a different community category."
                      : "There are no discussions to display yet. Start the first conversation and help build the KanuorieTech community."}
                  </p>

                  {!search.trim() &&
                    activeCategory ===
                      "All Discussions" && (
                      <button
                        type="button"
                        onClick={openCreatePost}
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                      >
                        <Plus className="h-4 w-4" />
                        Start a Discussion
                      </button>
                    )}
                </div>
              )}
            </div>
          </motion.main>

          {/* =========================================
              SIDEBAR
          ========================================= */}

          <motion.aside
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Community Guidelines */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">
                    Community
                  </h2>

                  <p className="text-xs text-slate-500">
                    Learn together
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3 text-sm leading-6 text-slate-600">
                <p>
                  Ask thoughtful questions,
                  share what you're building,
                  and help other learners when
                  you can.
                </p>

                <p>
                  Keep conversations respectful,
                  useful, and focused on learning
                  and professional growth.
                </p>
              </div>
            </div>

            {/* Popular Topics */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-slate-900">
                Explore Topics
              </h2>

              <div className="mt-4 space-y-2">
                {categories
                  .slice(1)
                  .map((category) => {
                    const Icon =
                      category.icon;

                    return (
                      <button
                        key={category.name}
                        type="button"
                        onClick={() =>
                          setActiveCategory(
                            category.name,
                          )
                        }
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-600 transition hover:bg-slate-50 hover:text-blue-600"
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span>
                          {category.name}
                        </span>
                      </button>
                    );
                  })}
              </div>
            </div>
          </motion.aside>
        </div>
      </div>

      {/* =========================================
          CREATE POST MODAL
      ========================================= */}

      {showCreatePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.96,
              y: 10,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            className="w-full max-w-xl rounded-2xl bg-white shadow-2xl"
          >
            {/* =====================================
                MODAL HEADER
            ===================================== */}

            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <div>
                <h2 className="font-semibold text-slate-900">
                  Create a Post
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Start a conversation with the
                  community.
                </p>
              </div>

              <button
                type="button"
                onClick={closeCreatePost}
                disabled={creatingPost}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* =====================================
                FORM
            ===================================== */}

            <form
              onSubmit={handleCreatePost}
            >
              <div className="space-y-5 p-5 sm:p-6">
                {/* =================================
                    ERROR
                ================================= */}

                {createError && (
                  <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

                    <span>{createError}</span>
                  </div>
                )}

                {/* =================================
                    TITLE
                ================================= */}

                <div>
                  <label
                    htmlFor="community-post-title"
                    className="text-sm font-medium text-slate-700"
                  >
                    Post title
                  </label>

                  <input
                    id="community-post-title"
                    type="text"
                    value={postTitle}
                    onChange={(event) =>
                      setPostTitle(
                        event.target.value,
                      )
                    }
                    maxLength={150}
                    placeholder="Give your discussion a clear title..."
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* =================================
                    CATEGORY
                ================================= */}

                <div>
                  <label
                    htmlFor="community-post-category"
                    className="text-sm font-medium text-slate-700"
                  >
                    Category
                  </label>

                  <select
                    id="community-post-category"
                    value={postCategory}
                    onChange={(event) =>
                      setPostCategory(
                        event.target.value,
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    {categories
                      .slice(1)
                      .map((category) => (
                        <option
                          key={category.name}
                          value={category.name}
                        >
                          {category.name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* =================================
                    CONTENT
                ================================= */}

                <div>
                  <label
                    htmlFor="community-post"
                    className="text-sm font-medium text-slate-700"
                  >
                    What's on your mind?
                  </label>

                  <textarea
                    id="community-post"
                    value={postContent}
                    onChange={(event) =>
                      setPostContent(
                        event.target.value,
                      )
                    }
                    maxLength={5000}
                    rows={6}
                    placeholder="Share a question, project, idea, or something you've learned..."
                    className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <div className="mt-1 text-right text-xs text-slate-400">
                    {postContent.length}/5000
                  </div>
                </div>
              </div>

              {/* =====================================
                  MODAL ACTIONS
              ===================================== */}

              <div className="flex flex-col-reverse gap-2 border-t border-slate-100 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                <button
                  type="button"
                  onClick={closeCreatePost}
                  disabled={creatingPost}
                  className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    creatingPost ||
                    !postTitle.trim() ||
                    !postContent.trim()
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {creatingPost ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    "Publish Post"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}