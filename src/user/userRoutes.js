const { Router } = require ("express");
const { createUser, readUsers, updateUser, deleteUser, loginUser } = require("./userControllers");
//TODO: import middleware function below
const {hashPass, comparePass, tokenCheck, validateEmail} = require('../middleware')

const userRouter = Router();

userRouter.post('/addUser', validateEmail, hashPass, createUser);
//TODO: call middleware function below
userRouter.post('/loginUser', tokenCheck, comparePass, loginUser)
userRouter.get('/readUsers', readUsers)
userRouter.put('/updateUser',updateUser) 
userRouter.delete('/deleteUser', deleteUser)

module.exports = userRouter;