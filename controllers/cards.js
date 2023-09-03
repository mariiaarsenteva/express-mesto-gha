/* eslint no-underscore-dangle: 0 */

const { HTTP_STATUS_OK, HTTP_STATUS_CREATED } = require('http2').constants;
const mongoose = require('mongoose');
const CardModel = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const getCards = (req, res, next) => CardModel.find({})
  .populate(['owner', 'likes'])
  .then((cards) => res.status(HTTP_STATUS_OK).send(cards))
  .catch(next);

const deleteCard = (req, res, next) => {
  CardModel.findById(req.params.cardId)
    .orFail()
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        throw new ForbiddenError('Карточка другого пользователя');
      }
      CardModel.deleteOne(card)
        .orFail()
        .then(() => {
          res.status(HTTP_STATUS_OK).send({ message: 'Карточка удалена' });
        })
        .catch((err) => {
          if (err instanceof mongoose.Error.CastError) {
            next(new BadRequestError(`Некорректный _id карточки: ${req.params.cardId}`));
          } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
            next(new NotFoundError(`Карточка по данному _id: ${req.params.cardId} не найдена.`));
          } else {
            next(err);
          }
        });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new NotFoundError(`Карточка по данному _id: ${req.params.cardId} не найдена.`));
      } else {
        next(err);
      }
    });
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
            next(new NotFoundError(`Карточка по данному _id: ${req.params.cardId} не найдена.`));
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
  CardModel.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail()
    .populate(['owner', 'likes'])
    .then((card) => res.status(HTTP_STATUS_OK).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError(`Некорректный _id карточки: ${req.params.cardId}`));
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError(`Карточка по данному _id: ${req.params.cardId} не найдена.`));
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  CardModel.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail()
    .populate(['owner', 'likes'])
    .then((card) => res.status(HTTP_STATUS_OK).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError(`Некорректный _id карточки: ${req.params.cardId}`));
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError(`Карточка по данному _id: ${req.params.cardId} не найдена.`));
      } else {
        next(err);
      }
    });
};

module.exports = {
  addCard, getCards, deleteCard, likeCard, dislikeCard,
};
