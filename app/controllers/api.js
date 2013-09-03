const async = require('async');
const lib = require('../../lib');
const path = require('path');
const request = require('request');
const url = require('url');

function parseRobots (uri, callback) {
    if (!url.parse(uri).protocol)
        uri = 'http://' + uri.replace(/^\/+/, '');
    var robots = url.resolve(uri, '/robots.txt');
    var base = url.parse(uri);

    request(robots, function (error, response, body) {
        if (error || response.statusCode >= 300) {
            callback(error, []);
        }

        var uris = [];
        lib.parseRobots(body).forEach(function(uri) {
            if (!url.parse(uri).hostname)
                uri = url.resolve(base.href, uri);
            if (!url.parse(uri).protocol)
                uri = base.protocol + '//' + uri.replace(/^\/+/, '');

            uris.push(uri);
        });
        callback(null, uris);
    });
}

function updateFromRobots (uri, callback) {
    parseRobots(uri, function(err, uris) {
        if (err)
            return callback(err, []);

        async.map(uris, function (uri, done) {
            processUri(uri, function(err, rsp) {
                done({
                    uri: uri,
                    error: err,
                    response: rsp || null
                });
            })
        }, callback);
    });
}

function processUri (uri, callback) {
    var extension = path.extname(uri).toLowerCase();

    if (extension === '.xml') {
        return updateFromXml(uri, callback);
    } else if (extension === '.json') {
        return updateFromJson(uri, callback);
    } else {
        return callback('Unknown file type');
    }
}

function updateFromXml (uri, callback) {
    callback(null, true);
}

function updateFromJson (uri, callback) {
    callback(null, true);
}

exports.parseRobots = parseRobots;
exports.updateFromRobots = updateFromRobots;
exports.updateFromXml = updateFromXml;
exports.updateFromJson = updateFromJson;

exports.ping = function (uri, type, callback) {
    if (typeof type === 'function') {
        callback = type;
        type = null;
    }

    if (typeof callback !== 'function') {
        callback = function () {};
    }

    if (!type) {
        var extension = path.extname(uri).split('.').pop().toLowerCase();
        if (['json', 'xml'].indexOf(extension) >= 0) {
            type = extension;
        } else {
            type = 'robots';
        }
    }

    switch (type) {
        case 'robots':
            return updateFromRobots(uri, callback);
            break;
        case 'xml':
            return updateFromXml(uri, callback);
            break;
        case 'json':
            return updateFromJson(uri, callback);
            break;
        default:
            callback('Unknown ping type; should be one of robots, xml, json.');
            return false;
    }
}