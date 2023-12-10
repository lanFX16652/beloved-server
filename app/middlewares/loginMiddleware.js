const jwt = require("jsonwebtoken");

exports.loginMiddleware = (req, res, next) => {
    // lấy token ra từ header
    const authorizationHeader = req.headers["authorization"];
    const token = authorizationHeader.split(" ")[1];

    // kiểm tra có token không
    if (!token) {
        res.status(400).json({ message: "Bạn chưa đăng nhập" })
    }
    // có token
    // verify token bằng jwt để lấy thông tin đã làm ở bước login jwt.sign
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        if (err) {
            return res.status(500)
        } else {
            req.user = data
            return next()
        }
    })
}