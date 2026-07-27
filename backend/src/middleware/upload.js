const multer = require("multer");
const path = require("path");

/* =========================
   MEMORY STORAGE
========================= */
const storage = multer.memoryStorage();

/* =========================
   FILE FILTER
========================= */
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
  ];

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

/* =========================
   MULTER CONFIG
========================= */
const upload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 10 * 1024 * 1024, // 5MB
  },
});

/* =========================
   EXPORTS
========================= */

module.exports = {
  single: (field = "image") => upload.single(field),

  multiple: (field = "images", max = 10) =>
    upload.array(field, max),

  fields: (fields) => upload.fields(fields),
};