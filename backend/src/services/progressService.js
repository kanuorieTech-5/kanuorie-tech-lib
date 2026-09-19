const Progress = require("../models/Progress");
const Course = require("../models/Course");

/* ==========================================
   PROGRESS SERVICE
========================================== */

class ProgressService {
  /* ==========================================
     FORMAT A PROGRESS RECORD

     Keeps curriculum/modules out of the
     Learning Hub response while providing
     the total lesson count needed to display:

       8 / 20 lessons completed
  ========================================== */

  async formatProgress(progress) {
    if (!progress) {
      return null;
    }

    const course = progress.course;

    if (!course) {
      return null;
    }

    const totalLessons = (course.modules || []).reduce(
      (total, module) =>
        total + (module.lessons || []).length,
      0
    );

    return {
      _id: progress._id,
      user: progress.user,
      course: {
        _id: course._id,
        title: course.title,
        description: course.description,
        image: course.image,
        category: course.category,
        level: course.level,
        duration: course.duration,
        language: course.language,
        instructor: course.instructor,
        published: course.published,
        featured: course.featured,
        premium: course.premium,
      },
      percentage: progress.percentage,
      status: progress.status,
      completed: progress.completed,
      completedLessons: progress.completedLessons || [],
      totalLessons,
      currentLesson: progress.currentLesson || null,
      lastAccessed: progress.lastAccessed,
      completedAt: progress.completedAt,
      lastProgressUpdate: progress.lastProgressUpdate,
      createdAt: progress.createdAt,
      updatedAt: progress.updatedAt,
    };
  }

  /* ==========================================
     GET ALL PROGRESS FOR A USER

     Only the authenticated user's enrolled
     courses are returned.
  ========================================== */

  async getUserProgress(userId) {
    const progressRecords = await Progress.find({
      user: userId,
    })
      .populate({
        path: "course",
        select:
          "title description image category level duration language instructor published featured premium modules",
      })
      .sort({
        lastAccessed: -1,
      });

    const formatted = await Promise.all(
      progressRecords.map((progress) =>
        this.formatProgress(progress)
      )
    );

    return formatted.filter(Boolean);
  }

  /* ==========================================
     GET PROGRESS FOR ONE COURSE
  ========================================== */

  async getCourseProgress(userId, courseId) {
    const progress = await Progress.findOne({
      user: userId,
      course: courseId,
    }).populate({
      path: "course",
      select:
        "title description image category level duration language instructor published featured premium modules",
    });

    return this.formatProgress(progress);
  }

  /* ==========================================
     UPDATE PROGRESS
  ========================================== */

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
    } else {
      progress.percentage = percentage;
      progress.completed = percentage >= 100;
      progress.lastAccessed = new Date();

      await progress.save();
    }

    await progress.populate({
      path: "course",
      select:
        "title description image category level duration language instructor published featured premium modules",
    });

    return this.formatProgress(progress);
  }

  /* ==========================================
     COMPLETE COURSE
  ========================================== */

  async completeCourse(userId, courseId) {
    const progress = await Progress.findOneAndUpdate(
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
    ).populate({
      path: "course",
      select:
        "title description image category level duration language instructor published featured premium modules",
    });

    return this.formatProgress(progress);
  }

  /* ==========================================
     RESET PROGRESS
  ========================================== */

  async resetProgress(userId, courseId) {
    const progress = await Progress.findOneAndUpdate(
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
    ).populate({
      path: "course",
      select:
        "title description image category level duration language instructor published featured premium modules",
    });

    return this.formatProgress(progress);
  }

  /* ==========================================
     CONTINUE LEARNING
  ========================================== */

  async getContinueLearning(userId) {
    const progressRecords = await Progress.find({
      user: userId,
      completed: false,
    })
      .populate({
        path: "course",
        select:
          "title description image category level duration language instructor published featured premium modules",
      })
      .sort({
        lastAccessed: -1,
      })
      .limit(10);

    const formatted = await Promise.all(
      progressRecords.map((progress) =>
        this.formatProgress(progress)
      )
    );

    return formatted.filter(Boolean);
  }

  /* ==========================================
     COMPLETED COURSES
  ========================================== */

  async getCompletedCourses(userId) {
    const progressRecords = await Progress.find({
      user: userId,
      completed: true,
    })
      .populate({
        path: "course",
        select:
          "title description image category level duration language instructor published featured premium modules",
      })
      .sort({
        completedAt: -1,
      });

    const formatted = await Promise.all(
      progressRecords.map((progress) =>
        this.formatProgress(progress)
      )
    );

    return formatted.filter(Boolean);
  }

  /* ==========================================
     DELETE PROGRESS
  ========================================== */

  async deleteProgress(userId, courseId) {
    return await Progress.findOneAndDelete({
      user: userId,
      course: courseId,
    });
  }

  /* ==========================================
     USER STATISTICS
  ========================================== */

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
