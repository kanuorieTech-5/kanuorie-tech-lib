const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const { Course, Progress } = require("../models");

/* =========================
   🔄 UPDATE PROGRESS
========================= */
router.put("/", protect, async (req, res) => {
  try {
    const { userId, courseId, progress } = req.body;

    console.log("BODY:", req.body);

    // ✅ find course (keeps your logic intact)
    const course = await Course.findOne({
      where: {
        id: courseId,
        userId: userId,
      },
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // ✅ find or create progress record
    let record = await Progress.findOne({
      where: {
        userId,
        courseId,
      },
    });

    if (!record) {
      record = await Progress.create({
        userId,
        courseId,
        progress: 0,
        completed: false,
      });
    }

    // ✅ sanitize
    const safeProgress = Math.max(0, Math.min(progress, 100));

    const now = new Date();

    // ✅ daily restriction (same as your controller logic)
    if (record.lastProgressUpdate) {
      const last = new Date(record.lastProgressUpdate);

      const isSameDay =
        last.getFullYear() === now.getFullYear() &&
        last.getMonth() === now.getMonth() &&
        last.getDate() === now.getDate();

      if (isSameDay) {
        return res.status(400).json({
          message: "Progress already updated today. Try tomorrow.",
        });
      }
    }

    // ✅ update progress (NEW SYSTEM)
    record.progress = safeProgress;
    record.completed = safeProgress >= 100;
    record.lastProgressUpdate = new Date();

    await record.save();

    // 🔥 OPTIONAL: keep backward compatibility (if frontend still reads course.progress)
    course.progress = safeProgress;
    course.lastProgressUpdate = new Date();
    await course.save();

    return res.json({
      progress: record.progress,
      completed: record.completed,
    });
  } catch (err) {
    console.error("PROGRESS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;