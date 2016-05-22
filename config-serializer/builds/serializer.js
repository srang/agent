/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../typings/main/ambient/node/index.d.ts" />
	"use strict";
	var UhkBuffer_1 = __webpack_require__(1);
	var UhkConfiguration_1 = __webpack_require__(2);
	var assert = __webpack_require__(42);
	var fs = __webpack_require__(43);
	function readJSON(config) {
	    var jsonConfig = JSON.parse(fs.readFileSync(config));
	    var configTs = new UhkConfiguration_1.UhkConfiguration().fromJsObject(jsonConfig);
	    return configTs;
	}
	exports.readJSON = readJSON;
	function readBIN(config) {
	    var buffer = new UhkBuffer_1.UhkBuffer(fs.readFileSync(config));
	    var configTs = new UhkConfiguration_1.UhkConfiguration().fromBinary(buffer);
	    return configTs;
	}
	exports.readBIN = readBIN;
	function writeJSON(configTs, filename) {
	    if (filename === void 0) { filename = 'uhk.json'; }
	    var configJs = configTs.toJsObject();
	    fs.writeFileSync(filename, JSON.stringify(configJs, undefined, 4));
	}
	exports.writeJSON = writeJSON;
	function writeBIN(configTs, filename) {
	    if (filename === void 0) { filename = 'uhk.bin'; }
	    var configBuffer = new UhkBuffer_1.UhkBuffer();
	    configTs.toBinary(configBuffer);
	    fs.writeFileSync(filename, configBuffer.getBufferContent());
	}
	exports.writeBIN = writeBIN;
	function compareConfigs(binConfig, jsonConfig) {
	    var config1Ts = readJSON(jsonConfig);
	    var config1Js = config1Ts.toJsObject();
	    var buf = new UhkBuffer_1.UhkBuffer();
	    config1Ts.toBinary(buf);
	    var config1Bc = buf.getBufferContent();
	    var config2Ts = readBIN(binConfig);
	    var config2Js = config2Ts.toJsObject();
	    var config2Bc = buf.getBufferContent();
	    try {
	        assert.deepEqual(config1Js, config2Js);
	        console.log('JSON configurations are identical.');
	    }
	    catch (error) {
	        console.log('JSON configurations differ.');
	    }
	    var buffersContentsAreEqual = Buffer.compare(config1Bc, config2Bc) === 0;
	    console.log('Binary configurations ' + (buffersContentsAreEqual ? 'are identical' : 'differ') + '.');
	    return buffersContentsAreEqual;
	}
	exports.compareConfigs = compareConfigs;


