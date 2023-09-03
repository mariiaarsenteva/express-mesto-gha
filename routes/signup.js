const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { addUser } = require('../controllers/users');
const { httpRegex, emailRegex } = require('../utils/constants');

router.post('/', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(emailRegex),
    password: Joi.string().required().min(3),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(httpRegex),
  }),
}), addUser);

module.exports = router;
