const Validator = require('fastest-validator');
const models = require('../models');

module.exports.showAllPostByUser = async (event) => {
    try {
        const result = await models.Post.findAll( { where: { userId:event.pathParameters.id}  ,include:[{ model: models.User, attributes: ['id','name'] }]}, {attributes: ['User.name']} );
        
        for(let post of result) {
            const comments = await models.Comment.findAll({where:{postId:post.id}});
            post.setDataValue('comments', comments);
        }
        return {
            statusCode: 200,
            body: JSON.stringify(
              {
                data: result,
              }
            ),
          };
    }
    catch(error){
      console.log("get all post by user error===>",error);
        return {
            statusCode: 500,
            body: JSON.stringify(
              {
                message: 'Something went wrong!',
              }
            ),
          };
    }
}
