const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Mongoose = require('mongoose')

router.post("/login", (req, res, next) => {
    passport.authenticate("local", function(err, user, info) {
        if (err) {
            return res.status(400).json({errors: err});
        }
        if (!user) {
            return res.status(400).json(info);
        }
        req.logIn(user, function(err) {
            if (err) {
                return res.status(400).json({errors: err});
            }
            return res.status(200).json({userId: user._id});
        });
    })(req, res, next);
});

router.post("/register", async(req, res) => {
    let body = req.body
    body._id = new Mongoose.Types.ObjectId()
    let error = {}

    try {
        if (body.password == null || body.password == undefined || body.password.trim() === '')
            error = {field: "password", message: 'The password field cannot be blank'}

        body.password = bcrypt.hashSync(body.password, 10);
        console.log("Creating a new User")
        console.log("Body:", body)

        if (body.username == null || body.username == undefined || body.username.trim() === '')
            error = {field: "username", message: 'The username field cannot be blank'}
        else {
            const duplicatedUser = await User.findOne({"username": body.username});
            if (duplicatedUser)
                error = {field: "username", message: 'This username is already in use'}
        }

        if (Object.keys(error).length > 0) {
            console.log("Error: ", error)
            res.status(400).json(error)
        } else {
            const userDB = await User.create(body);
            res.status(200).json({userId: userDB._id});
        }
    } catch (err) {
        console.log("Error: ", err)
        return res.status(500).json({
            error
        })
    }
});

router.post('/logout', function(req, res, next){
    req.session.destroy()
    // req.sessionID.destroy()
    res.status(401);
});

module.exports = router;