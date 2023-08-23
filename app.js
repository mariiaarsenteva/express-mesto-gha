const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const router = express.Router();

const { PORT } = process.env;

// mongoose.connect(MONGODB_URL, {
//   useUnifiedTopology: true,
//   useNewUrlParser: true,
// });

mongoose.connect(process.env.MONGODB_URL);
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: 'true',
  useUnifiedTopology: 'true',
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
