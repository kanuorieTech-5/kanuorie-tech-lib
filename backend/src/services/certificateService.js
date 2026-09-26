const crypto = require("crypto");

const Certificate = require("../models/Certificate");
const User = require("../models/User");
const Course = require("../models/Course");
const Progress = require("../models/Progress");

/* ==========================================
   CERTIFICATE SERVICE
========================================== */

class CertificateService {
  /* ------------------------------------------
     GENERATE CERTIFICATE ID
  ------------------------------------------ */

  generateCertificateId() {
    const year = new Date().getFullYear();

    const randomPart = crypto
      .randomBytes(5)
      .toString("hex")
      .toUpperCase();

    return `KT-${year}-${randomPart}`;
  }

  /* ------------------------------------------
     ISSUE CERTIFICATE
  ------------------------------------------ */

  async issueCertificate({
    userId,
    courseId,
    progressId,
  }) {
    /*
     * Prevent duplicate certificates.
     */

    const existingCertificate =
      await Certificate.findOne({
        user: userId,
        course: courseId,
      })
        .populate("course", "title instructor")
        .populate("user", "firstName lastName email");

    if (existingCertificate) {
      return existingCertificate;
    }

    const [user, course, progress] =
      await Promise.all([
        User.findById(userId),
        Course.findById(courseId),
        Progress.findById(progressId),
      ]);

    if (!user) {
      throw new Error("User not found.");
    }

    if (!course) {
      throw new Error("Course not found.");
    }

    if (!progress) {
      throw new Error("Progress record not found.");
    }

    if (!progress.completed || progress.percentage < 100) {
      throw new Error(
        "Certificate can only be issued after course completion."
      );
    }

    const recipientName =
      `${user.firstName || ""} ${user.lastName || ""}`
        .trim() || user.email;

    let instructor = "KanuorieTech";

    if (typeof course.instructor === "string") {
      instructor = course.instructor;
    } else if (
      course.instructor &&
      typeof course.instructor === "object"
    ) {
      instructor =
        course.instructor.name ||
        course.instructor.fullName ||
        "KanuorieTech";
    }

    const completionDate =
      progress.completedAt || new Date();

    /*
     * Generate and save the certificate.
     *
     * The unique user + course index prevents
     * duplicate certificates.
     */

    let certificate;

    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        certificate = await Certificate.create({
          certificateId:
            this.generateCertificateId(),

          user: user._id,
          course: course._id,
          progress: progress._id,

          recipientName,
          courseTitle: course.title,
          instructor,

          completionDate,
          issuedAt: new Date(),

          status: "issued",
        });

        break;
      } catch (error) {
        /*
         * If another request created the certificate
         * concurrently, return that certificate.
         */

        if (error.code === 11000) {
          const duplicate =
            await Certificate.findOne({
              user: userId,
              course: courseId,
            })
              .populate(
                "course",
                "title instructor"
              )
              .populate(
                "user",
                "firstName lastName email"
              );

          if (duplicate) {
            certificate = duplicate;
            break;
          }
        }

        if (attempt === 2) {
          throw error;
        }
      }
    }

    /*
     * Keep Progress synchronized with the certificate.
     */

    if (!progress.certificateIssued) {
      progress.certificateIssued = true;
      await progress.save();
    }

    return certificate;
  }

  /* ------------------------------------------
     GET USER CERTIFICATES
  ------------------------------------------ */

  async getUserCertificates(userId) {
    return Certificate.find({
      user: userId,
    })
      .populate(
        "course",
        "title description image category level duration language instructor"
      )
      .sort({
        issuedAt: -1,
      });
  }

  /* ------------------------------------------
     GET SINGLE USER CERTIFICATE
  ------------------------------------------ */

  async getUserCertificate(
    userId,
    certificateId
  ) {
    return Certificate.findOne({
      user: userId,
      certificateId,
    })
      .populate(
        "course",
        "title description image category level duration language instructor"
      )
      .populate(
        "user",
        "firstName lastName email"
      );
  }

  /* ------------------------------------------
     PUBLIC VERIFICATION
  ------------------------------------------ */

  async verifyCertificate(certificateId) {
    return Certificate.findOne({
      certificateId,
    })
      .populate(
        "course",
        "title description category level duration language instructor"
      )
      .populate(
        "user",
        "firstName lastName"
      );
  }
}

module.exports = new CertificateService();
