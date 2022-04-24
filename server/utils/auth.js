const jwt = require("jsonwebtoken");

exports.createJWT = (username, email, userId, duration) => {
    const payload = {
        username,
        email,
        userId,
        duration
    };
    return jwt.sign(payload, process.env.TOKEN_SECRET, {
        expiresIn: duration,
    });
};