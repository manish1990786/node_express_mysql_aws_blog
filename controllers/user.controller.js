const Validator = require('fastest-validator');
const models = require('../models');
const bcrypt = require('bcryptjs');

async function registerUser(req, res){
    try {

        const user = {
            name: req.body.name,
            username:req.body.username,
            email:req.body.email,
            password: req.body.password
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
            return res.status(400).json({
                message: "Validation failed",
                errors: validationResponse
            });
        }

        const username_exists = await models.User.findOne({where:{username:req.body.username}});

        if(username_exists){
            return res.status(409).json({
                message: "Username already exists!",
            });
        }

        const result = await models.User.findOne({where:{email:req.body.email}});

        if( result ) {
            return res.status(409).json({
                message: "Email already exists!",
            });
        } 
        
        user.password = encryptPassword(req.body.password);
        const user_response = await models.User.create(user)

        res.status(201).json({
            message: "User created successfully",
            post: user_response
        });
    }
    catch( error ) {
        console.log(error)
            res.status( 500 ).json( {
                message: "Something went wrong!",
            } );
        }
    }

function encryptPassword(password){
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
}

module.exports = {
    registerUser: registerUser
} 