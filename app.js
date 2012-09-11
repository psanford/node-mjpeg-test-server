var express = require('express');
var fs = require('fs');

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
  response.send('This page has an mjpeg embedded in it:<br/><img src=count.mjpeg><br/> Click here to <a href=count.mjpeg>view the image by itself</a>. <p><b>Update:</b> This page was created to demo a bug in Chrome 20/21 where an mpjeg stream viewed directly did not animate (<a href=http://crbug.com/135337>chrome bug 135337</a>). The issue has been fixed in versions >= 22. I\'ll leave this page up for anyone else trying to test mjpeg functionality.</p>');
});

app.get('/count.mjpeg', function(request, res) {
  res.writeHead(200, {
    'Content-Type': 'multipart/x-mixed-replace; boundary=myboundary',
    'Cache-Control': 'no-cache',
    'Connection': 'close',
    'Pragma': 'no-cache'
  });

  var i = 0;
  var stop = false;

  res.connection.on('close', function() { stop = true; });

  var send_next = function() {
    if (stop)
      return;
    i = (i+1) % 100;
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
