const Progress = require("../models/Progress");
const Course = require("../models/Course");

class ProgressService {
  /* =========================
     GET USER PROGRESS
  ========================= */
  async getUserProgress(userId) {
    return await Progress.find({ user: userId })
      .populate("course")
      .sort({ updatedAt: -1 });
  }

  /* =========================
     GET COURSE PROGRESS
  ========================= */
  async getCourseProgress(userId, courseId) {
    return await Progress.findOne({
      user: userId,
      course: courseId,
    }).populate("course");
  }

  /* =========================
     CREATE OR UPDATE PROGRESS
  ========================= */
  async updateProgress(userId, courseId, percentage) {
    let progress = await Progress.findOne({
      user: userId,
      course: courseId,
    });

    if (!progress) {
      progress = await Progress.create({
        user: userId,
        course: courseId,
        percentage,
        completed: percentage >= 100,
        lastAccessed: new Date(),
      });

      return progress.populate("course");
    }

    progress.percentage = percentage;
    progress.completed = percentage >= 100;
    progress.lastAccessed = new Date();

    await progress.save();

    return progress.populate("course");
  }

  /* =========================
     COMPLETE COURSE
  ========================= */
  async completeCourse(userId, courseId) {
    return await Progress.findOneAndUpdate(
      {
        user: userId,
        course: courseId,
      },
      {
        percentage: 100,
        completed: true,
        completedAt: new Date(),
        lastAccessed: new Date(),
      },
      {
        new: true,
        upsert: true,
      }
    ).populate("course");
  }

  /* =========================
     RESET COURSE
  ========================= */
  async resetProgress(userId, courseId) {
    return await Progress.findOneAndUpdate(
      {
        user: userId,
        course: courseId,
      },
      {
        percentage: 0,
        completed: false,
        completedAt: null,
        lastAccessed: new Date(),
      },
      {
        new: true,
      }
    );
  }

  /* =========================
     CONTINUE LEARNING
  ========================= */
  async getContinueLearning(userId) {
    return await Progress.find({
      user: userId,
      completed: false,
    })
      .populate("course")
      .sort({
        lastAccessed: -1,
      })
      .limit(10);
  }

  /* =========================
     COMPLETED COURSES
  ========================= */
  async getCompletedCourses(userId) {
    return await Progress.find({
      user: userId,
      completed: true,
    })
      .populate("course")
      .sort({
        completedAt: -1,
      });
  }

  /* =========================
     DELETE PROGRESS
  ========================= */
  async deleteProgress(userId, courseId) {
    return await Progress.findOneAndDelete({
      user: userId,
      course: courseId,
    });
  }

  /* =========================
     USER STATISTICS
  ========================= */
  async getStatistics(userId) {
    const totalCourses = await Progress.countDocuments({
      user: userId,
    });

    const completedCourses = await Progress.countDocuments({
      user: userId,
      completed: true,
    });

    const inProgress = await Progress.countDocuments({
      user: userId,
      completed: false,
    });

    const avg = await Progress.aggregate([
      {
        $match: {
          user: userId,
        },
      },
      {
        $group: {
          _id: null,
          average: {
            $avg: "$percentage",
          },
        },
      },
    ]);

    return {
      totalCourses,
      completedCourses,
      inProgress,
      averageProgress: avg.length
        ? Math.round(avg[0].average)
        : 0,
    };
  }
}

module.exports = new ProgressService();