const express = require('express');
const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/users');

const {
    restrict
} = require('../middleware/auth');

const blogRouter = require("./blogs");

const router = express.Router();


router.use("/:userid/blogs",blogRouter);

router.use(restrict());

router
.route('/')
.get(getUsers)
.post(createUser);

router
.route('/:userid')
.get(getUser)
.put(updateUser)
.delete(deleteUser);


module.exports = router;