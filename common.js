/*
 * @Author: yululiang 
 * @Date: 2018-11-21 17:51:23 
 * @Last Modified by:   yululiang 
 * @Last Modified time: 2018-11-21 17:51:23 
 */

'use strict';

global.common = {};
global.common.getCurrentModule = (dirname) => {
    let list = dirname.split('\\');
    return list[list.length - 1];
};
console.log('===========>common load finished');
module.exports = common;