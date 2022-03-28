const categoryController = require('../controllers/category-controller');
const bodyValidation = require('../middlewares/body-validation-middleware');
const { categoryValidator } = require('../validators/category-validator');

const categoryRouter = require('express').Router();

categoryRouter.route('/')
    .get(categoryController.getAll)
    .post(bodyValidation(categoryValidator), categoryController.add);

categoryRouter.route('/:id([0-9]+)')
    .get(categoryController.getById)
    .put(bodyValidation(categoryValidator), categoryController.update)
    .delete(categoryController.delete);

module.exports = categoryRouter;