/// <reference path="../typings/main/ambient/node/index.d.ts" />

import {Serializable} from './Serializable';
import {UhkBuffer} from './UhkBuffer';
import {UhkConfiguration} from './config-items/UhkConfiguration';

let assert = require('assert');
let fs = require('fs');

export function serializeJSON(config: string, output = 'uhk.bin') {
  let jsonConfig = readJSON(config);
  let configTs: Serializable<UhkConfiguration> = new UhkConfiguration().fromJsObject(jsonConfig);
  let configBuffer = new UhkBuffer();
  configTs.toBinary(configBuffer);
  fs.writeFileSync(output, configBuffer.getBufferContent());
}

export function deserializeBin(config: string, output = 'uhk.json') {
  let buffer: UhkBuffer = readBin(config);
  let configTs: Serializable<UhkConfiguration> = new UhkConfiguration().fromBinary(buffer);
  let configJs = configTs.toJsObject();
  fs.writeFileSync(output, JSON.stringify(configJs, undefined, 4));
}

export function compareConfigs(binConfig: string, jsonConfig: string) {
  let config1Js = readJSON(jsonConfig);
  let config1Ts: Serializable<UhkConfiguration> = new UhkConfiguration().fromJsObject(config1Js);
  let buf = new UhkBuffer();
  config1Ts.toBinary(buf);
  let config1Bc = buf.getBufferContent();

  buf = readBin(binConfig);
  let config2Ts: Serializable<UhkConfiguration> = new UhkConfiguration().fromBinary(buf);
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

function readJSON(filename: string) {
  return JSON.parse(fs.readFileSync(filename));
}

function readBin(filename: string) {
  return new UhkBuffer(fs.readFileSync(filename));
}