/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	var UhkBuffer = (function () {
	    function UhkBuffer(_buffer) {
	        this._enableDump = false;
	        this.offset = 0;
	        this.bytesToBacktrack = 0;
	        if (_buffer && _buffer.length > UhkBuffer.eepromSize) {
	            throw "UhkBuffer.constructor: " +
	                ("Buffer provided is larger than the eeprom size " + UhkBuffer.eepromSize);
	        }
	        this.buffer = _buffer || new Buffer(UhkBuffer.eepromSize).fill(0);
	    }
	    UhkBuffer.prototype.readInt8 = function () {
	        var value = this.buffer.readInt8(this.offset);
	        this.dump("i8(" + value + ")");
	        this.bytesToBacktrack = 1;
	        this.offset += this.bytesToBacktrack;
	        return value;
	    };
	    UhkBuffer.prototype.writeInt8 = function (value) {
	        this.dump("i8(" + value + ")");
	        this.buffer.writeInt8(value, this.offset);
	        this.offset += 1;
	    };
	    UhkBuffer.prototype.readUInt8 = function () {
	        var value = this.buffer.readUInt8(this.offset);
	        this.dump("u8(" + value + ")");
	        this.bytesToBacktrack = 1;
	        this.offset += this.bytesToBacktrack;
	        return value;
	    };
	    UhkBuffer.prototype.writeUInt8 = function (value) {
	        this.dump("u8(" + value + ")");
	        this.buffer.writeUInt8(value, this.offset);
	        this.offset += 1;
	    };
	    UhkBuffer.prototype.readInt16 = function () {
	        var value = this.buffer.readInt16LE(this.offset);
	        this.dump("i16(" + value + ")");
	        this.bytesToBacktrack = 2;
	        this.offset += this.bytesToBacktrack;
	        return value;
	    };
	    UhkBuffer.prototype.writeInt16 = function (value) {
	        this.dump("i16(" + value + ")");
	        this.buffer.writeInt16LE(value, this.offset);
	        this.offset += 2;
	    };
	    UhkBuffer.prototype.readUInt16 = function () {
	        var value = this.buffer.readUInt16LE(this.offset);
	        this.dump("u16(" + value + ")");
	        this.bytesToBacktrack = 2;
	        this.offset += this.bytesToBacktrack;
	        return value;
	    };
	    UhkBuffer.prototype.writeUInt16 = function (value) {
	        this.dump("u16(" + value + ")");
	        this.buffer.writeUInt16LE(value, this.offset);
	        this.offset += 2;
	    };
	    UhkBuffer.prototype.readInt32 = function () {
	        var value = this.buffer.readInt32LE(this.offset);
	        this.dump("i32(" + value + ")");
	        this.bytesToBacktrack = 4;
	        this.offset += this.bytesToBacktrack;
	        return value;
	    };
	    UhkBuffer.prototype.writeInt32 = function (value) {
	        this.dump("i32(" + value + ")");
	        this.buffer.writeInt32LE(value, this.offset);
	        this.offset += 4;
	    };
	    UhkBuffer.prototype.readUInt32 = function () {
	        var value = this.buffer.readUInt32LE(this.offset);
	        this.dump("u32(" + value + ")");
	        this.bytesToBacktrack = 4;
	        this.offset += this.bytesToBacktrack;
	        return value;
	    };
	    UhkBuffer.prototype.writeUInt32 = function (value) {
	        this.dump("u32(" + value + ")");
	        this.buffer.writeUInt32LE(value, this.offset);
	        this.offset += 4;
	    };
	    UhkBuffer.prototype.readCompactLength = function () {
	        var length = this.readUInt8();
	        if (length === UhkBuffer.longCompactLengthPrefix) {
	            length += this.readUInt8() << 8;
	        }
	        return length;
	    };
	    UhkBuffer.prototype.writeCompactLength = function (length) {
	        if (length >= UhkBuffer.longCompactLengthPrefix) {
	            this.writeUInt8(UhkBuffer.longCompactLengthPrefix);
	            this.writeUInt16(length);
	        }
	        else {
	            this.writeUInt8(length);
	        }
	    };
	    UhkBuffer.prototype.readString = function () {
	        var stringByteLength = this.readCompactLength();
	        var str = this.buffer.toString(UhkBuffer.stringEncoding, this.offset, this.offset + stringByteLength);
	        this.dump(UhkBuffer.stringEncoding + "(" + str + ")");
	        this.bytesToBacktrack = stringByteLength;
	        this.offset += stringByteLength;
	        return str;
	    };
	    UhkBuffer.prototype.writeString = function (str) {
	        var stringByteLength = Buffer.byteLength(str, UhkBuffer.stringEncoding);
	        if (stringByteLength > UhkBuffer.maxCompactLength) {
	            throw 'Cannot serialize string: ${stringByteLength} bytes is larger ' +
	                'than the maximum allowed length of ${UhkBuffer.maxStringByteLength} bytes';
	        }
	        this.writeCompactLength(stringByteLength);
	        this.dump(UhkBuffer.stringEncoding + "(" + str + ")");
	        this.buffer.write(str, this.offset, stringByteLength, UhkBuffer.stringEncoding);
	        this.offset += stringByteLength;
	    };
	    UhkBuffer.prototype.readBoolean = function () {
	        return this.readUInt8() !== 0;
	    };
	    UhkBuffer.prototype.writeBoolean = function (bool) {
	        this.writeUInt8(bool ? 1 : 0);
	    };
	    UhkBuffer.prototype.backtrack = function () {
	        this.offset -= this.bytesToBacktrack;
	        this.bytesToBacktrack = 0;
	    };
	    UhkBuffer.prototype.getBufferContent = function () {
	        return this.buffer.slice(0, this.offset);
	    };
	    Object.defineProperty(UhkBuffer.prototype, "enableDump", {
	        get: function () {
	            return this._enableDump;
	        },
	        set: function (value) {
	            if (value) {
	                UhkBuffer.isFirstElementToDump = true;
	            }
	            this._enableDump = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    UhkBuffer.prototype.dump = function (value) {
	        if (!this.enableDump) {
	            return;
	        }
	        if (!UhkBuffer.isFirstElementToDump) {
	            process.stdout.write(', ');
	        }
	        process.stdout.write(value);
	        if (UhkBuffer.isFirstElementToDump) {
	            UhkBuffer.isFirstElementToDump = false;
	        }
	    };
	    UhkBuffer.eepromSize = 32 * 1024;
	    UhkBuffer.maxCompactLength = 0xFFFF;
	    UhkBuffer.longCompactLengthPrefix = 0xFF;
	    UhkBuffer.stringEncoding = 'utf8';
	    UhkBuffer.isFirstElementToDump = false;
	    return UhkBuffer;
	}());
	exports.UhkBuffer = UhkBuffer;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var Serializable_1 = __webpack_require__(3);
	var ModuleConfigurations_1 = __webpack_require__(4);
	var KeyMaps_1 = __webpack_require__(8);
	var Macros_1 = __webpack_require__(25);
	var assert_1 = __webpack_require__(7);
	var UhkConfiguration = (function (_super) {
	    __extends(UhkConfiguration, _super);
	    function UhkConfiguration() {
	        _super.apply(this, arguments);
	    }
	    UhkConfiguration.prototype._fromJsObject = function (jsObject) {
	        this.signature = jsObject.signature;
	        this.dataModelVersion = jsObject.dataModelVersion;
	        this.prologue = jsObject.prologue;
	        this.hardwareId = jsObject.hardwareId;
	        this.brandId = jsObject.brandId;
	        this.moduleConfigurations = new ModuleConfigurations_1.ModuleConfigurations().fromJsObject(jsObject.moduleConfigurations);
	        this.keyMaps = new KeyMaps_1.KeyMaps().fromJsObject(jsObject.keyMaps);
	        this.macros = new Macros_1.Macros().fromJsObject(jsObject.macros);
	        this.epilogue = jsObject.epilogue;
	        return this;
	    };
	    UhkConfiguration.prototype._fromBinary = function (buffer) {
	        this.signature = buffer.readString();
	        this.dataModelVersion = buffer.readUInt8();
	        this.prologue = buffer.readUInt32();
	        this.hardwareId = buffer.readUInt8();
	        this.brandId = buffer.readUInt8();
	        this.moduleConfigurations = new ModuleConfigurations_1.ModuleConfigurations().fromBinary(buffer);
	        this.keyMaps = new KeyMaps_1.KeyMaps().fromBinary(buffer);
	        this.macros = new Macros_1.Macros().fromBinary(buffer);
	        this.epilogue = buffer.readUInt32();
	        return this;
	    };
	    UhkConfiguration.prototype._toJsObject = function () {
	        return {
	            signature: this.signature,
	            dataModelVersion: this.dataModelVersion,
	            prologue: this.prologue,
	            hardwareId: this.hardwareId,
	            brandId: this.brandId,
	            moduleConfigurations: this.moduleConfigurations.toJsObject(),
	            keyMaps: this.keyMaps.toJsObject(),
	            macros: this.macros.toJsObject(),
	            epilogue: this.epilogue
	        };
	    };
	    UhkConfiguration.prototype._toBinary = function (buffer) {
	        buffer.writeString(this.signature);
	        buffer.writeUInt8(this.dataModelVersion);
	        buffer.writeUInt32(this.prologue);
	        buffer.writeUInt8(this.hardwareId);
	        buffer.writeUInt8(this.brandId);
	        this.moduleConfigurations.toBinary(buffer);
	        this.keyMaps.toBinary(buffer);
	        this.macros.toBinary(buffer);
	        buffer.writeUInt32(this.epilogue);
	    };
	    UhkConfiguration.prototype.toString = function () {
	        return "<UhkConfiguration signature=\"" + this.signature + "\">";
	    };
	    UhkConfiguration.prototype.getKeymap = function (keymapId) {
	        var keyMaps = this.keyMaps.elements;
	        for (var i = 0; i < keyMaps.length; ++i) {
	            if (keymapId === keyMaps[i].id) {
	                return keyMaps[i];
	            }
	        }
	    };
	    __decorate([
	        assert_1.assertUInt8
	    ], UhkConfiguration.prototype, "dataModelVersion", void 0);
	    __decorate([
	        assert_1.assertUInt32
	    ], UhkConfiguration.prototype, "prologue", void 0);
	    __decorate([
	        assert_1.assertUInt8
	    ], UhkConfiguration.prototype, "hardwareId", void 0);
	    __decorate([
	        assert_1.assertUInt8
	    ], UhkConfiguration.prototype, "brandId", void 0);
	    __decorate([
	        assert_1.assertUInt32
	    ], UhkConfiguration.prototype, "epilogue", void 0);
	    return UhkConfiguration;
	}(Serializable_1.Serializable));
	exports.UhkConfiguration = UhkConfiguration;


/***/ },
/* 3 */
/***/ function(module, exports) {

	/// <references path="Function.d.ts">
	"use strict";
	var Serializable = (function () {
	    function Serializable() {
	    }
	    Serializable.prototype.fromJsObject = function (jsObject) {
	        this.dump(("" + this.getIndentation() + this.constructor.name + ".fromJsObject: ") +
	            (this.strintifyJsObject(jsObject) + "\n"));
	        Serializable.depth++;
	        var value = this._fromJsObject(jsObject);
	        Serializable.depth--;
	        this.dump(this.getIndentation() + "=> " + value + "\n");
	        return value;
	    };
	    Serializable.prototype.fromBinary = function (buffer) {
	        this.dump("\n" + this.getIndentation() + this.constructor.name + ".fromBinary: [");
	        Serializable.depth++;
	        buffer.enableDump = Serializable.enableDump;
	        var value = this._fromBinary(buffer);
	        buffer.enableDump = false;
	        Serializable.depth--;
	        this.dump("]\n" + this.getIndentation() + "=> " + value);
	        return value;
	    };
	    Serializable.prototype.toJsObject = function () {
	        this.dump("" + this.getIndentation() + this.constructor.name + ".toJsObject: " + this + "\n");
	        Serializable.depth++;
	        var value = this._toJsObject();
	        Serializable.depth--;
	        this.dump(this.getIndentation() + "=> " + this.strintifyJsObject(value) + "\n");
	        return value;
	    };
	    // TODO: remove parameter and return the buffer
	    Serializable.prototype.toBinary = function (buffer) {
	        this.dump("\n" + this.getIndentation() + this.constructor.name + ".toBinary: " + this + " [");
	        Serializable.depth++;
	        buffer.enableDump = Serializable.enableDump;
	        var value = this._toBinary(buffer);
	        buffer.enableDump = false;
	        Serializable.depth--;
	        this.dump("]");
	        return value;
	    };
	    Serializable.prototype.dump = function (value) {
	        if (Serializable.enableDump) {
	            process.stdout.write(value);
	        }
	    };
	    Serializable.prototype.getIndentation = function () {
	        return new Array(Serializable.depth + 1).join('    ');
	    };
	    Serializable.prototype.strintifyJsObject = function (jsObject) {
	        var json = JSON.stringify(jsObject);
	        return json.length > Serializable.maxDisplayedJsonLength
	            ? json.substr(0, Serializable.maxDisplayedJsonLength) + '...'
	            : json;
	    };
	    Serializable.depth = 0;
	    Serializable.maxDisplayedJsonLength = 160;
	    Serializable.enableDump = false;
	    return Serializable;
	}());
	exports.Serializable = Serializable;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var ClassArray_1 = __webpack_require__(5);
	var ModuleConfiguration_1 = __webpack_require__(6);
	var ModuleConfigurations = (function (_super) {
	    __extends(ModuleConfigurations, _super);
	    function ModuleConfigurations() {
	        _super.apply(this, arguments);
	    }
	    ModuleConfigurations.prototype.jsObjectToClass = function (jsObject) {
	        return new ModuleConfiguration_1.ModuleConfiguration().fromJsObject(jsObject);
	    };
	    ModuleConfigurations.prototype.binaryToClass = function (buffer) {
	        return new ModuleConfiguration_1.ModuleConfiguration().fromBinary(buffer);
	    };
	    return ModuleConfigurations;
	}(ClassArray_1.ClassArray));
	exports.ModuleConfigurations = ModuleConfigurations;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Serializable_1 = __webpack_require__(3);
	var ClassArray = (function (_super) {
	    __extends(ClassArray, _super);
	    function ClassArray() {
	        _super.apply(this, arguments);
	        this.elements = [];
	    }
	    ClassArray.prototype._fromJsObject = function (jsObjects) {
	        for (var _i = 0, jsObjects_1 = jsObjects; _i < jsObjects_1.length; _i++) {
	            var jsObject = jsObjects_1[_i];
	            this.elements.push(this.jsObjectToClass(jsObject));
	        }
	        return this;
	    };
	    ClassArray.prototype._fromBinary = function (buffer) {
	        var arrayLength = buffer.readCompactLength();
	        if (buffer.enableDump) {
	            buffer.enableDump = false;
	        }
	        for (var i = 0; i < arrayLength; i++) {
	            this.elements.push(this.binaryToClass(buffer));
	        }
	        return this;
	    };
	    ClassArray.prototype._toJsObject = function () {
	        var array = [];
	        for (var _i = 0, _a = this.elements; _i < _a.length; _i++) {
	            var element = _a[_i];
	            array.push(element.toJsObject());
	        }
	        return array;
	    };
	    ClassArray.prototype._toBinary = function (buffer) {
	        buffer.writeCompactLength(this.elements.length);
	        if (buffer.enableDump) {
	            buffer.enableDump = false;
	        }
	        for (var _i = 0, _a = this.elements; _i < _a.length; _i++) {
	            var element = _a[_i];
	            element.toBinary(buffer);
	        }
	    };
	    ClassArray.prototype.toString = function () {
	        return "<" + this.constructor.name + " length=\"" + this.elements.length + "\">";
	    };
	    return ClassArray;
	}(Serializable_1.Serializable));
	exports.ClassArray = ClassArray;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var Serializable_1 = __webpack_require__(3);
	var assert_1 = __webpack_require__(7);
	var ModuleConfiguration = (function (_super) {
	    __extends(ModuleConfiguration, _super);
	    function ModuleConfiguration() {
	        _super.apply(this, arguments);
	    }
	    ModuleConfiguration.prototype._fromJsObject = function (jsObject) {
	        this.id = jsObject.id;
	        this.initialPointerSpeed = jsObject.initialPointerSpeed;
	        this.pointerAcceleration = jsObject.pointerAcceleration;
	        this.maxPointerSpeed = jsObject.maxPointerSpeed;
	        return this;
	    };
	    ModuleConfiguration.prototype._fromBinary = function (buffer) {
	        this.id = buffer.readUInt8();
	        this.initialPointerSpeed = buffer.readUInt8();
	        this.pointerAcceleration = buffer.readUInt8();
	        this.maxPointerSpeed = buffer.readUInt8();
	        return this;
	    };
	    ModuleConfiguration.prototype._toJsObject = function () {
	        return {
	            id: this.id,
	            initialPointerSpeed: this.initialPointerSpeed,
	            pointerAcceleration: this.pointerAcceleration,
	            maxPointerSpeed: this.maxPointerSpeed
	        };
	    };
	    ModuleConfiguration.prototype._toBinary = function (buffer) {
	        buffer.writeUInt8(this.id);
	        buffer.writeUInt8(this.initialPointerSpeed);
	        buffer.writeUInt8(this.pointerAcceleration);
	        buffer.writeUInt8(this.maxPointerSpeed);
	    };
	    ModuleConfiguration.prototype.toString = function () {
	        return "<ModuleConfiguration id=\"" + this.id + "\" >";
	    };
	    __decorate([
	        assert_1.assertUInt8
	    ], ModuleConfiguration.prototype, "id", void 0);
	    __decorate([
	        assert_1.assertUInt8
	    ], ModuleConfiguration.prototype, "initialPointerSpeed", void 0);
	    __decorate([
	        assert_1.assertUInt8
	    ], ModuleConfiguration.prototype, "pointerAcceleration", void 0);
	    __decorate([
	        assert_1.assertUInt8
	    ], ModuleConfiguration.prototype, "maxPointerSpeed", void 0);
	    return ModuleConfiguration;
	}(Serializable_1.Serializable));
	exports.ModuleConfiguration = ModuleConfiguration;


/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";
	function assertUInt8(target, key) {
	    return assertInteger(target, key, 0, 0xFF);
	}
	exports.assertUInt8 = assertUInt8;
	function assertInt8(target, key) {
	    return assertInteger(target, key, -0x80, 0x7F);
	}
	exports.assertInt8 = assertInt8;
	function assertUInt16(target, key) {
	    return assertInteger(target, key, 0, 0xFFFF);
	}
	exports.assertUInt16 = assertUInt16;
	function assertInt16(target, key) {
	    return assertInteger(target, key, -0x8000, 0x7FFF);
	}
	exports.assertInt16 = assertInt16;
	function assertUInt32(target, key) {
	    return assertInteger(target, key, 0, 0xFFFFFFFF);
	}
	exports.assertUInt32 = assertUInt32;
	function assertInt32(target, key) {
	    return assertInteger(target, key, -0x80000000, 0x7FFFFFFF);
	}
	exports.assertInt32 = assertInt32;
	function assertCompactLength(target, key) {
	    return assertUInt16(target, key);
	}
	exports.assertCompactLength = assertCompactLength;
	function assertInteger(target, key, min, max) {
	    var priv = '_' + key;
	    function getter() {
	        return this[priv];
	    }
	    function setter(newVal) {
	        if (this[priv] !== newVal) {
	            if (newVal < min || newVal > max) {
	                throw (target.constructor.name + "." + key + ": ") +
	                    ("Integer " + newVal + " is outside the valid [" + min + ", " + max + "] interval");
	            }
	            this[priv] = newVal;
	        }
	    }
	    Object.defineProperty(target, key, {
	        get: getter,
	        set: setter,
	        enumerable: true,
	        configurable: true
	    });
	}
	function assertEnum(enumerated) {
	    return function (target, key) {
	        var priv = '_' + key;
	        function getter() {
	            return this[priv];
	        }
	        function setter(newVal) {
	            if (this[priv] !== newVal) {
	                if (enumerated[newVal] === undefined) {
	                    throw target.constructor.name + "." + key + ": " + newVal + " is not enum";
	                }
	                this[priv] = newVal;
	            }
	        }
	        Object.defineProperty(target, key, {
	            get: getter,
	            set: setter,
	            enumerable: true,
	            configurable: true
	        });
	    };
	}
	exports.assertEnum = assertEnum;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var ClassArray_1 = __webpack_require__(5);
	var KeyMap_1 = __webpack_require__(9);
	var KeyMaps = (function (_super) {
	    __extends(KeyMaps, _super);
	    function KeyMaps() {
	        _super.apply(this, arguments);
	    }
	    KeyMaps.prototype.jsObjectToClass = function (jsObject) {
	        return new KeyMap_1.KeyMap().fromJsObject(jsObject);
	    };
	    KeyMaps.prototype.binaryToClass = function (buffer) {
	        return new KeyMap_1.KeyMap().fromBinary(buffer);
	    };
	    return KeyMaps;
	}(ClassArray_1.ClassArray));
	exports.KeyMaps = KeyMaps;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var Serializable_1 = __webpack_require__(3);
	var Layers_1 = __webpack_require__(10);
	var assert_1 = __webpack_require__(7);
	var KeyMap = (function (_super) {
	    __extends(KeyMap, _super);
	    function KeyMap() {
	        _super.apply(this, arguments);
	    }
	    KeyMap.prototype._fromJsObject = function (jsObject) {
	        this.id = jsObject.id;
	        this.isDefault = jsObject.isDefault;
	        this.abbreviation = jsObject.abbreviation;
	        this.name = jsObject.name;
	        this.layers = new Layers_1.Layers().fromJsObject(jsObject.layers);
	        return this;
	    };
	    KeyMap.prototype._fromBinary = function (buffer) {
	        this.id = buffer.readUInt8();
	        this.isDefault = buffer.readBoolean();
	        this.abbreviation = buffer.readString();
	        this.name = buffer.readString();
	        this.layers = new Layers_1.Layers().fromBinary(buffer);
	        return this;
	    };
	    KeyMap.prototype._toJsObject = function () {
	        return {
	            id: this.id,
	            isDefault: this.isDefault,
	            abbreviation: this.abbreviation,
	            name: this.name,
	            layers: this.layers.toJsObject()
	        };
	    };
	    KeyMap.prototype._toBinary = function (buffer) {
	        buffer.writeUInt8(this.id);
	        buffer.writeBoolean(this.isDefault);
	        buffer.writeString(this.abbreviation);
	        buffer.writeString(this.name);
	        this.layers.toBinary(buffer);
	    };
	    KeyMap.prototype.toString = function () {
	        return "<KeyMap id=\"" + this.id + "\" name=\"" + this.name + "\">";
	    };
	    __decorate([
	        assert_1.assertUInt8
	    ], KeyMap.prototype, "id", void 0);
	    return KeyMap;
	}(Serializable_1.Serializable));
	exports.KeyMap = KeyMap;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var ClassArray_1 = __webpack_require__(5);
	var Layer_1 = __webpack_require__(11);
	var Layers = (function (_super) {
	    __extends(Layers, _super);
	    function Layers() {
	        _super.apply(this, arguments);
	    }
	    Layers.prototype.jsObjectToClass = function (jsObject) {
	        return new Layer_1.Layer().fromJsObject(jsObject);
	    };
	    Layers.prototype.binaryToClass = function (buffer) {
	        return new Layer_1.Layer().fromBinary(buffer);
	    };
	    return Layers;
	}(ClassArray_1.ClassArray));
	exports.Layers = Layers;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Serializable_1 = __webpack_require__(3);
	var Modules_1 = __webpack_require__(12);
	var Layer = (function (_super) {
	    __extends(Layer, _super);
	    function Layer() {
	        _super.apply(this, arguments);
	    }
	    Layer.prototype._fromJsObject = function (jsObject) {
	        this.modules = new Modules_1.Modules().fromJsObject(jsObject.modules);
	        return this;
	    };
	    Layer.prototype._fromBinary = function (buffer) {
	        this.modules = new Modules_1.Modules().fromBinary(buffer);
	        return this;
	    };
	    Layer.prototype._toJsObject = function () {
	        return {
	            modules: this.modules.toJsObject()
	        };
	    };
	    Layer.prototype._toBinary = function (buffer) {
	        this.modules.toBinary(buffer);
	    };
	    Layer.prototype.toString = function () {
	        return "<Layer>";
	    };
	    return Layer;
	}(Serializable_1.Serializable));
	exports.Layer = Layer;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var ClassArray_1 = __webpack_require__(5);
	var Module_1 = __webpack_require__(13);
	var Modules = (function (_super) {
	    __extends(Modules, _super);
	    function Modules() {
	        _super.apply(this, arguments);
	    }
	    Modules.prototype.jsObjectToClass = function (jsObject) {
	        return new Module_1.Module().fromJsObject(jsObject);
	    };
	    Modules.prototype.binaryToClass = function (buffer) {
	        return new Module_1.Module().fromBinary(buffer);
	    };
	    return Modules;
	}(ClassArray_1.ClassArray));
	exports.Modules = Modules;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var Serializable_1 = __webpack_require__(3);
	var KeyActions_1 = __webpack_require__(14);
	var assert_1 = __webpack_require__(7);
	var PointerRole;
	(function (PointerRole) {
	    PointerRole[PointerRole["none"] = 0] = "none";
	    PointerRole[PointerRole["move"] = 1] = "move";
	    PointerRole[PointerRole["scroll"] = 2] = "scroll";
	})(PointerRole || (PointerRole = {}));
	var Module = (function (_super) {
	    __extends(Module, _super);
	    function Module() {
	        _super.apply(this, arguments);
	    }
	    Module.prototype._fromJsObject = function (jsObject) {
	        this.id = jsObject.id;
	        this.pointerRole = PointerRole[jsObject.pointerRole];
	        this.keyActions = new KeyActions_1.KeyActions().fromJsObject(jsObject.keyActions);
	        return this;
	    };
	    Module.prototype._fromBinary = function (buffer) {
	        this.id = buffer.readUInt8();
	        this.pointerRole = buffer.readUInt8();
	        this.keyActions = new KeyActions_1.KeyActions().fromBinary(buffer);
	        return this;
	    };
	    Module.prototype._toJsObject = function () {
	        return {
	            id: this.id,
	            pointerRole: PointerRole[this.pointerRole],
	            keyActions: this.keyActions.toJsObject()
	        };
	    };
	    Module.prototype._toBinary = function (buffer) {
	        buffer.writeUInt8(this.id);
	        buffer.writeUInt8(this.pointerRole);
	        this.keyActions.toBinary(buffer);
	    };
	    Module.prototype.toString = function () {
	        return "<Module id=\"" + this.id + "\" pointerRole=\"" + this.pointerRole + "\">";
	    };
	    __decorate([
	        assert_1.assertUInt8
	    ], Module.prototype, "id", void 0);
	    __decorate([
	        assert_1.assertEnum(PointerRole)
	    ], Module.prototype, "pointerRole", void 0);
	    return Module;
	}(Serializable_1.Serializable));
	exports.Module = Module;


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var ClassArray_1 = __webpack_require__(5);
	var DualRoleKeystrokeAction_1 = __webpack_require__(15);
	var NoneAction_1 = __webpack_require__(17);
	var KeystrokeAction_1 = __webpack_require__(18);
	var KeyAction_1 = __webpack_require__(16);
	var KeystrokeModifiersAction_1 = __webpack_require__(19);
	var KeystrokeWithModifiersAction_1 = __webpack_require__(20);
	var SwitchLayerAction_1 = __webpack_require__(21);
	var SwitchKeymapAction_1 = __webpack_require__(22);
	var MouseAction_1 = __webpack_require__(23);
	var PlayMacroAction_1 = __webpack_require__(24);
	var KeyActions = (function (_super) {
	    __extends(KeyActions, _super);
	    function KeyActions() {
	        _super.apply(this, arguments);
	    }
	    KeyActions.prototype.jsObjectToClass = function (jsObject) {
	        switch (jsObject.keyActionType) {
	            case KeyAction_1.keyActionType.NoneAction:
	                return new NoneAction_1.NoneAction().fromJsObject(jsObject);
	            case KeyAction_1.keyActionType.KeystrokeAction:
	                return new KeystrokeAction_1.KeystrokeAction().fromJsObject(jsObject);
	            case KeyAction_1.keyActionType.KeystrokeModifiersAction:
	                return new KeystrokeModifiersAction_1.KeystrokeModifiersAction().fromJsObject(jsObject);
	            case KeyAction_1.keyActionType.KeystrokeWithModifiersAction:
	                return new KeystrokeWithModifiersAction_1.KeystrokeWithModifiersAction().fromJsObject(jsObject);
	            case KeyAction_1.keyActionType.DualRoleKeystrokeAction:
	                return new DualRoleKeystrokeAction_1.DualRoleKeystrokeAction().fromJsObject(jsObject);
	            case KeyAction_1.keyActionType.SwitchLayerAction:
	                return new SwitchLayerAction_1.SwitchLayerAction().fromJsObject(jsObject);
	            case KeyAction_1.keyActionType.SwitchKeymapAction:
	                return new SwitchKeymapAction_1.SwitchKeymapAction().fromJsObject(jsObject);
	            case KeyAction_1.keyActionType.MouseAction:
	                return new MouseAction_1.MouseAction().fromJsObject(jsObject);
	            case KeyAction_1.keyActionType.PlayMacroAction:
	                return new PlayMacroAction_1.PlayMacroAction().fromJsObject(jsObject);
	            default:
	                throw "Invalid KeyAction.keyActionType: \"" + jsObject.keyActionType + "\"";
	        }
	    };
	    KeyActions.prototype.binaryToClass = function (buffer) {
	        var keyActionFirstByte = buffer.readUInt8();
	        buffer.backtrack();
	        if (buffer.enableDump) {
	            process.stdout.write(']\n');
	            buffer.enableDump = false;
	        }
	        switch (keyActionFirstByte) {
	            case KeyAction_1.KeyActionId.NoneAction:
	                return new NoneAction_1.NoneAction().fromBinary(buffer);
	            case KeyAction_1.KeyActionId.KeystrokeAction:
	                return new KeystrokeAction_1.KeystrokeAction().fromBinary(buffer);
	            case KeyAction_1.KeyActionId.KeystrokeModifiersAction:
	                return new KeystrokeModifiersAction_1.KeystrokeModifiersAction().fromBinary(buffer);
	            case KeyAction_1.KeyActionId.KeystrokeWithModifiersAction:
	                return new KeystrokeWithModifiersAction_1.KeystrokeWithModifiersAction().fromBinary(buffer);
	            case KeyAction_1.KeyActionId.DualRoleKeystrokeAction:
	                return new DualRoleKeystrokeAction_1.DualRoleKeystrokeAction().fromBinary(buffer);
	            case KeyAction_1.KeyActionId.SwitchLayerAction:
	                return new SwitchLayerAction_1.SwitchLayerAction().fromBinary(buffer);
	            case KeyAction_1.KeyActionId.SwitchKeymapAction:
	                return new SwitchKeymapAction_1.SwitchKeymapAction().fromBinary(buffer);
	            case KeyAction_1.KeyActionId.MouseAction:
	                return new MouseAction_1.MouseAction().fromBinary(buffer);
	            case KeyAction_1.KeyActionId.PlayMacroAction:
	                return new PlayMacroAction_1.PlayMacroAction().fromBinary(buffer);
	            default:
	                throw "Invalid KeyAction first byte: " + keyActionFirstByte;
	        }
	    };
	    return KeyActions;
	}(ClassArray_1.ClassArray));
	exports.KeyActions = KeyActions;


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var KeyAction_1 = __webpack_require__(16);
	var assert_1 = __webpack_require__(7);
	var LongPressAction;
	(function (LongPressAction) {
	    LongPressAction[LongPressAction["leftCtrl"] = 0] = "leftCtrl";
	    LongPressAction[LongPressAction["leftShift"] = 1] = "leftShift";
	    LongPressAction[LongPressAction["leftAlt"] = 2] = "leftAlt";
	    LongPressAction[LongPressAction["leftSuper"] = 3] = "leftSuper";
	    LongPressAction[LongPressAction["rightCtrl"] = 4] = "rightCtrl";
	    LongPressAction[LongPressAction["rightShift"] = 5] = "rightShift";
	    LongPressAction[LongPressAction["rightAlt"] = 6] = "rightAlt";
	    LongPressAction[LongPressAction["rightSuper"] = 7] = "rightSuper";
	    LongPressAction[LongPressAction["mod"] = 8] = "mod";
	    LongPressAction[LongPressAction["fn"] = 9] = "fn";
	    LongPressAction[LongPressAction["mouse"] = 10] = "mouse";
	})(LongPressAction || (LongPressAction = {}));
	var DualRoleKeystrokeAction = (function (_super) {
	    __extends(DualRoleKeystrokeAction, _super);
	    function DualRoleKeystrokeAction() {
	        _super.apply(this, arguments);
	    }
	    DualRoleKeystrokeAction.prototype._fromJsObject = function (jsObject) {
	        this.assertKeyActionType(jsObject);
	        this.scancode = jsObject.scancode;
	        this.longPressAction = LongPressAction[jsObject.longPressAction];
	        return this;
	    };
	    DualRoleKeystrokeAction.prototype._fromBinary = function (buffer) {
	        this.readAndAssertKeyActionId(buffer);
	        this.scancode = buffer.readUInt8();
	        this.longPressAction = buffer.readUInt8();
	        return this;
	    };
	    DualRoleKeystrokeAction.prototype._toJsObject = function () {
	        return {
	            keyActionType: KeyAction_1.keyActionType.DualRoleKeystrokeAction,
	            scancode: this.scancode,
	            longPressAction: LongPressAction[this.longPressAction]
	        };
	    };
	    DualRoleKeystrokeAction.prototype._toBinary = function (buffer) {
	        buffer.writeUInt8(KeyAction_1.KeyActionId.DualRoleKeystrokeAction);
	        buffer.writeUInt8(this.scancode);
	        buffer.writeUInt8(this.longPressAction);
	    };
	    DualRoleKeystrokeAction.prototype.toString = function () {
	        return "<DualRoleKeystrokeAction scancode=\"" + this.scancode + "\" longPressAction=\"" + this.longPressAction + "\">";
	    };
	    __decorate([
	        assert_1.assertUInt8
	    ], DualRoleKeystrokeAction.prototype, "scancode", void 0);
	    __decorate([
	        assert_1.assertEnum(LongPressAction)
	    ], DualRoleKeystrokeAction.prototype, "longPressAction", void 0);
	    return DualRoleKeystrokeAction;
	}(KeyAction_1.KeyAction));
	exports.DualRoleKeystrokeAction = DualRoleKeystrokeAction;


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../Function.d.ts" />
	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Serializable_1 = __webpack_require__(3);
	(function (KeyActionId) {
	    KeyActionId[KeyActionId["NoneAction"] = 0] = "NoneAction";
	    KeyActionId[KeyActionId["KeystrokeAction"] = 1] = "KeystrokeAction";
	    KeyActionId[KeyActionId["KeystrokeModifiersAction"] = 2] = "KeystrokeModifiersAction";
	    KeyActionId[KeyActionId["KeystrokeWithModifiersAction"] = 3] = "KeystrokeWithModifiersAction";
	    KeyActionId[KeyActionId["DualRoleKeystrokeAction"] = 4] = "DualRoleKeystrokeAction";
	    KeyActionId[KeyActionId["SwitchLayerAction"] = 5] = "SwitchLayerAction";
	    KeyActionId[KeyActionId["SwitchKeymapAction"] = 6] = "SwitchKeymapAction";
	    KeyActionId[KeyActionId["MouseAction"] = 7] = "MouseAction";
	    KeyActionId[KeyActionId["PlayMacroAction"] = 8] = "PlayMacroAction";
	})(exports.KeyActionId || (exports.KeyActionId = {}));
	var KeyActionId = exports.KeyActionId;
	exports.keyActionType = {
	    NoneAction: 'none',
	    KeystrokeAction: 'keystroke',
	    KeystrokeModifiersAction: 'keystrokeModifiers',
	    KeystrokeWithModifiersAction: 'keystrokeWithModifiers',
	    DualRoleKeystrokeAction: 'dualRoleKeystroke',
	    SwitchLayerAction: 'switchLayer',
	    SwitchKeymapAction: 'switchKeymap',
	    MouseAction: 'mouse',
	    PlayMacroAction: 'playMacro'
	};
	var KeyAction = (function (_super) {
	    __extends(KeyAction, _super);
	    function KeyAction() {
	        _super.apply(this, arguments);
	    }
	    KeyAction.prototype.assertKeyActionType = function (jsObject) {
	        var keyActionClassname = this.constructor.name;
	        var keyActionTypeString = exports.keyActionType[keyActionClassname];
	        if (jsObject.keyActionType !== keyActionTypeString) {
	            throw "Invalid " + keyActionClassname + ".keyActionType: " + jsObject.keyActionType;
	        }
	    };
	    KeyAction.prototype.readAndAssertKeyActionId = function (buffer) {
	        var classname = this.constructor.name;
	        var readKeyActionId = buffer.readUInt8();
	        var keyActionId = KeyActionId[classname];
	        if (readKeyActionId !== keyActionId) {
	            throw "Invalid " + classname + " first byte: " + readKeyActionId;
	        }
	    };
	    return KeyAction;
	}(Serializable_1.Serializable));
	exports.KeyAction = KeyAction;


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var KeyAction_1 = __webpack_require__(16);
	var NoneAction = (function (_super) {
	    __extends(NoneAction, _super);
	    function NoneAction() {
	        _super.apply(this, arguments);
	    }
	    NoneAction.prototype._fromJsObject = function (jsObject) {
	        this.assertKeyActionType(jsObject);
	        return this;
	    };
	    NoneAction.prototype._fromBinary = function (buffer) {
	        this.readAndAssertKeyActionId(buffer);
	        return this;
	    };
	    NoneAction.prototype._toJsObject = function () {
	        return {
	            keyActionType: KeyAction_1.keyActionType.NoneAction
	        };
	    };
	    NoneAction.prototype._toBinary = function (buffer) {
	        buffer.writeUInt8(KeyAction_1.KeyActionId.NoneAction);
	    };
	    NoneAction.prototype.toString = function () {
	        return '<NoneAction>';
	    };
	    return NoneAction;
	}(KeyAction_1.KeyAction));
	exports.NoneAction = NoneAction;


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var KeyAction_1 = __webpack_require__(16);
	var assert_1 = __webpack_require__(7);
	var KeystrokeAction = (function (_super) {
	    __extends(KeystrokeAction, _super);
	    function KeystrokeAction() {
	        _super.apply(this, arguments);
	    }
	    KeystrokeAction.prototype._fromJsObject = function (jsObject) {
	        this.assertKeyActionType(jsObject);
	        this.scancode = jsObject.scancode;
	        return this;
	    };
	    KeystrokeAction.prototype._fromBinary = function (buffer) {
	        this.readAndAssertKeyActionId(buffer);
	        this.scancode = buffer.readUInt8();
	        return this;
	    };
	    KeystrokeAction.prototype._toJsObject = function () {
	        return {
	            keyActionType: KeyAction_1.keyActionType.KeystrokeAction,
	            scancode: this.scancode
	        };
	    };
	    KeystrokeAction.prototype._toBinary = function (buffer) {
	        buffer.writeUInt8(KeyAction_1.KeyActionId.KeystrokeAction);
	        buffer.writeUInt8(this.scancode);
	    };
	    KeystrokeAction.prototype.toString = function () {
	        return "<KeystrokeAction scancode=\"" + this.scancode + "\">";
	    };
	    __decorate([
	        assert_1.assertUInt8
	    ], KeystrokeAction.prototype, "scancode", void 0);
	    return KeystrokeAction;
	}(KeyAction_1.KeyAction));
	exports.KeystrokeAction = KeystrokeAction;


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var KeyAction_1 = __webpack_require__(16);
	var assert_1 = __webpack_require__(7);
	(function (KeyModifiers) {
	    KeyModifiers[KeyModifiers["leftCtrl"] = 1] = "leftCtrl";
	    KeyModifiers[KeyModifiers["leftShift"] = 2] = "leftShift";
	    KeyModifiers[KeyModifiers["leftAlt"] = 4] = "leftAlt";
	    KeyModifiers[KeyModifiers["leftGui"] = 8] = "leftGui";
	    KeyModifiers[KeyModifiers["rightCtrl"] = 16] = "rightCtrl";
	    KeyModifiers[KeyModifiers["rightShift"] = 32] = "rightShift";
	    KeyModifiers[KeyModifiers["rightAlt"] = 64] = "rightAlt";
	    KeyModifiers[KeyModifiers["rightGui"] = 128] = "rightGui";
	})(exports.KeyModifiers || (exports.KeyModifiers = {}));
	var KeyModifiers = exports.KeyModifiers;
	var KeystrokeModifiersAction = (function (_super) {
	    __extends(KeystrokeModifiersAction, _super);
	    function KeystrokeModifiersAction() {
	        _super.apply(this, arguments);
	    }
	    KeystrokeModifiersAction.prototype._fromJsObject = function (jsObject) {
	        this.assertKeyActionType(jsObject);
	        this.modifierMask = jsObject.modifierMask;
	        return this;
	    };
	    KeystrokeModifiersAction.prototype._fromBinary = function (buffer) {
	        this.readAndAssertKeyActionId(buffer);
	        this.modifierMask = buffer.readUInt8();
	        return this;
	    };
	    KeystrokeModifiersAction.prototype._toJsObject = function () {
	        return {
	            keyActionType: KeyAction_1.keyActionType.KeystrokeModifiersAction,
	            modifierMask: this.modifierMask
	        };
	    };
	    KeystrokeModifiersAction.prototype._toBinary = function (buffer) {
	        buffer.writeUInt8(KeyAction_1.KeyActionId.KeystrokeModifiersAction);
	        buffer.writeUInt8(this.modifierMask);
	    };
	    KeystrokeModifiersAction.prototype.toString = function () {
	        return "<KeystrokeModifiersAction modifierMask=\"" + this.modifierMask + "\">";
	    };
	    KeystrokeModifiersAction.prototype.isModifierActive = function (modifier) {
	        return (this.modifierMask & modifier) > 0;
	    };
	    KeystrokeModifiersAction.prototype.isOnlyOneModifierActive = function () {
	        return this.modifierMask !== 0 && !(this.modifierMask & this.modifierMask - 1);
	    };
	    __decorate([
	        assert_1.assertUInt8
	    ], KeystrokeModifiersAction.prototype, "modifierMask", void 0);
	    return KeystrokeModifiersAction;
	}(KeyAction_1.KeyAction));
	exports.KeystrokeModifiersAction = KeystrokeModifiersAction;


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var KeyAction_1 = __webpack_require__(16);
	var assert_1 = __webpack_require__(7);
	var KeystrokeWithModifiersAction = (function (_super) {
	    __extends(KeystrokeWithModifiersAction, _super);
	    function KeystrokeWithModifiersAction() {
	        _super.apply(this, arguments);
	    }
	    KeystrokeWithModifiersAction.prototype._fromJsObject = function (jsObject) {
	        this.assertKeyActionType(jsObject);
	        this.scancode = jsObject.scancode;
	        this.modifierMask = jsObject.modifierMask;
	        return this;
	    };
	    KeystrokeWithModifiersAction.prototype._fromBinary = function (buffer) {
	        this.readAndAssertKeyActionId(buffer);
	        this.scancode = buffer.readUInt8();
	        this.modifierMask = buffer.readUInt8();
	        return this;
	    };
	    KeystrokeWithModifiersAction.prototype._toJsObject = function () {
	        return {
	            keyActionType: KeyAction_1.keyActionType.KeystrokeWithModifiersAction,
	            scancode: this.scancode,
	            modifierMask: this.modifierMask
	        };
	    };
	    KeystrokeWithModifiersAction.prototype._toBinary = function (buffer) {
	        buffer.writeUInt8(KeyAction_1.KeyActionId.KeystrokeWithModifiersAction);
	        buffer.writeUInt8(this.scancode);
	        buffer.writeUInt8(this.modifierMask);
	    };
	    KeystrokeWithModifiersAction.prototype.toString = function () {
	        return "<KeystrokeWithModifiersAction scancode=\"" + this.scancode + "\" modifierMask=\"" + this.modifierMask + "\">";
	    };
	    KeystrokeWithModifiersAction.prototype.isModifierActive = function (modifier) {
	        return (this.modifierMask & modifier) > 0;
	    };
	    __decorate([
	        assert_1.assertUInt8
	    ], KeystrokeWithModifiersAction.prototype, "modifierMask", void 0);
	    __decorate([
	        assert_1.assertUInt8
	    ], KeystrokeWithModifiersAction.prototype, "scancode", void 0);
	    return KeystrokeWithModifiersAction;
	}(KeyAction_1.KeyAction));
	exports.KeystrokeWithModifiersAction = KeystrokeWithModifiersAction;


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var KeyAction_1 = __webpack_require__(16);
	var assert_1 = __webpack_require__(7);
	(function (LayerName) {
	    LayerName[LayerName["mod"] = 0] = "mod";
	    LayerName[LayerName["fn"] = 1] = "fn";
	    LayerName[LayerName["mouse"] = 2] = "mouse";
	})(exports.LayerName || (exports.LayerName = {}));
	var LayerName = exports.LayerName;
	var SwitchLayerAction = (function (_super) {
	    __extends(SwitchLayerAction, _super);
	    function SwitchLayerAction() {
	        _super.apply(this, arguments);
	    }
	    SwitchLayerAction.prototype._fromJsObject = function (jsObject) {
	        this.assertKeyActionType(jsObject);
	        this._layer = LayerName[jsObject.layer];
	        this.isLayerToggleable = jsObject.toggle;
	        return this;
	    };
	    SwitchLayerAction.prototype._fromBinary = function (buffer) {
	        this.readAndAssertKeyActionId(buffer);
	        this._layer = buffer.readUInt8();
	        this.isLayerToggleable = buffer.readBoolean();
	        return this;
	    };
	    SwitchLayerAction.prototype._toJsObject = function () {
	        return {
	            keyActionType: KeyAction_1.keyActionType.SwitchLayerAction,
	            layer: LayerName[this.layer],
	            toggle: this.isLayerToggleable
	        };
	    };
	    SwitchLayerAction.prototype._toBinary = function (buffer) {
	        buffer.writeUInt8(KeyAction_1.KeyActionId.SwitchLayerAction);
	        buffer.writeUInt8(this.layer);
	        buffer.writeBoolean(this.isLayerToggleable);
	    };
	    SwitchLayerAction.prototype.toString = function () {
	        return "<SwitchLayerAction layer=\"" + this.layer + "\" toggle=\"" + this.isLayerToggleable + "\">";
	    };
	    Object.defineProperty(SwitchLayerAction.prototype, "layer", {
	        get: function () {
	            return this._layer;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    __decorate([
	        assert_1.assertEnum(LayerName)
	    ], SwitchLayerAction.prototype, "_layer", void 0);
	    return SwitchLayerAction;
	}(KeyAction_1.KeyAction));
	exports.SwitchLayerAction = SwitchLayerAction;


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var KeyAction_1 = __webpack_require__(16);
	var assert_1 = __webpack_require__(7);
	var SwitchKeymapAction = (function (_super) {
	    __extends(SwitchKeymapAction, _super);
	    function SwitchKeymapAction() {
	        _super.apply(this, arguments);
	    }
	    SwitchKeymapAction.prototype._fromJsObject = function (jsObject) {
	        this.assertKeyActionType(jsObject);
	        this.keymapId = jsObject.keymapId;
	        return this;
	    };
	    SwitchKeymapAction.prototype._fromBinary = function (buffer) {
	        this.readAndAssertKeyActionId(buffer);
	        this.keymapId = buffer.readUInt8();
	        return this;
	    };
	    SwitchKeymapAction.prototype._toJsObject = function () {
	        return {
	            keyActionType: KeyAction_1.keyActionType.SwitchKeymapAction,
	            keymapId: this.keymapId
	        };
	    };
	    SwitchKeymapAction.prototype._toBinary = function (buffer) {
	        buffer.writeUInt8(KeyAction_1.KeyActionId.SwitchKeymapAction);
	        buffer.writeUInt8(this.keymapId);
	    };
	    SwitchKeymapAction.prototype.toString = function () {
	        return "<SwitchKeymapAction keymapId=\"" + this.keymapId + "\">";
	    };
	    __decorate([
	        assert_1.assertUInt8
	    ], SwitchKeymapAction.prototype, "keymapId", void 0);
	    return SwitchKeymapAction;
	}(KeyAction_1.KeyAction));
	exports.SwitchKeymapAction = SwitchKeymapAction;


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var KeyAction_1 = __webpack_require__(16);
	var assert_1 = __webpack_require__(7);
	var MouseActionParam;
	(function (MouseActionParam) {
	    MouseActionParam[MouseActionParam["leftClick"] = 0] = "leftClick";
	    MouseActionParam[MouseActionParam["middleClick"] = 1] = "middleClick";
	    MouseActionParam[MouseActionParam["rightClick"] = 2] = "rightClick";
	    MouseActionParam[MouseActionParam["moveUp"] = 3] = "moveUp";
	    MouseActionParam[MouseActionParam["moveDown"] = 4] = "moveDown";
	    MouseActionParam[MouseActionParam["moveLeft"] = 5] = "moveLeft";
	    MouseActionParam[MouseActionParam["moveRight"] = 6] = "moveRight";
	    MouseActionParam[MouseActionParam["scrollUp"] = 7] = "scrollUp";
	    MouseActionParam[MouseActionParam["scrollDown"] = 8] = "scrollDown";
	    MouseActionParam[MouseActionParam["scrollLeft"] = 9] = "scrollLeft";
	    MouseActionParam[MouseActionParam["scrollRight"] = 10] = "scrollRight";
	    MouseActionParam[MouseActionParam["accelerate"] = 11] = "accelerate";
	    MouseActionParam[MouseActionParam["decelerate"] = 12] = "decelerate";
	})(MouseActionParam || (MouseActionParam = {}));
	var MouseAction = (function (_super) {
	    __extends(MouseAction, _super);
	    function MouseAction() {
	        _super.apply(this, arguments);
	    }
	    MouseAction.prototype._fromJsObject = function (jsObject) {
	        this.assertKeyActionType(jsObject);
	        this.mouseAction = MouseActionParam[jsObject.mouseAction];
	        return this;
	    };
	    MouseAction.prototype._fromBinary = function (buffer) {
	        this.readAndAssertKeyActionId(buffer);
	        this.mouseAction = buffer.readUInt8();
	        return this;
	    };
	    MouseAction.prototype._toJsObject = function () {
	        return {
	            keyActionType: KeyAction_1.keyActionType.MouseAction,
	            mouseAction: MouseActionParam[this.mouseAction]
	        };
	    };
	    MouseAction.prototype._toBinary = function (buffer) {
	        buffer.writeUInt8(KeyAction_1.KeyActionId.MouseAction);
	        buffer.writeUInt8(this.mouseAction);
	    };
	    MouseAction.prototype.toString = function () {
	        return "<MouseAction mouseAction=\"" + this.mouseAction + "\">";
	    };
	    __decorate([
	        assert_1.assertEnum(MouseActionParam)
	    ], MouseAction.prototype, "mouseAction", void 0);
	    return MouseAction;
	}(KeyAction_1.KeyAction));
	exports.MouseAction = MouseAction;


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var KeyAction_1 = __webpack_require__(16);
	var assert_1 = __webpack_require__(7);
	var PlayMacroAction = (function (_super) {
	    __extends(PlayMacroAction, _super);
	    function PlayMacroAction() {
	        _super.apply(this, arguments);
	    }
	    PlayMacroAction.prototype._fromJsObject = function (jsObject) {
	        this.assertKeyActionType(jsObject);
	        this.macroId = jsObject.macroId;
	        return this;
	    };
	    PlayMacroAction.prototype._fromBinary = function (buffer) {
	        this.readAndAssertKeyActionId(buffer);
	        this.macroId = buffer.readUInt8();
	        return this;
	    };
	    PlayMacroAction.prototype._toJsObject = function () {
	        return {
	            keyActionType: KeyAction_1.keyActionType.PlayMacroAction,
	            macroId: this.macroId
	        };
	    };
	    PlayMacroAction.prototype._toBinary = function (buffer) {
	        buffer.writeUInt8(KeyAction_1.KeyActionId.PlayMacroAction);
	        buffer.writeUInt8(this.macroId);
	    };
	    PlayMacroAction.prototype.toString = function () {
	        return "<PlayMacroAction macroId=\"" + this.macroId + "\">";
	    };
	    __decorate([
	        assert_1.assertUInt8
	    ], PlayMacroAction.prototype, "macroId", void 0);
	    return PlayMacroAction;
	}(KeyAction_1.KeyAction));
	exports.PlayMacroAction = PlayMacroAction;


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var ClassArray_1 = __webpack_require__(5);
	var Macro_1 = __webpack_require__(26);
	var Macros = (function (_super) {
	    __extends(Macros, _super);
	    function Macros() {
	        _super.apply(this, arguments);
	    }
	    Macros.prototype.jsObjectToClass = function (jsObject) {
	        return new Macro_1.Macro().fromJsObject(jsObject);
	    };
	    Macros.prototype.binaryToClass = function (buffer) {
	        return new Macro_1.Macro().fromBinary(buffer);
	    };
	    return Macros;
	}(ClassArray_1.ClassArray));
	exports.Macros = Macros;


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var Serializable_1 = __webpack_require__(3);
	var MacroActions_1 = __webpack_require__(27);
	var assert_1 = __webpack_require__(7);
	var Macro = (function (_super) {
	    __extends(Macro, _super);
	    function Macro() {
	        _super.apply(this, arguments);
	    }
	    Macro.prototype._fromJsObject = function (jsObject) {
	        this.id = jsObject.id;
	        this.isLooped = jsObject.isLooped;
	        this.isPrivate = jsObject.isPrivate;
	        this.name = jsObject.name;
	        this.macroActions = new MacroActions_1.MacroActions().fromJsObject(jsObject.macroActions);
	        return this;
	    };
	    Macro.prototype._fromBinary = function (buffer) {
	        this.id = buffer.readUInt8();
	        this.isLooped = buffer.readBoolean();
	        this.isPrivate = buffer.readBoolean();
	        this.name = buffer.readString();
	        this.macroActions = new MacroActions_1.MacroActions().fromBinary(buffer);
	        return this;
	    };
	    Macro.prototype._toJsObject = function () {
	        return {
	            id: this.id,
	            isLooped: this.isLooped,
	            isPrivate: this.isPrivate,
	            name: this.name,
	            macroActions: this.macroActions.toJsObject()
	        };
	    };
	    Macro.prototype._toBinary = function (buffer) {
	        buffer.writeUInt8(this.id);
	        buffer.writeBoolean(this.isLooped);
	        buffer.writeBoolean(this.isPrivate);
	        buffer.writeString(this.name);
	        this.macroActions.toBinary(buffer);
	    };
	    Macro.prototype.toString = function () {
	        return "<Macro id=\"" + this.id + "\" name=\"" + this.name + "\">";
	    };
	    __decorate([
	        assert_1.assertUInt8
	    ], Macro.prototype, "id", void 0);
	    return Macro;
	}(Serializable_1.Serializable));
	exports.Macro = Macro;


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var ClassArray_1 = __webpack_require__(5);
	var DelayMacroAction_1 = __webpack_require__(28);
	var MacroAction_1 = __webpack_require__(29);
	var HoldKeyMacroAction_1 = __webpack_require__(30);
	var HoldModifiersMacroAction_1 = __webpack_require__(31);
	var HoldMouseButtonsMacroAction_1 = __webpack_require__(32);
	var MoveMouseMacroAction_1 = __webpack_require__(33);
	var PressKeyMacroAction_1 = __webpack_require__(34);
	var PressModifiersMacroAction_1 = __webpack_require__(35);
	var PressMouseButtonsMacroAction_1 = __webpack_require__(36);
	var ReleaseKeyMacroAction_1 = __webpack_require__(37);
	var ReleaseModifiersMacroAction_1 = __webpack_require__(38);
	var ReleaseMouseButtonsMacroAction_1 = __webpack_require__(39);
	var ScrollMouseMacroAction_1 = __webpack_require__(40);
	var TextMacroAction_1 = __webpack_require__(41);
	var MacroActions = (function (_super) {
	    __extends(MacroActions, _super);
	    function MacroActions() {
	        _super.apply(this, arguments);
	    }
	    MacroActions.prototype.jsObjectToClass = function (jsObject) {
	        switch (jsObject.macroActionType) {
	            case MacroAction_1.macroActionType.PressKeyMacroAction:
	                return new PressKeyMacroAction_1.PressKeyMacroAction().fromJsObject(jsObject);
	            case MacroAction_1.macroActionType.HoldKeyMacroAction:
	                return new HoldKeyMacroAction_1.HoldKeyMacroAction().fromJsObject(jsObject);
	            case MacroAction_1.macroActionType.ReleaseKeyMacroAction:
	                return new ReleaseKeyMacroAction_1.ReleaseKeyMacroAction().fromJsObject(jsObject);
	            case MacroAction_1.macroActionType.PressModifiersMacroAction:
	                return new PressModifiersMacroAction_1.PressModifiersMacroAction().fromJsObject(jsObject);
	            case MacroAction_1.macroActionType.HoldModifiersMacroAction:
	                return new HoldModifiersMacroAction_1.HoldModifiersMacroAction().fromJsObject(jsObject);
	            case MacroAction_1.macroActionType.ReleaseModifiersMacroAction:
	                return new ReleaseModifiersMacroAction_1.ReleaseModifiersMacroAction().fromJsObject(jsObject);
	            case MacroAction_1.macroActionType.PressMouseButtonsMacroAction:
	                return new PressMouseButtonsMacroAction_1.PressMouseButtonsMacroAction().fromJsObject(jsObject);
	            case MacroAction_1.macroActionType.HoldMouseButtonsMacroAction:
	                return new HoldMouseButtonsMacroAction_1.HoldMouseButtonsMacroAction().fromJsObject(jsObject);
	            case MacroAction_1.macroActionType.ReleaseMouseButtonsMacroAction:
	                return new ReleaseMouseButtonsMacroAction_1.ReleaseMouseButtonsMacroAction().fromJsObject(jsObject);
	            case MacroAction_1.macroActionType.MoveMouseMacroAction:
	                return new MoveMouseMacroAction_1.MoveMouseMacroAction().fromJsObject(jsObject);
	            case MacroAction_1.macroActionType.ScrollMouseMacroAction:
	                return new ScrollMouseMacroAction_1.ScrollMouseMacroAction().fromJsObject(jsObject);
	            case MacroAction_1.macroActionType.DelayMacroAction:
	                return new DelayMacroAction_1.DelayMacroAction().fromJsObject(jsObject);
	            case MacroAction_1.macroActionType.TextMacroAction:
	                return new TextMacroAction_1.TextMacroAction().fromJsObject(jsObject);
	            default:
	                throw "Invalid MacroAction.macroActionType: \"" + jsObject.macroActionType + "\"";
	        }
	    };
	    MacroActions.prototype.binaryToClass = function (buffer) {
	        var macroActionFirstByte = buffer.readUInt8();
	        buffer.backtrack();
	        if (buffer.enableDump) {
	            process.stdout.write(']\n');
	            buffer.enableDump = false;
	        }
	        switch (macroActionFirstByte) {
	            case MacroAction_1.MacroActionId.PressKeyMacroAction:
	                return new PressKeyMacroAction_1.PressKeyMacroAction().fromBinary(buffer);
	            case MacroAction_1.MacroActionId.HoldKeyMacroAction:
	                return new HoldKeyMacroAction_1.HoldKeyMacroAction().fromBinary(buffer);
	            case MacroAction_1.MacroActionId.ReleaseKeyMacroAction:
	                return new ReleaseKeyMacroAction_1.ReleaseKeyMacroAction().fromBinary(buffer);
	            case MacroAction_1.MacroActionId.PressModifiersMacroAction:
	                return new PressModifiersMacroAction_1.PressModifiersMacroAction().fromBinary(buffer);
	            case MacroAction_1.MacroActionId.HoldModifiersMacroAction:
	                return new HoldModifiersMacroAction_1.HoldModifiersMacroAction().fromBinary(buffer);
	            case MacroAction_1.MacroActionId.ReleaseModifiersMacroAction:
	                return new ReleaseModifiersMacroAction_1.ReleaseModifiersMacroAction().fromBinary(buffer);
	            case MacroAction_1.MacroActionId.PressMouseButtonsMacroAction:
	                return new PressMouseButtonsMacroAction_1.PressMouseButtonsMacroAction().fromBinary(buffer);
	            case MacroAction_1.MacroActionId.HoldMouseButtonsMacroAction:
	                return new HoldMouseButtonsMacroAction_1.HoldMouseButtonsMacroAction().fromBinary(buffer);
	            case MacroAction_1.MacroActionId.ReleaseMouseButtonsMacroAction:
	                return new ReleaseMouseButtonsMacroAction_1.ReleaseMouseButtonsMacroAction().fromBinary(buffer);
	            case MacroAction_1.MacroActionId.MoveMouseMacroAction:
	                return new MoveMouseMacroAction_1.MoveMouseMacroAction().fromBinary(buffer);
	            case MacroAction_1.MacroActionId.ScrollMouseMacroAction:
	                return new ScrollMouseMacroAction_1.ScrollMouseMacroAction().fromBinary(buffer);
	            case MacroAction_1.MacroActionId.DelayMacroAction:
	                return new DelayMacroAction_1.DelayMacroAction().fromBinary(buffer);
	            case MacroAction_1.MacroActionId.TextMacroAction:
	                return new TextMacroAction_1.TextMacroAction().fromBinary(buffer);
	            default:
	                throw "Invalid MacroAction first byte: " + macroActionFirstByte;
	        }
	    };
	    return MacroActions;
	}(ClassArray_1.ClassArray));
	exports.MacroActions = MacroActions;


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var MacroAction_1 = __webpack_require__(29);
	var assert_1 = __webpack_require__(7);
	var DelayMacroAction = (function (_super) {
	    __extends(DelayMacroAction, _super);
	    function DelayMacroAction() {
	        _super.apply(this, arguments);
	    }
	    DelayMacroAction.prototype._fromJsObject = function (jsObject) {
	        this.assertMacroActionType(jsObject);
	        this.delay = jsObject.delay;
	        return this;
	    };
	    DelayMacroAction.prototype._fromBinary = function (buffer) {
	        this.readAndAssertMacroActionId(buffer);
	        this.delay = buffer.readUInt16();
	        return this;
	    };
	    DelayMacroAction.prototype._toJsObject = function () {
	        return {
	            macroActionType: MacroAction_1.macroActionType.DelayMacroAction,
	            delay: this.delay
	        };
	    };
	    DelayMacroAction.prototype._toBinary = function (buffer) {
	        buffer.writeUInt8(MacroAction_1.MacroActionId.DelayMacroAction);
	        buffer.writeUInt16(this.delay);
	    };
	    DelayMacroAction.prototype.toString = function () {
	        return "<DelayMacroAction delay=\"" + this.delay + "\">";
	    };
	    __decorate([
	        assert_1.assertUInt16
	    ], DelayMacroAction.prototype, "delay", void 0);
	    return DelayMacroAction;
	}(MacroAction_1.MacroAction));
	exports.DelayMacroAction = DelayMacroAction;


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Serializable_1 = __webpack_require__(3);
	(function (MacroActionId) {
	    MacroActionId[MacroActionId["PressKeyMacroAction"] = 0] = "PressKeyMacroAction";
	    MacroActionId[MacroActionId["HoldKeyMacroAction"] = 1] = "HoldKeyMacroAction";
	    MacroActionId[MacroActionId["ReleaseKeyMacroAction"] = 2] = "ReleaseKeyMacroAction";
	    MacroActionId[MacroActionId["PressModifiersMacroAction"] = 3] = "PressModifiersMacroAction";
	    MacroActionId[MacroActionId["HoldModifiersMacroAction"] = 4] = "HoldModifiersMacroAction";
	    MacroActionId[MacroActionId["ReleaseModifiersMacroAction"] = 5] = "ReleaseModifiersMacroAction";
	    MacroActionId[MacroActionId["PressMouseButtonsMacroAction"] = 6] = "PressMouseButtonsMacroAction";
	    MacroActionId[MacroActionId["HoldMouseButtonsMacroAction"] = 7] = "HoldMouseButtonsMacroAction";
	    MacroActionId[MacroActionId["ReleaseMouseButtonsMacroAction"] = 8] = "ReleaseMouseButtonsMacroAction";
	    MacroActionId[MacroActionId["MoveMouseMacroAction"] = 9] = "MoveMouseMacroAction";
	    MacroActionId[MacroActionId["ScrollMouseMacroAction"] = 10] = "ScrollMouseMacroAction";
	    MacroActionId[MacroActionId["DelayMacroAction"] = 11] = "DelayMacroAction";
	    MacroActionId[MacroActionId["TextMacroAction"] = 12] = "TextMacroAction";
	})(exports.MacroActionId || (exports.MacroActionId = {}));
	var MacroActionId = exports.MacroActionId;
	exports.macroActionType = {
	    PressKeyMacroAction: 'pressKey',
	    HoldKeyMacroAction: 'holdKey',
	    ReleaseKeyMacroAction: 'releaseKey',
	    PressModifiersMacroAction: 'pressModifiers',
	    HoldModifiersMacroAction: 'holdModifiers',
	    ReleaseModifiersMacroAction: 'releaseModifiers',
	    PressMouseButtonsMacroAction: 'pressMouseButtons',
	    HoldMouseButtonsMacroAction: 'holdMouseButtons',
	    ReleaseMouseButtonsMacroAction: 'releaseMouseButtons',
	    MoveMouseMacroAction: 'moveMouse',
	    ScrollMouseMacroAction: 'scrollMouse',
	    DelayMacroAction: 'delay',
	    TextMacroAction: 'text'
	};
	var MacroAction = (function (_super) {
	    __extends(MacroAction, _super);
	    function MacroAction() {
	        _super.apply(this, arguments);
	    }
	    MacroAction.prototype.assertMacroActionType = function (jsObject) {
	        var macroActionClassname = this.constructor.name;
	        var macroActionTypeString = exports.macroActionType[macroActionClassname];
	        if (jsObject.macroActionType !== macroActionTypeString) {
	            throw "Invalid " + macroActionClassname + ".macroActionType: " + jsObject.macroActionType;
	        }
	    };
	    MacroAction.prototype.readAndAssertMacroActionId = function (buffer) {
	        var classname = this.constructor.name;
	        var readMacroActionId = buffer.readUInt8();
	        var macroActionId = MacroActionId[classname];
	        if (readMacroActionId !== macroActionId) {
	            throw "Invalid " + classname + " first byte: " + readMacroActionId;
	        }
	    };
	    return MacroAction;
	}(Serializable_1.Serializable));
	exports.MacroAction = MacroAction;


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var MacroAction_1 = __webpack_require__(29);
	var assert_1 = __webpack_require__(7);
	var HoldKeyMacroAction = (function (_super) {
	    __extends(HoldKeyMacroAction, _super);
	    function HoldKeyMacroAction() {
	        _super.apply(this, arguments);
	    }
	    HoldKeyMacroAction.prototype._fromJsObject = function (jsObject) {
	        this.assertMacroActionType(jsObject);
	        this.scancode = jsObject.scancode;
	        return this;
	    };
	    HoldKeyMacroAction.prototype._fromBinary = function (buffer) {
	        this.readAndAssertMacroActionId(buffer);
	        this.scancode = buffer.readUInt8();
	        return this;
	    };
	    HoldKeyMacroAction.prototype._toJsObject = function () {
	        return {
	            macroActionType: MacroAction_1.macroActionType.HoldKeyMacroAction,
	            scancode: this.scancode
	        };
	    };
	    HoldKeyMacroAction.prototype._toBinary = function (buffer) {
	        buffer.writeUInt8(MacroAction_1.MacroActionId.HoldKeyMacroAction);
	        buffer.writeUInt8(this.scancode);
	    };
	    HoldKeyMacroAction.prototype.toString = function () {
	        return "<HoldKeyMacroAction scancode=\"" + this.scancode + "\">";
	    };
	    __decorate([
	        assert_1.assertUInt8
	    ], HoldKeyMacroAction.prototype, "scancode", void 0);
	    return HoldKeyMacroAction;
	}(MacroAction_1.MacroAction));
	exports.HoldKeyMacroAction = HoldKeyMacroAction;


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var MacroAction_1 = __webpack_require__(29);
	var assert_1 = __webpack_require__(7);
	var HoldModifiersMacroAction = (function (_super) {
	    __extends(HoldModifiersMacroAction, _super);
	    function HoldModifiersMacroAction() {
	        _super.apply(this, arguments);
	    }
	    HoldModifiersMacroAction.prototype._fromJsObject = function (jsObject) {
	        this.assertMacroActionType(jsObject);
	        this.modifierMask = jsObject.modifierMask;
	        return this;
	    };
	    HoldModifiersMacroAction.prototype._fromBinary = function (buffer) {
	        this.readAndAssertMacroActionId(buffer);
	        this.modifierMask = buffer.readUInt8();
	        return this;
	    };
	    HoldModifiersMacroAction.prototype._toJsObject = function () {
	        return {
	            macroActionType: MacroAction_1.macroActionType.HoldModifiersMacroAction,
	            modifierMask: this.modifierMask
	        };
	    };
	    HoldModifiersMacroAction.prototype._toBinary = function (buffer) {
	        buffer.writeUInt8(MacroAction_1.MacroActionId.HoldModifiersMacroAction);
	        buffer.writeUInt8(this.modifierMask);
	    };
	    HoldModifiersMacroAction.prototype.toString = function () {
	        return "<HoldModifiersMacroAction modifierMask=\"" + this.modifierMask + "\">";
	    };
	    __decorate([
	        assert_1.assertUInt8
	    ], HoldModifiersMacroAction.prototype, "modifierMask", void 0);
	    return HoldModifiersMacroAction;
	}(MacroAction_1.MacroAction));
	exports.HoldModifiersMacroAction = HoldModifiersMacroAction;


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var MacroAction_1 = __webpack_require__(29);
	var assert_1 = __webpack_require__(7);
	var HoldMouseButtonsMacroAction = (function (_super) {
	    __extends(HoldMouseButtonsMacroAction, _super);
	    function HoldMouseButtonsMacroAction() {
	        _super.apply(this, arguments);
	    }
	    HoldMouseButtonsMacroAction.prototype._fromJsObject = function (jsObject) {
	        this.assertMacroActionType(jsObject);
	        this.mouseButtonsMask = jsObject.mouseButtonsMask;
	        return this;
	    };
	    HoldMouseButtonsMacroAction.prototype._fromBinary = function (buffer) {
	        this.readAndAssertMacroActionId(buffer);
	        this.mouseButtonsMask = buffer.readUInt8();
	        return this;
	    };
	    HoldMouseButtonsMacroAction.prototype._toJsObject = function () {
	        return {
	            macroActionType: MacroAction_1.macroActionType.HoldMouseButtonsMacroAction,
	            mouseButtonsMask: this.mouseButtonsMask
	        };
	    };
	    HoldMouseButtonsMacroAction.prototype._toBinary = function (buffer) {
	        buffer.writeUInt8(MacroAction_1.MacroActionId.HoldMouseButtonsMacroAction);
	        buffer.writeUInt8(this.mouseButtonsMask);
	    };
	    HoldMouseButtonsMacroAction.prototype.toString = function () {
	        return "<HoldMouseButtonsMacroAction mouseButtonsMask=\"" + this.mouseButtonsMask + "\">";
	    };
	    __decorate([
	        assert_1.assertUInt8
	    ], HoldMouseButtonsMacroAction.prototype, "mouseButtonsMask", void 0);
	    return HoldMouseButtonsMacroAction;
	}(MacroAction_1.MacroAction));
	exports.HoldMouseButtonsMacroAction = HoldMouseButtonsMacroAction;


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var MacroAction_1 = __webpack_require__(29);
	var assert_1 = __webpack_require__(7);
	var MoveMouseMacroAction = (function (_super) {
	    __extends(MoveMouseMacroAction, _super);
	    function MoveMouseMacroAction() {
	        _super.apply(this, arguments);
	    }
	    MoveMouseMacroAction.prototype._fromJsObject = function (jsObject) {
	        this.assertMacroActionType(jsObject);
	        this.x = jsObject.x;
	        this.y = jsObject.y;
	        return this;
	    };
	    MoveMouseMacroAction.prototype._fromBinary = function (buffer) {
	        this.readAndAssertMacroActionId(buffer);
	        this.x = buffer.readInt16();
	        this.y = buffer.readInt16();
	        return this;
	    };
	    MoveMouseMacroAction.prototype._toJsObject = function () {
	        return {
	            macroActionType: MacroAction_1.macroActionType.MoveMouseMacroAction,
	            x: this.x,
	            y: this.y
	        };
	    };
	    MoveMouseMacroAction.prototype._toBinary = function (buffer) {
	        buffer.writeUInt8(MacroAction_1.MacroActionId.MoveMouseMacroAction);
	        buffer.writeInt16(this.x);
	        buffer.writeInt16(this.y);
	    };
	    MoveMouseMacroAction.prototype.toString = function () {
	        return "<MoveMouseMacroAction pos=\"(" + this.x + "," + this.y + ")\">";
	    };
	    __decorate([
	        assert_1.assertInt16
	    ], MoveMouseMacroAction.prototype, "x", void 0);
	    __decorate([
	        assert_1.assertInt16
	    ], MoveMouseMacroAction.prototype, "y", void 0);
	    return MoveMouseMacroAction;
	}(MacroAction_1.MacroAction));
	exports.MoveMouseMacroAction = MoveMouseMacroAction;


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var MacroAction_1 = __webpack_require__(29);
	var assert_1 = __webpack_require__(7);
	var PressKeyMacroAction = (function (_super) {
	    __extends(PressKeyMacroAction, _super);
	    function PressKeyMacroAction() {
	        _super.apply(this, arguments);
	    }
	    PressKeyMacroAction.prototype._fromJsObject = function (jsObject) {
	        this.assertMacroActionType(jsObject);
	        this.scancode = jsObject.scancode;
	        return this;
	    };
	    PressKeyMacroAction.prototype._fromBinary = function (buffer) {
	        this.readAndAssertMacroActionId(buffer);
	        this.scancode = buffer.readUInt8();
	        return this;
	    };
	    PressKeyMacroAction.prototype._toJsObject = function () {
	        return {
	            macroActionType: MacroAction_1.macroActionType.PressKeyMacroAction,
	            scancode: this.scancode
	        };
	    };
	    PressKeyMacroAction.prototype._toBinary = function (buffer) {
	        buffer.writeUInt8(MacroAction_1.MacroActionId.PressKeyMacroAction);
	        buffer.writeUInt8(this.scancode);
	    };
	    PressKeyMacroAction.prototype.toString = function () {
	        return "<PressKeyMacroAction scancode=\"" + this.scancode + "\">";
	    };
	    __decorate([
	        assert_1.assertUInt8
	    ], PressKeyMacroAction.prototype, "scancode", void 0);
	    return PressKeyMacroAction;
	}(MacroAction_1.MacroAction));
	exports.PressKeyMacroAction = PressKeyMacroAction;


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var MacroAction_1 = __webpack_require__(29);
	var assert_1 = __webpack_require__(7);
	var PressModifiersMacroAction = (function (_super) {
	    __extends(PressModifiersMacroAction, _super);
	    function PressModifiersMacroAction() {
	        _super.apply(this, arguments);
	    }
	    PressModifiersMacroAction.prototype._fromJsObject = function (jsObject) {
	        this.assertMacroActionType(jsObject);
	        this.modifierMask = jsObject.modifierMask;
	        return this;
	    };
	    PressModifiersMacroAction.prototype._fromBinary = function (buffer) {
	        this.readAndAssertMacroActionId(buffer);
	        this.modifierMask = buffer.readUInt8();
	        return this;
	    };
	    PressModifiersMacroAction.prototype._toJsObject = function () {
	        return {
	            macroActionType: MacroAction_1.macroActionType.PressModifiersMacroAction,
	            modifierMask: this.modifierMask
	        };
	    };
	    PressModifiersMacroAction.prototype._toBinary = function (buffer) {
	        buffer.writeUInt8(MacroAction_1.MacroActionId.PressModifiersMacroAction);
	        buffer.writeUInt8(this.modifierMask);
	    };
	    PressModifiersMacroAction.prototype.toString = function () {
	        return "<PressModifiersMacroAction modifierMask=\"" + this.modifierMask + "\">";
	    };
	    __decorate([
	        assert_1.assertUInt8
	    ], PressModifiersMacroAction.prototype, "modifierMask", void 0);
	    return PressModifiersMacroAction;
	}(MacroAction_1.MacroAction));
	exports.PressModifiersMacroAction = PressModifiersMacroAction;


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var MacroAction_1 = __webpack_require__(29);
	var assert_1 = __webpack_require__(7);
	var PressMouseButtonsMacroAction = (function (_super) {
	    __extends(PressMouseButtonsMacroAction, _super);
	    function PressMouseButtonsMacroAction() {
	        _super.apply(this, arguments);
	    }
	    PressMouseButtonsMacroAction.prototype._fromJsObject = function (jsObject) {
	        this.assertMacroActionType(jsObject);
	        this.mouseButtonsMask = jsObject.mouseButtonsMask;
	        return this;
	    };
	    PressMouseButtonsMacroAction.prototype._fromBinary = function (buffer) {
	        this.readAndAssertMacroActionId(buffer);
	        this.mouseButtonsMask = buffer.readUInt8();
	        return this;
	    };
	    PressMouseButtonsMacroAction.prototype._toJsObject = function () {
	        return {
	            macroActionType: MacroAction_1.macroActionType.PressMouseButtonsMacroAction,
	            mouseButtonsMask: this.mouseButtonsMask
	        };
	    };
	    PressMouseButtonsMacroAction.prototype._toBinary = function (buffer) {
	        buffer.writeUInt8(MacroAction_1.MacroActionId.PressMouseButtonsMacroAction);
	        buffer.writeUInt8(this.mouseButtonsMask);
	    };
	    PressMouseButtonsMacroAction.prototype.toString = function () {
	        return "<PressMouseButtonsMacroAction mouseButtonsMask=\"" + this.mouseButtonsMask + "\">";
	    };
	    __decorate([
	        assert_1.assertUInt8
	    ], PressMouseButtonsMacroAction.prototype, "mouseButtonsMask", void 0);
	    return PressMouseButtonsMacroAction;
	}(MacroAction_1.MacroAction));
	exports.PressMouseButtonsMacroAction = PressMouseButtonsMacroAction;


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var MacroAction_1 = __webpack_require__(29);
	var assert_1 = __webpack_require__(7);
	var ReleaseKeyMacroAction = (function (_super) {
	    __extends(ReleaseKeyMacroAction, _super);
	    function ReleaseKeyMacroAction() {
	        _super.apply(this, arguments);
	    }
	    ReleaseKeyMacroAction.prototype._fromJsObject = function (jsObject) {
	        this.assertMacroActionType(jsObject);
	        this.scancode = jsObject.scancode;
	        return this;
	    };
	    ReleaseKeyMacroAction.prototype._fromBinary = function (buffer) {
	        this.readAndAssertMacroActionId(buffer);
	        this.scancode = buffer.readUInt8();
	        return this;
	    };
	    ReleaseKeyMacroAction.prototype._toJsObject = function () {
	        return {
	            macroActionType: MacroAction_1.macroActionType.ReleaseKeyMacroAction,
	            scancode: this.scancode
	        };
	    };
	    ReleaseKeyMacroAction.prototype._toBinary = function (buffer) {
	        buffer.writeUInt8(MacroAction_1.MacroActionId.ReleaseKeyMacroAction);
	        buffer.writeUInt8(this.scancode);
	    };
	    ReleaseKeyMacroAction.prototype.toString = function () {
	        return "<ReleaseKeyMacroAction scancode=\"" + this.scancode + "\">";
	    };
	    __decorate([
	        assert_1.assertUInt8
	    ], ReleaseKeyMacroAction.prototype, "scancode", void 0);
	    return ReleaseKeyMacroAction;
	}(MacroAction_1.MacroAction));
	exports.ReleaseKeyMacroAction = ReleaseKeyMacroAction;


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var MacroAction_1 = __webpack_require__(29);
	var assert_1 = __webpack_require__(7);
	var ReleaseModifiersMacroAction = (function (_super) {
	    __extends(ReleaseModifiersMacroAction, _super);
	    function ReleaseModifiersMacroAction() {
	        _super.apply(this, arguments);
	    }
	    ReleaseModifiersMacroAction.prototype._fromJsObject = function (jsObject) {
	        this.assertMacroActionType(jsObject);
	        this.modifierMask = jsObject.modifierMask;
	        return this;
	    };
	    ReleaseModifiersMacroAction.prototype._fromBinary = function (buffer) {
	        this.readAndAssertMacroActionId(buffer);
	        this.modifierMask = buffer.readUInt8();
	        return this;
	    };
	    ReleaseModifiersMacroAction.prototype._toJsObject = function () {
	        return {
	            macroActionType: MacroAction_1.macroActionType.ReleaseModifiersMacroAction,
	            modifierMask: this.modifierMask
	        };
	    };
	    ReleaseModifiersMacroAction.prototype._toBinary = function (buffer) {
	        buffer.writeUInt8(MacroAction_1.MacroActionId.ReleaseModifiersMacroAction);
	        buffer.writeUInt8(this.modifierMask);
	    };
	    ReleaseModifiersMacroAction.prototype.toString = function () {
	        return "<ReleaseModifiersMacroAction modifierMask=\"" + this.modifierMask + "\">";
	    };
	    __decorate([
	        assert_1.assertUInt8
	    ], ReleaseModifiersMacroAction.prototype, "modifierMask", void 0);
	    return ReleaseModifiersMacroAction;
	}(MacroAction_1.MacroAction));
	exports.ReleaseModifiersMacroAction = ReleaseModifiersMacroAction;


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var MacroAction_1 = __webpack_require__(29);
	var assert_1 = __webpack_require__(7);
	var ReleaseMouseButtonsMacroAction = (function (_super) {
	    __extends(ReleaseMouseButtonsMacroAction, _super);
	    function ReleaseMouseButtonsMacroAction() {
	        _super.apply(this, arguments);
	    }
	    ReleaseMouseButtonsMacroAction.prototype._fromJsObject = function (jsObject) {
	        this.assertMacroActionType(jsObject);
	        this.mouseButtonsMask = jsObject.mouseButtonsMask;
	        return this;
	    };
	    ReleaseMouseButtonsMacroAction.prototype._fromBinary = function (buffer) {
	        this.readAndAssertMacroActionId(buffer);
	        this.mouseButtonsMask = buffer.readUInt8();
	        return this;
	    };
	    ReleaseMouseButtonsMacroAction.prototype._toJsObject = function () {
	        return {
	            macroActionType: MacroAction_1.macroActionType.ReleaseMouseButtonsMacroAction,
	            mouseButtonsMask: this.mouseButtonsMask
	        };
	    };
	    ReleaseMouseButtonsMacroAction.prototype._toBinary = function (buffer) {
	        buffer.writeUInt8(MacroAction_1.MacroActionId.ReleaseMouseButtonsMacroAction);
	        buffer.writeUInt8(this.mouseButtonsMask);
	    };
	    ReleaseMouseButtonsMacroAction.prototype.toString = function () {
	        return "<ReleaseMouseButtonsMacroAction mouseButtonsMask=\"" + this.mouseButtonsMask + "\">";
	    };
	    __decorate([
	        assert_1.assertUInt8
	    ], ReleaseMouseButtonsMacroAction.prototype, "mouseButtonsMask", void 0);
	    return ReleaseMouseButtonsMacroAction;
	}(MacroAction_1.MacroAction));
	exports.ReleaseMouseButtonsMacroAction = ReleaseMouseButtonsMacroAction;


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var MacroAction_1 = __webpack_require__(29);
	var assert_1 = __webpack_require__(7);
	var ScrollMouseMacroAction = (function (_super) {
	    __extends(ScrollMouseMacroAction, _super);
	    function ScrollMouseMacroAction() {
	        _super.apply(this, arguments);
	    }
	    ScrollMouseMacroAction.prototype._fromJsObject = function (jsObject) {
	        this.assertMacroActionType(jsObject);
	        this.x = jsObject.x;
	        this.y = jsObject.y;
	        return this;
	    };
	    ScrollMouseMacroAction.prototype._fromBinary = function (buffer) {
	        this.readAndAssertMacroActionId(buffer);
	        this.x = buffer.readInt16();
	        this.y = buffer.readInt16();
	        return this;
	    };
	    ScrollMouseMacroAction.prototype._toJsObject = function () {
	        return {
	            macroActionType: MacroAction_1.macroActionType.ScrollMouseMacroAction,
	            x: this.x,
	            y: this.y
	        };
	    };
	    ScrollMouseMacroAction.prototype._toBinary = function (buffer) {
	        buffer.writeUInt8(MacroAction_1.MacroActionId.ScrollMouseMacroAction);
	        buffer.writeInt16(this.x);
	        buffer.writeInt16(this.y);
	    };
	    ScrollMouseMacroAction.prototype.toString = function () {
	        return "<ScrollMouseMacroAction pos=\"(" + this.x + "," + this.y + ")\">";
	    };
	    __decorate([
	        assert_1.assertInt16
	    ], ScrollMouseMacroAction.prototype, "x", void 0);
	    __decorate([
	        assert_1.assertInt16
	    ], ScrollMouseMacroAction.prototype, "y", void 0);
	    return ScrollMouseMacroAction;
	}(MacroAction_1.MacroAction));
	exports.ScrollMouseMacroAction = ScrollMouseMacroAction;


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var MacroAction_1 = __webpack_require__(29);
	var TextMacroAction = (function (_super) {
	    __extends(TextMacroAction, _super);
	    function TextMacroAction() {
	        _super.apply(this, arguments);
	    }
	    TextMacroAction.prototype._fromJsObject = function (jsObject) {
	        this.assertMacroActionType(jsObject);
	        this.text = jsObject.text;
	        return this;
	    };
	    TextMacroAction.prototype._fromBinary = function (buffer) {
	        this.readAndAssertMacroActionId(buffer);
	        this.text = buffer.readString();
	        return this;
	    };
	    TextMacroAction.prototype._toJsObject = function () {
	        return {
	            macroActionType: MacroAction_1.macroActionType.TextMacroAction,
	            text: this.text
	        };
	    };
	    TextMacroAction.prototype._toBinary = function (buffer) {
	        buffer.writeUInt8(MacroAction_1.MacroActionId.TextMacroAction);
	        buffer.writeString(this.text);
	    };
	    TextMacroAction.prototype.toString = function () {
	        return "<TextMacroAction text=\"" + this.text + "\">";
	    };
	    return TextMacroAction;
	}(MacroAction_1.MacroAction));
	exports.TextMacroAction = TextMacroAction;


/***/ },
/* 42 */
/***/ function(module, exports) {

	module.exports = require("assert");

/***/ },
/* 43 */
/***/ function(module, exports) {

	module.exports = require("fs");

/***/ }
/******/ ]);