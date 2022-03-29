const categoryRouter = require('./category-router');
const messageRouter = require('./message-router');
const subjectRouter = require('./subject-router');

const router = require('express').Router();
router.use('/category', categoryRouter);
router.use('/subject', subjectRouter);
router.use('/message', messageRouter);

module.exports = router;