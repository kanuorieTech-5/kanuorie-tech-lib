const Team = require("../models/Team");
const ApiError = require("../utils/ApiError");

class TeamService {
  /* ==========================================
     CREATE TEAM MEMBER
  ========================================== */

  async create(data) {
    const existing = await Team.findOne({
      firstName: data.firstName,
      lastName: data.lastName,
      position: data.position,
    });

    if (existing) {
      throw new ApiError(
        409,
        "Team member already exists."
      );
    }

    return Team.create(data);
  }

  /* ==========================================
     GET ALL TEAM MEMBERS
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

    if (query.position) {
      filter.position = query.position;
    }

    if (query.search) {
      filter.$or = [
        {
          firstName: {
            $regex: query.search,
            $options: "i",
          },
        },
        {
          lastName: {
            $regex: query.search,
            $options: "i",
          },
        },
        {
          position: {
            $regex: query.search,
            $options: "i",
          },
        },
      ];
    }

    const [items, total] = await Promise.all([
      Team.find(filter)
        .sort({
          order: 1,
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit)
        .lean(),

      Team.countDocuments(filter),
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
     GET SINGLE MEMBER
  ========================================== */

  async getById(id) {
    return Team.findById(id).lean();
  }

  /* ==========================================
     UPDATE TEAM MEMBER
  ========================================== */

  async update(id, data) {
    return Team.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
        runValidators: true,
      }
    );
  }

  /* ==========================================
     DELETE TEAM MEMBER
  ========================================== */

  async delete(id) {
    return Team.findByIdAndDelete(id);
  }

  /* ==========================================
     FEATURED MEMBERS
  ========================================== */

  async featured() {
    return Team.find({
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
     ACTIVE MEMBERS
  ========================================== */

  async active() {
    return Team.find({
      active: true,
    })
      .sort({
        order: 1,
        createdAt: -1,
      })
      .lean();
  }

  /* ==========================================
     TEAM STATISTICS
  ========================================== */

  async stats() {
    const [
      total,
      active,
      inactive,
      featured,
    ] = await Promise.all([
      Team.countDocuments(),
      Team.countDocuments({ active: true }),
      Team.countDocuments({ active: false }),
      Team.countDocuments({ featured: true }),
    ]);

    return {
      total,
      active,
      inactive,
      featured,
    };
  }
}

module.exports = new TeamService();