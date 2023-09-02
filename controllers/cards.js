/* eslint no-underscore-dangle: 0 */

const { HTTP_STATUS_OK, HTTP_STATUS_CREATED } = require('http2').constants;
const mongoose = require('mongoose');
const CardModel = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

const getCards = (req, res, next) => CardModel.find({})
  .populate(['owner', 'likes'])
  .then((cards) => res.status(HTTP_STATUS_OK).send(cards))
  .catch(next);

const deleteCard = (req, res, next) => {
  if (req.params.cardId.length === 24) {
    CardModel.findByIdAndRemove(req.params.cardId)
      .orFail()
      .then(() => {
        res.status(HTTP_STATUS_OK).send({ message: 'Карточка удалена' });
      })
      .catch((err) => {
        if (err instanceof mongoose.Error.CastError) {
          next(new BadRequestError(`Некорректный _id карточки: ${req.params.userId}`));
        } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
          next(new NotFoundError(`Карточка по данному _id: ${req.params.userId} не найдена.`));
        } else {
          next(err);
        }
      });
  }
};

const addCard = (req, res, next) => {
  const { name, link } = req.body;
  CardModel.create({ name, link, owner: req.user._id })
    .then((card) => {
      CardModel.findById(card._id)
        .orFail()
        .populate('owner')
        .then((data) => res.status(HTTP_STATUS_CREATED).send(data))
        .catch((err) => {
          if (err instanceof mongoose.Error.DocumentNotFoundError) {
            next(new NotFoundError(`Пользователь по данному _id: ${req.params.userId} не найден.`));
          } else {
            next(err);
          }
        });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
  if (req.params.cardId.length === 24) {
    CardModel.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
      .orFail()
      .populate(['owner', 'likes'])
      .then((card) => res.status(HTTP_STATUS_OK).send(card))
      .catch((err) => {
        if (err instanceof mongoose.Error.CastError) {
          next(new BadRequestError(`Некорректный _id карточки: ${req.params.userId}`));
        } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
          next(new NotFoundError(`Карточка по данному _id: ${req.params.userId} не найдена.`));
        } else {
          next(err);
        }
      });
  }
};

const likeCard = (req, res, next) => {
  if (req.params.cardId.length === 24) {
    CardModel.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
      .orFail()
      .populate(['owner', 'likes'])
      .then((card) => res.status(HTTP_STATUS_OK).send(card))
      .catch((err) => {
        if (err instanceof mongoose.Error.CastError) {
          next(new BadRequestError(`Некорректный _id карточки: ${req.params.userId}`));
        } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
          next(new NotFoundError(`Карточка по данному _id: ${req.params.userId} не найдена.`));
        } else {
          next(err);
        }
      });
  }
};

module.exports = {
  addCard, getCards, deleteCard, likeCard, dislikeCard,
};
