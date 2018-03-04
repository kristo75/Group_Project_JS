const express = require('express');
const app = express();
const path = require('path');

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname + '/index.html'))
});

app.use(express.static('public'));

const port = process.env.PORT || 3000;

const server = app.listen(port, function(){
  const port = server.address().port;
  console.log('Example app listening at', port);
})
