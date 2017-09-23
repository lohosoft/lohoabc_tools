// console.log(qwest);

window.load = start();
var queryUrlRoot = "http://127.0.0.1:3000/getimgs/?word=";
var order = 0;

function start() {
	console.log("app");
	// console.log(dict_graph.nodes);
	showOptionImgs(0);
}

function nextWord() {
	order += 1;
	showOptionImgs(order);
}

function prevWord() {
	order -= 1;
	showOptionImgs(order);
}
function showOptionImgs(order) {
	var optionsDiv = document.getElementById("optionsDiv");
	optionsDiv.innerHTML = "";
	var currentWord = document.getElementById("currentWord");
	var word = dict_graph.nodes[order].v;
	currentWord.innerHTML = word;
	var queryUrlRoot = "http://127.0.0.1:3000/getimgs/?word=";
	var requestUrl = queryUrlRoot + word;
	console.log("showOptionImgs for : ", word);
	console.log("requestUrl is ", requestUrl);
	qwest
		.get(requestUrl)
		.then(function(xhr, response) {
			console.log("got optoiins words : ", response);

			for (var i = response.length - 1; i >= 0; i--) {
				var imgUrl = response[i].thumbnailUrl;
				console.log("imgUrl is ", imgUrl);
				var img = new Image();
				img.src = imgUrl;
				img.name = word;
				img.onclick = "clickOnImg('this')";

				optionsDiv.appendChild(img);
				// document.body.appendChild(checkbox);
			}
		})
		.catch(function(e, xhr, response) {})
		.complete(function() {});
}

function clickOnImg(that) {
	console.log(that.name);
}
