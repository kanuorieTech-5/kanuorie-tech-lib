const express = require("express");

const router = express.Router();

const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const protect = require("../middleware/auth");
const admin = require("../middleware/admin");

/* ==========================================
   PUBLIC ROUTES
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

/* ==========================================
   EXPORT ROUTER
========================================== */

module.exports = router;