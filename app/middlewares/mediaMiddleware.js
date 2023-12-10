const multer = require("multer");
const path = require("path");

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), "app/upload"))
    },
    filename: function (req, file, cb) {
        const mimetype = file.originalname.split(".").pop();
        cb(null, Date.now() + "." + mimetype);
    }
});

exports.upload = multer({ storage }).array("image")

// exports.uploadMiddleware = (req, res, next) => {
//     upload(req, res, (err) => {
//         if (err instanceof multer.MulterError) {
//             console.log(err);
//         } else if (err) {
//             console.log(err);
//         }
//     })

//     next()
// }