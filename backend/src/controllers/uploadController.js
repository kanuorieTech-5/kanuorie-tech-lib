const cloudinary = require("../config/cloudinary");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

/* ==========================================
   UPLOAD FILE
========================================== */

const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Please select a file to upload.");
  }

  const folder = req.body.folder || "kanuorietech";

  const dataURI = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
    "base64"
  )}`;

  const result = await cloudinary.uploader.upload(dataURI, {
    folder,
    resource_type: "auto",

    transformation: [
      {
        width: 1200,
        crop: "limit",
      },
      {
        quality: "auto",
      },
      {
        fetch_format: "auto",
      },
    ],
  });

  return ApiResponse.success(
    res,
    {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      resourceType: result.resource_type,
      createdAt: result.created_at,
    },
    "File uploaded successfully."
  );
});

/* ==========================================
   DELETE FILE
========================================== */

const deleteImage = asyncHandler(async (req, res) => {
  const { publicId } = req.params;

  if (!publicId) {
    throw new ApiError(400, "Public ID is required.");
  }

  await cloudinary.uploader.destroy(publicId, {
    resource_type: "auto",
  });

  return ApiResponse.success(
    res,
    null,
    "File deleted successfully."
  );
});

/* ==========================================
   EXPORTS
========================================== */

module.exports = {
   uploadImage,
   deleteImage,
};