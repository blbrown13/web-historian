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
    console.log(req.url);
     archive.addUrlToList(req.url);
  }
};

// var request = {method: 'GET', url: '/'};
// handleRequest(request)
// } else if (hasUrl) {
//   http.serveAssets(res, `${archive.paths.archivedSites}/${req.url}`, function(data){
//     res.writeHead(200, http.headers);
//     res.end(data);
//   });
// } else {
//   // 404
//   res.writeHead(404, http.headers);
//   res.end();
// }
