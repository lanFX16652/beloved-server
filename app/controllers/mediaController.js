const multer = require("multer");
const Media = require("../models/mediaModel")

exports.imageUpload = async (req, res, next) => {
    const files = req.files
    console.log(files);
    try {
        const newFiles = await Promise.all(files.map(file => {
            const mimetype = file.originalname.split(".").pop()
            return new Media({
                filename: file?.originalname,
                mimetype: mimetype,
                name: file.filename
            }).save()
        }))
        return res.json(newFiles.map(file => file._id))
    } catch (error) {
        console.log(error);
    }
}