const router = require('express').Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {
    createJWT,
} = require("../utils/auth");

router.route("/singin").post((req, res) => {
    let { username, password, email } = req.body;
    User.findOne({ username: username }).then(user => {
        if (!user) {
            return res.status(404).json({
                errors: [{ user: "not found" }],
            });
        } else {
            bcrypt.compare(password, user.password).then(isMatch => {
                if (!isMatch) {
                    return res.status(400).json({
                        errors: [{
                            password: "incorrect"
                        }]
                    });
                }
                let access_token = createJWT(
                    user.username,
                    user.email,
                    user._id,
                    36000
                );
                jwt.verify(access_token, process.env.TOKEN_SECRET, (err,
                    decoded) => {
                    if (err) {
                        res.status(500).json({ erros: err });
                    }
                    if (decoded) {
                        return res.status(200).json({
                            success: true,
                            token: access_token,
                            message: user
                        });
                    }
                });
            }).catch(err => {
                console.log(err)
                res.status(500).json({ erros: err });
            });
        }
    }).catch(err => {
        res.status(500).json({ erros: err });
    });
})

router.route("/singup").post((req, res, next) => {
    let { username, password, email } = req.body;
    User.findOne({ email: email })
        .then(user => {
            if (user) {
                return res.status(422).json({ errors: [{ user: "email already exists" }] });
            } else {
                const user = new User({
                    username: username,
                    email: email,
                    password: password,
                });
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(password, salt, function(err, hash) {
                        if (err) throw err;
                        user.password = hash;
                        user.save()
                            .then(response => {
                                res.status(200).json({
                                    success: true,
                                    result: response
                                })
                            })
                            .catch(err => {
                                res.status(500).json({
                                    errors: [{ error: err }]
                                });
                            });
                    });
                });
            }
        }).catch(err => {
            res.status(500).json({
                errors: [{ error: 'Something went wrong' }]
            });
        })
})


router.route("/test").post((req, res) => {
    let token = req.body.token;
    let decoded;
    if (!token) {
        return res.status(401).json({ "error": "No token provided." });
    }
    try {
        decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (err) {
        return res.status(400).json({ "error": "Token invalid." });
    }
    console.log(decoded.userId)
    res.json({ "Twoje id": decoded.userId });
    return;
})


module.exports = router;