function findBadges (query, callback) {
    var query = query || {};
    var limit = query.limit || 12;
    var ids = [];
    var badges = [];
    var lipsum = 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

    if (query.id) {
        ids = [query.id];
    } else {
        ids = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
            .split('')
            .sort(function() { return 0.5 - Math.random();})
            .slice(0, limit);
    }

    ids.forEach(function(character) {
        badges.push({
            id: character,
            name: 'Badge ' + character,
            strapline: 'Short Badge Description',
            description: 'Longer Badge Description - ' + lipsum,
            tags: ['Tag 1', 'Tag 2', 'Tag 3']
        });
    });

    callback(null, badges);
}

exports.find = findBadges;

exports.featured = function featured (limit, callback) {
    if (typeof limit === 'function') {
        callback = limit;
        limit = null;
    }

    limit = limit || 4;

    findBadges({
        featured: true,
        limit: limit
    }, callback);
}

exports.latest = function latest (limit, callback) {
    if (typeof limit === 'function') {
        callback = limit;
        limit = null;
    }

    limit = limit || 12;

    findBadges({
        limit: limit
    }, callback);
}

exports.get = function get (id, callback) {
    findBadges({
        limit: 1,
        id: id
    }, function (err, badges) {
        callback(err, (badges||[])[0]);
    });
}

exports.similar = function similar (id, limit, callback) {
    if (typeof limit === 'function') {
        callback = limit;
        limit = null;
    }

    limit = limit || 4;

    findBadges({
        limit: limit,
        similarTo: id
    }, callback);
}

exports.add = function addBadge (badge) {
    
}