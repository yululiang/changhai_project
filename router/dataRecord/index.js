const express = require('express');
const router = express.Router();

router.use('/ptInfo', require('./ptInfo'));

module.exports = router;