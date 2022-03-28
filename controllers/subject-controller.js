const db = require('../models');

const subjectController = {

    getAll: async (req, res) => {
        const subjects = await db.Subject.findAll({
            // include: db.Category          // Many to Many avec toutes les infos (donc la table intermediaire)
            include: {                       // Many to Many customisé
                model: db.Category,
                through: { attributes: [] }  // -> Permet de selectionner les infos de la table intermediaire
            }
        });
        res.json(subjects);
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
            return res.sendStatus(404);
        }

        res.json(subject);
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
            res.json(newSubject);
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

        const [nbRow, updatedData] = await db.Subject.update(data, {
            where: { id },
            returning: true // Permet d'obtenir 'updatedData' (Only MSSQL & PostgreSQL)
        });

        if (nbRow !== 1) {
            return res.sendStatus(400);
        }
        res.json(updatedData);
    },

    delete: async (req, res) => {
        const id = parseInt(req.params.id);

        const nbRow = await db.Subject.destroy({
            where: { id }
        });

        if (nbRow !== 1) {
            return res.sendStatus(404);
        }
        res.sendStatus(204);
    },


    addCategories: async (req, res) => {
        const id = parseInt(req.params.id);
        const data = req.validatedData;

        // Récuperation du sujet
        const subject = await db.Subject.findByPk(id);

        // Si non trouvé -> 404
        if (!subject) {
            return res.sendStatus(404);
        }

        // Ajout de la categorie avec la méthode généré automatiquement par sequelize
        await subject.addCategory(data.categories);

        // Version au singulier et au pluriel possible :
        // -> subject.addCategories(data.categories);

        res.json(subject);
    },

    removeCategories: async (req, res) => {
        const id = parseInt(req.params.id);
        const data = req.validatedData;

        // Récuperation du sujet
        const subject = await db.Subject.findByPk(id);

        // Si non trouvé -> 404
        if (!subject) {
            return res.sendStatus(404);
        }

        // Ajout de la categorie avec la méthode généré automatiquement par sequelize
        await subject.removeCategory(data.categories);

        // Version au singulier et au pluriel possible :
        // -> subject.removeCategories(data.categories);

        res.json(subject);
    }

};

module.exports = subjectController;