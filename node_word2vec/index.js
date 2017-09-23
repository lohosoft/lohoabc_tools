const w2v = require("word2vec");

// w2v.word2phrase(
// 	__dirname + "/fixtures/input.txt",
// 	__dirname + "/fixtures/phrases.txt",
// 	{
// 		threshold: 5,
// 		debug: 2,
// 		minCount: 2
// 	}
// );

// w2v.word2vec(
// 	__dirname + "/fixtures/phrases.txt",
// 	__dirname + "/fixtures/vectors.txt",
// 	{
// 		cbow: 1,
// 		size: 200,
// 		window: 8,
// 		negative: 25,
// 		hs: 0,
// 		sample: 1e-4,
// 		threads: 20,
// 		iter: 15,
// 		minCount: 2
// 	}
// );

// w2v.loadModel(__dirname + "/fixtures/vectors.txt", function(err, model) {
// 	// console.log(model);

// 	// var wordVecs = model.getVectors(["Hamlet", "daughter"]);
// 	// console.log(model.getNearestWord(wordVecs[0].values, 1));

// 	var similar = model.mostSimilar("apple", 20);
// 	console.log(similar);

// 	// var analogy = model.analogy("mother", ["Hamlet", "father"], 10);
// 	// console.log(analogy);

// 	var similarity = model.similarity("father", "mother");
// 	console.log(similarity);
// });

w2v.loadModel(__dirname + "/fixtures/vectors.txt", function(err, model) {
	var wordVecs = model.getVectors(["mother", "father", "king"]);
	var result = wordVecs[0].subtract(wordVecs[1]).add(wordVecs[2]);

	console.log(model.getNearestWords(result, 10));
});
