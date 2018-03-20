const express = require('express');
const app = express();
const path = require('path');
const database = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const ObjectID = require('mongodb').ObjectID;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
const databaseUrl = process.env.MONGODB_URI || "mongodb://localhost:27017"
console.log(databaseUrl)
database.connect(databaseUrl, function(error, client){
  if(error){
    console.log("Error:", error);
  return
  }
  console.log(client)
  const db = client.db("heroku_rgv75lk1");

  app.get('/', function(req, res){
    res.sendFile(path.join(__dirname + '/index.html'))
  });

  app.get('/db', function(req, res){
    const userPOIs = db.collection('visitedPois');
    userPOIs.find({}).toArray(function(err, result){
      if (err) {
        console.log(err);
        res.status(500);
        res.send();
      }
      res.json(result);
    })
  })

  app.post('/', function(req, res){
    const visitedPoisCollection = db.collection('visitedPois');



    const visitedPoisToSave = req.body;
    // console.log(req.body.id.substring(4));
    // const objectID = new ObjectID(req.body.id.substring(4));

// {_id: objectID, value: visitedPoisToSave}
    visitedPoisCollection.save(visitedPoisToSave, function(error, result){
      if(error){
        console.log("Error:", error);
        res.status(500);
        res.send();
      }
      res.status(201);
      res.json(result.ops[0]);
      console.log('saved to database');
    });
  })

  app.get('/db/:id', function(req, res){
    const userPOIs = db.collection('infernal');
    //const visitedPoisToGet = req.body;
    console.log("ID", req.params.id);
    const objectID = new ObjectID(req.params.id);
    const filterObject = {_id: objectID};
    userPOIs.find(filterObject).toArray(function(error, poi){
      if(error){
        console.log("error", error);
        res.status(500);
        res.send();
      }
      res.json(poi);
    });
  })

  app.use(express.static('public'));
  const port = process.env.PORT || 3000;
  const server = app.listen(port, function(){
    const port = server.address().port;
    console.log('Example app listening at', port);
  })
  console.log('Client is running');
});
