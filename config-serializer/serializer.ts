/// <reference path="../typings/main/ambient/node/index.d.ts" />

import {Serializable} from './Serializable';
import {UhkBuffer} from './UhkBuffer';
import {UhkConfiguration} from './config-items/UhkConfiguration';

let assert = require('assert');
let fs = require('fs');

export function readJSON(config: string): Serializable<UhkConfiguration> {
  let jsonConfig = JSON.parse(fs.readFileSync(config));
  let configTs: Serializable<UhkConfiguration> = new UhkConfiguration().fromJsObject(jsonConfig);
  return configTs;
}

export function readBIN(config: string): Serializable<UhkConfiguration> {
  let buffer: UhkBuffer = new UhkBuffer(fs.readFileSync(config));
  let configTs: Serializable<UhkConfiguration> = new UhkConfiguration().fromBinary(buffer);
  return configTs;
}

export function writeJSON(configTs: Serializable<UhkConfiguration>, filename = 'uhk.json') {
  let configJs = configTs.toJsObject();
  fs.writeFileSync(filename, JSON.stringify(configJs, undefined, 4));
}

export function writeBIN(configTs: Serializable<UhkConfiguration>, filename = 'uhk.bin') {
  let configBuffer = new UhkBuffer();
  configTs.toBinary(configBuffer);
  fs.writeFileSync(filename, configBuffer.getBufferContent());
}

export function compareConfigs(binConfig: string, jsonConfig: string) {
  let config1Ts: Serializable<UhkConfiguration> = readJSON(jsonConfig);
  let config1Js = config1Ts.toJsObject();
  let buf = new UhkBuffer();
  config1Ts.toBinary(buf);
  let config1Bc = buf.getBufferContent();

  let config2Ts: Serializable<UhkConfiguration> = readBIN(binConfig);
  let config2Js = config2Ts.toJsObject();
  let config2Bc = buf.getBufferContent();
  try {
    assert.deepEqual(config1Js, config2Js);
    console.log('JSON configurations are identical.');
  } catch (error) {
    console.log('JSON configurations differ.');
  }

  let buffersContentsAreEqual = Buffer.compare(config1Bc, config2Bc) === 0;
  console.log('Binary configurations ' + (buffersContentsAreEqual ? 'are identical' : 'differ') + '.');
  return buffersContentsAreEqual;
}
