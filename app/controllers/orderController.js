const Product = require("../models/productModel.js");
const Cart = require("../models/cartModel.js");
const Order = require("../models/orderModel.js");
const nodemailer = require("nodemailer");
const config = require("../config/config.js");

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: config.transporterUser,
        pass: config.transporterPass,
    }
})

exports.createOrder = async (req, res, next) => {
    try {
        const { fullname, email, phoneNumber, address, cart, totalPrice } = req.body;

        // Tìm trong Product Database những sản phẩm có trong giỏ hàng của người dùng
        const itemsCheckStock = await Promise.all(cart.map(productOrder => {
            return Product.findById(productOrder.product._id)
        }))


        // Check những sản phẩm hết hàng
        const itemsOutOfStock = itemsCheckStock.map(product => {
            if (product.quantity === 0) {
                return {
                    productName: product.name
                }
            }
        }).filter(Boolean)
        console.log("itemsOutOfStock", itemsOutOfStock);

        if (itemsOutOfStock.length) {
            return res.status(200).json({
                message: "Order have product out of stock",
                products: itemsOutOfStock
            })
        }
        console.log("itemsOutOfStock", itemsOutOfStock);
        // Tạo new order sau khi check số lượng từng sản phẩm của client mua với số lượng từng sản phẩm trong kho
        const cartToProcess = []

        cart?.forEach(cartItem => {
            for (const productInDB of itemsCheckStock) {
                if (productInDB._id.toString() === cartItem.product._id) {
                    cartToProcess.push({
                        product: productInDB,
                        quantity: productInDB.quantity < cartItem.quantity ? productInDB.quantity : cartItem.quantity
                    })
                }
            }
        })

        if (cartToProcess.length) {
            const newOrder = await Order.create({
                fullname: fullname,
                email: email,
                phoneNumber: phoneNumber,
                address: address,
                cart: cartToProcess,
                totalPrice: totalPrice,
                userId: req.user._id,
            })

            console.log("newOrder:", newOrder)

            // Xử lý lại số lượng trong kho và delete cart sau khi tạo order
            await Promise.all(cartToProcess.map(p => Product.findByIdAndUpdate(p.product._id, {
                quantity: p.product.quantity - p.quantity
            })))

            await Cart.deleteOne({ userId: req.user._id });

            // Email đơn hàng cho người dùng
            const user = req.user;

            let tableProductTemplate = '';
            const attachments = []

            newOrder.cart.forEach((item) => {
                attachments.push({
                    filename: item.product.name,
                    path: item.product.images[0],
                    cid: item.product._id.toString()
                })

                tableProductTemplate += `
                    <tr>
                        <td>${item.product.name}</td>
                        <td><img src="cid:${item.product._id.toString()}" alt="${item.product.name}"/></td>
                        <td>${item.product.price}</td>
                        <td>${item.quantity}</td>
                        <td>${item.quantity * item.product.price}</td>
                    </tr>
                `
            })

            let mailOptions = {
                to: email, //địa chỉ email người nhận
                subject: `Order ${newOrder._id} from The Vintage Beloved`, //Tiêu đề email
                attachments: attachments,
                html: `
                    <html>
                    <head>
                        <style>
                            table,
                            th,
                            td {
                                border: 1px solid;
                                text-align: center;
                            }
                            img {
                                width: 100px;
                            }
                        </style>
                        </head>
                        <body>
                            <h1>Hello ${user._id}</h1>
                            <h5>Phone: ${phoneNumber}</h5>
                            <h5>Address ${address}</h5>
                            <table>
                                <tr>
                                    <th>Name</th>
                                    <th>Image</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Total</th>
                                </tr>
                                ${tableProductTemplate}
                            </table>

                            <h4>TOTAL PRICE: ${totalPrice}</h4>
                        </body>
                    </html> 
                `
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Email sent: " + info.response)
                }
            })

            // Trả về dữ liệu
            const order = newOrder.toObject();
            return res.status(200).json({
                order: {
                    ...order,
                    status: "Waiting for pay",
                    delivery: "Waiting for processing"
                }
            })
        } else {
            res.status(400).json({ message: "Your cart is empty" })
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "server error " })
    }
}

exports.getAllOrders = async (req, res, next) => {
    const { page, limit } = req.query;
    try {
        const allOrders = await Order
            .find({})
            .skip((page - 1) * limit)
            .limit(limit);
        const totalOrders = await Order.count();
        const totalPage = totalOrders / +limit;
        const allOrderTransform = allOrders.map((order) => {
            const objectOrder = order.toObject();
            return {
                ...objectOrder,
                status: "Chưa thanh toán",
                delivery: "Chưa vận chuyển",
            };
        });

        return res.status(200).json({ allOrderTransform, totalOrders, totalPage, page })

    } catch (error) {
        console.log(error);
    }
}