const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

const certificateService = require("../services/certificateService");

/* ==========================================
   GET MY CERTIFICATES
========================================== */

const getMyCertificates = asyncHandler(
  async (req, res) => {
    const certificates =
      await certificateService.getUserCertificates(
        req.user._id
      );

    return ApiResponse.success(
      res,
      certificates,
      "Certificates retrieved successfully."
    );
  }
);

/* ==========================================
   GET MY CERTIFICATE
========================================== */

const getMyCertificate = asyncHandler(
  async (req, res) => {
    const certificate =
      await certificateService.getUserCertificate(
        req.user._id,
        req.params.certificateId
      );

    if (!certificate) {
      throw new ApiError(
        404,
        "Certificate not found."
      );
    }

    return ApiResponse.success(
      res,
      certificate,
      "Certificate retrieved successfully."
    );
  }
);

/* ==========================================
   VERIFY CERTIFICATE
   PUBLIC ENDPOINT
========================================== */

const verifyCertificate = asyncHandler(
  async (req, res) => {
    const certificate =
      await certificateService.verifyCertificate(
        req.params.certificateId
      );

    if (!certificate) {
      throw new ApiError(
        404,
        "Certificate not found or invalid."
      );
    }

    return ApiResponse.success(
      res,
      {
        valid:
          certificate.status === "issued",
        certificate,
      },
      "Certificate verification completed."
    );
  }
);

module.exports = {
  getMyCertificates,
  getMyCertificate,
  verifyCertificate,
};
