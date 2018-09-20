#!/usr/bin/env node
"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var firebase = __importStar(require("firebase"));
var path_1 = __importDefault(require("path"));
var config = require(path_1.default.join(process.cwd(), 'uxboard.json'));
firebase.initializeApp(config.firebase);
var values = [
    { name: '意義' },
    { name: '素敵・楽しい' },
    { name: '快適' },
    { name: '使いやすい' },
    { name: '安全・安心' },
    { name: '機能する' }
];
firebase
    .database()
    .ref(config.databasePrefix + "/indices")
    .set(values)
    .then(function () { return process.exit(0); })
    .catch(function (e) {
    console.error(e);
    process.exit(1);
});
