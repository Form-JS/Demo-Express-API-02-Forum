const db = require('../models');

const categoryController = {

    getAll: async (req, res) => {
        const categories = await db.Category.findAll({
            order: [['name', 'ASC']]
        });
        res.json(categories);
    },

    getById: async (req, res) => {
        const id = parseInt(req.params.id);

        const category = await db.Category.findOne({
            where: { id: id }
        });

        if (!category) {
            return res.sendStatus(404);
        }
        res.json(category);
    },

    add: async (req, res) => {
        const data = {
            name: req.body.name
        };

        const newCategory = await db.Category.create(data);
        res.json(newCategory);
    },

    update: async (req, res) => {
        const id = parseInt(req.params.id);
        const data = {
            name: req.body.name
        };

        const resultUpdate = await db.Category.update(data, {
            where: { id },   // Ecriture simplifié -> { id: id }
            returning: true
        });

        // Nombre de row modifier
        const nbRow = resultUpdate[0];
        if (nbRow !== 1) {
            return res.sendStatus(400);
        }

        // Tableau avec les valeurs mise à jours (Ne fonctionne pas sur MySQL / MariaDB)
        const updatedData = resultUpdate[1];
        res.status(200).json(updatedData[0]);
    },

    delete: async (req, res) => {
        const id = parseInt(req.params.id);

        const nbRow = await db.Category.destroy({
            where: { id }
        });

        if (nbRow !== 1) {
            return res.sendStatus(404);
        }
        res.sendStatus(204);
    }
};

module.exports = categoryController;