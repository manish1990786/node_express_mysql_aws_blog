const Validator = require('fastest-validator');
const models = require('../models');

async function savePost(req, res){

    try {
        const post = {
            title: req.body.title,
            description: req.body.description,
            userId: req.body.user_id
        }

        const schema = {
            title: {type:"string", empty:false, pattern:/^[a-zA-Z]+$/, optional: false, max: "100"},
            description: {type: "string",empty:false, optional: false, max: "500"},
            userId: {type: "number", empty:false, optional: false}
        }
        
        const v = new Validator();
        const validationResponse = v.validate(post, schema);

        if(validationResponse !== true){
            return res.status(400).json({
                message: "Validation failed",
                errors: validationResponse
            });
        }
        
        const user = await models.User.findByPk(req.body.user_id);
        if(user === null){
            return res.status(404).json({
                message: "User not found"
            });
        }

        const result = await models.Post.findOne({where:{title:post.title}});
                
        if( result ) {
            return res.status(409).json({
                message: "Title already exists!",
            });
        }

        const post_result = await models.Post.create(post);
        
        res.status(201).json({
                message: "Post created successfully",
                post: post_result
            });
    }
    catch(error){
        res.status(500).json({
            message: "Something went wrong",
            error: error
        });
    }
}

async function showPost(req, res){

    try {
            const id = req.params.id;

            let result = await models.Post.findByPk(id);

            if(result){
                const comments = await models.Comment.findAll({where:{postId:id}});
                const user_info = await models.User.findOne({where:{id:result.userId}});
                result.setDataValue('comments', comments);
                result.setDataValue('autherName', user_info.name);
                res.status(200).json(result);
            } else {
                res.status(404).json({
                    message: "Post not found!"
                }) 
            }
    }
    catch(error){
        console.log(error)
        res.status(500).json({
            message: "Something went wrong!"
        })
    }
}


async function showAllPost(req, res){
    try {
        const result = await models.Post.findAll( { where: { userId:req.params.user_id}  ,include:[{ model: models.User, attributes: ['id','name'] }]}, {attributes: ['User.name']} );
        
        for(let post of result) {
            const comments = await models.Comment.findAll({where:{postId:post.id}});
            post.setDataValue('comments', comments);
        }
        res.status(200).json(result);
    }
    catch(error){
        console.log(error)
        res.status(500).json({
            message: "Something went wrong!"
        });
    }
}
 
module.exports = {
    savePost,
    showPost,
    showAllPost
}
