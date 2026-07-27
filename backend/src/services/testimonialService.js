const Testimonial = require("../models/Testimonial");
const ApiError = require("../utils/ApiError");

class TestimonialService {
  /* ==========================================
     CREATE TESTIMONIAL
  ========================================== */

  async create(data) {
    const existing = await Testimonial.findOne({
      name: data.name,
      company: data.company,
      message: data.message,
    });

    if (existing) {
      throw new ApiError(
        409,
        "Testimonial already exists."
      );
    }

    return Testimonial.create(data);
  }

  /* ==========================================
     GET ALL TESTIMONIALS
  ========================================== */

  async getAll(query = {}) {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.max(Number(query.limit) || 10, 1);
    const skip = (page - 1) * limit;

    const filter = {};

    if (query.active !== undefined) {
      filter.active = query.active === "true";
    }

    if (query.featured !== undefined) {
      filter.featured = query.featured === "true";
    }

    if (query.rating) {
      filter.rating = Number(query.rating);
    }

    if (query.search) {
      const search = query.search.trim();

      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          company: {
            $regex: search,
            $options: "i",
          },
        },
        {
          position: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const [items, total] = await Promise.all([
      Testimonial.find(filter)
        .sort({
          order: 1,
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit)
        .lean(),

      Testimonial.countDocuments(filter),
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

  /* ==========================================
     GET SINGLE TESTIMONIAL
  ========================================== */

  async getById(id) {
    return Testimonial.findById(id).lean();
  }

  /* ==========================================
     UPDATE TESTIMONIAL
  ========================================== */

  async update(id, data) {
    return Testimonial.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
        runValidators: true,
      }
    );
  }

  /* ==========================================
     DELETE TESTIMONIAL
  ========================================== */

  async delete(id) {
    return Testimonial.findByIdAndDelete(id);
  }

  /* ==========================================
     FEATURED TESTIMONIALS
  ========================================== */

  async featured() {
    return Testimonial.find({
      featured: true,
      active: true,
    })
      .sort({
        order: 1,
        createdAt: -1,
      })
      .lean();
  }

  /* ==========================================
     ACTIVE TESTIMONIALS
  ========================================== */

  async active() {
    return Testimonial.find({
      active: true,
    })
      .sort({
        order: 1,
        createdAt: -1,
      })
      .lean();
  }

  /* ==========================================
     TESTIMONIAL STATISTICS
  ========================================== */

  async stats() {
    const [
      total,
      active,
      inactive,
      featured,
      averageRating,
    ] = await Promise.all([
      Testimonial.countDocuments(),
      Testimonial.countDocuments({ active: true }),
      Testimonial.countDocuments({ active: false }),
      Testimonial.countDocuments({ featured: true }),
      Testimonial.aggregate([
        {
          $group: {
            _id: null,
            average: {
              $avg: "$rating",
            },
          },
        },
      ]),
    ]);

    return {
      total,
      active,
      inactive,
      featured,
      averageRating:
        averageRating[0]?.average?.toFixed(1) || 0,
    };
  }
}

module.exports = new TestimonialService();