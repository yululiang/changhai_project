'use strict';
//初始化配置
const config = require('./config');
//初始化日志组件
const log4js = require('log4js');
log4js.configure(config.log4jsConfig);
global.logger = log4js.getLogger('oth');
logger.info('init logger -> finished');
//初始化连接
const mysql = require('mysql');
const pool = mysql.createPool(config.dbConfig);
async function getConnection() {
    logger.info('get connection success');
    let con = await new Promise((resolve, reject) => {
        pool.getConnection((err, con) => {
            if (err) {
                return reject(err);
            } else {
                return resolve(con);
            }
        });
    });
    con.queryAsync = (...args) => {
        return new Promise((resolve, reject) => {
            logger.info('sql ->', args[0]);
            logger.info('sqlParam ->', args[1] || []);
            con.query(...args, (err, result) => {
                if (err)  {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    };
    con.releaseTest = () => {
        try {
            con.release();
            logger.info('release connection -> success');
        }  catch (err) {
            con.end();
            logger.info('release connection -> fail');
        }
    };
    return con;
}
logger.info('init mysql_pool -> finished');
//初始化sql语句
global.sqls = require('./changhai/sqls');
logger.info('init sqls -> finished');
//初始化公共参数
global.responseSuccess = (data) => {
    return {
        msg: 'success',
        code: 0,
        data: data,
    };
};
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
    let conn = await getConnection();
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