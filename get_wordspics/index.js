// const compression = require("compression");
const args = process.argv;
console.log(args);
const express = require("express");
const app = express();
const fs = require("fs");
const bingApiKey = "189bda1045ad40bfbae3e3a449d801f5";

const BingSearch = require("node-bing-api")({ accKey: bingApiKey });
const cors = require("cors");

// use nginx instead compression
// app.use(compression());

// only for dev enable cors
app.use(cors());

const port = args[2];

app.use(express.static("static"));

app.get("/getimgs", function(req, res) {
	let word = req.query.word;
	// res.send(word);
	handleQuery(res, word);
});
app.listen(port, function() {
	console.log("Example app listening on port : ", port);
});

function handleQuery(res, word) {
	console.log("bingsearchimg testing");
	BingSearch.images(
		word,
		{
			count: 6, // Number of results (max 50)
			offset: 0 // Skip first 3 result
		},
		function(error, result, body) {
			// console.log(res);
			// console.log(body.value[0]);
			if (!error) {
				// res.send(JSON.stringify(body.value));
				res.json(body.value);
			}
		}
	);
}
