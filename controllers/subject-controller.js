const db = require('../models');
const { NotFoundErrorResponse, ErrorResponse } = require('../response-schemas/error-schema');
const { SuccessArrayResponse, SuccessObjectResponse } = require('../response-schemas/succes-schema');

// TODO Modifier les méthodes pour utiliser le JWT

const subjectController = {

    // Actions principals
    getAll: async (req, res) => {
        const { offset, limit } = req.pagination;

        const { rows, count } = await db.Subject.findAndCountAll({
            distinct: true,                   // Fix le probleme de count (Permet de ne pas compter les ligne d'un INNER JOIN)
            offset,
            limit,
            // include: db.Category           // Many to Many avec toutes les infos (donc la table intermediaire)
            include: {                        // Many to Many customisé
                model: db.Category,
                through: { attributes: [] },  // -> Permet de selectionner les infos de la table intermediaire
            }
        });
        res.json(new SuccessArrayResponse(rows, count));
    },

    getOne: async (req, res) => {
        const id = parseInt(req.params.id);

        const subject = await db.Subject.findByPk(id, {
            include: {
                model: db.Category,
                through: { attributes: [] }
            }
        });

        if (!subject) {
            return res.status(404).json(new NotFoundErrorResponse('Subject not found'));
        }

        res.json(new SuccessObjectResponse(subject));
    },

    add: async (req, res) => {
        const data = req.validatedData;

        // Ajout d'une transaction
        // -> Sécurité pour s'assuré que toutes les opérations DB soit réalisé ou aucunne
        const transaction = await db.sequelize.transaction();

        try {
            // Ajout d'un nouveau sujet
            const newSubject = await db.Subject.create(data, { transaction });

            // Ajout des categories via l'id (si elle est présente en DB)
            await newSubject.addCategory(data.categories, { transaction });

            // Validation des modifications dans la DB
            await transaction.commit();

            // Envoi du sujet créé
            res.json(new SuccessObjectResponse(newSubject));
        }
        catch (error) {
            // Retour à l'etat (avant les modifications)
            await transaction.rollback();

            // Propagation de l'erreur
            throw error;
        }
    },

    update: async (req, res) => {
        const id = parseInt(req.params.id);
        const data = req.validatedData;

        const transaction = await db.sequelize.transaction();

        const [nbRow, updatedData] = await db.Subject.update(data, {
            where: { id },
            returning: true, // Permet d'obtenir 'updatedData' (Only MSSQL & PostgreSQL)
            transaction
        });

        if (nbRow !== 1) {
            await transaction.rollback();
            return res.status(400).json(new ErrorResponse('Error during update'));
        }

        await transaction.commit();
        res.json(new SuccessObjectResponse(updatedData));
    },

    delete: async (req, res) => {
        const id = parseInt(req.params.id);

        const transaction = await db.sequelize.transaction();
        const nbRow = await db.Subject.destroy({
            where: { id },
            transaction
        });

        if (nbRow !== 1) {
            await transaction.rollback();
            return res.status(404).json(new NotFoundErrorResponse('Subject not found'));
        }

        await transaction.commit();
        res.sendStatus(204);
    },

    // Manipulation des categories
    addCategories: async (req, res) => {
        const id = parseInt(req.params.id);
        const data = req.validatedData;

        // Récuperation du sujet
        const subject = await db.Subject.findByPk(id);

        // Si non trouvé -> 404
        if (!subject) {
            return res.status(404).json(new NotFoundErrorResponse('Subject not found'));
        }

        // Ajout de la categorie avec la méthode généré automatiquement par sequelize
        await subject.addCategory(data.categories);

        // Version au singulier et au pluriel possible :
        // -> subject.addCategories(data.categories);

        res.json(new SuccessObjectResponse(subject));
    },

    removeCategories: async (req, res) => {
        const id = parseInt(req.params.id);
        const data = req.validatedData;

        // Récuperation du sujet
        const subject = await db.Subject.findByPk(id);

        // Si non trouvé -> 404
        if (!subject) {
            return res.status(404).json(new NotFoundErrorResponse('Subject not found'));
        }

        // Ajout de la categorie avec la méthode généré automatiquement par sequelize
        await subject.removeCategory(data.categories);

        // Version au singulier et au pluriel possible :
        // -> subject.removeCategories(data.categories);

        res.json(new SuccessObjectResponse(subject));
    },

    // Manipulation des messages
    getAllMessage: async (req, res) => {
        const subjectId = parseInt(req.params.id);
        const { offset, limit } = req.pagination;

        const { rows, count } = await db.Message.findAndCountAll({
            attributes: {
                exclude: ['subjectId']
            },
            where: { subjectId },
            order: [['createdAt', 'DESC']],
            offset,
            limit
        });

        res.json(new SuccessArrayResponse(rows, count));
    },

    addMessage: async (req, res) => {
        const subjectId = parseInt(req.params.id);
        const data = req.validatedData;

        const subject = await db.Subject.findByPk(subjectId);
        if (!subject) {
            return res.status(404).json(new NotFoundErrorResponse('Subject not found'));
        }

        const transaction = await db.sequelize.transaction();
        try {
            const message = await subject.createMessage(data, { transaction });
            await transaction.commit();

            res.json(new SuccessObjectResponse(message));
        }
        catch (error) {
            transaction.rollback();
            throw error;
        }
    }
};

module.exports = subjectController;