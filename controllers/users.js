const { HTTP_STATUS_OK, HTTP_STATUS_CREATED } = require('http2').constants;
const mongoose = require('mongoose');
const UserModel = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

const getUsers = (req, res, next) => UserModel.find({})
  .then((users) => res.status(HTTP_STATUS_OK).send(users))
  .catch(next);

const getUserById = (req, res, next) => {
  UserModel.findById(req.params.userId)
    .orFail()
    .then((user) => {
      res.status(HTTP_STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError(`Некорректный _id: ${req.params.userId}`));
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError(`Пользователь по данному _id: ${req.params.userId} не найден.`));
      } else {
        next(err);
      }
    });
};

const addUser = (req, res, next) => UserModel.create({ ...req.body })
  .then((user) => res.status(HTTP_STATUS_CREATED).send(user))
  .catch((err) => {
    if (err instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError(err.message));
    } else {
      next(err);
    }
  });

const editUserData = (req, res, next) => {
  const { name, about } = req.body;
  if (req.user._id) {
    UserModel.findByIdAndUpdate(req.user._id, { name, about }, { new: 'true', runValidators: true })
      .orFail()
      .then((user) => {
        res.status(HTTP_STATUS_OK).send(user);
      })
      .catch((err) => {
        if (err instanceof mongoose.Error.ValidationError) {
          next(new BadRequestError(err.message));
        } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
          next(new NotFoundError(`Пользователь по данному _id: ${req.params.userId} не найден.`));
        } else {
          next(err);
        }
      });
  }
};

const editUserAvatar = (req, res, next) => {
  if (req.user._id) {
    UserModel.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, { new: 'true', runValidators: true })
      .orFail()
      .then((user) => res.status(HTTP_STATUS_OK).send(user))
      .catch((err) => {
        if (err instanceof mongoose.Error.ValidationError) {
          next(new BadRequestError(err.message));
        } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
          next(new NotFoundError(`Пользователь по данному _id: ${req.params.userId} не найден.`));
        } else {
          next(err);
        }
      });
  }
};

module.exports = {
  getUsers, getUserById, addUser, editUserData, editUserAvatar,
};
