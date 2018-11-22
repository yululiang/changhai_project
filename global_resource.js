/*
 * @Author: yululiang 
 * @Date: 2018-11-21 17:51:42 
 * @Last Modified by: yululiang
 * @Last Modified time: 2018-11-21 17:52:24
 */

'use strict';

//成功返回值
global.responseSuccess = (data) => {
    return {
        msg: 'success',
        code: 0,
        data: data,
    };
};
//失败返回值
global.responseFail = (error) => {
    return {
        msg: String(error),
        code: -1,
    };
};
/**
 *service调用方法
 * @param option { data, path }
 * @returns {Promise.<*>}
 */
global.service = async (option) => {
    let conn = await global.getConnection();
    try {
        let { data, path } = option;
        let [ dir, file, method ] = path.split('.');
        let module = require(`./changhai/service/${dir}/${file}`);
        let fn = module[method];
        if (Object.prototype.toString.call(fn) === '[object AsyncFunction]') {
            let result = await fn(conn, data);
            conn.commit();
            return Promise.resolve(result);
        } else {
            return Promise.reject('no this method');
        }
    } catch (err) {
        conn.rollback();
        return Promise.reject(err);
    } finally {
        conn.releaseTest();
    }
};
/**controller调用方法
 * @param option { { path, req, res } }
 * @returns {Promise.<void>}
 */
global.render = async (option) => {
    let { path, req, res } = option;
    try {
        let result = await global.service({ data: req.body, path });
        res.send(responseSuccess(result));
    } catch (err) {
        logger.info(err);
        res.send(responseFail(err));
    }
};

module.exports = {};
logger.info('load global_resource -> finished');
