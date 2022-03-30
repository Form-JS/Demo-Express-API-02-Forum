const messageController = require('../controllers/message-controller');
const bodyValidation = require('../middlewares/body-validation-middleware');
const { messageValidator } = require('../validators/message-validator');

const messageRouter = require('express').Router();

messageRouter.route('/:id([0-9]+)')
    .get(messageController.getById)
    .put(authentificateJwt(), bodyValidation(messageValidator), messageController.update)
    .delete(authentificateJwt(), messageController.delete);

module.exports = messageRouter;