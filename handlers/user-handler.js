const Validator = require('fastest-validator');
const models = require('../models');
const bcrypt = require('bcryptjs');

module.exports.registerUser = async (event) => {
    try {
        event.body = JSON.parse(event.body)
        const user = {
            name: event.body.name,
            username:event.body.username,
            email:event.body.email,
            password: event.body.password
        }

        const schema = {
            name : {type:"string", empty:false, optional: false, max: "100"},
            username: {type:"string", empty:false, pattern:/^[a-zA-Z0-9]+$/, optional: false, max: "100"},
            email: {type: "email", empty:false, optional: false, max: "100"},
            password: {type: "string", empty:false, optional: false, max: "100"},
        }
        
        const v = new Validator();
        const validationResponse = v.validate(user, schema);

        if(validationResponse !== true){
            return {
                statusCode: 409,
                body: JSON.stringify(
                  {
                    message: 'Validation failed',
                    errors: validationResponse
                  }
                ),
              };
        }

        const username_exists = await models.User.findOne({where:{username:event.body.username}});

        if(username_exists){

            return {
                statusCode: 409,
                body: JSON.stringify(
                  {
                    message: 'Username already exists!',
                  }
                ),
              };
        }

        const result = await models.User.findOne({where:{email:event.body.email}});

        if( result ) {

            return {
                statusCode: 409,
                body: JSON.stringify(
                  {
                    message: 'Email already exists!',
                  }
                ),
              };
        } 
        
        user.password = encryptPassword(event.body.password);
        const user_response = await models.User.create(user)

        return {
            statusCode: 201,
            body: JSON.stringify(
              {
                message: 'User created successfully',
                data: user_response,
              }
            ),
          };
    }
    catch( error ) {
      console.log("user handler error===>",error);
        return {
            statusCode: 500,
            body: JSON.stringify(
              {
                message: 'Something went wrong!',
                data: user_response,
              }
            ),
          };
    }
}
function encryptPassword(password){
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
}