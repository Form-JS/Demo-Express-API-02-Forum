const jwt = require('jsonwebtoken');

const generateJWT = ({ id, pseudo, isAdmin }) => {
    const data = { id, pseudo, isAdmin };
    const secret = process.env.JWT_SECRET;
    const audience = process.env.JWT_AUDIENCE;
    const issuer = process.env.JWT_ISSUER;
    const expiresIn = '12h'; // Format: https://github.com/vercel/ms

    const token = jwt.sign(data, secret, {
        audience,
        issuer,
        expiresIn,
        algorithm: 'HS512'  // HS256 par default
    });
    const expire = new Date(jwt.decode(token).exp * 1000).toISOString();

    return {
        token,
        expire
    };
};

const decodeJWT = (token) => {
    if (!token) {
        throw new Error('Indalid JWT');
    }

    const optionsVerify = {
        audience: process.env.JWT_AUDIENCE,
        issuer: process.env.JWT_ISSUER,
    };
    const data = jwt.verify(token, process.env.JWT_SECRET, optionsVerify);

    return {
        id: data.id,
        pseudo: data.pseudo,
        isAdmin: data.isAdmin
    };
};

module.exports = {
    generateJWT,
    decodeJWT
};