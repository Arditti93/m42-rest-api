const bcrypt = require('bcrypt')
const User = require('../user/userModels')


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