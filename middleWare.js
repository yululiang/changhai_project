const bodyParser = require('body-parser');

function fileNotFound(req, res, next) {
    logger.info('request ->请求无效资源');
    let err = new Error('Not Found');
    err.status = 404;
    res.status(404).send(err);
}

exports.fileNotFound = fileNotFound;
exports.jsonParse = bodyParser.json();
exports.urlencode = bodyParser.urlencoded({ extended: true });