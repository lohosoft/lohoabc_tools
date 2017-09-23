const DB = require("./db.js");
const Config = require("./config.js");
const fs = require("fs");

let myMap = new Map();
let myMapSize;
function mapToJson(map) {
	return JSON.stringify([...map]);
}
function jsonToMap(jsonStr) {
	return new Map(JSON.parse(jsonStr));
}

exports.mapToJson = mapToJson;
exports.jsonToMap = jsonToMap;
