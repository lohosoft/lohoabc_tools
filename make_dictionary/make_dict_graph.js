console.log("make_dict_graph.js");
const fs = require("fs"),
	path = require("path");
const async = require("async");
const graphlib = require("graphlib");
const Graph = graphlib.Graph;
let graph = new Graph();
const rawGraphFile = "./src/data/json/dict_graph_with_trans_and_vec.json";
const graphFile = "./src/data/json/dict_graph_v2.json";

const Word2VecUtils = require("./src/word2vec/word2vecutils.js");

function _readGraphFromJSONFile(file) {
	console.log("_readGraphFromJSONFile with file : ", file);
	return function(callback) {
		fs.readFile(file, function(err, data) {
			if (!err) {
				let rawGraph = graphlib.json.read(JSON.parse(data));
				callback(null, rawGraph);
			} else {
				callback(err);
			}
		});
	};
}

// ==========  not working on async waterfall when split to multi functions ==================  TODO
// function _makeGraphWithComponents(graph, callback) {
// 	console.log("_makeGraphWithComponents");
// 	return function(callback) {
// 		let rawArray = graph.nodes();
// 		rawArray.map(item => {
// 			let word = item;
// 			let vec = graph.node(item).vec;
// 			let similarity = 0;
// 			let simWord;
// 			rawArray.map(item1 => {
// 				let word1 = item1;
// 				let vec1 = graph.node(word1).vec;
// 				if (word !== word1) {
// 					let similarity1 = Word2VecUtils.getCosSim(vec, vec1);
// 					if (similarity1 >= similarity) {
// 						similarity = similarity1;
// 						simWord = word1;
// 					}
// 				}
// 			});

// 			// console.log("most similarity is : ", word, simWord);
// 			graph.setEdge(word, simWord, similarity);
// 		});

// 		callback(null, graph);
// 	};
// }
// for simple connected components , result should is 1 =======================
check();
function check() {
	async.waterfall(
		[
			_readGraphFromJSONFile(graphFile),
			function(graph, callback) {
				// console.log(graphlib.alg.components(graph).length);
				let res = graphlib.alg.components(graph).length;
				callback(null, res);
			}
		],
		function(err, res) {
			console.log("result is ", res);
		}
	);
}

// make();
// do the work
function make() {
	async.waterfall(
		[
			_readGraphFromJSONFile(rawGraphFile),
			function(graph, callback) {
				let rawArray = graph.nodes();
				rawArray.map(item => {
					let word = item;
					let vec = graph.node(item).vec;
					let similarity = 0;
					let simWord;
					rawArray.map(item1 => {
						let word1 = item1;
						let vec1 = graph.node(word1).vec;
						if (word !== word1) {
							let similarity1 = Word2VecUtils.getCosSim(
								vec,
								vec1
							);
							if (similarity1 >= similarity) {
								similarity = similarity1;
								simWord = word1;
							}
						}
					});

					// console.log("most similarity is : ", word, simWord);
					graph.setEdge(word, simWord, similarity);
				});

				callback(null, graph);
			},
			// connect each one of components by nearest distance to rest of all node except this components
			function(graph, callback) {
				console.log(graphlib.alg.components(graph).length);
				let nodes = graph.nodes();
				let components = graphlib.alg.components(graph);
				// add first into processed make it start working
				let processed = components[0];

				while (processed.length < nodes.length) {
					console.log(processed.length);
					let oWord;
					let similarityRes = 0;
					let simWord;
					processed.map(item => {
						let word = item;
						let vec = graph.node(word).vec;
						nodes.map(item1 => {
							if (processed.indexOf(item1) === -1) {
								let word1 = item1;
								let vec1 = graph.node(word1).vec;
								let similarity1 = Word2VecUtils.getCosSim(
									vec,
									vec1
								);
								if (similarity1 >= similarityRes) {
									similarityRes = similarity1;
									simWord = word1;
									oWord = word;
								}
							}
						});
					});
					graph.setEdge(oWord, simWord, similarityRes);
					// find which component has simWord
					components.map(component => {
						if (component.indexOf(simWord) !== -1) {
							processed = processed.concat(component);
						}
					});
				}
				console.log(" graph edges : ", graph.edgeCount());

				callback(null, graph);
			},
			// remove vec ,keep translation for every word
			function(graph, callback) {
				let nodes = graph.nodes();
				nodes.map(item => {
					let word = item;
					let trans = graph.node(word).t;
					graph.setNode(word, trans);
				});
				let jsondata = graphlib.json.write(graph);
				// console.log(JSON.stringify(jsondata));
				fs.writeFile(graphFile, JSON.stringify(jsondata), function(
					err
				) {
					if (err) throw err;
					callback(null, "ok");
				});

				// callback(null, "ok");
			}
		],
		function(err, result) {
			if (!err) {
				console.log("result is : ", result);
			}
		}
	);
}
