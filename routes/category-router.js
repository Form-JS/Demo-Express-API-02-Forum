const categoryController = require('../controllers/category-controller');
const { authentificateJwt } = require('../middlewares/authentificate-jwt');
const bodyValidation = require('../middlewares/body-validation-middleware');
const { categoryValidator } = require('../validators/category-validator');

const categoryRouter = require('express').Router();

categoryRouter.route('/')
    .get(categoryController.getAll)
    .post(authentificateJwt({ adminRight: true }), bodyValidation(categoryValidator), categoryController.add);

categoryRouter.route('/:id([0-9]+)')
    .get(categoryController.getById)
    .put(authentificateJwt({ adminRight: true }), bodyValidation(categoryValidator), categoryController.update)
    .delete(authentificateJwt({ adminRight: true }), categoryController.delete);

module.exports = categoryRouter;