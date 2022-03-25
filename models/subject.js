const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    // Initialize Subject model
    const Subject = sequelize.define('Subject', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    return Subject;
};