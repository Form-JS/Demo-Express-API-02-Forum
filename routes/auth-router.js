const authController = require('../controllers/auth-controller');
const bodyValidation = require('../middlewares/body-validation-middleware');
const { registerValidator, loginValidator } = require('../validators/auth-validator');


const authRouter = require('express').Router();

authRouter.route('/register')
    .post(bodyValidation(registerValidator), authController.register);

authRouter.route('/login')
    .post(bodyValidation(loginValidator), authController.login);

module.exports = authRouter;