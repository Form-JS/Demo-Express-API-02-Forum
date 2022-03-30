const { decodeJWT } = require('../utils/jwt-utils');
const db = require('../models');
const { Op } = require('sequelize');

const authentificateJwt = ({ adminRight = false }) => {
    /**
      * Middleware pour gérer les jwt
      * @param {Request} req 
      * @param {Response} res 
      * @param {NextFunction} next 
      */
    return async (req, res, next) => {
        // - Récuperation du header d'authenfication
        const authHeader = req.headers['authorization'];
        // Résultat: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6..."

        // Récuperation du JWT
        const token = authHeader && authHeader.split(' ')[1];

        // Si aucun token recu
        if (!token) {
            return res.sendStatus(401);
        }

        // Si un token
        try {
            // Récuperation des données
            const tokenData = decodeJWT(token);

            // Si 'AdminRight' -> Verification si l'utilisateur est admin
            if (adminRight) {
                //  Check en DB
                const admin = await db.Member.findOne({
                    where: {
                        [Op.and]: [
                            { id: tokenData.id },
                            { isAdmin: true }
                        ]
                    }
                });

                if (!admin) {
                    return res.sendStatus(403);
                }
            }

            // Ajout des infos du token a l'object "request" d'express
            req.user = tokenData;

            // On continue :)
            next();
        }
        catch (error) {
            return res.sendStatus(403);
        }
    };
};

module.exports = {
    authentificateJwt
};