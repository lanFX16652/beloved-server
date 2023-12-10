const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel.js");

exports.signup = async (req, res, next) => {
    try {
        // console.log(req.body);
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);

        const newUser = new User({
            username: username,
            email: email,
            password: hashed
        })
        const user = await newUser.save()

        const accessToken = jwt.sign(user.toObject(), process.env.ACCESS_TOKEN_SECRET)

        return res.status(201).json({ newUser: user, accessToken: accessToken })

    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }

}

exports.login = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const user = await User.findOne({ email: email })
        if (user) {
            bcrypt.compare(password, user.password)
                .then((doMatch) => {
                    if (doMatch) {
                        const accessToken = jwt.sign(user.toObject(), process.env.ACCESS_TOKEN_SECRET)
                        res.status(200).json({ user: user, accessToken: accessToken });
                    } else {
                        return res.status(400).json({ message: "Password is incorrect" })
                    }
                })
                .catch((err) => {
                    console.log(err);
                    res.status(400).json({ message: "Email not found" })
                })
        } else {
            return res.status(400).json({ message: "Email not found" })
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
}

exports.adminLogin = async (req, res, next) => {
    try {
        console.log(req.body);
        const email = req.body.email;
        const password = req.body.password;

        const user = await User.findOne({ email: email })
        if (user) {
            bcrypt.compare(password, user.password)
                .then((doMatch) => {
                    if (!user.isAdmin) {
                        return res.status(400).json({ message: "You are not admin" })
                    } else {
                        const accessToken = jwt.sign(user.toObject(), process.env.ACCESS_TOKEN_SECRET)
                        return res.status(200).json({ userAdmin: user, accessToken: accessToken })
                    }
                })
                .catch((error) => {
                    return res.status(400).json({ message: "Password is incorrect" })
                })
        } else {
            return res.status(400).json({ message: "Email not found" })
        }
    } catch (err) {
        console.log(err)
    }
}