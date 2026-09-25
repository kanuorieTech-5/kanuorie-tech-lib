const CommunityPost = require("../models/CommunityPost");
const CommunityComment = require("../models/CommunityComment");
const CommunityLike = require("../models/CommunityLike");
const CommunitySave = require("../models/CommunitySave");
const CommunityReport = require("../models/CommunityReport");
const CommunityShare = require("../models/CommunityShare");

/* ==========================================
   CONSTANTS
========================================== */

const COMMUNITY_CATEGORIES = [
  "Announcements",
  "Questions & Help",
  "Web Development",
  "Career & Jobs",
  "Projects & Ideas",
];

/* ==========================================
   HELPERS
========================================== */

const formatAuthor = (user) => {
  if (!user) return null;

  return {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName:
      user.fullName ||
      `${user.firstName || ""} ${user.lastName || ""}`.trim(),
    avatar: user.avatar || null,
    role: user.role,
    isVerified: user.isVerified,
  };
};

const getUserId = (req) => {
  return req.user?._id || req.user?.id || null;
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

    const currentPage = Math.max(Number(page) || 1, 1);
    const pageLimit = Math.min(
      Math.max(Number(limit) || 10, 1),
      50
    );

    const filter = {
      status: "published",
    };

    if (
      category &&
      category !== "All Discussions" &&
      COMMUNITY_CATEGORIES.includes(category)
    ) {
      filter.category = category;
    }

    if (search?.trim()) {
      const searchRegex = new RegExp(
        search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i"
      );

      filter.$or = [
        { title: searchRegex },
        { content: searchRegex },
      ];
    }

    const total = await CommunityPost.countDocuments(filter);

    const posts = await CommunityPost.find(filter)
      .populate(
        "author",
        "firstName lastName avatar role isVerified"
      )
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * pageLimit)
      .limit(pageLimit)
      .lean();

    const userId = getUserId(req);

    let likedPostIds = new Set();
    let savedPostIds = new Set();

    if (userId && posts.length) {
      const postIds = posts.map((post) => post._id);

      const [likes, saves] = await Promise.all([
        CommunityLike.find({
          user: userId,
          post: { $in: postIds },
        })
          .select("post")
          .lean(),

        CommunitySave.find({
          user: userId,
          post: { $in: postIds },
        })
          .select("post")
          .lean(),
      ]);

      likedPostIds = new Set(
        likes.map((item) => item.post.toString())
      );

      savedPostIds = new Set(
        saves.map((item) => item.post.toString())
      );
    }

    const items = posts.map((post) => ({
      ...post,
      author: formatAuthor(post.author),
      likedByMe: likedPostIds.has(post._id.toString()),
      savedByMe: savedPostIds.has(post._id.toString()),
    }));

    const totalPages = Math.ceil(total / pageLimit);

    return res.status(200).json({
      success: true,
      message: "Community posts retrieved successfully.",
      data: {
        items,
        count: items.length,
      },
      meta: {
        page: currentPage,
        limit: pageLimit,
        total,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* ==========================================
   GET SINGLE COMMUNITY POST
========================================== */

const getCommunityPost = async (req, res, next) => {
  try {
    const post = await CommunityPost.findOne({
      _id: req.params.id,
      status: "published",
    })
      .populate(
        "author",
        "firstName lastName avatar role isVerified"
      )
      .lean();

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Community post not found.",
      });
    }

    const userId = getUserId(req);

    let likedByMe = false;
    let savedByMe = false;

    if (userId) {
      const [like, save] = await Promise.all([
        CommunityLike.exists({
          post: post._id,
          user: userId,
        }),

        CommunitySave.exists({
          post: post._id,
          user: userId,
        }),
      ]);

      likedByMe = Boolean(like);
      savedByMe = Boolean(save);
    }

    return res.status(200).json({
      success: true,
      message: "Community post retrieved successfully.",
      data: {
        post: {
          ...post,
          author: formatAuthor(post.author),
          likedByMe,
          savedByMe,
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

const createCommunityPost = async (req, res, next) => {
  try {
    const {
      title,
      content,
      category = "Questions & Help",
    } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Post title is required.",
      });
    }

    if (!content?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Post content is required.",
      });
    }

    if (!COMMUNITY_CATEGORIES.includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid community category.",
      });
    }

    const post = await CommunityPost.create({
      author: req.user._id,
      title: title.trim(),
      content: content.trim(),
      category,
    });

    await post.populate(
      "author",
      "firstName lastName avatar role isVerified"
    );

    return res.status(201).json({
      success: true,
      message: "Community post created successfully.",
      data: {
        post: {
          ...post.toObject(),
          author: formatAuthor(post.author),
          likedByMe: false,
          savedByMe: false,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/* ==========================================
   DELETE COMMUNITY POST
========================================== */

const deleteCommunityPost = async (req, res, next) => {
  try {
    const post = await CommunityPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Community post not found.",
      });
    }

    const userId = getUserId(req);

    const isOwner =
      post.author.toString() === userId.toString();

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this post.",
      });
    }

    post.status = "deleted";
    await post.save();

    return res.status(200).json({
      success: true,
      message: "Community post deleted successfully.",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

/* ==========================================
   GET COMMUNITY CATEGORIES
========================================== */

const getCommunityCategories = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Community categories retrieved successfully.",
      data: {
        categories: COMMUNITY_CATEGORIES,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* ==========================================
   GET COMMENTS
========================================== */

const getCommunityComments = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const currentPage = Math.max(Number(page) || 1, 1);
    const pageLimit = Math.min(
      Math.max(Number(limit) || 20, 1),
      50
    );

    const post = await CommunityPost.findOne({
      _id: req.params.id,
      status: "published",
    }).select("_id");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Community post not found.",
      });
    }

    const filter = {
      post: post._id,
      status: "published",
    };

    const total = await CommunityComment.countDocuments(filter);

    const comments = await CommunityComment.find(filter)
      .populate(
        "author",
        "firstName lastName avatar role isVerified"
      )
      .sort({ createdAt: 1 })
      .skip((currentPage - 1) * pageLimit)
      .limit(pageLimit)
      .lean();

    const items = comments.map((comment) => ({
      ...comment,
      author: formatAuthor(comment.author),
    }));

    const totalPages = Math.ceil(total / pageLimit);

    return res.status(200).json({
      success: true,
      message: "Community comments retrieved successfully.",
      data: {
        items,
        count: items.length,
      },
      meta: {
        page: currentPage,
        limit: pageLimit,
        total,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* ==========================================
   CREATE COMMENT
========================================== */

const createCommunityComment = async (req, res, next) => {
  try {
    const { content } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment content is required.",
      });
    }

    const post = await CommunityPost.findOne({
      _id: req.params.id,
      status: "published",
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Community post not found.",
      });
    }

    const comment = await CommunityComment.create({
      post: post._id,
      author: req.user._id,
      content: content.trim(),
    });

    await CommunityPost.findByIdAndUpdate(
      post._id,
      {
        $inc: {
          commentsCount: 1,
        },
      }
    );

    await comment.populate(
      "author",
      "firstName lastName avatar role isVerified"
    );

    return res.status(201).json({
      success: true,
      message: "Comment added successfully.",
      data: {
        comment: {
          ...comment.toObject(),
          author: formatAuthor(comment.author),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/* ==========================================
   DELETE COMMENT
========================================== */

const deleteCommunityComment = async (req, res, next) => {
  try {
    const comment = await CommunityComment.findOne({
      _id: req.params.commentId,
      post: req.params.id,
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found.",
      });
    }

    const userId = getUserId(req);

    const isOwner =
      comment.author.toString() === userId.toString();

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this comment.",
      });
    }

    if (comment.status === "deleted") {
      return res.status(200).json({
        success: true,
        message: "Comment already deleted.",
        data: null,
      });
    }

    comment.status = "deleted";
    await comment.save();

    await CommunityPost.findByIdAndUpdate(
      req.params.id,
      {
        $inc: {
          commentsCount: -1,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully.",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

/* ==========================================
   LIKE / UNLIKE POST
========================================== */

const toggleCommunityLike = async (req, res, next) => {
  try {
    const post = await CommunityPost.findOne({
      _id: req.params.id,
      status: "published",
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Community post not found.",
      });
    }

    const existingLike = await CommunityLike.findOne({
      post: post._id,
      user: req.user._id,
    });

    let liked;

    if (existingLike) {
      await existingLike.deleteOne();

      await CommunityPost.findByIdAndUpdate(
        post._id,
        {
          $inc: {
            likesCount: -1,
          },
        }
      );

      liked = false;
    } else {
      try {
        await CommunityLike.create({
          post: post._id,
          user: req.user._id,
        });

        await CommunityPost.findByIdAndUpdate(
          post._id,
          {
            $inc: {
              likesCount: 1,
            },
          }
        );

        liked = true;
      } catch (error) {
        if (error.code === 11000) {
          liked = true;
        } else {
          throw error;
        }
      }
    }

    const updatedPost = await CommunityPost.findById(
      post._id
    ).select("likesCount");

    return res.status(200).json({
      success: true,
      message: liked
        ? "Post liked successfully."
        : "Post unliked successfully.",
      data: {
        liked,
        likesCount: updatedPost.likesCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* ==========================================
   SAVE / UNSAVE POST
========================================== */

const toggleCommunitySave = async (req, res, next) => {
  try {
    const post = await CommunityPost.findOne({
      _id: req.params.id,
      status: "published",
    }).select("_id");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Community post not found.",
      });
    }

    const existingSave = await CommunitySave.findOne({
      post: post._id,
      user: req.user._id,
    });

    let saved;

    if (existingSave) {
      await existingSave.deleteOne();
      saved = false;
    } else {
      try {
        await CommunitySave.create({
          post: post._id,
          user: req.user._id,
        });

        saved = true;
      } catch (error) {
        if (error.code === 11000) {
          saved = true;
        } else {
          throw error;
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: saved
        ? "Post saved successfully."
        : "Post removed from saved posts.",
      data: {
        saved,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* ==========================================
   SHARE POST
========================================== */

const shareCommunityPost = async (req, res, next) => {
  try {
    const { platform = "copy" } = req.body;

    const validPlatforms = [
      "copy",
      "native",
      "whatsapp",
      "facebook",
      "linkedin",
      "x",
      "other",
    ];

    const selectedPlatform = validPlatforms.includes(platform)
      ? platform
      : "other";

    const post = await CommunityPost.findOne({
      _id: req.params.id,
      status: "published",
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Community post not found.",
      });
    }

    await CommunityShare.create({
      post: post._id,
      user: req.user?._id || null,
      platform: selectedPlatform,
    });

    const updatedPost = await CommunityPost.findByIdAndUpdate(
      post._id,
      {
        $inc: {
          sharesCount: 1,
        },
      },
      {
        new: true,
      }
    ).select("sharesCount");

    return res.status(200).json({
      success: true,
      message: "Post share recorded successfully.",
      data: {
        sharesCount: updatedPost.sharesCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* ==========================================
   REPORT POST
========================================== */

const reportCommunityPost = async (req, res, next) => {
  try {
    const {
      reason,
      details = "",
    } = req.body;

    const validReasons = [
      "spam",
      "harassment",
      "inappropriate",
      "misinformation",
      "copyright",
      "other",
    ];

    if (!validReasons.includes(reason)) {
      return res.status(400).json({
        success: false,
        message: "Invalid report reason.",
      });
    }

    const post = await CommunityPost.findOne({
      _id: req.params.id,
      status: "published",
    }).select("_id");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Community post not found.",
      });
    }

    const existingReport = await CommunityReport.findOne({
      post: post._id,
      reporter: req.user._id,
    });

    if (existingReport) {
      return res.status(409).json({
        success: false,
        message: "You have already reported this post.",
      });
    }

    await CommunityReport.create({
      post: post._id,
      reporter: req.user._id,
      reason,
      details: details.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Post reported successfully.",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCommunityPosts,
  getCommunityPost,
  createCommunityPost,
  deleteCommunityPost,
  getCommunityCategories,
  getCommunityComments,
  createCommunityComment,
  deleteCommunityComment,
  toggleCommunityLike,
  toggleCommunitySave,
  shareCommunityPost,
  reportCommunityPost,
};