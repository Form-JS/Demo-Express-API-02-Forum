const categoryController = require('../controllers/category-controller');

const categoryRouter = require('express').Router();

categoryRouter.route('/')
    .get(categoryController.getAll)
    .post(categoryController.add);

categoryRouter.route('/:id([0-9]+)')
    .get(categoryController.getById)
    .put(categoryController.update)
    .delete(categoryController.delete);

module.exports = categoryRouter;