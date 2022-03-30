const db = require('../models');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const { ErrorResponse } = require('../response-schemas/error-schema');
const { generateJWT } = require('../utils/jwt-utils');

const authController = {

    register: async (req, res) => {
        // Recup data + Hash Pwd
        const { pseudo, email } = req.validatedData;
        const password = await bcrypt.hash(req.validatedData.password, 10);

        // Ajout en DB
        const member = await db.Member.create({ pseudo, email, password });

        // Création d'un « Json Web Token »
        const token = generateJWT({
            id: member.id,
            pseudo: member.pseudo,
            isAdmin: member.isAdmin
        });

        res.json(token);
    },

    login: async (req, res) => {
        // Recup data + Hash Pwd
        const { identifier, password } = req.validatedData;

        // Get Member from DB
        const member = await db.Member.findOne({
            where: {    // Condition avec un OU en SQL
                [Op.or]: [
                    {   // Test du pseudo avec l'operateur LIKE
                        pseudo: { [Op.like]: identifier }
                    },
                    {   // Test de l'email avec l'operateur LIKE
                        email: { [Op.like]: identifier }
                    }
                ]
            }
        });

        // Si le member n'existe pas ('Identifier' invalide)
        if (!member) {
            return res.status(422).json(new ErrorResponse('Bad credential', 422));
        }

        // Si le member existe: Check le password via bcrypt
        const isValid = await bcrypt.compare(password, member.password);

        // Si le mot de passe n'est pas valide
        if (!isValid) {
            return res.status(422).json(new ErrorResponse('Bad credential', 422));
        }

        // Création d'un « Json Web Token »
        const token = generateJWT({
            id: member.id,
            pseudo: member.pseudo,
            isAdmin: member.isAdmin
        });

        res.json(token);
    }
};

module.exports = authController;