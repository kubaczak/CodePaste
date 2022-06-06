const router = require('express').Router();
const Post = require('../models/post');
const jwt = require('jsonwebtoken');
const ObjectId = require('mongoose').Types.ObjectId;

router.route('/:id').get((req, res, next) => {
    console.log(req.cookies);
    if (ObjectId.isValid(req.params.id)) {
        Post.findById(req.params.id).then((post) => {
            if (!post) {
                return res.status(401).json({ error: 'Post not exists' });
            }
            let views = post.views + 1;
            Post.findByIdAndUpdate(req.params.id, { views: views })
                .then(() => {
                    return res.json(post);
                })
                .catch((err) => {
                    console.log(err);
                });
        });
    } else {
        return res.status(401).json({ error: 'Invalid id' });
    }
});

router.route('/').post((req, res, next) => {
    let token = req.body.token;
    let decoded;
    if (!token) {
        return res.status(401).json({ error: 'No token provided.' });
    }
    try {
        decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (err) {
        return res.status(400).json({ error: 'Token invalid.' });
    }
    let author = decoded.userId;
    let paste = req.body.paste;
    let lang = req.body.lang;
    const newPaste = new Post({ author, paste, lang });

    newPaste
        .save()
        .then(() => res.json(newPaste._id))
        .catch((err) => res.status(400).json({ error: err }));
});

router.route('/:id').delete((req, res, next) => {
    let token = req.body.token;
    let decoded;
    if (!token) {
        return res.status(401).json({ error: 'No token provided.' });
    }
    try {
        decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (err) {
        return res.status(400).json({ error: 'Token invalid.' });
    }
    Post.findById(req.params.id).then((post) => {
        if (!post) {
            return res.status(401).json({ error: 'Post not exists' });
        }
        if (post.author != decoded.userId) {
            return res.status(401).json({ error: 'Cannot delete this post' });
        }
        Post.findByIdAndRemove(req.params.id)
            .then(() => {
                return res.status(200).json('Success!');
            })
            .catch((err) => {
                console.log(err);
            });
    });
});

router.route('/edit/:id').post((req, res) => {
    let token = req.body.token;
    let decoded;
    if (!token) {
        return res.status(401).json({ error: 'No token provided.' });
    }
    try {
        decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (err) {
        return res.status(400).json({ error: 'Token invalid.' });
    }
    Post.findById(req.params.id).then((post) => {
        if (!post) {
            return res.status(401).json({ error: 'Post not exists' });
        }
        if (post.author != decoded.userId) {
            return res.status(401).json({ error: 'Cannot edit this post' });
        }
        let paste = req.body.paste;
        let lang = req.body.lang;
        Post.findByIdAndUpdate(req.params.id, { paste: paste, lang: lang })
            .then(() => {
                return res.status(200).json('Success!');
            })
            .catch((err) => {
                console.log(err);
            });
    });
});

router.route('/star/:id').post((req, res) => {
    let token = req.body.token;
    let decoded;
    if (!token) {
        return res.status(401).json({ error: 'No token provided.' });
    }
    try {
        decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (err) {
        return res.status(400).json({ error: 'Token invalid.' });
    }
    Post.findById(req.params.id).then((post) => {
        if (!post) {
            return res.status(401).json({ error: 'Post not exists' });
        }
        if (post.starsUsers.includes(decoded.userId)) {
            return res.status(401).json({ error: 'User alredy stared this post' });
        }
        let starsUsers = post.starsUsers;
        starsUsers.push(decoded.userId);
        let stars = post.stars + 1;
        Post.findByIdAndUpdate(req.params.id, {
                starsUsers: starsUsers,
                stars: stars,
            })
            .then(() => {
                return res.status(200).json('Success!');
            })
            .catch((err) => {
                console.log(err);
            });
    });
});

router.route('/star/:id').delete((req, res) => {
    let token = req.body.token;
    let decoded;
    if (!token) {
        return res.status(401).json({ error: 'No token provided.' });
    }
    try {
        decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (err) {
        return res.status(400).json({ error: 'Token invalid.' });
    }
    Post.findById(req.params.id).then((post) => {
        if (!post) {
            return res.status(401).json({ error: 'Post not exists' });
        }
        if (!post.starsUsers.includes(decoded.userId)) {
            return res.status(401).json({ error: 'User not staring this post' });
        }
        let starsUsers = post.starsUsers;
        starsUsers.pull(decoded.userId);
        let stars = post.stars - 1;
        Post.findByIdAndUpdate(req.params.id, {
                starsUsers: starsUsers,
                stars: stars,
            })
            .then(() => {
                return res.status(200).json('Success!');
            })
            .catch((err) => {
                console.log(err);
            });
    });
});

module.exports = router;