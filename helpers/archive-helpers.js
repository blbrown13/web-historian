var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var Promise = require('bluebird');
/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function() {
  return new Promise(function(resolve, reject) {
    fs.readFile(exports.paths.list, 'utf8', function (err, data) {
      if (err) { return reject(err); }
      var urlArray = data.split('\n');
      resolve(urlArray);
    });
  });
};

exports.isUrlInList = function(url) {
  return new Promise(function(resolve, reject) {
    exports.readListOfUrls().then(function(urls){
      resolve(urls.includes(url));
    });
  });
};

exports.addUrlToList = function(url) {
  return new Promise(function(resolve, reject) {
    fs.appendFile(exports.paths.list, url, function (err, data) {
      if (err) { return reject(err); }
      resolve();
    });
  });
};

exports.isUrlArchived = function(url) {
   return new Promise(function(resolve, reject) {
    fs.readdir(exports.paths.archivedSites, function(err, files){
      if (err) { return reject(err); }
      var hasUrl = files.includes(url);
      resolve(hasUrl);
    });
  });
};

exports.downloadUrls = function(urls) {
  _.each(urls, function(url){
    exports.isUrlArchived(url).then(function(hasUrl){
      if (!hasUrl) {
        fs.writeFile(`${exports.paths.archivedSites}/${url}`, function(err, files){
          err ? (() => { return err }) : null;
        });
      }
    });
  });
};
