
var fs = require('fs'),
    babel = require('babel-core'),
    Reader = require('./Reader.js');

// @TODO: split these out into separate packages
var Writer = new Object();


// THIS IS FOR TESTING!!!!!!
// returns a list
var prepareSamples = function (stuff) {
	var Ch = Cheerio.load(fs.readFileSync(stuff));
	var content = Ch('body').text();

	return content.split('. ');
}

// 
// WRITER
// 

// This function was blatantly ripped from the Internet
Writer.markovize = function (titles) {
	// input: list
	// output: string

	var terminals = {};
	var startwords = [];
	var wordstats = {};

	for (var i = 0; i < titles.length; i++) {
		var words = titles[i].split(' ');
		terminals[words[words.length-1]] = true;
		startwords.push(words[0]);
		for (var j = 0; j < words.length - 1; j++) {
			if (wordstats.hasOwnProperty(words[j])) {
				wordstats[words[j]].push(words[j+1]);
			} else {
				wordstats[words[j]] = [words[j+1]];
			}
		}
	}

	var choice = function (a) {
		var i = Math.floor(a.length * Math.random());
		return a[i];
	};

	var make_title = function (min_length) {
		word = choice(startwords);
		var title = [word];
		while (wordstats.hasOwnProperty(word)) {
			var next_words = wordstats[word];
			var word = choice(next_words);
			title.push(word);
			if (title.length >= min_length && terminals.hasOwnProperty(word)) break;
		}
		if (title.length < min_length) {
			return make_title(min_length);
		}
		return title.join(' ');
	};

	return make_title(10);
};

// ------------------------------------------ SANDBOX

var getJSON = function (page, callback) {
    request(page, function (error, response, body) {

        if (!error && response.statusCode == 200) {
            var result = JSON.parse(body);

            callback(result);
        } else {
            console.log('There was a connection error');
        }
    });
};

getJSON('http://a.4cdn.org/r9k/catalog.json', function (thing) {
    var result = thing.map(page => page.threads)
        .map(function (thread, i) {
            return thread[i];
        })
        .map(single => single.com);

    console.log(Writer.markovize(result));
});