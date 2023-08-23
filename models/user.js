const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    minlength: [2, 'Длина поля не меньше 2 знаков'],
    maxlength: [30, 'Длина поля не больше 30 знаков'],
  },
  about: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    minlength: [2, 'Длина поля не меньше 2 знаков'],
    maxlength: [30, 'Длина поля не больше 30 знаков'],
  },
  avatar: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    validate: ({
      validator: (value) => validator.isURL(value, { protocols: ['http', 'https'], require_tld: true, require_protocol: true }),
      message: 'Неверный URL',
    }),
  },

}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
