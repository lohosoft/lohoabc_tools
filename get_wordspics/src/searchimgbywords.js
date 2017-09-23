const fs = require("fs");
const bingApiKey = "189bda1045ad40bfbae3e3a449d801f5";

const BingSearch = require("node-bing-api")({ accKey: bingApiKey });
const download = require("image-downloader");
const wordsPicsPath = "./wordspics/";
const dictGraphJson = require("./dict_graph.json");
// console.log(dictGraphJson.nodes.length);

start();
// test();
function start() {
	// body...
	for (var i = dictGraphJson.nodes.length - 1; i >= 0; i--) {
		searchImgByWord(dictGraphJson.nodes[i].v);
	}
}

function test() {
	console.log("bingsearchimg testing");
	BingSearch.images(
		"Ninja",
		{
			count: 1, // Number of results (max 50)
			offset: 0 // Skip first 3 result
		},
		function(error, res, body) {
			// console.log(res);
			console.log(body.value[0].thumbnailUrl);
		}
	);
}

function searchImgByWord(word) {
	let filename = word.replace(/[^a-z0-9]/gi, "_").toLowerCase();
	// console.log(filename);
	let imgNameSuffix = "pep-" + filename;
	let checkExistedFileName = imgNameSuffix + "-0.jpeg";
	if(!fs.existsSync(checkExistedFileName)){
		console.log(word);
	}
// for (let i = 0; i < 8; i++) {
// 	let checkExistedFileName = imgNameSuffix + "-" + i + ".jpeg";
// 	if (!fs.existsSync(checkExistedFileName)) {
// 		console.log(checkExistedFileName)
// 	// 	BingSearch.images(
// 	// 		word,
// 	// 		{
// 	// 			count: 1, // Number of results (max 50)
// 	// 			offset: i // Skip first 3 result
// 	// 		},
// 	// 		function(error, res, body) {
// 	// 			// console.log(res);
// 	// 			// console.log(body.value[0]);
// 	// 			if (!error) {
// 	// 				let resArray = body.value;
// 	// 				let thumbUrl = resArray[0].thumbnailUrl;
// 	// 				let type = resArray[0].encodingFormat;
// 	// 				if (type === "jpeg") {
// 	// 					// console.log(
// 	// 					// 	"handling image thumb : with ",
// 	// 					// 	imgNameSuffix,
// 	// 					// 	thumbUrl
// 	// 					// );
// 	// 					// no need big image right now
// 	// 					// downLoadImgs(imgUrl, wordImgsPath + imgNameSuffix);

// 	// 					let path =
// 	// 						wordsPicsPath +
// 	// 						imgNameSuffix +
// 	// 						"-" +
// 	// 						i +
// 	// 						".jpeg";

// 	// 					let options = {
// 	// 						url: thumbUrl,
// 	// 						dest: path // Save to /path/to/dest/photo.jpg
// 	// 					};

// 	// 					download
// 	// 						.image(options)
// 	// 						.then(({ filename, image }) => {
// 	// 							// console.log("File saved to", filename);
// 	// 						})
// 	// 						.catch(err => {
// 	// 							throw err;
// 	// 							console.log(
// 	// 								"err happend for : ",
// 	// 								word,
// 	// 								imgUrl
// 	// 							);
// 	// 						});
// 	// 				}
// 	// 			} else {
// 	// 				console.log("bing search error : ", error);
// 	// 			}
// 	// 		}
// 	// 	);
// 	}
// }
}

function downLoadImgs(word, imgUrl, path) {
	let options = {
		url: imgUrl,
		dest: path // Save to /path/to/dest/photo.jpg
	};
	download
		.image(options)
		.then(({ filename, image }) => {
			console.log("File saved to", filename);
		})
		.catch(err => {
			throw err;
			console.log("err happend for : ", word, imgUrl);
		});
}
