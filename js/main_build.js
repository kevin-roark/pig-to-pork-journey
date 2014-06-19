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

var SPEED_DIFF = 85;

var $body = $('body');
var game, pig, cannon;
var donuts = [];
var keys;
var controllable = false;


//intro(function() {
  game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, 'pork-journey',
                         {preload: preload,
                          create: createGame,
                          update: update,
                          render: render
                         });
//});

function preload() {
  game.load.image('flypig', 'assets/flypig.png');
  game.load.image('cannon', 'assets/cannon.png');
  game.load.image('donut', 'assets/chocolate_donut.png');
}

function createGame() {
  game.physics.startSystem(Phaser.Physics.ARCADE);

  game.world.setBounds(0, 0, 2500, 2500);

  pig = game.add.sprite(50, GAME_HEIGHT - 200, 'flypig');
  pig.name = 'flypig';
  game.physics.enable(pig, Phaser.Physics.ARCADE);
  pig.body.collideWorldBounds = true;
  pig.body.immovable = true;
  pig.body.setSize(100, 50, 0, 0);

  cannon = game.add.sprite(0, GAME_HEIGHT - 200, 'cannon');
  cannon.name = 'cannon';
  game.physics.enable(cannon, Phaser.Physics.ARCADE);

  game.camera.follow(pig);

  keys = game.input.keyboard.createCursorKeys();

  createDonut();

  launchPig();
}

function update() {
  for (var i = 0; i < donuts.length; i++) {
    var donut = donuts[i];
    var intersecting = game.physics.arcade.intersects(pig, donut);
    if (intersecting) {
      console.log('they touching');
    }
  }

  if (!controllable) return;
 
  setPigMotion();
 }

function setPigMotion() {
  pig.body.velocity.x = 0;
  pig.body.velocity.y = 0;

  if (keys.left.isDown) {
    pig.body.velocity.x -= SPEED_DIFF;
  }
  
  if (keys.right.isDown) {
    pig.body.velocity.x += SPEED_DIFF;
  }
  
  if (keys.up.isDown) {
    pig.body.velocity.y -= SPEED_DIFF;
  }
  
  if (keys.down.isDown) {
    pig.body.velocity.y += SPEED_DIFF;
  }
}

function render() {
  // called every frame i guess after update
}

function launchPig() {
  pig.body.velocity.x = 100;
  pig.body.velocity.y = -40;

  var launchInterval = setInterval(function() {
    pig.body.velocity.y += 1;
    if (pig.body.velocity.y >= 0) {
      clearInterval(launchInterval);
      pig.body.velocity.x = 0;
      controllable = true;
    }
  }, 100);
}

function createDonut() {
  var donut = game.add.sprite(400, 100, 'donut');
  donuts.push(donut);
  donut.name = 'donut' + donuts.length;
  game.physics.enable(donut, Phaser.Physics.ARCADE);
  //donut.body.immovable = true;
}



},{"./intro":1}]},{},[2])