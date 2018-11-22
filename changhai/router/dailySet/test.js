const express = require('express');
const router = express.Router();
/**
 * router调用例（控制层）
 */
router.post('/test', async (req, res) => {
    render({ path: 'dailySet.test.test', req, res });
});

module.exports = router;



