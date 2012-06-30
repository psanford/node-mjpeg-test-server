var express = require('express');
var fs = require('fs');

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
  response.send('This page has an mjpeg embedded in it:<br/><img src=count.mjpeg><br/>But if you open the <a href=count.mjpeg>image directly it does not animate</a> (in Chrome 20).');
});

app.get('/count.mjpeg', function(request, res) {
  res.writeHead(200, {
    'Content-Type': 'multipart/x-mixed-replace; boundary=myboundary',
    'Cache-Control': 'no-cache',
    'Connection': 'close',
    'Pragma': 'no-cache'
  });

  var i = 0;
  var send_next = function() {
    i = (i+1) % 100;
    console.log("send ", i);
    var filename = i + ".jpg";
    fs.readFile(__dirname + '/resources/' + filename, function (err, content) {
      res.write("--myboundary\r\n");
      res.write("Content-Type: image/jpeg\r\n");
      res.write("Content-Length: " + content.length + "\r\n");
      res.write("\r\n");
      res.write(content, 'binary');
      res.write("\r\n");
      setTimeout(send_next, 500);
    });
  };
  send_next();
});


var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
