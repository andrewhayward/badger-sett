var re = /^\s*Badges:\s*([^\s]+)\s*$/i;

exports = module.exports = function parseRobots (robotsStr) {
    var matches = robotsStr.trim().match(new RegExp(re.source, 'gim'));
    var uris = [];

    matches && matches.forEach(function(match) {
        uris.push(match.match(re)[1]);
    });

    return uris;
}
