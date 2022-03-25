const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    const Category = sequelize.define('category', {
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        }
    }, {
        timestamps: false
    });

    return Category;
};