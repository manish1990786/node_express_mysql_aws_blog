const Validator = require('fastest-validator');
const models = require('../models');

module.exports.savePost = async (event) => {

    try {

        event.body = JSON.parse(event.body)
        const post = {
            title: event.body.title,
            description: event.body.description,
            userId: event.body.user_id
        }

        const schema = {
            title: {type:"string", empty:false, pattern:/^[a-zA-Z]+$/, optional: false, max: "100"},
            description: {type: "string",empty:false, optional: false, max: "500"},
            userId: {type: "number", empty:false, optional: false}
        }
        
        const v = new Validator();
        const validationResponse = v.validate(post, schema);

        if(validationResponse !== true){
            return {
                statusCode: 400,
                body: JSON.stringify(
                  {
                    message: "Validation failed",
                    errors: validationResponse
                  }
                ),
              };
        }
        
        const user = await models.User.findByPk(event.body.user_id);
        if(user === null){
            return {
                statusCode: 404,
                body: JSON.stringify(
                  {
                    message: "User not found",
                  }
                ),
              };
        }

        const result = await models.Post.findOne({where:{title:post.title}});
                
        if( result ) {
            return {
                statusCode: 409,
                body: JSON.stringify(
                  {
                    message: "Title already exists!",
                  }
                ),
              };
        }

        const post_result = await models.Post.create(post);

        return {
            statusCode: 201,
            body: JSON.stringify(
            {
                message: "Post created successfully",
                data: post_result
            }
            ),
        };
    }
    catch(error){
        console.log("create post handler error===>",error);
        return {
            statusCode: 500,
            body: JSON.stringify(
            {
                message: "Something went wrong",
                error: error
            }
            ),
        };
    }
}