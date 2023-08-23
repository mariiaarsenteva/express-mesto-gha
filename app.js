const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const router = express.Router();

const { PORT } = process.env;
const { MONGODB_URI } = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const app = express();

app.use(bodyParser.json());
app.use(router);

app.use((req, res, next) => {
  req.user = {
    _id: '64e287cff8b18399a9dcb59f',
  };

  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

app.timeout = 0;

app.listen(PORT);
