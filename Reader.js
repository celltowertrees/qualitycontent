var Cheerio = require('cheerio'),
    request = require('request'),
    S = require('string');
    
module.exports = {

    getKinjaTitles: function (page, callback) {
        var titles = [];

        var getNextPage = function (Ch) {
            var nextLink = Ch('.load-more .text-center a');
            console.log(nextLink.attr('href'));
        };

        // @TODO: make this its own function
        var scrapePage = function (page) {
            request(page, function (error, response, body) {

                if (!error && response.statusCode == 200) {
                    var Ch = Cheerio.load(body);

                    Ch('.entry-title a').each(function (i, elem) {
                        titles[i] = Ch(this).text();
                    });

                    callback(titles);
                    getNextPage(Ch);

                } else {
                    console.log('There was a connection error');
                }
            });
        };

        scrapePage(page);
    },

    tweet: function (keyword, callback) {
        var tweetList = [],
            Twit = require('twit'),
            T = new Twit(require('./twitconfig'));

        T.get('search/tweets', {
            q: keyword,
            count: 100
        }, function (err, data) {
            for (i = 0; i < data.statuses.length; i++) {
                tweetList.push(S(data.statuses[i].text).s);
            }

            callback(tweetList);
        });
    },

    // Attempt to use the API
    kinja: function (url, callback) {
        var Request = require('request');
        var comments = [];

        Request(url, {json: true}, function (error, response, body) {
            console.log('Attempting request');

            if (!error && response.statusCode === 200) {
                console.log('Request succeeded!');

                for (var i = 0; i < 9; i++) {
                    if (body.data.items[i] !== undefined) {
                        comments.push(body.data.items[i].reply.plaintext);
                    }
                }

                callback(comments);

            } else {
                console.log('You have failed');
            }
        });
    }
}