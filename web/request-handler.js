var path = require('path');
var archive = require('../helpers/archive-helpers');
var http = require('./http-helpers');
var fs = require('fs');
var Promise = require('bluebird');
// require more modules/folders here!

exports.handleRequest = function (req, res) {

  if (req.method === 'GET') {
    if (req.url === '/') {
      http.serveAssets(res, archive.paths.siteAssets + '/index.html', function(data)  {
        res.writeHead(200, http.headers);
        res.end(data);
      });
    } else {
      var url = req.url.split("").splice(1).join("");
      archive.isUrlArchived(url).then(function(hasUrl){
        if (hasUrl) {
          http.serveAssets(res, `${archive.paths.archivedSites+req.url}`, function(data){
            res.writeHead(200, http.headers);
            res.end(data);
          });
        } else {
          res.writeHead(404, http.headers);
          res.end();
        }
      });
    }
  } else if (req.method === 'POST') {
    res.writeHead(302, http.headers);
    req.on('data', function(chunk){
      chunk = JSON.parse(chunk);
      data = chunk.concat('\n');
      fs.appendFile(archive.paths.list, data);
    });
    req.on('end', function(){
      res.end(fs.readFile(archive.paths.list, 'utf8'));
    });
  } else {
    res.writeHead(404, http.headers);
    res.end();
  }
};
