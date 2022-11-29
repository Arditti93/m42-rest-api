const User = require("./userModels");
const jwt = require("jsonwebtoken")

exports.createUser = async (request, response) => {
    try {
        const newUser = await User.create(request.body);
        const token = await jwt.sign({_id: newUser._id}, process.env.SECRET)
        console.log("SUCCESFUL", newUser);
        console.log(token)
        response.status(201).send({ user: newUser.username, token });
    } catch (error) {
        console.log(error);
        response.status(500).send({error: error.message});
    }
};

exports.readUsers = async (request, response) => {
    try {
        const users = await User.find({})
        response.status(200).send({user: users})
    } catch (error) {
        console.log(error);
        response.status(500).send({error: error.message});
    }
}

exports.updateUser = async (request, response) => {
    try {
        await User.updateOne(
            {username: request.body.username },
            {[request.body.key]: request.body.value}
        );
        response.status(200).send({message: "user felid has been updated"})
    } catch (error) {
        console.log(error);
        response.status(500).send({error: error.message});
    }
}

exports.deleteUser = async (request, response) => {
    try {
        await User.deleteOne({username: request.body.username})
        response.status(200).send({message: "successfully deleted a user"})
    } catch (error) {
        console.log(error);
        response.status(500).send({error: error.message});
    }
}

exports.loginUser = async (request, response) => {
    try {
        if (request.authUser) {
            console.log(request.authUser)
            console.log('auth user exists')
            console.log("token exists continue to login")
            response.status(200).send({username: request.authUser.username})  
        } else {
            const user = await User.findOne({username: request.body.username})
            const token = await jwt.sign({_id: user._id}, process.env.SECRET)
            console.log("token not passed continue login and generate a new token")
            response.status(200).send({username: user.username, token})
        }
    } catch (error) {
        console.log(error);
        response.status(500).send({error: error.message});
    }
}




