#!/usr/bin/env node

const optimist = require('optimist')
        .usage([
            'Validate a badge XML file against relevant schema.',
            'If no URI is specified, XML is read from stdin',
            '',
            'Usage: $0 [-q|--quiet] [-v|--verbose] [-u|--uri uri]'
        ].join('\n'))
        .options({
            q: {
                alias: 'quiet',
                describe: 'do not print to stdout'
            },
            v: {
                alias: 'verbose',
                describe: 'display errors'
            },
            u: {
                alias: 'uri',
                describe: 'the URI to read the XML from'
            }
        });

const argv = optimist.argv;

if (argv['?'] || argv['h'] || argv['help']) {
    optimist.showHelp();
    process.exit(0);
}

const path = require('path');
const request = require('request');

const validate = require(path.normalize(__dirname + '/../lib/validate-xml'));

function log (msg) {
    if (!argv['quiet'])
        console.log.apply(console, arguments);
}

function validateXml (xmlStr) {
    var validation = validate(xmlStr);

    if (validation.valid) {
        log('Valid');
        process.exit(0);
    } else {
        log('Invalid');
        if (argv['verbose'])
            validation.errors.forEach(function(err) { log(' -', err); });
        process.exit(1);
    }
}

if (argv['uri']) {

    var uri = argv['uri'];

    request(uri, function (error, response, body) {
        if (!error && response.statusCode === 200)
            return validateXml(body);

        log('Invalid');
        process.exit(1);
    });

} else {

    var stdin = [];

    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    process.stdin.on('data', function(chunk) {
        stdin.push(chunk);
    });

    process.stdin.on('end', function() {
        validateXml(stdin.join(''));
    });

}
