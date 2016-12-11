//drop in autorun folder to call on js
//Loading modules
var http = require('http');
var fs = require('fs');
var path = require('path');
var b = require('bonescript');
var io = require('socket.io');//.listen(server);
var HtmlLedDemo = require('/var/lib/cloud9/HtmlLedDemo.js');
var Robot = require('var/lib/cloud9/robot.html');