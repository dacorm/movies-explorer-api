const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const UnauthorizedError = require('../utils/errors/unauthorizedError');
const EMAIL_ERROR = require('../utils/constants');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, 'длина имени должна быть не менее 2 символов'],
    maxlength: [30, 'длина имени должна быть не более 30 символов'],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: EMAIL_ERROR,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.checkUser = async function (email, password) {
  try {
    const user = await this.findOne({ email }).select('+password');
    if (!user) {
      return Promise.reject(new UnauthorizedError('Неверная почта или пароль'));
    }
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return Promise.reject(new UnauthorizedError('Неверная почта или пароль'));
    }

    if (user && match) {
      return user;
    }
  } catch (e) {
    console.log(e);
  }
};

module.exports = mongoose.model('user', userSchema);
