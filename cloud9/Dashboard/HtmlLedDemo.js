//Loading modules
var http = require('http');
var fs = require('fs');
var path = require('path');
var b = require('bonescript');

// Initialize the server on port 8888
var server = http.createServer(function (req, res) 
{
    // requesting files
    var file = '.'+((req.url=='/')?'/robot.html':req.url);
    var fileExtension = path.extname(file);
    var contentType = 'text/html';
    if(fileExtension == '.css')
    {
        contentType = 'text/css';
    }
    fs.exists(file, function(exists)
    {
        if(exists)
        {
            fs.readFile(file, function(error, content)
            {
                if(!error)
                {
                    // Page found, write content
                    res.writeHead(200,{'content-type':contentType});
                    res.end(content);
                }
            })
        }
        else
        {
            // Page not found
            res.writeHead(404);
            res.end('Page not found');
        }
    })
}).listen(9000);  //change from 8888

// Loading socket io module
var io = require('socket.io').listen(server);
var forward = false;
var Forw = false;
var enable1Pin = "P9_14";
var Rev = false;
var Left = false;
var Right = false;
var enable2Pin = "P9_42";
var ledYellow  = "P9_16";
var motor1Pin1 = "P9_12";
var motor1Pin2 = "P9_18";
var motor2Pin1 = "P9_15";
var motor2Pin2 = "P9_17";
var lights = "P9_11";
var auger = "P9_13";
var ledGreen = "P9_41";
var STOP = false;
var timer1 = 9000;
//var demoMode = false;
//var demoStep = 0;
//var demoCount = 0;
//var ledDir = 0;
//var ledBright = 0; 


// configure pins and set all low
//b.pinMode(Forw, b.OUTPUT);
//b.pinMode(Rev, b.OUTPUT);
b.pinMode(ledYellow, b.OUTPUT);
//b.analogWrite(Forw,1);
b.analogWrite(ledYellow,1);
//b.analogWrite(Rev,1);


b.pinMode(enable1Pin, b.OUTPUT);
b.pinMode(enable2Pin, b.OUTPUT);
b.pinMode(motor1Pin1, b.OUTPUT);
b.pinMode(motor1Pin2, b.OUTPUT);
b.pinMode(motor2Pin1, b.OUTPUT);
b.pinMode(motor2Pin2, b.OUTPUT);
b.pinMode(lights, b.OUTPUT);
b.pinMode(auger, b.OUTPUT);
b.pinMode(ledGreen, b.OUTPUT);

b.analogWrite(enable1Pin,0);
b.analogWrite(enable2Pin,0);
b.digitalWrite(motor1Pin1,0);
b.digitalWrite(motor1Pin2,0);
b.digitalWrite(motor2Pin1,0);
b.digitalWrite(motor2Pin2,0);
b.digitalWrite(lights,1);
b.digitalWrite(auger,0);


function handler (req, res) {
  if (req.url == "/favicon.ico"){   // handle requests for favico.ico
  res.writeHead(200, {'Content-Type': 'image/x-icon'} );
  res.end();
  console.log('favicon requested');
  return;
  }
  fs.readFile('robot.html',    // load html file
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading robot.html');
    }
    res.writeHead(200);
    res.end(data);
  });
}
 
