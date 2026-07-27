const FAQ = require("../models/FAQ");

class FAQService {
  async create(data) {
    return FAQ.create(data);
  }

  async getAll(query = {}) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    if (query.category) {
      filter.category = query.category;
    }

    if (query.active !== undefined) {
      filter.active = query.active === "true";
    }

    if (query.search) {
      filter.question = {
        $regex: query.search,
        $options: "i",
      };
    }

    const [items, total] = await Promise.all([
      FAQ.find(filter)
        .sort({ order: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit),

      FAQ.countDocuments(filter),
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

  async getById(id) {
    return FAQ.findById(id);
  }

  async update(id, data) {
    return FAQ.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id) {
    return FAQ.findByIdAndDelete(id);
  }

  async featured() {
    return FAQ.find({
      featured: true,
      active: true,
    }).sort({ order: 1 });
  }
}

module.exports = new FAQService();