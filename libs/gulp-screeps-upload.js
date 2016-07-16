'use strict';

let _ = require("lodash");
let deepEqual = require("deep-equal");
let gulpCollect = require("gulp-collect");
let https = require('https');
let path = require('path');
let Q = require("q");

module.exports = function(email, password, branch) {
  return gulpCollect.list((fileVinyls, cb) => {
    let cbd = Q.defer();
    _gulpUploadVinylsAsModules(fileVinyls, cbd.makeNodeResolver(), email, password, branch);
    return cbd.promise;
  });
}

var __lastUploaded = null;
function _gulpUploadVinylsAsModules(fileVinyls, cb, email, password, branch) {
  let modules = {}
  for (let fileVinyl of fileVinyls) {
    let moduleName = path.basename(fileVinyl.path);
    modules[moduleName] = fileVinyl.contents.toString("utf-8");
  }
  console.log(`Modules: ${_.keys(modules).join(", ")}`);
  let data = { branch: branch, modules: modules };
  if (deepEqual(__lastUploaded, data)) {
    //console.log("Skipping upload due to equal outputs.");
    return cb(null, {});
  }
  __lastUploaded = data;

  console.log("Uploading...");
  let req = https.request({
    hostname: "screeps.com",
    port: 443,
    path: "/api/user/code",
    method: "POST",
    auth: `${email}:${password}`,
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }, res => {
    console.log(`Response: ${res.statusCode}`);
    cb(null, {});
  });

  req.end(JSON.stringify(data));
}
