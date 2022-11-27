const Movie = require('../models/movie');
const {
  NOT_FOUND_ERROR_CODE,
  DEFAULT_ERROR_CODE,
  INCORRECT_DATA_ERROR_CODE,
} = require('../utils/constants');
const BadRequestError = require('../utils/errors/badRequestError');
const NotFoundError = require('../utils/errors/notFoundError');
const ForbiddenError = require('../utils/errors/forbiddenError');

const USER_REF = [{ path: 'likes', model: 'user' }];

module.exports.getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({});
    res.send(movies);
  } catch (e) {
    next(e);
  }
};

module.exports.createMovie = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const movie = await Movie.create({ name, link, owner: req.user._id });

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
      return new NotFoundError('Фильм не найден');
    }
    if (movie.owner.toString() !== req.user._id) {
      return new ForbiddenError('Нельзя удалять чужие фильмы');
    }
    const movieDelete = await Movie.findByIdAndRemove(req.params._id);
    res.send({
      message: 'Фильм удален',
    });
  } catch (e) {
    if (e.name === 'CastError') {
      next(new BadRequestError('Переданы не валидные данные'));
    } else {
      next(e);
    }
  }
};