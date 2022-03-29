const subjectController = require('../controllers/subject-controller');
const bodyValidation = require('../middlewares/body-validation-middleware');
const { subjectValidator, subjectUpdateValidator, subjectCategoriesValidator } = require('../validators/subject-validator');


const subjectRouter = require('express').Router();

// Routes principals
subjectRouter.route('/')
    .get(subjectController.getAll)
    .post(bodyValidation(subjectValidator), subjectController.add);

subjectRouter.route('/:id([0-9]+)')
    .get(subjectController.getOne)
    .put(bodyValidation(subjectUpdateValidator), subjectController.update)
    .delete(subjectController.delete);

// Routes pour les categories
subjectRouter.route('/:id([0-9]+)/AddCategories')
    .post(bodyValidation(subjectCategoriesValidator), subjectController.addCategories);

subjectRouter.route('/:id([0-9]+)/RemoveCategories')
    .post(bodyValidation(subjectCategoriesValidator), subjectController.removeCategories);

// Routes pour les messages
subjectRouter.route('/:id([0-9]+)/message')
    .get(subjectController.getAllMessage)
    .post(subjectController.addMessage);

subjectRouter.route('/:id([0-9]+)/message/:messageId([0-9]+)')
    .get(subjectController.getMessageById)
    .put(subjectController.updateMessage)
    .delete(subjectController.deleteMessage);

module.exports = subjectRouter;