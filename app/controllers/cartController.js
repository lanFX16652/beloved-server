const Cart = require("../models/cartModel.js");
const Product = require("../models/productModel.js");

exports.addToCart = async (req, res, next) => {
    const { qty, productId } = req.body;

    if (req.user) {
        try {
            let userCart = await Cart.findOne({
                userId: req.user
            })
            //logic cho user đã có cart
            if (userCart) {
                // tìm index của product trong array product của cart user
                const productInCartIndex = userCart.cart.findIndex((p) => p.product._id.toString() === productId
                );

                if (productInCartIndex === -1) {
                    // nếu không có thì thêm product mới vào cart user
                    userCart.cart = [...userCart.cart, {
                        product: await Product.findById(productId),
                        quantity: qty,
                    }];
                } else {
                    // nếu có thì tìm product trong array cart user để tăng qty
                    userCart.cart = userCart.cart.map((p) => {
                        if (p.product._id.toString() === productId) {
                            p.quantity += qty;
                        }
                        return p;
                    });
                }
                await userCart.save();
            } else {
                // logic cho user chưa có cart
                userCart = await Cart.create({
                    userId: req.user._id,
                    cart: [
                        {
                            product: await Product.findById(productId),
                            quantity: qty,
                        }
                    ]
                });
                await userCart.save();
            }
            res.status(200).json({
                cart: userCart.cart,
                totalCartItem: userCart.cart.reduce((prev, cartItem) => {
                    return prev + cartItem.quantity;
                }, 0),
                totalPrice: userCart.cart.reduce((prev, cartItem) => {
                    return prev + cartItem.product.price * cartItem.quantity;
                }, 0)
            })
        } catch (err) {
            console.log(err)
        }
    } else {
        res.status(400).json({
            message: "Required login!"
        })
    }
};

exports.getCart = async (req, res, next) => {
    if (req.user) {
        try {
            const userCart = await Cart.findOne({ userId: req.user._id });
            return res.status(200).json({
                cart: userCart?.cart ? userCart?.cart : [],
                totalCartItem: userCart?.cart ? userCart.cart.reduce((prev, cartItem) => {
                    return prev + cartItem.quantity
                }, 0) : 0,
                totalPrice: userCart?.cart ? userCart.cart.reduce((prev, cartItem) => {
                    return prev + (cartItem.product.price * cartItem.quantity)
                }, 0) : 0
            })
        } catch (error) {
            console.log(error);
        }
    } else {
        res.status(400).json({ message: "Please login!" })
    }
}
