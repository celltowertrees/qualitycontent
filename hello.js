var fs = require('fs'),
    babel = require('babel-core'),
    request = require('request'),
    Reader = require('./Reader.js'),
    Writer = require('./Writer.js');

// THIS IS FOR TESTING!!!!!!
// returns a list
var prepareSamples = function (stuff) {
	var Ch = Cheerio.load(fs.readFileSync(stuff));
	var content = Ch('body').text();

	return content.split('. ');
}

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