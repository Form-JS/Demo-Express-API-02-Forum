const db = require('../models');
const { NotFoundErrorResponse, ErrorResponse } = require('../response-schemas/error-schema');
const { SuccessObjectResponse } = require('../response-schemas/succes-schema');

const messageController = {

    getById: async (req, res) => {
        const id = parseInt(req.params.id);

        const message = await db.Message.findByPk(id);
        if (!message) {
            return res.status(404).json(new NotFoundErrorResponse('Message not found'));
        }

        res.json(new SuccessObjectResponse(message));
    },

    update: async (req, res) => {
        const id = parseInt(req.params.id);
        const data = req.validatedData;

        const [nbRow, updatedData] = await db.Message.update(data, {
            where: { id },
            returning: true
        });

        if (nbRow !== 1) {
            return res.status(400).json(new ErrorResponse('Error during update'));
        }

        res.json(new SuccessObjectResponse(updatedData));
    },

    delete: async (req, res) => {
        const id = parseInt(req.params.id);

        const nbRow = await db.Message.destroy({
            where: { id }
        });

        if (nbRow !== 1) {
            return res.status(400).json(new ErrorResponse('Error during update'));
        }

        res.sendStatus(204);
    }
};

module.exports = messageController;