const multer = require("multer");

/* ==========================================
   MEMORY STORAGE
========================================== */

const storage = multer.memoryStorage();

/* ==========================================
   ALLOWED IMAGE TYPES
========================================== */

const allowedTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

/* ==========================================
   FILE FILTER
========================================== */

const fileFilter = (req, file, cb) => {
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(
      new Error(
        "Only JPG, JPEG, PNG, WEBP, GIF and SVG images are allowed."
      ),
      false
    );
  }

  cb(null, true);
};

/* ==========================================
   MULTER INSTANCE
========================================== */

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

/* ==========================================
   EXPORTS
========================================== */

module.exports = upload;