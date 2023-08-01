const Validator = require('fastest-validator');
const models = require('../models');

module.exports.showPost = async (event) => {

    try {
            const id = event.pathParameters.id;

            let result = await models.Post.findByPk(id);

            if(result){
                const comments = await models.Comment.findAll({where:{postId:id}});
                const user_info = await models.User.findOne({where:{id:result.userId}});
                result.setDataValue('comments', comments);
                result.setDataValue('autherName', user_info.name);

                return {
                    statusCode: 200,
                    body: JSON.stringify(
                      {
                        data: result
                      }
                    ),
                  };

            } else {
                return {
                    statusCode: 404,
                    body: JSON.stringify(
                      {
                        message: "Post not found!"
                      }
                    ),
                  };
            }
    }
    catch(error){
      console.log("get post handler error===>",error);
        return {
            statusCode: 500,
            body: JSON.stringify(
              {
                message: "Something went wrong!"
              }
            ),
          };
    }
}
