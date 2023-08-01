const Validator = require('fastest-validator');
const models = require('../models')

module.exports.saveComment = async (event) => {
    try {
        event.body = JSON.parse(event.body)
        const comment = {
            content: event.body.content,
            postId: event.body.post_id,
            userId: event.body.user_id
        }
    
        const schema = {
            content: {type: "string", empty:false, optional: false, max: "500"},
            postId: {type: "number", empty:false, optional: false},
            userId: {type: "number", empty:false, optional: false}
        }
    
        const v = new Validator();
        const validationResponse = v.validate(comment, schema);
    
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
        
        if(isURL(comment.content)) {
            return {
                statusCode: 400,
                body: JSON.stringify(
                  {
                    message: "Content must not have URL",
                  }
                ),
              };
        }

        const post = await models.Post.findByPk(event.body.post_id);
        if(post === null){
            return {
                statusCode: 404,
                body: JSON.stringify(
                  {
                    message: "Post not found"
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
                    message: "User not found"
                  }
                ),
              };
        }

       const commentResponse = await models.Comment.create(comment);

        return {
            statusCode: 201,
            body: JSON.stringify(
              {
                message: "Comment created successfully",
                data: commentResponse
              }
            ),
          };
    }
    catch(error){
      console.log("comment handler error===>",error);
        return {
            statusCode: 201,
            body: JSON.stringify(
              {
                message: "Something went wrong",
                error: error
              }
            ),
          };
    }
}

function isURL(string) {
    let res = String(string).match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (res !== null)
};