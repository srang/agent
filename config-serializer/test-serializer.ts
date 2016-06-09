import {Serializable} from './Serializable';
import {UhkBuffer} from './UhkBuffer';
import {UhkConfiguration} from './config-items/UhkConfiguration';

let assert = require('assert');
let fs = require('fs');

let uhkConfig = JSON.parse(fs.readFileSync('uhk-config.json'));
let uhkConfig2 = new UhkBuffer(fs.readFileSync('uhk-config.bin'));
let binConfigTs: Serializable<UhkConfiguration> = new UhkConfiguration().fromBinary(uhkConfig2);
let binConfigJs = binConfigTs.toJsObject();
fs.writeFileSync('uhk-config-deserialzed.json', JSON.stringify(binConfigJs, undefined, 4));

let config1Js = uhkConfig;
let config1Ts: Serializable<UhkConfiguration> = new UhkConfiguration().fromJsObject(config1Js);
let config1Buffer = new UhkBuffer();
config1Ts.toBinary(config1Buffer);
let config1BufferContent = config1Buffer.getBufferContent();
fs.writeFileSync('uhk-config.bin', config1BufferContent);

config1Buffer.offset = 0;
console.log();
let config2Ts = new UhkConfiguration().fromBinary(config1Buffer);
console.log('\n');
let config2Js = config2Ts.toJsObject();
let config2Buffer = new UhkBuffer();
config2Ts.toBinary(config2Buffer);
fs.writeFileSync('uhk-config-serialized.json', JSON.stringify(config2Js, undefined, 4));
let config2BufferContent = config1Buffer.getBufferContent();
fs.writeFileSync('uhk-config-serialized.bin', config2BufferContent);

console.log('\n');
try {
    assert.deepEqual(config1Js, config2Js);
    assert.deepEqual(config1Js, binConfigJs);
    console.log('JSON configurations are identical.');
} catch (error) {
    console.log('JSON configurations differ.');
}

let buffersContentsAreEqual = Buffer.compare(config1BufferContent, config2BufferContent) === 0;
console.log('Binary configurations ' + (buffersContentsAreEqual ? 'are identical' : 'differ') + '.');
