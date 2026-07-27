const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

/* ==========================================
   CREATE PRODUCT
========================================== */

const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create({
    ...req.body,
    createdBy: req.user._id,
  });

  return ApiResponse.success(
    res,
    product,
    "Product created successfully.",
    201
  );
});

/* ==========================================
   GET ALL PRODUCTS
========================================== */

const getProducts = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  const filter = {};

  if (req.query.category) {
    filter.category = req.query.category;
  }

  if (req.query.featured === "true") {
    filter.featured = true;
  }

  if (req.query.published) {
    filter.published = req.query.published === "true";
  }

  if (req.query.search) {
    filter.$or = [
      {
        name: {
          $regex: req.query.search,
          $options: "i",
        },
      },
      {
        description: {
          $regex: req.query.search,
          $options: "i",
        },
      },
      {
        excerpt: {
          $regex: req.query.search,
          $options: "i",
        },
      },
      {
        technologies: {
          $in: [
            new RegExp(req.query.search, "i"),
          ],
        },
      },
    ];
  }

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate("createdBy", "firstName lastName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Product.countDocuments(filter),
  ]);

  return ApiResponse.success(
    res,
    {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    },
    "Products retrieved successfully."
  );
});

/* ==========================================
   GET SINGLE PRODUCT
========================================== */

const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate("createdBy", "firstName lastName email");

  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  product.views += 1;
  await product.save();

  return ApiResponse.success(
    res,
    product,
    "Product retrieved successfully."
  );
});

/* ==========================================
   UPDATE PRODUCT
========================================== */

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  return ApiResponse.success(
    res,
    product,
    "Product updated successfully."
  );
});

/* ==========================================
   DELETE PRODUCT
========================================== */

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  await product.deleteOne();

  return ApiResponse.success(
    res,
    null,
    "Product deleted successfully."
  );
});

/* ==========================================
   FEATURED PRODUCTS
========================================== */

const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({
    featured: true,
    published: true,
  })
    .sort({ createdAt: -1 })
    .limit(8);

  return ApiResponse.success(
    res,
    products,
    "Featured products retrieved successfully."
  );
});

/* ==========================================
   PRODUCT STATISTICS
========================================== */

const getProductStats = asyncHandler(async (req, res) => {
  const [
    total,
    featured,
    published,
    unpublished,
  ] = await Promise.all([
    Product.countDocuments(),
    Product.countDocuments({ featured: true }),
    Product.countDocuments({ published: true }),
    Product.countDocuments({ published: false }),
  ]);

  return ApiResponse.success(
    res,
    {
      total,
      featured,
      published,
      unpublished,
    },
    "Product statistics retrieved successfully."
  );
});

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getProductStats,
};