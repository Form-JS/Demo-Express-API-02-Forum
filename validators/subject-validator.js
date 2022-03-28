const yup = require('yup');

const subjectValidator = yup.object().shape({
    name: yup.string().trim().required().min(3).max(255),
    categories: yup.array(yup.number()).default([])
});

const subjectUpdateValidator = yup.object().shape({
    name: yup.string().trim().required().min(3).max(255)
});

const subjectCategoriesValidator = yup.object().shape({
    categories: yup.array(yup.number()).required()
});

module.exports = {
    subjectValidator,
    subjectUpdateValidator,
    subjectCategoriesValidator
};
