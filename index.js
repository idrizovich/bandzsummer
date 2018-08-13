const express = require('express');
const bodyparser = require("body-parser");
const app = express();
const MongoClient = require('mongodb').MongoClient;
const jwt_secret = 'WU5CjF8fHxG40S2t7oyk';
var mongojs = require('mongojs')
var db = mongojs('localhost:27017/Bandz', ['events'])

var jwt = require('jsonwebtoken');
var MongoId = require('mongodb').ObjectID;
var db;

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

var urlencodedParser = bodyparser.urlencoded({
  extended: false
})

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

app.post('/event', urlencodedParser, function (request, response, next) {
  console.log(request.body)

  db.collection('events').save(request.body, (err, result) => {
    if (err) return console.log(err);
    response.send(true);
  })
})

MongoClient.connect('mongodb://localhost:27017/Bandz', (err, database) => {
  if (err) return console.log(err)
  db = database;
  app.listen(3000, () => console.log('Example app listening on port 3000!'))
})