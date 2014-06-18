
var intro = require('./intro');

var GAME_WIDTH = 800;
var GAME_HEIGHT = 600;

var SPEED_DIFF = 50;

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

  pig = game.add.sprite(50, GAME_HEIGHT - 200, 'flypig');
  pig.name = 'flypig';
  game.physics.enable(pig, Phaser.Physics.ARCADE);
  pig.body.collideWorldBounds = true;
  pig.body.immovable = true;
  pig.body.setSize(100, 50, 0, 0);

  cannon = game.add.sprite(0, GAME_HEIGHT - 200, 'cannon');
  cannon.name = 'cannon';
  game.physics.enable(cannon, Phaser.Physics.ARCADE);

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
  } else if (keys.right.isDown) {
    pig.body.velocity.x += SPEED_DIFF;
  } else if (keys.up.isDown) {
    pig.body.velocity.y -= SPEED_DIFF;
  } else if (keys.down.isDown) {
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


