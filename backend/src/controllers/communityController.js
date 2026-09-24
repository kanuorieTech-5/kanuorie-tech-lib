const CommunityPost = require("../models/CommunityPost");
const User = require("../models/User");

/* ==========================================
   VALID CATEGORIES
========================================== */

const COMMUNITY_CATEGORIES = [
  "Announcements",
  "Questions & Help",
  "Web Development",
  "Career & Jobs",
  "Projects & Ideas",
];

/* ==========================================
   BUILD AUTHOR RESPONSE
========================================== */

const formatAuthor = (user) => {
  if (!user) {
    return null;
  }

  return {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName:
      `${user.firstName || ""} ${user.lastName || ""}`.trim(),
    avatar: user.avatar || null,
    role: user.role || "user",
    isVerified: Boolean(user.isVerified),
  };
};

/* ==========================================
   GET COMMUNITY POSTS
========================================== */

const getCommunityPosts = async (req, res, next) => {
  try {
    const {
      category,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    const currentPage = Math.max(
      Number(page) || 1,
      1
    );

    const perPage = Math.min(
      Math.max(Number(limit) || 10, 1),
      50
    );

    const filter = {
      status: "published",
    };

    /* ========================================
       CATEGORY FILTER
    ======================================== */

    if (
      category &&
      category !== "All Discussions"
    ) {
      if (
        !COMMUNITY_CATEGORIES.includes(category)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid community category.",
        });
      }

      filter.category = category;
    }

    /* ========================================
       SEARCH
    ======================================== */

    if (
      typeof search === "string" &&
      search.trim()
    ) {
      const searchRegex = new RegExp(
        search.trim().replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        ),
        "i"
      );

      filter.$or = [
        {
          title: searchRegex,
        },
        {
          content: searchRegex,
        },
      ];
    }

    const skip =
      (currentPage - 1) * perPage;

    const [posts, total] =
      await Promise.all([
        CommunityPost.find(filter)
          .populate({
            path: "author",
            select:
              "firstName lastName avatar role isVerified",
          })
          .sort({
            createdAt: -1,
          })
          .skip(skip)
          .limit(perPage)
          .lean(),

        CommunityPost.countDocuments(filter),
      ]);

    const formattedPosts = posts.map(
      (post) => ({
        ...post,
        author: formatAuthor(post.author),
      })
    );

    return res.status(200).json({
      success: true,
      message:
        "Community posts retrieved successfully.",
      data: {
        items: formattedPosts,
        count: formattedPosts.length,
      },
      meta: {
        page: currentPage,
        limit: perPage,
        total,
        totalPages: Math.ceil(
          total / perPage
        ),
        hasNextPage:
          currentPage * perPage < total,
        hasPreviousPage:
          currentPage > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* ==========================================
   GET SINGLE COMMUNITY POST
========================================== */

const getCommunityPost = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    const post =
      await CommunityPost.findOne({
        _id: id,
        status: "published",
      })
        .populate({
          path: "author",
          select:
            "firstName lastName avatar role isVerified",
        })
        .lean();

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Community post not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Community post retrieved successfully.",
      data: {
        post: {
          ...post,
          author: formatAuthor(post.author),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/* ==========================================
   CREATE COMMUNITY POST
========================================== */

const createCommunityPost = async (
  req,
  res,
  next
) => {
  try {
    const {
      title,
      content,
      category,
    } = req.body;

    /* ========================================
       VALIDATE TITLE
    ======================================== */

    if (
      typeof title !== "string" ||
      !title.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Post title is required.",
      });
    }

    /* ========================================
       VALIDATE CONTENT
    ======================================== */

    if (
      typeof content !== "string" ||
      !content.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Post content is required.",
      });
    }

    /* ========================================
       VALIDATE CATEGORY
    ======================================== */

    const selectedCategory =
      typeof category === "string" &&
      category.trim()
        ? category.trim()
        : "Questions & Help";

    if (
      !COMMUNITY_CATEGORIES.includes(
        selectedCategory
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid community category.",
      });
    }

    /* ========================================
       CREATE POST
    ======================================== */

    const post =
      await CommunityPost.create({
        author: req.user._id,
        title: title.trim(),
        content: content.trim(),
        category: selectedCategory,
      });

    const populatedPost =
      await CommunityPost.findById(post._id)
        .populate({
          path: "author",
          select:
            "firstName lastName avatar role isVerified",
        })
        .lean();

    return res.status(201).json({
      success: true,
      message:
        "Community post created successfully.",
      data: {
        post: {
          ...populatedPost,
          author: formatAuthor(
            populatedPost.author
          ),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/* ==========================================
   DELETE OWN COMMUNITY POST
========================================== */

const deleteCommunityPost = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    const post =
      await CommunityPost.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Community post not found.",
      });
    }

    /* ========================================
       ONLY AUTHOR OR ADMIN CAN DELETE
    ======================================== */

    const isAuthor =
      post.author.toString() ===
      req.user._id.toString();

    const isAdmin =
      req.user.role === "admin";

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to delete this post.",
      });
    }

    post.status = "deleted";

    await post.save();

    return res.status(200).json({
      success: true,
      message:
        "Community post deleted successfully.",
      data: {
        postId: post._id,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* ==========================================
   GET COMMUNITY CATEGORIES
========================================== */

const getCommunityCategories = async (
  req,
  res,
  next
) => {
  try {
    return res.status(200).json({
      success: true,
      message:
        "Community categories retrieved successfully.",
      data: {
        items: COMMUNITY_CATEGORIES,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* ==========================================
   EXPORTS
========================================== */

module.exports = {
  getCommunityPosts,
  getCommunityPost,
  createCommunityPost,
  deleteCommunityPost,
  getCommunityCategories,
};