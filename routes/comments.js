const express = require("express")
const {
    protect
} = require("../middleware/auth");
const router = express.Router({mergeParams:true});

const {
    getComments,
    getComment,
    updateComment,
    deleteComment,
    createComment,
} = require('../controllers/comments');


router.route('/')
.get(getComments)
.post(protect,createComment);


router.route("/:commentid")
.get(getComment)
.put(protect,updateComment)
.delete(protect,deleteComment);


module.exports = router;