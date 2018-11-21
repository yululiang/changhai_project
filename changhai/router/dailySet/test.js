const express = require('express');
const router = express.Router();

router.post('/test', async (req, res) => {
    try {
        let result = await global.service({
            path: 'dailySet.test.test',
            data: req.body
        });
        res.send(global.responseSuccess(result));
    } catch (err) {
        console.log(err);
        res.send(global.responseFail(err));
    }
});

module.exports = router;



