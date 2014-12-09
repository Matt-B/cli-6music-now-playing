'use strict';

var request = require('request');
var cheerio = require('cheerio');
var asciify = require('asciify');
var clear = require('cli-clear');
var rainbow = require('ansi-rainbow');

function getNowPlaying(callback) {
  request("http://6music.sharpshooterlabs.com", function(error, response, body) {
    if(error) {
      callback({ error: error });
    } else {
      var $ = cheerio.load(body);
      callback({
        artist: $('#artist').text(),
        title: $('#title').text(),
      });
    }
  });
}

function printAsciiText(text, callback) {
  asciify(text, { font: "colossal", maxWidth: process.stdout.columns }, function(err, res) {
    console.log(rainbow.r(res));
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
setInterval(printNowPlaying, 60000);
