const router = require('express').Router();
const Post = require('../models/post')
const jwt = require('jsonwebtoken');

router.route('/:id').get((req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if (!post) {
            return res.status(401).json({ "error": "Post not exists" });
        }
        res.json(post)
    });
})

router.route("/").post((req, res, next) => {
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
    let author = decoded.userId;
    let paste = req.body.paste;
    let lang = req.body.lang;
    const newPaste = new Post({ author, paste, lang })

    newPaste.save()
        .then(() => res.json(newPaste._id))
        .catch(err => res.status(400).json({ "error": err }));
})

router.route("/:id").delete((req, res, next) => {
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
    Post.findById(req.params.id).then(post => {
        if (!post) {
            return res.status(401).json({ "error": "Post not exists" });
        }
        if (post.author != decoded.userId) {
            return res.status(401).json({ "error": "Cannot delete this post" });
        }
        Post.findByIdAndRemove(req.params.id)
            .then(() => {
                return res.status(200).json("Success!")
            })
            .catch((err) => {
                console.log(err)
            })
    });
})

router.route("/edit/:id").post((req, res) => {
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
    Post.findById(req.params.id).then(post => {
        if (!post) {
            return res.status(401).json({ "error": "Post not exists" });
        }
        if (post.author != decoded.userId) {
            return res.status(401).json({ "error": "Cannot edit this post" });
        }
        let paste = req.body.paste;
        let lang = req.body.lang;
        Post.findByIdAndUpdate(req.params.id, { paste: paste, lang: lang })
            .then(() => {
                return res.status(200).json("Success!")
            })
            .catch((err) => {
                console.log(err)
            })
    });
})

module.exports = router;