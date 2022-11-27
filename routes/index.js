const router = require('express').Router();
const auth = require('../middlewares/auth');
const userRouter = require('./users');
const movieRouter = require('./movies');
const { validationCreateUser, validationLoginUser } = require('../utils/validators/userValidator');
const { login, createUser } = require('../controllers/user');
const NotFoundError = require('../utils/errors/notFoundError');

router.post('/signin', validationLoginUser, login);
router.post('/signup', validationCreateUser, createUser);
router.use(auth);
router.use(userRouter);
router.use(movieRouter);

router.use('*', () => {
  throw new NotFoundError('Запрашиваемый адрес не найден. Проверьте URL и метод запроса');
});

module.exports = router;
