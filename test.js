var
assert	= require('assert'),
file	= require('fs').readFileSync,
jQuery	= require('jquery').create();

//
eval(file('./path/to/file.js', 'utf8'));

console.log(Flickerer);