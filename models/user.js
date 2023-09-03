const mongoose = require('mongoose');
// const validator = require('validator');
const bcrypt = require('bcrypt');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { emailRegex, httpRegex } = require('../utils/constants');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: [2, 'Длина поля не меньше 2 знаков'],
    maxlength: [30, 'Длина поля не больше 30 знаков'],
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: [2, 'Длина поля не меньше 2 знаков'],
    maxlength: [30, 'Длина поля не больше 30 знаков'],
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: ({
      validator(url) {
        return httpRegex.test(url);
      },
      message: 'Неверный URL',
    }),
  },
  email: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    validate: {
      validator(email) {
        return emailRegex.test(email);
      },
      message: 'Введите верный email',
    },
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    select: false,
  },

}, { versionKey: false });

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
        // return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильные почта или пароль');
          }

          return user; // теперь user доступен
        });
    });
};

module.exports = mongoose.model('user', userSchema);
