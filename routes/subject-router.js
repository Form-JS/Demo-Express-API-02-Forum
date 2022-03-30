const subjectController = require('../controllers/subject-controller');
const bodyValidation = require('../middlewares/body-validation-middleware');
const { messageValidator } = require('../validators/message-validator');
const { subjectValidator, subjectUpdateValidator, subjectCategoriesValidator } = require('../validators/subject-validator');


const subjectRouter = require('express').Router();

// Routes principals
subjectRouter.route('/')
    .get(subjectController.getAll)
    .post(authentificateJwt(), bodyValidation(subjectValidator), subjectController.add);

subjectRouter.route('/:id([0-9]+)')
    .get(subjectController.getOne)
    .put(authentificateJwt(), bodyValidation(subjectUpdateValidator), subjectController.update)
    .delete(authentificateJwt(), subjectController.delete);

// Routes pour les categories
subjectRouter.route('/:id([0-9]+)/AddCategories')
    .post(authentificateJwt(), bodyValidation(subjectCategoriesValidator), subjectController.addCategories);

subjectRouter.route('/:id([0-9]+)/RemoveCategories')
    .post(authentificateJwt(), bodyValidation(subjectCategoriesValidator), subjectController.removeCategories);

// Routes pour les messages
subjectRouter.route('/:id([0-9]+)/message')
    .get(subjectController.getAllMessage)
    .post(authentificateJwt(), bodyValidation(messageValidator), subjectController.addMessage);

module.exports = subjectRouter;