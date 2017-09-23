console.log("index.js");
const fs = require("fs"),
	path = require("path");
const async = require("async");
const graphlib = require("graphlib");
const Graph = graphlib.Graph;
// const Graph = require("../../../node_modules/graphlib/dist/graphlib.js").Graph;
let graph = new Graph();
const rawTextPath = "./src/raw.txt";
// const rawTextPath = "./src/line_handle_test.txt";
const rawGraphFile = "./src/raw_graph_dict.json";
const graphFile = "./src/dict_graph.json";
const lineReader = require("readline").createInterface({
	input: require("fs").createReadStream(rawTextPath)
});

// not count '
// const english = /^[A-Za-z0-9]*$/;
// count ' like o'clock
const english = /^[A-Za-z0-9']*$/;
const Word2VecUtils = require("./src/word2vec/word2vecutils.js");

// ===========================================  make dict graph =======================
// getDictGraph();

// console.log(Word2VecUtils.getVecByWord("policeman"));

function getSimilarFor2Words(w1, w2) {
	let aVec = Word2VecUtils.getVecByWord(w1);
	let bVec = Word2VecUtils.getVecByWord(w2);
	// console.log(aVec);
	if (aVec[0] && bVec[0]) {
		return Word2VecUtils.getCosSim(aVec, bVec);
	} else {
		return false;
	}
}

function getDictGraph() {
	async.waterfall(
		[
			function(callback) {
				fs.readFile(rawGraphFile, function(err, data) {
					if (!err) {
						let rawGraph = graphlib.json.read(JSON.parse(data));
						callback(null, rawGraph);
					}
				});
			},
			function(rawGraph, callback) {
				// console.log(rawGraph);
				let rawArray = rawGraph.nodes();
				// let newGraph = new Graph();
				for (let i = rawArray.length - 1; i >= 0; i--) {
					let wordA = rawArray[i];
					// console.log("find shorted distance for : ", wordA);
					let similarityRes = 0;
					let wordBRes;
					for (let i = rawArray.length - 1; i >= 0; i--) {
						let wordB = rawArray[i];
						// console.log("target word is : ", wordB);
						if (wordA !== wordB) {
							// all to lower case for nation name city name
							let compareWordA = wordA
								.split(",")[0]
								.toLowerCase();
							let compareWordB = wordB
								.split(",")[0]
								.toLowerCase();

							let vecA = Word2VecUtils.getVecByWord(compareWordA);
							let vecB = Word2VecUtils.getVecByWord(compareWordB);
							// some words singular not exist but plurals exists
							if (vecA[0] === false) {
								compareWordA = compareWordA + "s";
								vecA = Word2VecUtils.getVecByWord(compareWordA);
								// console.log("+ s for : ", compareWordA);
								// console.log(vecA);
							}
							if (vecB[0] === false) {
								compareWordB = compareWordB + "s";
								vecB = Word2VecUtils.getVecByWord(compareWordB);
								// console.log("+ s for : ", compareWordB);
								// console.log(vecB);
							}
							let similarity = Word2VecUtils.getCosSim(
								vecA,
								vecB
							);

							if (similarity > similarityRes) {
								similarityRes = similarity;
								wordBRes = wordB;
								// console.log(
								// 	"new similarity is : ",
								// 	similarityRes
								// );
								// console.log("new res word is : ", wordBRes);
							}
						}
					}
					if (!wordBRes) {
						console.log("no result for : ", wordA);
						console.log("similarityRes is : ", similarityRes);
					} else {
						rawGraph.setEdge(wordA, wordBRes, { s: similarityRes });
					}
				}
				callback(null, rawGraph);
			},
			function(graphRes, callback) {
				let jsondata = graphlib.json.write(graphRes);
				// console.log(JSON.stringify(jsondata));
				fs.writeFile(graphFile, JSON.stringify(jsondata), function(
					err
				) {
					if (err) throw err;
					callback(null, "ok");
				});
			}
		],
		function(err, result) {
			if (!err) {
				console.log("result : ", result);
			} else {
				console.log("err : ", err);
			}
		}
	);
}

// read a line from target raw words file and hanle line by line
let linenumber = 0;
lineReader.on("line", function(line) {
	// console.log("Line from file:", line);
	linenumber += 1;
	handleLine(line, linenumber);
});

function handleLine(line, linenumber) {
	console.log("handling linenumber : ", linenumber);
	let array = line.split(" ");
	let e = [];
	let c = [];
	array.map(item => {
		// get english part
		if (english.test(item) && item !== "") {
			// console.log(item);
			// console.log("handling e : ", item);
			e.push(item);
		} else if (item.length !== 0 && item !== "") {
			// get chinese part
			// console.log("handling c : ", item);
			c.push(item);
		}
	});
	// console.log("e : ", e);
	// console.log("c : ", c);
	// c = c.replace(/^\s\s*/, "").replace(/\s\s*$/, "");
	// console.log(array);
	// graph.setNode(e, c);
	// console.log("handling linenumber : ", linenumber);
	let eStr = e.join(" ");
	console.log("e part is : ", eStr);
	let cStr = c.join("");
	console.log("c part is : ", cStr);

	if (!graph.hasNode(eStr)) {
		graph.setNode(eStr, cStr);
		console.log("graph size is : ", graph.nodes().length);
	} else {
		console.log("reapet linenumber : ", linenumber);
		console.log("repeat for : ", eStr, cStr);
	}
	if (graph.nodes().length === 721) {
		console.log("finish");
		// let jsondata = graphlib.json.write(graph);
		// console.log(JSON.stringify(jsondata));
		// fs.writeFile(rawGraphFile, jsondata, function(err) {
		// 	if (err) throw err;
		// });
	}
	// console.log(graph.node(e));
}
