const db = require('../models');

const categoryController = {

    getAll: async (req, res) => {
        const categories = await db.Category.findAll();
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

    update: (req, res) => {
        const id = parseInt(req.params.id);

    },

    delete: (req, res) => {
        const id = parseInt(req.params.id);

    }
};

module.exports = categoryController;