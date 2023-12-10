const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const cartSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    cart: [
        {
            product: Object,
            quantity: {
                type: Number,
                default: 0
            }
        }
    ]
});

module.exports = mongoose.model("cart", cartSchema);