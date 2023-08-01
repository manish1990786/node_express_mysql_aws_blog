const express = require('express');
const postsController = require('../controllers/post.controller');

const router = express.Router();
router.get("/ping", (req,res) => {
    return res.status(200).send("pong");
});
router.post("/", postsController.savePost);
router.get("/postByUser/:user_id", postsController.showAllPost);
router.get("/:id", postsController.showPost);

module.exports = router;
