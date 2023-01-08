require('dotenv').config();

const { NODE_ENV, PORT, DB } = process.env;

const PORT_CFG = NODE_ENV === 'production' ? PORT : 3001;
const DB_CFG = NODE_ENV === 'production' ? DB : 'mongodb://localhost:27017/moviesdb';

module.exports = {
  PORT_CFG,
  DB_CFG,
};
