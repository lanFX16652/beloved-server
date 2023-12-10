const express = require("express");
const productController = require("../controllers/productController.js");

const router = express.Router();

router.post("/add-product", productController.addNewProduct);
router.get("/product-list", productController.getProducts);
router.post("/product-detail", productController.getProductDetail);
router.post("/edit-product", productController.editProduct);
router.post("/delete-product", productController.deleteProduct);

const productRoute = router;

module.exports = productRoute;
