const categoryRouter = require('./category-router');
const subjectRouter = require('./subject-router');

const router = require('express').Router();
router.use('/category', categoryRouter);
router.use('/subject', subjectRouter);

module.exports = router;