io.sockets.on('connection', function (socket) {
  // listen to sockets and write analog values to LED's
  socket.on('Forw', function (data) {
       b.analogWrite(enable1Pin,1-(data/100));
       b.analogWrite(enable2Pin,1-(data/100));
       b.digitalWrite(motor1Pin1,1);
       b.digitalWrite(motor1Pin2,0);
       b.digitalWrite(motor2Pin1,1);
       b.digitalWrite(motor2Pin2,0);
       console.log('Forward: ' + data);
 /* if (data == '2'){
    Forw == true;
    console.log('ForwardTrue: ' + data);
    DriveF();
      console.log('ForwardDrive: ' + data);
   }*/
    /*else if (data == 'STOP'){
     Forw == false;
     enable1Pin = 0;
     enable2Pin = 0;
   }*/ 
   });
  
  socket.on('Rev', function (data) {
       b.analogWrite(enable1Pin,1-(data/100));
       b.analogWrite(enable2Pin,1-(data/100));
       b.digitalWrite(motor1Pin1,0);
       b.digitalWrite(motor1Pin2,1);
       b.digitalWrite(motor2Pin1,0);
       b.digitalWrite(motor2Pin2,1);
     console.log('Reverse: ' + data);
  });
  
    socket.on('Left', function (data) {
       b.analogWrite(enable1Pin,1-(data/100));
       b.analogWrite(enable2Pin,1-(data/100));
       b.digitalWrite(motor1Pin1,0);
       b.digitalWrite(motor1Pin2,1);
       b.digitalWrite(motor2Pin1,1);
       b.digitalWrite(motor2Pin2,0);
     console.log('Left: ' + data);
     setTimeout(stopturn,1000);
        //stopturn();
     //stopturn();
     
  });
  
    socket.on('Right', function (data) {
       b.analogWrite(enable1Pin,1-(data/100));
       b.analogWrite(enable2Pin,1-(data/100));
       b.digitalWrite(motor1Pin1,1);
       b.digitalWrite(motor1Pin2,0);
       b.digitalWrite(motor2Pin1,0);
       b.digitalWrite(motor2Pin2,1);
     console.log('Right: ' + data);
    setTimeout(stopturn,1000);
  });
  
    socket.on('STOP', function (data) {
       b.analogWrite(enable1Pin,1-(data/100));
       b.analogWrite(enable2Pin,1-(data/100));
       b.digitalWrite(motor1Pin1,0);
       b.digitalWrite(motor1Pin2,0);
       b.digitalWrite(motor2Pin1,0);
       b.digitalWrite(motor2Pin2,0);
       b.digitalWrite(auger,0);
      console.log('Stop: ' + data);
  });
  
  socket.on('ledYellow', function (data) {
    b.analogWrite(ledYellow, 1-(data/100));
   console.log('Yellow: ' + data);
  });



//lights
  socket.on('lights', function (data) {
    //if (data == 'on'){
    b.digitalWrite(lights, data);
    //  }
  //  else if (data =='off'){
 //   b.digitalWrite(lights, 100);
 //   }
   console.log('Lights: ' + data);
  });
  
//auger
  socket.on('auger', function (data) {
    //if (data == 'on'){
    b.digitalWrite(auger, data);
    //  }
  //  else if (data =='off'){
 //   b.digitalWrite(lights, 100);
 //   }
   console.log('Auger: ' + data);
  });
});

function led(Yellow){
//  b.analogWrite(Forw, Forward);
  b.analogWrite(ledYellow, Yellow);
  //b.digitalWrite(lights,0);
  //b.analogWrite(Rev, Reverse);  
}

/*function lights(On, Off){
    b.digitalWrite(lights, 1);
  
}*/
function stopturn(Right,Left){
     //setInterval(stopturn,timer1);
    b.analogWrite(enable1Pin,0);
    b.analogWrite(enable2Pin,0);
    b.digitalWrite(motor1Pin1,0);
    b.digitalWrite(motor1Pin2,0);
    b.digitalWrite(motor2Pin1,0);
    b.digitalWrite(motor2Pin2,0);
   
    
}

//drive forward
function DriveF(){
  if (forward === 2) {
  b.analogWrite(enable1Pin,175);
  b.analogWrite(enable2Pin,175);
  b.digitalWrite(motor1Pin1,1);
  b.digitalWrite(motor2Pin1,1);
  b.digitalWrite(motor1Pin2,0);
  b.digitalWrite(motor2Pin2,0);
  }
  console.log('DriveF: ' );
}

// Get server IP address on LAN
function getIPAddress() {
  var interfaces = require('os').networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];
    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
        return alias.address;
    }
  }
  return '0.0.0.0';
}
// Displaying a console message for user feedback
server.listen(console.log("Server Running ...")); 

//