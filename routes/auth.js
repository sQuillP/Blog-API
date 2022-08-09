const express = require('express');

const {
    loginUser,
    logoutUser,
    registerUser
}= require('../controllers/auth');


const router = express.Router();


router.route('/login')
.post(loginUser);

router.route('/logout')
.post(logoutUser);

router.route("/register")
.post(registerUser);

module.exports = router;