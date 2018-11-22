const ptInfoSQL = sqls.dataRecordSQL.ptInfoSQL;
async function save(conn, data) {
    return await conn.queryAsync(ptInfoSQL.save);
}

exports.save = save;