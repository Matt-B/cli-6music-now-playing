'use strict';

var request = require('request');
var cheerio = require('cheerio');
var asciify = require('asciify');
var clear = require('cli-clear');
var rainbow = require('ansi-rainbow');
var refreshRateInMilliSeconds = 30000;

function getNowPlaying(callback) {
  request("http://ws.audioscrobbler.com/1.0/user/bbc6music/recenttracks.rss", function(error, response, body) {
    if(error) {
      callback({ error: error });
    } else {
      var $ = cheerio.load(body, {
        xmlMode: true
      });
      callback({
        artist: $('item title')[0].children[0].data.split(' – ')[0],
        title: $('item title')[0].children[0].data.split(' – ')[1],
      });
    }
  });
}

function printAsciiText(text, callback) {
  asciify(text, { font: "colossal", maxWidth: process.stdout.columns }, function(err, res) {
    var cols = process.stdout.columns;
    var lines = res.split('\n').map(function (line) {
      var margin = Math.floor((cols - line.length) / 2);
      return Array(margin).join(' ') + line;
    });
    lines = lines.join('\n');
    console.log(rainbow.r(lines));
    if(callback) {
      callback();
    }
  });
}

function printNowPlaying() {
  getNowPlaying(function(nowPlayingObject) {
    if(nowPlayingObject.error) {
      clear();
      printAsciiText(nowPlayingObject.error);
    } else {
      clear();
      printAsciiText('Now Playing:', function() {
        printAsciiText(nowPlayingObject.title, function() {
          printAsciiText(" by ", function() {
            printAsciiText(nowPlayingObject.artist);
          });
        });
      });
    }
  });
}

printNowPlaying();
setInterval(printNowPlaying, refreshRateInMilliSeconds);
