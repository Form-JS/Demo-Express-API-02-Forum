const { DataTypes, Sequelize } = require('sequelize');

/**
 * Représentation du model Message
 * @param {Sequelize} sequelize
 * @returns
 */

module.exports = (sequelize) => {

    // Initialize model Message
    const Message = sequelize.define('message', {
        content: {
            type: DataTypes.STRING(1000),
            allowNull: false
        }
    }, {
        tableName: 'subjectMessages'
    });

    return Message;
};
