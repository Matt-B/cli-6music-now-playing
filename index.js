'use strict';

var request = require('request');
var cheerio = require('cheerio');
var sys = require('sys');
var asciify = require('asciify');
var clear = require('cli-clear');
var exec = require('child_process').exec;

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

function randomColor() {
  var colors = ['green', 'red', 'blue', 'white'];
  return colors[Math.floor(Math.random()*colors.length)];
}

function printAsciiText(text) {
  asciify(text, { color: randomColor() }, function(err, res) {
    console.log(res) 
  });
}

function printNowPlaying() {
  getNowPlaying(function(nowPlayingObject) {
    if(nowPlayingObject.error) {
      clear();
      printAsciiText(nowPlayingObject.error);
    } else {
      clear();
      printAsciiText(nowPlayingObject.title + "\n by \n" + nowPlayingObject.artist);
    }
  });
}

printNowPlaying();
setInterval(printNowPlaying, 60000);
