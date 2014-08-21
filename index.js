'use strict';

var request = require('request');
var cheerio = require('cheerio');
var sys = require('sys');
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

function clearConsole() {
  exec('clear', function(error, stdout, stderr) {
    sys.puts(stdout);
  });
}

function printToToiletConsole(text) {
  exec("toilet -f basic -w 200 --gay \""+ text + "\"", function(error, stdout, stderr) {
    console.log(stdout);
  });
}

function printNowPlaying() {
  getNowPlaying(function(nowPlayingObject) {
    if(nowPlayingObject.error) {
      clearConsole();
      printToToiletConsole(nowPlayingObject.error);
    } else {
      clearConsole();
      printToToiletConsole(nowPlayingObject.title + "\n by \n" + nowPlayingObject.artist);
    }
  });
}

printNowPlaying();
setInterval(printNowPlaying, 60000);
