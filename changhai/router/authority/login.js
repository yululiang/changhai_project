/*
 * @Author: yululiang 
 * @Date: 2018-12-18 16:20:12 
 * @Last Modified by: yululiang
 * @Last Modified time: 2018-12-18 16:29:58
 */
'use strict'
const express = require('express');
const router = express.Router();

//登陆
router.post('/login.do', async (req, res) => {
    render({ path: 'authority.login.login', req, res });
});

module.exports = router;