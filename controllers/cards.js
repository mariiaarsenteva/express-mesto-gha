/* eslint no-underscore-dangle: 0 */

const CardModel = require('../models/card');

const getCards = (req, res) => CardModel.find({})
  .populate(['owner', 'likes'])
  .then((cards) => res.status(200).send(cards))
  .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));

const deleteCard = (req, res) => {
  if (req.params.cardId.length === 24) {
    CardModel.findById(req.params.cardId)
      .then((card) => {
        if (!card) {
          res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
          return;
        }
        res.send({ message: 'Карточка удалена' });
      })
      .catch(() => res.status(404).send({ message: 'Запрашиваемая карточка не найдена' }));
  } else {
    res.status(400).send({ message: 'Некорректный _id' });
  }
};

const addCard = (req, res) => {
  const { name, link } = req.body;
  CardModel.create({ name, link, owner: req.user._id })
    .then((card) => {
      CardModel.findById(card._id)
        .populate('owner')
        .then((data) => res.status(201).send(data))
        .catch(() => res.status(404).send({ message: 'Запрашиваемая карточка не найдена' }));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: err.message });
      }
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

const dislikeCard = (req, res) => {
  if (req.params.cardId.length === 24) {
    CardModel.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
      .populate(['owner', 'likes'])
      .then((card) => {
        if (!card) {
          res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
          return;
        }
        res.send(card);
      })
      .catch(() => res.status(404).send({ message: 'Запрашиваемая карточка не найдена' }));
  } else {
    res.status(400).send({ message: 'Некорректный _id' });
  }
};

const likeCard = (req, res) => {
  if (req.params.cardId.length === 24) {
    CardModel.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
      .populate(['owner', 'likes'])
      .then((card) => {
        if (!card) {
          res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
          return;
        }
        res.send(card);
      })
      .catch(() => res.status(404).send({ message: 'Запрашиваемая карточка не найдена' }));
  } else {
    res.status(400).send({ message: 'Некорректный _id' });
  }
};

module.exports = {
  addCard, getCards, deleteCard, likeCard, dislikeCard,
};
