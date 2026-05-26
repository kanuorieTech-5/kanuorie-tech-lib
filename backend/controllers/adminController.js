const { User, Course, Progress, Book } = require("../models");
const { Op, fn, col, literal } = require("sequelize");

/* =========================
   🔐 ADMIN CHECK MIDDLEWARE
========================= */
const isAdmin = (req, res) => {
  if (req.user.role !== "admin") {
    res.status(403);
    throw new Error("Admin access only");
  }
};

/* =========================
   📊 GET DASHBOARD STATS
========================= */
exports.getStats = async (req, res) => {
  try {
    /* =========================
       📊 TOTALS
    ========================= */
    const totalUsers = await User.count();
    const totalCourses = await Course.count();
    const totalBooks = await Book.count();
    const totalProgress = await Progress.count();

    /* =========================
       📈 USER GROWTH (LAST 7 DAYS)
    ========================= */
    const userGrowth = await User.findAll({
      attributes: [
        [fn("DATE", col("createdAt")), "date"],
        [fn("COUNT", col("id")), "count"],
      ],
      where: {
        createdAt: {
          [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
      group: [fn("DATE", col("createdAt"))],
      order: [[fn("DATE", col("createdAt")), "ASC"]],
      raw: true,
    });

    /* =========================
       📚 BOOK CREATION TREND
    ========================= */
    const bookTrend = await Book.findAll({
      attributes: [
        [fn("DATE", col("createdAt")), "date"],
        [fn("COUNT", col("id")), "count"],
      ],
      group: [fn("DATE", col("createdAt"))],
      order: [[fn("DATE", col("createdAt")), "ASC"]],
      raw: true,
    });

    /* =========================
       📊 COURSE ENGAGEMENT
    ========================= */
    const courseEngagement = await Progress.findAll({
      attributes: [
        "courseId",
        [fn("COUNT", col("id")), "count"],
      ],
      group: ["courseId"],
      raw: true,
    });

    res.json({
      totals: {
        users: totalUsers,
        courses: totalCourses,
        books: totalBooks,
        progress: totalProgress,
      },

      charts: {
        userGrowth: userGrowth.map((u) => ({
          date: u.date,
          users: parseInt(u.count),
        })),

        bookTrend: bookTrend.map((b) => ({
          date: b.date,
          books: parseInt(b.count),
        })),

        courseEngagement: courseEngagement.map((c) => ({
          courseId: c.courseId,
          activity: parseInt(c.count),
        })),
      },
    });
  } catch (err) {
    console.error("Stats Error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   👥 GET ALL USERS
========================= */
exports.getUsers = async (req, res) => {
  try {
    isAdmin(req, res);

    const users = await User.findAll({
      attributes: { exclude: ["password"] },
      include: [Course, Progress], // 🔥 include relations
    });

    res.json(users);
  } catch (err) {
    console.error("Get Users Error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   🗑 DELETE USER
========================= */
exports.deleteUser = async (req, res) => {
  try {
    isAdmin(req, res);

    const userId = parseInt(req.params.id);

    // 🚫 Prevent admin deleting themselves
    if (req.user.id === userId) {
      return res.status(400).json({ message: "You cannot delete yourself" });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.destroy();

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete User Error:", err);
    res.status(500).json({ message: err.message });
  }
};
