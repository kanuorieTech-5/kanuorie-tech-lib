const Learning = require("../models/Learning");

const paginate = require("../helpers/pagination");
const buildQuery = require("../helpers/queryBuilder");

/* =========================
   CREATE LEARNING RESOURCE
========================= */

exports.create = async (data, user) => {
  const resource = await Learning.create({
    ...data,
    createdBy: user._id,
  });

  return resource;
};

/* =========================
   GET LEARNING RESOURCES
========================= */

exports.getAll = async (query = {}) => {
  const filters = buildQuery(query);

  const { page, limit, skip } = paginate(
    query.page,
    query.limit
  );

  const resources = await Learning.find(filters)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Learning.countDocuments(filters);

  return {
    resources,
    page,
    pages: Math.ceil(total / limit),
    total,
  };
};

/* =========================
   GET SINGLE RESOURCE
========================= */

exports.getById = async (id) => {
  const resource = await Learning.findById(id);

  if (!resource) {
    return null;
  }

  resource.views = (resource.views || 0) + 1;

  await resource.save();

  return resource;
};

/* =========================
   UPDATE RESOURCE
========================= */

exports.update = async (id, data) => {
  return Learning.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true,
    }
  );
};

/* =========================
   DELETE RESOURCE
========================= */

exports.delete = async (id) => {
  return Learning.findByIdAndDelete(id);
};

/* =========================
   FEATURED RESOURCES
========================= */

exports.getFeatured = async (limit = 6) => {
  return Learning.find({
    featured: true,
  })
    .sort({ createdAt: -1 })
    .limit(limit);
};

/* =========================
   RELATED RESOURCES
========================= */

exports.getRelated = async (
  resourceId,
  category
) => {
  return Learning.find({
    _id: { $ne: resourceId },
    category,
  }).limit(4);
};