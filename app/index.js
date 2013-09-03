const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');
const views = require('./views');

exports = module.exports = function generateApp (config) {
    config = config || {};

    var staticDir = path.join(__dirname, '/static');
    var staticRoot = '/static';

    var app = express();

    var loaders = [new nunjucks.FileSystemLoader(path.join(__dirname, 'templates'))];
    if (config.templates)
        loaders.unshift(new nunjucks.FileSystemLoader(config.templates));

    var env = new nunjucks.Environment(loaders, {
        autoescape: true,
        dev: !!config.debug,
    });

    env.express(app);

    // Bootstrap the app for reversible routing, and other niceties
    require('../lib/router.js')(app);

    app.configure(function () {
        app.use(staticRoot, express.static(staticDir));

        app.use(function (req, res, next) {
            res.locals.static = function static (staticPath) {
                return path.join(app.mountPoint, staticRoot, staticPath);
            }
            next();
        });
    });

    // Define routes
    app.get('/', 'site.home', views.site.home);
    app.get('/badges', 'site.badges', views.site.badges);
    app.get('/badges/:id', 'site.badge', views.site.badge);
    app.get('/search', 'site.search', views.site.search);
    app.get('/ping', 'api.ping', views.api.ping);

    // Baseline error handler
    app.use(function(err, req, res, next) {
        if (typeof(err.status) === 'number')
            return res.type('text/plain').send(err.status, err.message);

        process.stderr.write(err.stack);
        res.status(500).render('errors/default.html');
    });

    return app;
}
