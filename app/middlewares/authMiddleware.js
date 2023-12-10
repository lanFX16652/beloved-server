const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
    // lấy token ra từ header
    const authorizationHeader = req.headers["authorization"];
    const token = authorizationHeader?.split(" ")[1];

    // kiểm tra có token không
    if (!token) {
        // không token
        // status 401 là không có quyền truy cập
        res.status(401).json({ message: "Bạn không có quyền truy cập" })
    }
    // có token
    // verify token bằng jwt để lấy thông tin đã làm ở bước login jwt.sign
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        if (err) {
            return res.status(500)
        } else if (data?.isAdmin) {
            // thêm property mới vào object req là data của user lấy từ jwt
            req.user = data
            // gọi next để đi đến handler tiếp theo
            return next()
        }
        res.status(401).json({ message: "Bạn không phải admin" })
    })
}