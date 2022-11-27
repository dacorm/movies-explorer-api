const movieRouter = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movie');
const { validationCreateMovie, validationMovieId } = require('../utils/validators/movieValidator');

movieRouter.get('/movies', getMovies);
movieRouter.post('/movies', validationCreateMovie, createMovie);
movieRouter.delete('/movies/:_id', validationMovieId, deleteMovie);

module.exports = movieRouter;
