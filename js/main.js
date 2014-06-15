
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
