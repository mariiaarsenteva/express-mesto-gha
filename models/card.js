const mongoose = require('mongoose');
const { httpRegex } = require('../utils/constants');
// const validator = require('validator');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    minlength: [2, 'Длина поля не меньше 2 знаков'],
    maxlength: [30, 'Длина поля не больше 30 знаков'],
  },
  link: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    validate: ({
      validator(url) {
        return httpRegex.test(url);
      },
      message: 'Неверный URL',
    }),
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },

  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],

  createdAt: {
    type: Date,
    default: Date.now,
  },

}, { versionKey: false });

module.exports = mongoose.model('card', cardSchema);
