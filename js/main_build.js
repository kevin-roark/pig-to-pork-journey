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

var GAME_WIDTH = 1400;
var GAME_HEIGHT = 700;
var WORLD_WIDTH = 100000;

var HOR_SPEED_UP = 130;
var HOR_SLOW_DOWN = 110;
var VERT_SPEED_DIFF = 140;
var MIN_SPEED = 215;

var $body = $('body');
var game, pig, cannon;
var donuts = [];
var keys;
var controllable = false;
var active = false;

var lastDonutCreationX;

var lifeLossRate = 5;


//intro(function() {
  game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, 'pork-journey',
                         {preload: preload,
                          create: createGame,
                          update: update,
                          render: render
                         });
//});

function preload() {
  game.load.image('background','assets/galaxy.jpg');
  game.load.image('flypig', 'assets/flypig.png');
  game.load.image('cannon', 'assets/cannon.png');
  game.load.image('donut', 'assets/chocolate_donut.png');
}

function addControls() {
  $('canvas').css('opacity', '0.2');
  $('body').css('background-color', 'white');
  
  $('.play-button').show();
  $('.title').show();

  $('.play-button').click(function() {
    $(this).fadeOut(900, function() {
      startGame();
    });
    $('.title').fadeOut(900);
  });
}

function createGame() {
  addControls();

  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;
  game.scale.refresh();

  game.add.tileSprite(0, 0, WORLD_WIDTH, GAME_HEIGHT, 'background');
  
  game.physics.startSystem(Phaser.Physics.ARCADE);

  game.world.setBounds(0, 0, WORLD_WIDTH, GAME_HEIGHT);

  pig = game.add.sprite(200, GAME_HEIGHT - 150, 'flypig');
  pig.name = 'flypig';
  game.physics.enable(pig, Phaser.Physics.ARCADE);
  pig.body.collideWorldBounds = true;
  pig.body.immovable = true;
  pig.anchor.setTo(0.5, 0.5);

  cannon = game.add.sprite(0, GAME_HEIGHT - 160, 'cannon');
  cannon.name = 'cannon';
  game.physics.enable(cannon, Phaser.Physics.ARCADE);

  game.camera.follow(pig, Phaser.Camera.FOLLOW_PLATFORMER);

  keys = game.input.keyboard.createCursorKeys();

  createDonut();
}

function startGame() {
  $('body').css('background-color', 'black');
  $('canvas').css('opacity', '1.0');

  active = true;
  launchPig();
}

function update() {
  if (!active) return; 

  for (var i = 0; i < donuts.length; i++) {
    var donut = donuts[i];
    var intersecting = game.physics.arcade.intersects(pig, donut);
    var distance = game.physics.arcade.distanceBetween(pig, donut);
  }

  if (getWorldX() - lastDonutCreationX > 400) {
    createDonut();
  }

  rotateDonuts();

  if (!controllable) return;

  setPigMotion();
 }

function setPigMotion() {
  pig.body.velocity.x = MIN_SPEED;
  pig.body.velocity.y = 0;

  if (keys.left.isDown) {
    pig.body.velocity.x -= HOR_SLOW_DOWN;
  }
  
  if (keys.right.isDown) {
    pig.body.velocity.x += HOR_SPEED_UP;
  }
  
  if (keys.up.isDown) {
    pig.body.velocity.y -= VERT_SPEED_DIFF;
  }
  
  if (keys.down.isDown) {
    pig.body.velocity.y += VERT_SPEED_DIFF;
  }
}

function render() {
  // called every frame i guess after update
}

function launchPig() {
  pig.body.velocity.x = 80;
  pig.body.velocity.y = -56;

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
  var worldX = getWorldX();
  lastDonutCreationX = worldX;
  
  if (worldX < 100) {
    var x = 800;
    var y = 300;
  } else {
    var x = game.rnd.integerInRange(worldX + 1500, worldX + 3000);
    var y = game.rnd.integerInRange(80, 620);
  }

  var donut = game.add.sprite(x, y, 'donut');
  donuts.push(donut);
  donut.name = 'donut' + donuts.length;
  game.physics.enable(donut, Phaser.Physics.ARCADE);
  //donut.body.immovable = true;
  donut.anchor.setTo(0.5, 0.5);

  if (donuts.length > 10) {
    donuts.shift();
  }
  
  pig.bringToTop();
}

function rotateDonuts() {
  for (var i = 0; i < donuts.length; i++) {
    var donut = donuts[i];
    donut.angle += 1;
  }
}

function getWorldX() {
  return -game.world.position.x;
}



},{"./intro":1}]},{},[2])