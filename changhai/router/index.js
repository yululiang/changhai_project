const express = require('express');
const router = express.Router();

router.use('/dailySet', require('./dailySet'));


module.exports = router;