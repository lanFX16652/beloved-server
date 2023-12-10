const express = require("express");
const orderController = require("../controllers/orderController.js")
const { loginMiddleware } = require("../middlewares/loginMiddleware.js");

const router = express.Router()

router.post("/order/create", loginMiddleware, orderController.createOrder);
router.get("/order-list", loginMiddleware, orderController.getAllOrders);


const orderRoute = router;

module.exports = orderRoute;