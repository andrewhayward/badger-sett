const async = require('async');
const badges = require('../controllers/badges');

exports.home = function (req, res, next) {
    badges.featured(function (err, featured) {
        if (err)
            return next(err);

        res.render('site/home.html', {
            featured: featured
        });
    });
}

exports.search = function (req, res, next) {
    var query = req.query['q'];

    badges.find({query: query}, function(err, results) {
        if (err)
            return next(err);

        res.render('site/search.html', {
            query: query,
            results: results,
        });
    });
}

exports.badges = function (req, res, next) {
    async.parallel({
        featured: badges.featured.bind(badges),
        latest: badges.latest.bind(badges)
    }, function (err, context) {
        if (err)
            return next(err);

        res.render('site/badges.html', {
            featured: context.featured,
            latest: context.latest
        });
    });
}

exports.badge = function (req, res, next) {
    async.parallel({
        badge: badges.get.bind(badges, req.params.id),
        similar: badges.similar.bind(badges, req.params.id)
    }, function (err, context) {
        if (err)
            return next(err);

        res.render('site/badge.html', {
            instance: context.badge,
            similar: context.similar
        });
    });
}

exports.about = function (req, res, next) {
    res.render('site/about.html', {
        
    });
}