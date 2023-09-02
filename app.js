const helmet = require('helmet');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const router = express.Router();

const { PORT, MONGODB_URL } = process.env; // переменные прописаны в .env

mongoose.connect(MONGODB_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

// mongoose.connect(process.env.MONGODB_URL);
// mongoose.connect('mongodb://localhost:27017/mestodb', {
//   useNewUrlParser: 'true',
//   useUnifiedTopology: 'true',
// });

const app = express();

app.use(helmet());

app.use(bodyParser.json());
app.use(router);

app.use((req, res, next) => {
  req.user = {
    _id: '64f34e13af0aea68dd401d98',
  };

  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    // проверяем статус и выставляем сообщение в зависимости от него
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
});

app.timeout = 0;
app.listen(PORT);
