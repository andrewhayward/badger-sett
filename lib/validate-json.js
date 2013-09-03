const fs = require('fs');
const JaySchema = require('jayschema');
const path = require('path');

function loadSchema (file) {
    var location = path.normalize(__dirname + '/../app/static/schemas/' + file);
    return require(location);
}

const SCHEMA_LIST = {
    badgelist: loadSchema('badgelist.json'),
    badgeindex: loadSchema('badgeindex.json')
}

exports = module.exports = function validateJson (json) {
    var js = new JaySchema();

    try {
        if (typeof json === 'string')
            json = JSON.parse(json);
    } catch (err) {
        return {
            valid: false,
            errors: ["Could not parse JSON"]
        };
    }

    var schemaName = Object.keys(json)[0];
    var schema = SCHEMA_LIST.hasOwnProperty(schemaName) && SCHEMA_LIST[schemaName];

    if (!schema) {
        return {
            valid: false,
            errors: ["Could not match to valid schema"]
        };
    }

    var errors = js.validate(json, schema);
    return {
        valid: !errors.length,
        errors: errors
    };
}
