const express = require("express")
const mediaController = require("../controllers/mediaController.js")
const uploadMiddleware = require("../middlewares/mediaMiddleware.js")

const router = express.Router();

router.post("/upload", uploadMiddleware.upload, mediaController.imageUpload);

const mediaRoute = router;

module.exports = mediaRoute;