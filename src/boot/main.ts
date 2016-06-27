/**
 * Application bootstrap.
 * BEFORE CHANGING THIS FILE, make sure you read this:
 * http://support.screeps.com/hc/en-us/articles/204825672-New-main-loop-architecture
 *
 * Write your code to GameManager class in ./src/gameManager.ts
 */

import { GameManager } from './../gameManager';

declare var module: any;

/*
 * Singleton object. Since GameManager doesn't need multiple instances we can use it as singleton object.
 */
GameManager.globalBootstrap();

// This doesn't look really nice, but Screeps' system expects this method in main.js to run the application.
// If we have this line, we can make sure that globals bootstrap and game loop work.
// http://support.screeps.com/hc/en-us/articles/204825672-New-main-loop-architecture
module.exports.loop = function () {
  GameManager.loop();
};
