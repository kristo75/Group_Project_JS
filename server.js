const express = require('express');
const app = express();
const path = require('path');
const database = require('mongodb').MongoClient;



database.connect("mongodb://localhost:27017", function(error, client){
  if(error){
    console.log("Error:", error);
  return
  }
  const db = client.db("infernal");
  app.get('/', function(req, res){
    res.sendFile(path.join(__dirname + '/index.html'))
  });
  app.use(express.static('public'));
  const port = process.env.PORT || 3000;

  const server = app.listen(port, function(){
    const port = server.address().port;
    console.log('Example app listening at', port);
  })
  console.log('Client is running');
});
