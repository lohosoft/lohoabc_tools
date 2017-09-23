console.log("index.js");
const fs = require("fs"),
	path = require("path");
const async = require("async");
const graphlib = require("graphlib");
const Graph = graphlib.Graph;
// const Graph = require("../../../node_modules/graphlib/dist/graphlib.js").Graph;
// let graph = new Graph();
const graphFile = "./src/dict_graph.json";

doClean();
function doClean() {
	async.waterfall(
		[
			function(callback) {
				fs.readFile(graphFile, function(err, data) {
					if (!err) {
						let rawGraph = graphlib.json.read(JSON.parse(data));
						console.log(rawGraph.nodes().length);
						callback(null, rawGraph);
					} else {
						console.log(err);
					}
				});
			},

			function(rawGraph, callback) {
				let nodesArray = rawGraph.nodes();
				let newGraph = new Graph();
				nodesArray.map(node => {
					// console.log(node);
					let newNode = node.split(",").join(" ");
					newGraph.setNode(newNode, rawGraph.node(node));
				});
				let edgesArray = rawGraph.edges();
				edgesArray.map(edge => {
					// console.log(edge.v);
					// console.log(edge.w);
					let edgeValue = rawGraph.edge(edge.v, edge.w);
					// console.log(edgeValue.s);
					let oldV = edge.v;
					let oldW = edge.w;
					let newV = oldV.split(",").join(" ");
					let newW = oldW.split(",").join(" ");
					newGraph.setEdge(newV, newW, edgeValue.s);
				});
				callback(null, newGraph);
			},
			function(graphRes, callback) {
				let jsondata = graphlib.json.write(graphRes);
				// console.log(JSON.stringify(jsondata));
				fs.writeFile(
					"new_dict_graph.json",
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
				// console.log("result : ", result);
				// console.log(result.edge("yellow", "red"));
			} else {
				console.log("err : ", err);
			}
		}
	);
}
