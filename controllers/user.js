const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  NOT_FOUND_ERROR_CODE,
  EMAIL_ALREADY_EXISTS, REGISTER_INCORRECT_DATA, INCORRECT_DATA,
} = require('../utils/constants');
const BadRequestError = require('../utils/errors/badRequestError');
const ConflictError = require('../utils/errors/conflictError');
const {getJWT} = require("../utils/getJWT");

module.exports.createUser = async (req, res, next) => {
  try {
    const {
      name, email, password,
    } = req.body;

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hash,
    });
    res.send({
      message: 'Пользователь успешно создан',
    });
  } catch (e) {
    if (e.code === 11000) {
      next(new ConflictError(EMAIL_ALREADY_EXISTS));
    } else if (e.name === 'CastError') {
      next(new BadRequestError(REGISTER_INCORRECT_DATA));
    } else {
      next(e);
    }
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.checkUser(email, password);
    const key = getJWT();
    const token = jwt.sign({ _id: user._id }, key, { expiresIn: '7d' });
    res.send({
      token,
    });
  } catch (e) {
    next(e);
  }
};

module.exports.updateUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedUser) {
      return res.status(NOT_FOUND_ERROR_CODE).json({
        message: 'Пользователь не найден',
      });
    }

    res.send(updatedUser);
  } catch (e) {
    if (e.name === 'ValidationError') {
      next(new BadRequestError(e.message));
    } else {
      next(e);
    }
  }
};

module.exports.getMe = async (req, res, next) => {
  try {
    const id = req.user._id;
    const user = await User.findById({ _id: id });

    if (!user) {
      return res.status(NOT_FOUND_ERROR_CODE).json({
        message: 'Пользователь не найден',
      });
    }

    res.send(user);
  } catch (e) {
    if (e.name === 'CastError') {
      next(new BadRequestError(INCORRECT_DATA));
    } else {
      next(e);
    }
  }
};
