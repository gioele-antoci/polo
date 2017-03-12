
const _window: any = window;
declare var require: any;

_window.PIXI = require('phaser/build/custom/pixi')
_window.p2 = require('phaser/build/custom/p2')
_window.Phaser = require('phaser/build/custom/phaser-split')

console.log(Phaser);