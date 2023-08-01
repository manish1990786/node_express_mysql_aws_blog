const express = require('express');
const commentController = require('../controllers/comment.controller');

const router = express.Router();

router.post("/", commentController.saveComment);


module.exports = router;
