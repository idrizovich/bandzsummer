const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const MongoClient = require('mongodb').MongoClient;
const jwt_secret = 'WU5CjF8fHxG40S2t7oyk';
var mongojs = require('mongojs')
var db = mongojs('localhost:27017/Bandz', ['events'])

var jwt = require('jsonwebtoken');
var MongoId = require('mongodb').ObjectID;

app.use(express.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/', express.static('files'));

app.use('/rest/v1/', function (request, response, next) {
  jwt.verify(request.get('JWT'), jwt_secret, function (error, decoded) {
    if (error) {
      response.status(401).send('Unauthorized access');
    } else {
      db.collection("users").findOne({ '_id': new MongoId(decoded._id) }, function (error, user) {
        if (error) {
          throw error;
        } else {
          if (user) {
            next();
          } else {
            response.status(401).send('Credentials are wrong.');
          }
        }
      });
    }
  });
})

app.post('/login', function (request, response) {
  var user = request.body;

  db.collection("users").findOne({ 'email': user.email, 'password': user.password }, function (error, user) {
    if (error) {
      throw error;
    } else {
      if (user) {
        var token = jwt.sign(user, jwt_secret, {
          expiresIn: 20000
        });

        response.send({
          success: true,
          message: 'Authenticated',
          token: token
        })
      } else {
        response.send({
          success: false,
          message: null,
          token: null
        })
      }
    }
  });
});

app.post('/register/user', function (request, response) {
  var user_data = request.body;
  db.collection("users").findOne({ 'email': user_data.email }, function (error, user) {
    if (error) {
      throw error;
    } else {
      if (user) {
        response.send(false)
      } else {
        db.collection('users').save(user_data, (err, result) => {
          if (err) return console.log(err);
          response.send(true);
        })
      }
    }
  });
});

app.post('/register/band', function (request, response) {
  var user_data = request.body;
  db.collection("bands").findOne({ 'email': user_data.email }, function (error, user) {
    if (error) {
      throw error;
    } else {
      if (user) {
        response.send(false)
      } else {
        db.collection('bands').save(user_data, (err, result) => {
          if (err) return console.log(err);
          response.send(true);
        })
      }
    }
  });
});

app.post('/event', function (request, response) {
  var event = request.body
  db.collection('events').insert(event, function(err, result) {
    if (err) return console.log(err);
    response.setHeader('Content-Type', 'application/json');
    response.send(event);
  })
})

app.get('/events', function (req, res) {
  db.collection('events').find().toArray((err, event) => {
    if (err) return console.log(err);
    res.setHeader('Content-Type', 'application/json');
    res.send(event);
  })
});

app.delete('/events/:event_id', function(req, res){
  db.collection('events').remove({_id: new MongoId(req.params.event_id)},
  function(err, data){
      res.json(data);
  });
});

app.put('/events', function(req, res){
  event = req.body;
  db.collection('events').findOneAndUpdate( {_id: new MongoId(event._id) }, {
    $set : {eventBandName: req.body.eventBandName,
      eventTime: req.body.eventTime,
      eventLocalName: req.body.eventLocalName,
      eventLocalInfo: req.body.eventLocalInfo}
  }, (err, result) => {
    if (err) return res.send(err);
    res.send('OK');
  })
});

/* 
app.put('/events/:events_id', function(req, res){    
  db.collection('events').findAndModify(
     {_id: new MongoId(req.params.event_id)}, // query
     [['_id','asc']],  // sort order
     {$set : {eventBandName: req.body.eventBandName,
      eventTime: req.body.eventTime,
      eventLocalName: req.body.eventLocalName,
      eventLocalInfo: req.body.eventLocalInfo}}, // replacement, replaces only the field "hi"
     function(err, data) {
         if (err){
             console.warn(err.message);  // returns error if no matching object found
         }else{
             res.json(data);
         }
     });
}); */



  MongoClient.connect('mongodb://localhost:27017/Bandz', (err, database) => {
  if (err) return console.log(err)
  db = database;
  app.listen(3000, () => console.log('Example app listening on port 3000!'))
})