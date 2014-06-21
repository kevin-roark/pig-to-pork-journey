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

var TOUCHING_DIST = 100;
var PASSED_DIST = 400;
var OFFSCREEN_DIST = GAME_WIDTH;

var STARTING_LIFE = 5000;
var DEFAULT_LIFE_LOSS = 3;
var DONUT_LIFE_GAIN = 100;

var DONUT_CREATION_RATE = 1500;

var $body = $('body');
var game, pig, cannon;
var donuts = [];
var keys;
var controllable = false;
var active = false;

var donutGroup, pigGroup, textGroup;

var lifeText;

var currentLife = STARTING_LIFE;
var lifeLossRate = DEFAULT_LIFE_LOSS;

var Sprite = Phaser.Sprite;
var Text = Phaser.Text;

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
    $(this).off('click');
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

  donutGroup = game.add.group();
  pigGroup = game.add.group();
  textGroup = game.add.group();

  pig = pigGroup.add(new Sprite(game, 200, GAME_HEIGHT - 150, 'flypig'));
  pig.name = 'flypig';
  game.physics.enable(pig, Phaser.Physics.ARCADE);
  pig.body.collideWorldBounds = true;
  pig.body.immovable = true;
  pig.anchor.setTo(0.5, 0.5);

  lifeText = textGroup.add(new Text(game, GAME_WIDTH - 200, 36, getLifeText(), {
    font: "56px Courier New",
    fill: "rgb(255, 0, 0)",
    align: "center"
  }));

  lifeText.anchor.setTo(0.5, 0.5);
  lifeText.fixedToCamera = true;

  cannon = donutGroup.add(new Sprite(game, 0, GAME_HEIGHT - 160, 'cannon'));
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
  launchPig(function() {
    startDonutTimer();
    controllable = true;
  });
}

function endGame() {
  // gotta get the animation going with eating pork

  active = false;
  controllable = false;

  $('canvas').css('opacity', '0.2');
  $('.title').fadeIn(600);
  $('.replay-button').fadeIn(600);
  $('body').css('background-color', 'white');

  $('.replay-button').click(function() {
    $(this).off('click');
    $(this).fadeOut(300, function() {
      startGame();
    });
    $('.title').fadeOut(300);
  });

  pig.world.x = 200;
  pig.world.y = GAME_HEIGHT - 150;
 
  while (donuts.length > 0) {
    var donut = donuts.shift();
    donut.destroy();
  }

  currentLife = STARTING_LIFE;
}

var logged = false;

function update() {
  if (!active) return;

  for (var i = 0; i < donuts.length; i++) {
    var donut = donuts[i];
    var distance = game.physics.arcade.distanceBetween(pig, donut);

    if (!donut.passed && distance < TOUCHING_DIST) {
      hitDonut(donut);
    } else if (!donut.passed && pig.world.x - donut.world.x > PASSED_DIST) {
      passedDonut(donut);
    }
  }

  var firstDonut = donuts[0];
  if (firstDonut.passed && pig.world.x - firstDonut.world.x > OFFSCREEN_DIST) {
    donuts.shift();
    firstDonut.destroy();
  }

  rotateDonuts();

  if (!controllable) return;

  lifeLossRate = DEFAULT_LIFE_LOSS;

  setPigMotion();

  currentLife -= lifeLossRate;
  lifeText.setText(getLifeText());

  if (currentLife <= 0) {
    endGame();
  }
}

function hitDonut(donut) {
  donut.passed = true;
  currentLife += DONUT_LIFE_GAIN;
}

function passedDonut(donut) {
  donut.passed = true;
}

function setPigMotion() {
  pig.body.velocity.x = MIN_SPEED;
  pig.body.velocity.y = 0;

  if (keys.left.isDown) {
    pig.body.velocity.x -= HOR_SLOW_DOWN;
    lifeLossRate *= 1.25;
  }

  if (keys.right.isDown) {
    pig.body.velocity.x += HOR_SPEED_UP;
    lifeLossRate *= 0.75;
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

function launchPig(callback) {
  pig.body.velocity.x = 200;
  pig.body.velocity.y = -320;

  var launchInterval = setInterval(function() {
    pig.body.velocity.y *= 0.9;
    pig.body.velocity.x *= 0.94;

    if (pig.body.velocity.y >= -30) {
      clearInterval(launchInterval);
      pig.body.velocity.x = 0;
      pig.body.velocity.y = 0;

      callback();
    }
  }, 100);
}

function startDonutTimer() {
  if (!active) return;

  setTimeout(function() {
    createDonut();
    startDonutTimer();
  }, DONUT_CREATION_RATE);
}

function createDonut() {
  var worldX = getWorldX();

  if (worldX < 100) {
    var x = 800;
    var y = 300;
  } else {
    var x = game.rnd.integerInRange(worldX + 1500, worldX + 3000);
    var y = game.rnd.integerInRange(80, 620);
  }

  var donut = donutGroup.add(new Sprite(game, x, y, 'donut'));
  donuts.push(donut);
  donut.name = 'donut' + donuts.length;
  game.physics.enable(donut, Phaser.Physics.ARCADE);
  donut.anchor.setTo(0.5, 0.5);
  donut.passed = false;
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

function getLifeText() {
  return 'fat: ' + Math.round(currentLife);
}

},{"./intro":1}]},{},[2])