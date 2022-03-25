
module.exports = (sequelize) => {

    const CategorySubject = sequelize.define('categorySubject', {}, {
        timestamps: false,
        tableName: 'categorySubject'
    });

    return CategorySubject;
};