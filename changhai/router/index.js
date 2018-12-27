const express = require('express');
const router = express.Router();

router.use('/dailySet', require('./dailySet'));
router.use('/dataRecord', require('./dataRecord'));
router.use('/authority', require('./authority'));

module.exports = router;