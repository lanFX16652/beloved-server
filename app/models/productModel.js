const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String
    },
    brand: {
        type: String
    },
    price: {
        type: Number
    },
    quantity: {
        type: Number,
        default: 1,
    },
    category: {
        type: String
    },
    description: {
        type: String
    },
    images: [{
        type: String
    }]
});

module.exports = mongoose.model("product", productSchema);