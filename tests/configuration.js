/// <reference path="../typings/main/ambient/node/index.d.ts" />
"use strict";
var serial = require('../config-serializer/serializer');
describe('Agent Serializer', function () {
    var jsConfig = '../config-serializer/uhk-config.json';
    var binConfig = '../config-serializer/uhk-config.bin';
    var jsTest = '../config-serializer/uhk-test.json';
    var binTest = '../config-serializer/uhk-test.bin';
    it('serializes JSON', function () {
        var config = serial.readJSON(jsConfig);
        serial.writeBIN(config, binTest);
        var result = serial.compareConfigs(binTest, jsConfig);
        expect(result).toBe(true);
    });
    it('deserializes BIN', function () {
        serial.deserializeBin('./config-serializer/uhk-test.bin', './config-serializer/uhk-test.json');
        var config = serial.readBIN(binConfig);
        serial.writeJSON(config, jsTest);
        var result = serial.compareConfigs(binConfig, jsTest);
        expect(result).toBe(true);
    });
});
