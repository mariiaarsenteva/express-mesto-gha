const UserModel = require('../models/user');

const getUsers = (req, res) => UserModel.find({})
  .then((users) => res.status(200).send(users))
  .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));

const getUserById = (req, res) => {
  if (req.params.userId.length === 24) {
    UserModel.findById(req.params.userId)
      .then((user) => {
        if (!user) {
          res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
          return;
        }
        res.status(200).send(user);
      })
      .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
  } else {
    res.status(400).send({ message: 'Некорректный _id' });
  }
};

const addUser = (req, res) => UserModel.create({ ...req.body })
  .then((user) => res.status(201).send(user))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: err.message });
    }
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  });

const editUserData = (req, res) => {
  const { name, about } = req.body;
  if (req.user._id) {
    UserModel.findByIdAndUpdate(req.user._id, { name, about }, { new: 'true', runValidators: true })
      .then((user) => res.send(user))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(400).send({ message: err.message });
        } else {
          res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
        }
      });
  } else {
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};

const editUserAvatar = (req, res) => {
  if (req.user._id) {
    UserModel.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, { new: 'true', runValidators: true })
      .then((user) => res.send(user))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(400).send({ message: err.message });
        } else {
          res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
        }
      });
  } else {
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports = {
  getUsers, getUserById, addUser, editUserData, editUserAvatar,
};
