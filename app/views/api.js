const api = require('../controllers/api');

exports.ping = function ping (req, res, next) {
    var uri = (req.query['uri'] || '').trim();

    function done (results) {
        res.render('api/ping.html', {
            uri: uri,
            results: results
        });
    }

    if (uri) {
        api.ping(uri, function (err, results) {
            console.log(results);
            done(results);
        });
    } else {
        done();
    }
}
