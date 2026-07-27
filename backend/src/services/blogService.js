const Blog = require("../models/Blog");
const slugify = require("../helpers/slugify");

class BlogService {
  /* =========================
     CREATE BLOG
  ========================= */
  async create(data, user) {
    const blog = await Blog.create({
      ...data,
      slug: slugify(data.title),
      author: user._id,
    });

    return blog;
  }

  /* =========================
     GET ALL BLOGS
  ========================= */
  async getAll(query = {}) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    if (query.featured !== undefined) {
      filter.featured = query.featured === "true";
    }

    if (query.category) {
      filter.category = query.category;
    }

    if (query.search) {
      filter.$or = [
        {
          title: {
            $regex: query.search,
            $options: "i",
          },
        },
        {
          excerpt: {
            $regex: query.search,
            $options: "i",
          },
        },
      ];
    }

    const [items, total] = await Promise.all([
      Blog.find(filter)
        .populate("author", "firstName lastName")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Blog.countDocuments(filter),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /* =========================
     GET FEATURED BLOGS
  ========================= */
  async getFeatured(limit = 6) {
    return Blog.find({
      featured: true,
    })
      .populate("author", "firstName lastName")
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  /* =========================
     GET SINGLE BLOG
  ========================= */
  async getById(id) {
    const blog = await Blog.findById(id).populate(
      "author",
      "firstName lastName email"
    );

    if (blog) {
      blog.views = (blog.views || 0) + 1;
      await blog.save();
    }

    return blog;
  }

  /* =========================
     UPDATE BLOG
  ========================= */
  async update(id, data) {
    if (data.title) {
      data.slug = slugify(data.title);
    }

    return Blog.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  /* =========================
     DELETE BLOG
  ========================= */
  async delete(id) {
    return Blog.findByIdAndDelete(id);
  }
}

module.exports = new BlogService();