/*
 * @Author: yululiang 
 * @Date: 2018-11-21 17:51:23 
 * @Last Modified by:   yululiang 
 * @Last Modified time: 2018-11-21 17:51:23 
 */

'use strict';
//放一些公用的方法
global.common = {};

global.common.getCurrentModule = (dirname) => {
    let list = dirname.split('\\');
    return list[list.length - 1];
};

global.md5 = (v) => {
    const crypto = require('crypto');
    const md5 = crypto.createHash('md5');
    return md5.update(v).digest('hex');
};

logger.info('load common -> finished');
module.exports = common;