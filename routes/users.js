const userRouter = require('express').Router();
const { getMe, updateUser } = require('../controllers/user');
const { validationUserEdit } = require('../utils/validators/userValidator');

userRouter.get('/users/me', getMe);
userRouter.patch('/users/me', validationUserEdit, updateUser);

module.exports = userRouter;
