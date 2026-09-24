const multer = require("multer");

const storage = multer.memoryStorage();

const assessmentUpload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

module.exports = assessmentUpload;
