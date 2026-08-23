const express = require("express");

const router = express.Router();

const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getProductStats,
} = require("../controllers/productController");

const protect = require("../middleware/auth");
const admin = require("../middleware/admin");

/* ==========================================
   FEATURED PRODUCTS
========================================== */

router.get(
  "/featured",
  getFeaturedProducts
);

/* ==========================================
   PRODUCT STATISTICS
========================================== */

router.get(
  "/stats",
  protect,
  admin,
  getProductStats
);

/* ==========================================
   PRODUCTS
========================================== */

router
  .route("/")
  .get(getProducts)
  .post(
    protect,
    admin,
    createProduct
  );

router
  .route("/:id")
  .get(getProduct)
  .put(
    protect,
    admin,
    updateProduct
  )
  .delete(
    protect,
    admin,
    deleteProduct
  );

module.exports = router;