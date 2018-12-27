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
            let startTime = new Date().getMilliseconds();
            con.query(...args, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    let endTime = new Date().getMilliseconds();
                    logger.info('execute time->', `${(endTime - startTime)}ms`)
                    resolve(result);
                }
            });
        });
    };
    con.releaseTest = () => {
        try {
            con.release();
            logger.info('release connection -> success');
        } catch (err) {
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
const responseSuccess = (data) => {
    return {
        msg: 'success',
        code: 0,
        data: data,
    };
};
const responseFail = (error) => {
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
const service = async (option) => {
    let conn = await getConnection();
    try {
        let { data, path } = option;
        let [dir, file, method] = path.split('.');
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
        let result = await service({ data: req.body, path });
        res.send(responseSuccess(result));
    } catch (err) {
        logger.info(err);
        res.send(responseFail(err));
    }
};

//mongo初始化
const mongoClient = require('mongodb').MongoClient;
function db(url, dbName) {
    return new Promise((resolve, reject) => {
        mongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
            if (err) {
                return reject(err);
            } else {
                let db = client.db(dbName);
                return resolve( { db, client } );
            }
        });
    })
}

class MongoClient {
    constructor(url, dbName) {
        this._url = url;
        this._dbName = dbName;
    }
    /**
     * 实例化一个客户端并且连接
     * @param {*} url 
     * @param {*} dbName 
     */
    static connect(url, dbName) {
        return new Promise(async (resolve, reject) => {
            try {
                let mongoClient = new MongoClient(url, dbName);
                await mongoClient.init_db();
                return resolve(mongoClient);
            } catch (error) {
                return reject(error);
            }
        });
    }
    /**
     * 关闭客户端
     */
    close() {
        if (this._client === null) return false;
        return this._client.close();
    }

    init_db() {
        return new Promise(async (resolve, reject) => {
            if (this._db) resolve();
            try {
                let client = await db(this._url, this._dbName);
                this._db = client.db;
                this._client = client.client;
                return resolve();
            } catch (error) {
                return reject(error);
            }
        });
    }
    /**
     * 插入
     * @param {*} obj 
     * @param {*} collectName 
     */
    insertOne(obj, collectName) {
        if (!obj instanceof Object) return new TypeError('not Object ->' + obj);
        return new Promise(async (resolve, reject) => {
            let collection = this._db.collection(collectName);
            collection.insertOne(obj, (err, result) => {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(result);
                }
            });
        });
    }
    /**
     * 批量插入
     * @param {*} arr 
     * @param {*} collectName 
     */
    insertMany(arr, collectName) {
        if (!arr instanceof Array) return new TypeError('not Array ->' + arr);
        return new Promise((resolve, reject) => {
            let collection = this._db.collection(collectName);
            collection.insertMany(arr, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
    /**
     * 查询
     * @param {*} where 
     * @param {*} collectName 
     * @param {*} skip 
     * @param {*} limit 
     */
    find(where, collectName, skip=0, limit=0) {
        if (!where instanceof Object) return new TypeError('not Object ->' + where);
        if (typeof where === 'Function') where = { $where: where };
        return new Promise((resolve, reject) => {
            let collection = this._db.collection(collectName);
            collection.find(where).skip(skip).limit(limit).toArray((err, result) => {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(result);
                }
            });
        });
    }
    
    /**
     * 管道函数
     * @param {*} x 
     * @param {*} collectName 
     */
    aggregate(x, collectName) {
        return new Promise((resolve, reject) => {
           this._db.collection(collectName).aggregate(x).toArray((err, result) =>　{
                if (err) {
                    return reject(err);
                } else {
                    return resolve(result);
                }
           });
        });
    }
    /**
     * 更新
     * @param {*} where 
     * @param {*} update 
     * @param {*} collectName 
     */
    updateOne(where, update, collectName) {
        if (!where instanceof Object) return new TypeError('not Object ->' + where);
        if (!update instanceof Object) return new TypeError('not Object ->' + update);
        return new Promise((resolve, reject) =>　{
            let collection = this._db.collection(collectName);
            collection.updateOne(where, update, (err, result) => {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(result);
                }
            });
        });
    }
    /**
     * 更新多条
     * @param {*} where 
     * @param {*} update 
     * @param {*} collectName 
     */
    updateMany(where, update, collectName) {
        if (!where instanceof Object) return new TypeError('not Object ->' + where);
        if (!update instanceof Object) return new TypeError('not Object ->' + update);
        return new Promise((resolve, reject) =>　{
            let collection = this._db.collection(collectName);
            collection.updateMany(where, update, (err, result) => {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(result);
                }
            });
        });
    }
    /**
     * 删除一条
     * @param {*} where 
     * @param {*} collectName 
     */
    deleteOne(where, collectName) {
        if (!where instanceof Object) return new TypeError('not Object ->' + where);
        return new Promise((resolve, reject) =>　{
            let collection = this._db.collection(collectName);
            collection.deleteOne(where, (err, result) => {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(result);
                }
            });
        });
    }
    /**
     * 删除多条
     * @param {*} where 
     * @param {*} collectName 
     */
    deleteMany(where, collectName) {
        if (!where instanceof Object) return new TypeError('not Object ->' + where);
        return new Promise((resolve, reject) =>　{
            let collection = this._db.collection(collectName);
            collection.deleteMany(where, (err, result) => {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(result);
                }
            });
        });
    }
    /**
     * 删除集合
     */
    drop() {
        return new Promise((resolve, reject) => {
            let collection = this._db.collection(collectName);
            collection.drop((err, result) => {
                if (err) {
                    return reject(err);
                } else {
                    this.close();
                    return resolve(result);
                }
            });
        });
    }
}

global.MongoClient = MongoClient;
