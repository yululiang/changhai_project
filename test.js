let Connection = require('./mysql_conn');
let conn = new Connection();
async function test(sql) {
    let result = await conn.query(sql);
    console.log(result);
}

async function test2() {
    await test(`insert into user values (0, 'louis', 25, '19930204')`);
    await test(`select * from user`);
    conn.close();
}

test2();
// let arr = [1,2,3];
// arr.splice(arr.indexOf(2), 1);
// console.log(arr);
