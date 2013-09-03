const fs = require('fs');
const libxml = require('libxmljs');
const path = require('path');

function loadSchema (file) {
    var location = path.normalize(__dirname + '/../app/static/schemas/' + file);
    return libxml.parseXml(fs.readFileSync(location));
}

const SCHEMA_LIST = {
    badgelist: loadSchema('badgelist.xsd'),
    badgeindex: loadSchema('badgeindex.xsd')
}

exports = module.exports = function validateXml (xmlStr) {
    try {
        var xml = libxml.parseXml(xmlStr);
    } catch (err) {
        return {
            valid: false,
            errors: ["Could not parse XML"]
        };
    }

    var schemaName = xml.root().name();
    var schema = SCHEMA_LIST.hasOwnProperty(schemaName) && SCHEMA_LIST[schemaName];

    if (!schema) {
        return {
            valid: false,
            errors: ["Could not match to valid schema"]
        };
    }

    if (!xml.validate(schema)) {
        return {
            valid: false,
            errors: ["Unknown error - libxmljs is not particularly useful"]
        };
    }

    return {
        valid: true,
        errors: []
    }
}
