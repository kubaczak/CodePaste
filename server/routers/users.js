const router = require('express').Router();
const bcrypt = require('bcrypt');
let User = require('../models/user');

router.route('/').get((req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
    const username = req.body.username;
    let pass = req.body.password
    let salt = bcrypt.genSaltSync(10);
    let password = bcrypt.hashSync(pass, salt)
    const newUser = new User({ username, password });

    newUser.save()
        .then(() => res.json('User added!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;