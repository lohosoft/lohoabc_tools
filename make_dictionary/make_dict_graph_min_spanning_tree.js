console.log("dict_graph_with_trans_and_vec.js");
const fs = require("fs"),
	path = require("path");
const async = require("async");
const graphlib = require("graphlib");
const Graph = graphlib.Graph;
let graph = new Graph();
// const rawTextPath = "./src/line_handle_test.txt";
const Word2VecUtils = require("./src/word2vec/word2vecutils.js");

const graphFile = "./new_dict_graph.json";

const newGraphFile = "./dict_graph_with_trans_and_vec.json";

getSimpleDictGraph();
function getSimpleDictGraph() {
	async.waterfall(
		[
			function(callback) {
				fs.readFile("full_connect_dict_graph.json", function(
					err,
					data
				) {
					if (!err) {
						let rawGraph = graphlib.json.read(JSON.parse(data));
						callback(null, rawGraph);
					}
				});
			},
			function(graph, callback) {
				let newGraph = graphlib.alg.prim(graph, function(e) {
					return graph.edge(e);
				});
				callback(null, newGraph);
			},
			function(graphRes, callback) {
				let jsondata = graphlib.json.write(graphRes);
				// console.log(JSON.stringify(jsondata));
				fs.writeFile(
					"dict_graph_min_spanning_tree.json",
					JSON.stringify(jsondata),
					function(err) {
						if (err) throw err;
						callback(null, "ok");
					}
				);
			}
		],
		function(err, result) {
			if (!err) {
				console.log("result is : ", result);
			}
		}
	);
}

// getDictGraphByVec();
function getDictGraphByVec() {
	async.waterfall(
		[
			function(callback) {
				fs.readFile(newGraphFile, function(err, data) {
					if (!err) {
						let rawGraph = graphlib.json.read(JSON.parse(data));
						callback(null, rawGraph);
					}
				});
			},
			function(rawGraph, callback) {
				let rawArray = rawGraph.nodes();
				rawArray.map(item1 => {
					let word1 = item1;
					let vec1 = rawGraph.node(word1).vec;
					rawArray.map(item2 => {
						if (word1 !== item2) {
							let word2 = item2;
							let vec2 = rawGraph.node(word2).vec;
							let edgeValue = Word2VecUtils.getCosSim(vec1, vec2);
							// console.log("edge value is : ", edgeValue);
							rawGraph.setEdge(word1, word2, edgeValue);
						}
					});
				});
				console.log(rawGraph.edgeCount());
				callback(null, rawGraph);
			},
			function(graph, callback) {
				// simplify edges from full connected graph save to new graph
				// and remove vec for new graph
				let nodes = graph.nodes();
				nodes.map(item => {
					let word = item;
					let trans = graph.node(word).t;
					graph.setNode(item, trans);
				});

				console.log(graph.nodes().length, graph.edges().length);
				callback(null, graph);
			},
			function(graphRes, callback) {
				let jsondata = graphlib.json.write(graphRes);
				// console.log(JSON.stringify(jsondata));
				fs.writeFile(
					"full_connect_dict_graph.json",
					JSON.stringify(jsondata),
					function(err) {
						if (err) throw err;
						callback(null, "ok");
					}
				);
			}
		],
		function(err, result) {
			if (!err) {
				// console.log("result is : ", result);
			}
		}
	);
}

// getJsonFileOfWordTransVec();
function getJsonFileOfWordTransVec() {
	async.waterfall(
		[
			function(callback) {
				fs.readFile(graphFile, function(err, data) {
					if (!err) {
						let rawGraph = graphlib.json.read(JSON.parse(data));
						callback(null, rawGraph);
					}
				});
			},
			function(rawGraph, callback) {
				let resGraph = new Graph({
					directed: false,
					compound: false,
					multigraph: false
				});
				let rawArray = rawGraph.nodes();
				rawArray.map(item => {
					let word = item;
					let trans = rawGraph.node(item);
					let mayVec = Word2VecUtils.getVecByWord(
						word.split(" ")[0].toLowerCase()
					);
					// if (!mayVec[0]) {
					// 	console.log(word, mayVec);
					// }

					if (mayVec.length === 300) {
						// console.log(mayVec);
						let node = word;
						let value = { t: trans, vec: mayVec };
						resGraph.setNode(node, value);
					}
				});
				callback(null, resGraph);
			},
			function(graphRes, callback) {
				let jsondata = graphlib.json.write(graphRes);
				// console.log(JSON.stringify(jsondata));
				fs.writeFile(newGraphFile, JSON.stringify(jsondata), function(
					err
				) {
					if (err) throw err;
					callback(null, "ok");
				});
			}
		],
		function(err, result) {
			if (!err) {
				console.log("result is : ", result);
			}
		}
	);
}
