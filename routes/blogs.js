const express = require('express');
const router = express.Router({mergeParams: true});
const commentsRouter = require('./comments');
const {protect} = require('../middleware/auth');
const {
    getBlogs,
    getBlog,
    updateBlog,
    createBlog,
    deleteBlog,
} = require('../controllers/blogs');



router.use("/:blogid/comments", commentsRouter);

router.route('/')
.get(getBlogs)
.post(protect, createBlog);


router.route("/:blogid")
.get(getBlog)
.put(protect,updateBlog)
.delete(protect, deleteBlog);




module.exports = router;