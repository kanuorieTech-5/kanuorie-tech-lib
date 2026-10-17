const Opportunity = require("../models/Opportunity");
const slugify = require("../helpers/slugify");

class OpportunityService {
  async create(data, user) {
    const payload = {
      ...data,
      slug: slugify(data.title),
      createdBy: user?._id || null,
      publishedAt: data.published ? new Date() : null,
    };

    return Opportunity.create(payload);
  }

  async getAll(query = {}, { publicOnly = false } = {}) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 12));
    const skip = (page - 1) * limit;
    const filter = {};

    if (publicOnly) {
      filter.published = true;
      filter.status = "open";
    } else if (query.published !== undefined) {
      filter.published = query.published === "true";
    }

    if (
      !publicOnly &&
      query.status &&
      ["open", "closed"].includes(query.status)
    ) {
      filter.status = query.status;
    }

    if (query.type) {
      filter.type = query.type;
    }

    if (query.category) {
      filter.category = query.category;
    }

    if (query.featured !== undefined) {
      filter.featured = query.featured === "true";
    }

    if (query.search) {
      const search = String(query.search).trim().slice(0, 100);
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escaped, "i");

      filter.$or = [
        { title: regex },
        { organization: regex },
        { description: regex },
        { category: regex },
        { location: regex },
      ];
    }

    const [items, total] = await Promise.all([
      Opportunity.find(filter)
        .sort({ featured: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Opportunity.countDocuments(filter),
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

  async getById(identifier, { publicOnly = false } = {}) {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);

    const query = isObjectId
      ? { _id: identifier }
      : { slug: identifier };

    if (publicOnly) {
      query.published = true;
      query.status = "open";
    }

    return Opportunity.findOne(query).lean();
  }

  async update(id, data) {
    const existing = await Opportunity.findById(id);

    if (!existing) {
      return null;
    }

    const payload = { ...data };

    if (payload.title) {
      payload.slug = slugify(payload.title);
    }

    if (payload.published === true && !existing.published) {
      payload.publishedAt = new Date();
    }

    if (payload.published === false) {
      payload.publishedAt = null;
    }

    return Opportunity.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id) {
    return Opportunity.findByIdAndDelete(id);
  }
}

module.exports = new OpportunityService();