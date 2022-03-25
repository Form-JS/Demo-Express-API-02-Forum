const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    const Category = sequelize.define('Category', {
        name: {
            type: DataTypes.STRING(50),
            allowNull: false
        }
    }, {
        timestamps: false
    });

    return Category;
};