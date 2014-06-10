
var intro = require('./intro');

var $body = $('body');

intro(function() {
  postIntro();
});

function postIntro() {
  $body.html('more soon');
}
