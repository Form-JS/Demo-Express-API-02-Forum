const categoryRouter = require('./category-router');

const router = require('express').Router();
router.use('/category', categoryRouter);

module.exports = router;