const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const User = require('../user/userModels')
const validator = require("email-validator");


exports.hashPass = async (request, response, next) => {
    try {
        request.body.password = await bcrypt.hash(request.body.password, 10)
        next()
    } catch (error) {
        console.log(error)
        response.status(500).send({error: error.message})
    }
}
//TODO: write middleware function to compare plain text password with hashed password
exports.comparePass = async (request, response, next) => {
    try {
        request.user = await User.findOne({username: request.body.username})
        if (request.user && await bcrypt.compare(request.body.password, request.user.password)) {
            console.log("username and password exist in database")
            next()
        } else {
            throw new Error("Incorrect username or password")
        }
    } catch (error) {
        console.log(error)
        response.status(500).send({error: error.message})
    }
}

exports.tokenCheck = async (request, response, next) => {
    try {
        if (request.header("Authorization")){
            const token = request.header("Authorization").replace("Bearer ", "")
            const decodedToken = await jwt.verify(token, process.env.SECRET)
            const user = await User.findById(decodedToken._id)
            if (user) {
                request.user = user
            } else {
                throw new Error ("user doesn't exist")
            }
            request.authUser = user
            console.log("headers passed")
        } else {
            console.log("No headers passed")
        }
        next()
    } catch (error) {
        console.log(error)
        response.status(500).send({error: error.message})
    }
}



exports.validateEmail = async (request, response, next) => {
    try {
        if (validator.validate(request.body.email)) {
            console.log("vaild email")
            next()
        } else {
            throw new Error ("invaild email please try again")
        }
    } catch (error) {
        console.log(error)
        response.status(500).send({error: error.message})
    }
}

//EMAIL VALIDATION WITHOUT USING A NPM LIBARY

// exports.validateEmail = async (request, response, next) => {
//     try {
//         const regex = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/; 
//         console.log(regex.test(request.body.email)) // returns true or false
//         if (regex.test(request.body.email)) {
//             console.log("vaild email")
//             next()
//         } else {
//             throw new Error ("invaild email please try again")
//         }
 
//     } catch (error) {
//         console.log(error)
//         response.status(500).send({error: error.message})
//     }
// }
