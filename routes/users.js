const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { httpRegex } = require('../utils/constants');

const {
  getUsers, getUserById, getUser, editUserData, editUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUser);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), editUserData);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(httpRegex),
  }),
}), editUserAvatar);

module.exports = router;
