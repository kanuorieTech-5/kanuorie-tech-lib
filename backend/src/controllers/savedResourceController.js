const SavedResource = require("../models/SavedResource");

/* ==========================================
   VALID RESOURCE TYPES
========================================== */

const RESOURCE_TYPES = [
  "course",
  "book",
  "external",
];

/* ==========================================
   NORMALIZE RESOURCE TYPE
========================================== */

const normalizeResourceType = (value) => {
  if (!value) return "";

  return String(value)
    .trim()
    .toLowerCase();
};

/* ==========================================
   GET SAVED RESOURCES
========================================== */

const getSavedResources = async (req, res, next) => {
  try {
    const savedResources = await SavedResource.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      message: "Saved resources retrieved successfully.",
      data: {
        items: savedResources,
        count: savedResources.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* ==========================================
   SAVE RESOURCE
========================================== */

const saveResource = async (req, res, next) => {
  try {
    const {
      resourceId,
      resourceType,
      title,
      description,
      category,
      image,
      link,
    } = req.body;

    /* ========================================
       NORMALIZE VALUES
    ======================================== */

    const normalizedResourceId =
      resourceId !== undefined &&
      resourceId !== null
        ? String(resourceId).trim()
        : "";

    const normalizedResourceType =
      normalizeResourceType(resourceType);

    /* ========================================
       VALIDATION
    ======================================== */

    if (!normalizedResourceId) {
      return res.status(400).json({
        success: false,
        message: "resourceId is required.",
      });
    }

    if (!RESOURCE_TYPES.includes(normalizedResourceType)) {
      return res.status(400).json({
        success: false,
        message:
          'resourceType must be "course", "book", or "external".',
      });
    }

    if (
      typeof title !== "string" ||
      !title.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Resource title is required.",
      });
    }

    /* ========================================
       CHECK FOR EXISTING SAVE
    ======================================== */

    const existing = await SavedResource.findOne({
      user: req.user._id,
      resourceId: normalizedResourceId,
      resourceType: normalizedResourceType,
    });

    if (existing) {
      return res.status(200).json({
        success: true,
        message: "Resource is already saved.",
        data: {
          resource: existing,
          alreadySaved: true,
        },
      });
    }

    /* ========================================
       CREATE SAVED RESOURCE
    ======================================== */

    const savedResource =
      await SavedResource.create({
        user: req.user._id,

        resourceId: normalizedResourceId,

        resourceType:
          normalizedResourceType,

        title: title.trim(),

        description:
          typeof description === "string"
            ? description.trim()
            : "",

        category:
          typeof category === "string" &&
          category.trim()
            ? category.trim()
            : "General",

        image:
          typeof image === "string"
            ? image.trim()
            : "",

        link:
          typeof link === "string"
            ? link.trim()
            : "",
      });

    return res.status(201).json({
      success: true,
      message: "Resource saved successfully.",
      data: {
        resource: savedResource,
        alreadySaved: false,
      },
    });
  } catch (error) {
    /* ========================================
       HANDLE DUPLICATE INDEX RACE CONDITION
    ======================================== */

    if (error.code === 11000) {
      const resourceId =
        req.body?.resourceId !== undefined &&
        req.body?.resourceId !== null
          ? String(req.body.resourceId).trim()
          : "";

      const resourceType =
        normalizeResourceType(
          req.body?.resourceType
        );

      const existing =
        await SavedResource.findOne({
          user: req.user._id,
          resourceId,
          resourceType,
        });

      return res.status(200).json({
        success: true,
        message: "Resource is already saved.",
        data: {
          resource: existing,
          alreadySaved: true,
        },
      });
    }

    next(error);
  }
};

/* ==========================================
   REMOVE SAVED RESOURCE
========================================== */

const removeSavedResource = async (
  req,
  res,
  next
) => {
  try {
    const { resourceId } = req.params;
    const { resourceType } = req.query;

    const normalizedResourceId =
      resourceId
        ? String(resourceId).trim()
        : "";

    const normalizedResourceType =
      normalizeResourceType(resourceType);

    /* ========================================
       VALIDATION
    ======================================== */

    if (!normalizedResourceId) {
      return res.status(400).json({
        success: false,
        message: "resourceId is required.",
      });
    }

    if (
      normalizedResourceType &&
      !RESOURCE_TYPES.includes(
        normalizedResourceType
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          'resourceType must be "course", "book", or "external".',
      });
    }

    /* ========================================
       BUILD FILTER

       Always restrict by current user.
       This prevents one user from removing
       another user's saved resource.
    ======================================== */

    const filter = {
      user: req.user._id,
      resourceId: normalizedResourceId,
    };

    if (normalizedResourceType) {
      filter.resourceType =
        normalizedResourceType;
    }

    /* ========================================
       DELETE
    ======================================== */

    const deletedResource =
      await SavedResource.findOneAndDelete(
        filter
      );

    if (!deletedResource) {
      return res.status(404).json({
        success: false,
        message: "Saved resource not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Resource removed from saved resources.",
      data: {
        resource: deletedResource,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* ==========================================
   CHECK WHETHER RESOURCE IS SAVED
========================================== */

const checkSavedResource = async (
  req,
  res,
  next
) => {
  try {
    const { resourceId } = req.params;
    const { resourceType } = req.query;

    const normalizedResourceId =
      resourceId
        ? String(resourceId).trim()
        : "";

    const normalizedResourceType =
      normalizeResourceType(resourceType);

    /* ========================================
       VALIDATION
    ======================================== */

    if (!normalizedResourceId) {
      return res.status(400).json({
        success: false,
        message: "resourceId is required.",
      });
    }

    if (
      normalizedResourceType &&
      !RESOURCE_TYPES.includes(
        normalizedResourceType
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          'resourceType must be "course", "book", or "external".',
      });
    }

    /* ========================================
       BUILD FILTER
    ======================================== */

    const filter = {
      user: req.user._id,
      resourceId: normalizedResourceId,
    };

    if (normalizedResourceType) {
      filter.resourceType =
        normalizedResourceType;
    }

    /* ========================================
       FIND RESOURCE
    ======================================== */

    const resource =
      await SavedResource.findOne(filter);

    return res.status(200).json({
      success: true,
      data: {
        saved: Boolean(resource),
        resource: resource || null,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* ==========================================
   EXPORTS
========================================== */

module.exports = {
  getSavedResources,
  saveResource,
  removeSavedResource,
  checkSavedResource,
};