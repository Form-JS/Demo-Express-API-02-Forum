const jwt = require('jsonwebtoken');

const generateJWT = ({ id, pseudo, isAdmin }) => {
    return new Promise((resolve, reject) => {
        const data = { id, pseudo, isAdmin };
        const options = {
            algorithm: 'HS512',  // HS256 par default
            secret: process.env.JWT_SECRET,
            audience: process.env.JWT_AUDIENCE,
            issuer: process.env.JWT_ISSUER,
            expiresIn: '12h'    // Format: https://github.com/vercel/ms
        };

        jwt.sign(data, secret, options, (error, token) => {
            if (error) {
                return reject(error);
            }
            
            const expire = new Date(jwt.decode(token).exp * 1000).toISOString();
            resolve({ token, expire });
        });
    });
};

const decodeJWT = (token) => {
    if (!token) {
        return Promise.reject(new Error('Indalid JWT'));
    }

    return new Promise((resolve, reject) => {
        const optionsVerify = {
            audience: process.env.JWT_AUDIENCE,
            issuer: process.env.JWT_ISSUER,
        };
        jwt.verify(token, process.env.JWT_SECRET, optionsVerify, (error, data) => {
            if(error) {
                return reject(error);
            }
            
            resolve({
                id: data.id,
                pseudo: data.pseudo,
                isAdmin: data.isAdmin
            });
        });
    });
};

module.exports = {
    generateJWT,
    decodeJWT
};