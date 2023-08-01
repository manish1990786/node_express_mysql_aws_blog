const Validator = require('fastest-validator');
const models = require('../models')

async function saveComment(req, res) {
    try {
        const comment = {
            content: req.body.content,
            postId: req.body.post_id,
            userId: req.body.user_id
        }
    
        const schema = {
            content: {type: "string", empty:false, optional: false, max: "500"},
            postId: {type: "number", empty:false, optional: false},
            userId: {type: "number", empty:false, optional: false}
        }
    
        const v = new Validator();
        const validationResponse = v.validate(comment, schema);
    
        if(validationResponse !== true){
            return res.status(400).json({
                message: "Validation failed",
                errors: validationResponse
            });
        }
        
        if(isURL(comment.content)) {
            return res.status(400).json({
                message: "Content must not have URL",
            });
        }

        const post = await models.Post.findByPk(req.body.post_id);
        if(post === null){
            return res.status(404).json({
                message: "Post not found"
            });
        }

        const user = await models.User.findByPk(req.body.user_id);
        if(user === null){
            return res.status(404).json({
                message: "User not found"
            });
        }

       const commentResponse = await models.Comment.create(comment);
        res.status(201).json({
            message: "Comment created successfully",
            comment: commentResponse
        });
    }
    catch(error){
        console.log(error)
        res.status(500).json({
            message: "Something went wrong",
            error: error
        });
    }
}

function isURL(string) {
    let res = String(string).match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (res !== null)
};

module.exports = {
    saveComment
}