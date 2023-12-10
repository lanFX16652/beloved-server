const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const config = require("./config/config.js");

const authRoute = require("./routes/auth.js");
const mediaRoute = require("./routes/media.js");
const productRoute = require("./routes/product.js");
const cartRoute = require("./routes/cart.js");
const orderRoute = require("./routes/order.js");

dotenv.config()
const app = express();
const port = process.env.PORT || 5000;
const MONGODB_URI = config.mongodbUri

app.use(cors());
app.use(express.json());
app.use(express.static("app/upload"));

// Init Router
app.use(authRoute);
app.use(mediaRoute);
app.use(productRoute);
app.use(cartRoute);
app.use(orderRoute);

mongoose.connect(MONGODB_URI)
    .then((result) => console.log("Database connected"))
    .catch((err) => console.log("Database connect failed"))

app.listen(port, () => {
    console.log("listening on port: ", port)
})