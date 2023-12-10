const express = require("express");
const cartController = require("../controllers/cartController.js");
const { loginMiddleware } = require("../middlewares/loginMiddleware.js");

const router = express.Router()

router.post("/add-to-cart", loginMiddleware, cartController.addToCart);
router.get("/cart", loginMiddleware, cartController.getCart)

const cartRoute = router;

module.exports = cartRoute;