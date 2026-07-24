const { User, Book, Course, Notification, Progress } = require("../models");

/* =========================
   👤 GET FULL USER PROFILE
========================= */
const getFullUserProfile = async (req, res) => {
  try {
    const requestedUserId = parseInt(req.params.id);

    // 🔐 Only allow owner or admin
    if (req.user.id !== requestedUserId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await User.findByPk(requestedUserId, {
      include: [Book, Course, Notification, Progress],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Fetch User Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   👤 UPDATE PROFILE ONLY
========================= */
const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const allowedFields = ["name", "email", "bio", "avatar"];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    await user.update(updates);

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      avatar: user.avatar,
      role: user.role,
      settings: user.settings,
    });
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   ⚙️ UPDATE SETTINGS ONLY
========================= */
const updateSettings = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.settings = {
      ...user.settings,
      ...req.body,
    };

    await user.save();

    res.json(user.settings);
  } catch (err) {
    console.error("Update Settings Error:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  updateUser,
  updateSettings,
  getFullUserProfile,
};