const { Course, Progress } = require("../models");

/* =========================
   ➕ SAVE / ENROLL COURSE
========================= */
exports.saveCourse = async (req, res) => {
  try {
        console.log("BODY:", req.body);
        console.log("USER:", req.user);

    const { title, category, image, link, courseId } = req.body;

       if (courseId) {
      const existing = await Progress.findOne({
        where: {
          userId: req.user.id,
          courseId,
        },
      });

      if (existing) {
        return res.status(400).json({ message: "Already enrolled" });
      }

      const progress = await Progress.create({
        userId: req.user.id,
        courseId,
        progress: 0,
        completed: false,
      });

      return res.status(201).json(progress);
    }

    const course = await Course.create({
      title,
      category,
      image,
      link,
      userId: req.user.id,
    });
    console.log("COURSE CREATED:", course);

    // 🔥 create progress automatically
   if (course?.id) {
  await Progress.create({
    userId: req.user.id,
    courseId: course.id,
    progress: 0,
    completed: false,
  });
}
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   📥 GET USER COURSES
========================= */
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Progress,
          attributes: ["progress", "completed"],
        },
      ],
    });

    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   ❌ DELETE COURSE
========================= */
exports.deleteCourse = async (req, res) => {
  try {
    const deleted = await Course.destroy({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!deleted) {
      return res.status(404).json({ message: "Course not found" });
    }

    await Progress.destroy({
      where: {
        userId: req.user.id,
        courseId: req.params.id,
      },
    });

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   🔄 UPDATE PROGRESS
========================= */
exports.updateProgress = async (req, res) => {
  try {
    const { progress } = req.body;
    const courseId = req.params.id;

    const course = await Course.findOne({
      where: {
        id: courseId,
        userId: req.user.id,
      },
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const now = new Date();

    if (record.lastProgressUpdate) {
      const last = new Date(record.lastProgressUpdate);

      const isSameDay =
        last.getFullYear() === now.getFullYear() &&
        last.getMonth() === now.getMonth() &&
        last.getDate() === now.getDate();

      if (isSameDay) {
        const nextAvailable = new Date(last);
        nextAvailable.setDate(nextAvailable.getDate() + 1);
        nextAvailable.setHours(0, 0, 0, 0);

        return res.status(400).json({
          message: "Progress already updated today. Try tomorrow.",
          nextAvailable,
        });
      }
    }

    course.progress = Math.min(progress, 100);
    course.completed = progress >= 100;
    course.lastProgressUpdate = new Date();

    await course.save();

    return res.json({
      progress: course.progress,
      completed: course.completed,
    });
  } catch (err) {
    console.error("Progress error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   📝 UPDATE NOTES
========================= */
exports.updateNotes = async (req, res) => {
  try {
    const { notes } = req.body;

    const course = await Course.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.notes = notes;
    await course.save();

    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};