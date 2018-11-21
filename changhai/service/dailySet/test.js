module.exports.test = async function main(conn, data) {
    let sql = `select * from user`;
    return await conn.queryAsync(sql);
};
