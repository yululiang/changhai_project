const express = require('express');
const router = express.Router();

router.use(express.static('public'));
router.use('/dailySet', require('./dailySet'));
router.use('/dataRecord', require('./dataRecord'));

router.post('/login.do',　async (req, res) =>　{
    return await render({ path: 'authority.login.login', req, res });
});

router.post('/register.do',　async (req, res) =>　{
    return await render({ path: 'authority.register.register', req, res });
});

module.exports = router;

