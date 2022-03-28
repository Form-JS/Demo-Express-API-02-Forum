const subjectController = require('../controllers/subject-controller');
const bodyValidation = require('../middlewares/body-validation-middleware');
const { subjectValidator, subjectUpdateValidator, subjectCategoriesValidator } = require('../validators/subject-validator');


const subjectRouter = require('express').Router();

subjectRouter.route('/')
    .get(subjectController.getAll)
    .post(bodyValidation(subjectValidator), subjectController.add);

subjectRouter.route('/:id([0-9]+)')
    .get(subjectController.getOne)
    .put(bodyValidation(subjectUpdateValidator), subjectController.update)
    .delete(subjectController.delete);

subjectRouter.route('/:id([0-9]+)/AddCategories')
    .post(bodyValidation(subjectCategoriesValidator), subjectController.addCategories);

subjectRouter.route('/:id([0-9]+)/RemoveCategories')
    .post(bodyValidation(subjectCategoriesValidator), subjectController.removeCategories);

module.exports = subjectRouter;