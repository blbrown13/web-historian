var path = require('path');
var archive = require('../helpers/archive-helpers');
var http = require('./http-helpers');
var fs = require('fs');
// require more modules/folders here!

exports.handleRequest = function (req, res) {

  var hasUrl = archive.isUrlArchived(req.url);

  if (req.method === 'GET') {
    if (req.url === '/') {
      http.serveAssets(res, archive.paths.siteAssets + '/index.html', function(data){
        res.writeHead(200, http.headers);
        res.end(data);
      });
    } else if (archive.isUrlArchived(req.url)) {
      http.serveAssets(res, `${archive.paths.archivedSites}/${req.url}`, function(data){
        res.writeHead(200, http.headers);
        res.end(data);
      });
    } else {
      // 404
      res.writeHead(404, http.headers);
      res.end();
    }

    //res.end(output);
    // serveAssets gets HTML
    // return that html into response.end(html)
    //response.wrtieHead(200, http.headers)
  } else {
    // 404
    res.writeHead(404, http.headers);
    res.end();
  }

  //res.end(archive.paths.list);
};

// var request = {method: 'GET', url: '/'};
// handleRequest(request)
