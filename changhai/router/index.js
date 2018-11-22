const express = require('express');
const router = express.Router();

router.use('/dailySet', require('./dailySet'));
router.use('/dataRecord', require('./dataRecord'));

module.exports = router;