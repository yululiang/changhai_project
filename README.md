#github开源项目
```
本项目只支持async await模式
```
```
config.js 配置文件
```
```
common.js 公共函数文件
```
* init.js 初始化文件
```
数据库
log4js 
service调用封装
router调用封装
```
* sqls
```
分模块存放sql字符串，项目启动加载，
避免在service层写sql，影响代码美观
sql存放在.json文件
```
* router
```
控制层 使用render方法(init.js有封装)，调用service层
例：
const express = require('express');
const router = express.Router();
router.get('/test', async (req, res) => {
      render({ path: 'dailySet.test.test', req, res });
  });
```
* service
```
业务逻辑层
访问数据库使用 
conn.queryAsync(sql, sqlParam) 参数：{ {string: sql, array: sqlParam} } 可防sql注入
例：
const ptInfoSQL = sqls.dataRecordSQL.ptInfoSQL;
async function save(conn, data) {
    return await conn.queryAsync(ptInfoSQL.save);
}

exports.save = save;
```

     
     
    
