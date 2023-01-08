const Movie = require('../models/movie');
const {
  NOT_FOUND_ERROR_CODE,
  DEFAULT_ERROR_CODE,
  INCORRECT_DATA_ERROR_CODE, MOVIE_NOT_FOUND, FORBIDDEN_DELETE_MOVIE, INCORRECT_DATA,
} = require('../utils/constants');
const BadRequestError = require('../utils/errors/badRequestError');
const NotFoundError = require('../utils/errors/notFoundError');
const ForbiddenError = require('../utils/errors/forbiddenError');

const USER_REF = [{ path: 'likes', model: 'user' }];

module.exports.getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({ owner: req.user._id });
    res.send(movies);
  } catch (e) {
    next(e);
  }
};

module.exports.createMovie = async (req, res, next) => {
  try {
    const movie = await Movie.create({ ...req.body, owner: req.user._id });

    res.send({
      message: 'Фильм успешно создан',
    });
  } catch (e) {
    if (e.name === 'ValidationError') {
      next(new BadRequestError(e.message));
    } else {
      next(e);
    }
  }
};

module.exports.deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params._id);
    if (!movie) {
      throw new NotFoundError(MOVIE_NOT_FOUND);
    }
    if (movie.owner.toString() !== req.user._id) {
      throw new ForbiddenError(FORBIDDEN_DELETE_MOVIE);
    }
    const movieDelete = await Movie.findByIdAndRemove(req.params._id);
    res.send({
      message: 'Фильм удален',
    });
  } catch (e) {
    if (e.name === 'CastError') {
      next(new BadRequestError(INCORRECT_DATA));
    } else {
      next(e);
    }
  }
};
