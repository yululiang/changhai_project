const express = require('express');
const router = express();

router.use('/test', require('./test'));

module.exports = router;