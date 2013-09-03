// At some point, update this for jscoverage

/*
exports = module.exports = process.env.BADGER_SETT_COV
  ? require('./lib-cov/badger-sett')
  : require('./lib/badger-sett');
*/

exports = module.exports = require('./lib/badger-sett')