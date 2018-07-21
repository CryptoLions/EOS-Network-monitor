/* ###############################################################################
#
# EOS TestNet Monitor
#
# Created by http://CryptoLions.io
#
# Git Hub: https://github.com/CryptoLions/EOS-Testnet-monitor
#
############################################################################### */

var mongo = require('mongodb');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoClient = require('mongodb').MongoClient;
var fs = require('fs');
var STATS = {};
var isLoaded = false;
var CONFIG = require('./config.js');
var bc_parser = require('./bc_parser')

app.use('/', express.static(__dirname + '/html'));

mongoClient.connect(CONFIG.mongoURL, function(err, db) {

  console.log("Database Connected!");
  var dbo = db.db(CONFIG.mongoDB);

  app.get('/', function(req, res) {
    res.sendFile('index.html');
  });

  app.get('/hook', function(req, res) {
    console.log(req);
    res.json({});

  });

  app.get('/:blockid', function(req, res) {
    //blockid = req.params.blockid
    //res.sendFile('index.html');
  });

  bc_parser.init({
    io,
    db,
    dbo,
    CONFIG
  });

  var th = this;
  io.on('connection', function(socket) {
    bc_parser.connected(socket);

    socket.on('disconnect', function() {
      console.log('user disconnected');
      bc_parser.disconnected(socket);
    });

    socket.on('refresh', function() {
      //reinit Data from DB and send to user
      bc_parser.reinit();
    });

    socket.on('reload', function() {
      //Refresh users page for new update
      io.emit('reload', "1");
    });

    socket.on('api', function(msg) {
      //Refresh userss page for new update
      bc_parser.APIrequest(msg, socket);
    });

  });
});

http.listen(CONFIG.eos_monitor_port, function() {
  console.log('listening on *:' + CONFIG.eos_monitor_port);
});
