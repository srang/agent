/// <reference path="../typings/globals/jasmine/index.d.ts" />
/// <reference path="../typings/main/ambient/node/index.d.ts" />

import * as serial from '../config-serializer/serializer';

describe('Agent Serializer', function() {
  let jsConfig = '../config-serializer/uhk-config.json';
  let binConfig = '../config-serializer/uhk-config.bin';
  let jsTest = '../config-serializer/uhk-test.json';
  let binTest = '../config-serializer/uhk-test.bin';

  it('serializes JSON', () => {
    let config = serial.readJSON(jsConfig);
    serial.writeBIN(config, binTest);
    let result = serial.compareConfigs(binTest, jsConfig);
    expect(result).toBe(true);
  });

  it('deserializes BIN', function() {
    let config = serial.readBIN(binConfig);
    serial.writeJSON(config, jsTest);
    let result = serial.compareConfigs(binConfig, jsTest);
    expect(result).toBe(true);
  });
});
