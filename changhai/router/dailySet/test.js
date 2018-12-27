const express = require('express');
const router = express.Router();
/**
 * router调用例（控制层）
 */
router.get('/test', async (req, res) => {
    render({ path: 'dailySet.test.test', req, res });
});

module.exports = router;


/**
 *
 * @param test { test }
 * @param test2
 */
function test(test, test2) {
	console.log(123);
}
