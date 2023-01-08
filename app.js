require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const router = require('./routes');
const rateLimiter = require('./middlewares/rateLimiter');
const errorsHandler = require('./middlewares/errorHandler');
const { errorLogger, requestLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');
const { PORT_CFG, DB_CFG } = require('./utils/config');

const app = express();
app.use(bodyParser.json());
mongoose.connect(DB_CFG, { family: 4 });
app.use(requestLogger);
app.use(rateLimiter);
app.use(helmet());
app.use(cors);
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(errorsHandler);

app.listen(PORT_CFG, () => {
  console.log(`App listening at port ${PORT_CFG}`);
});
