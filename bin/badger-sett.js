#!/usr/bin/env node

const DEFAULT_PORT = 3000;
const COOKIE_SECRET = process.env['COOKIE_SECRET'] || null;
const SSL_KEY = process.env['SSL_KEY'];
const SSL_CERT = process.env['SSL_CERT'];

const optimist = require('optimist')
        .usage([
            'Spin up a badger sett server.',
            '',
            'Usage: $0 [-d|--debug] [-p|--port port]',
            'Options can also be provided through environment variables.'
        ].join('\n'))
        .options({
            d: {
                alias: 'debug',
                describe: 'boolean debug option'
            },
            p: {
                alias: 'port',
                describe: 'the port on which to run the server (default: '+DEFAULT_PORT+')'
            }
        });

const argv = optimist.argv;

if (argv['?'] || argv['h'] || argv['help']) {
    optimist.showHelp();
    process.exit(0);
}

const path = require('path');
const express = require('express');

const DEBUG = !!argv['debug'] || ('DEBUG' in process.env);
const PORT = argv['port'] || process.env['PORT'] || DEFAULT_PORT;

var app = require(path.join(__dirname, '..')).app({
    cookieSecret: COOKIE_SECRET,
    debug: DEBUG,
});

if (SSL_KEY) {
    app = require('https').createServer({
        key: fs.readFileSync(SSL_KEY),
        cert: fs.readFileSync(SSL_CERT)
    }, app);
}

app.listen(PORT, function () {
    console.log("Listening on port " + PORT + ".");
});
