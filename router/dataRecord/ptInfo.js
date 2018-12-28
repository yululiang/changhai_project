const express = require('express');
const router = express.Router();

router.post('/save', async (req, res) => {
    render({ path: 'dataRecord.ptInfo.save', req, res });
});

module.exports = router;