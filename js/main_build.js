(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var $body = $('body');

var finalCb;

module.exports = function(callback) {
  finalCb = callback;
  firstSentence();
};

function firstSentence() {
  var you = $('<div class="intro-text white">U</div>');
  you.css('left', '25%');
  you.css('top', '10%');

  var are = $('<div class="intro-text white">R</div>');
  are.css('right', '25%');
  are.css('top', '10%');

  var aPig = $('<div class="intro-text white">A PIG</div>');
  aPig.css('bottom', '20%');
  aPig.css('left', '40%');

  $body.append(you);
  setTimeout(function() {
    $body.append(are);
    setTimeout(function() {
      $body.append(aPig);
      setTimeout(function() {
        firstFlash();
      }, 800);
    }, 400);
  }, 400);
}

function firstFlash() {
  $body.html('');
  var pig = $('<img class="happy-pig" src="assets/happy_pig.jpg" />');
  $body.append(pig);

  function showPig() {
    $body.css('background-color', 'rgb(255, 0, 0)');
    pig.show();
  }

  function hidePig() {
    $body.css('background-color', '#000');
    pig.hide();
  }

  var showing = false;
  var shown = 0;

  var interval = setInterval(function() {
    if (showing) hidePig();
    else showPig();
    showing = !showing;
    if (++shown == 16) {
      clearInterval(interval);
      secondSentence();
    }
  }, 200);
}

function secondSentence() {
  $body.css('background-color', '#fff');

  var but = $('<div class="intro-text red">BUT</div>');
  but.css('left', '25%');
  but.css('top', '10%');

  var not = $('<div class="intro-text red">NOT</div>');
  not.css('right', '25%');
  not.css('top', '10%');

  var forLong = $('<div class="intro-text red">4 LONG</div>');
  forLong.css('left', '35%');
  forLong.css('bottom', '20%');

  $body.append(but);
  setTimeout(function() {
    $body.append(not);
    setTimeout(function() {
      $body.append(forLong);
      setTimeout(function() {
        secondFlash();
      }, 800);
    }, 400);
  }, 400);
}

function secondFlash() {
  $body.html('');
  var pig = $('<img class="happy-pig" src="assets/sad_pig.jpg" />');
  $body.append(pig);

  function showPig() {
    $body.css('background-color', 'rgb(255, 255, 0)');
    pig.show();
  }

  function hidePig() {
    $body.css('background-color', '#fff');
    pig.hide();
  }

  var showing = false;
  var shown = 0;

  var interval = setInterval(function() {
    if (showing) hidePig();
    else showPig();
    showing = !showing;
    if (++shown == 16) {
      clearInterval(interval);
      finalCb();
    }
  }, 200);
}

},{}],2:[function(require,module,exports){

var intro = require('./intro');

var GAME_WIDTH = 800;
var GAME_HEIGHT = 600;

var $body = $('body');
var game, pig, cannon;
var donuts = [];


intro(function() {
  game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, 'pork-journey', {preload: preload, create: createGame});
});

function preload() {
  game.load.image('flypig', 'assets/flypig.png');
  game.load.image('cannon', 'assets/cannon.png');
  game.load.image('donut', 'assets/chocolate_donut.png');
}

function createGame() {
  pig = game.add.sprite(50, GAME_HEIGHT - 200, 'flypig');
  game.physics.enable(pig, Phaser.Physics.ARCADE);

  cannon = game.add.sprite(0, GAME_HEIGHT - 200, 'cannon');
  game.physics.enable(cannon, Phaser.Physics.ARCADE);

  createDonut();

  launchPig();
}

function launchPig() {
  pig.body.velocity.x = 100;
  pig.body.velocity.y = -40;

  var launchInterval = setInterval(function() {
    pig.body.velocity.y += 1;
    if (pig.body.velocity.y >= 0) {
      clearInterval(launchInterval);
    }
  }, 100);
}

function createDonut() {
  var donut = game.add.sprite(400, 100, 'donut');
  donuts.push(donut);
  game.physics.enable(donut, Phaser.Physics.ARCADE);
}

},{"./intro":1}]},{},[2])