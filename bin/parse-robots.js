#!/usr/bin/env node

const optimist = require('optimist')
        .usage([
            'Parse robots text, and output a list of badge XML files.',
            'If no URI is specified, robots text is read from stdin',
            '',
            'Usage: $0 [-u|--uri uri]'
        ].join('\n'))
        .options({
            u: {
                alias: 'uri',
                describe: 'the URI to read the robots.txt from'
            }
        });

const argv = optimist.argv;

if (argv['?'] || argv['h'] || argv['help']) {
    optimist.showHelp();
    process.exit(0);
}

const path = require('path');
const request = require('request');
const url = require('url');

const parse = require(path.normalize(__dirname + '/../lib/parse-robots'));

function parseRobots (robots) {
    robots = parse(robots);

    if (!robots.length)
        process.exit(1);

    robots.forEach(function(uri) {
        console.log(uri);
    });
}

if (argv['uri']) {

    var uri = argv['uri'];
    if (!url.parse(uri).protocol)
        uri = 'http://' + uri.replace(/^\/+/, '');
    var robots = url.resolve(uri, '/robots.txt');

    request(robots, function (error, response, body) {
        if (!error && response.statusCode === 200)
            return parseRobots(body);
    
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
        parseRobots(stdin.join(''));
    });

}