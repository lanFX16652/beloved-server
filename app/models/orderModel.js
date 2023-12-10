const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    fullname: String,
    email: String,
    phoneNumber: String,
    address: String,
    userId: String,
    cart: [
        {
            product: Object,
            quantity: { type: Number, default: 0 }
        }
    ],
    totalPrice: Number,
}, {
    timestamps: true,
}
);

module.exports = mongoose.model("order", orderSchema);