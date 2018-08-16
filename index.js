const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const MongoClient = require('mongodb').MongoClient;
const jwt_secret = 'dinchetovjwtsecretjenajboljijwtsecretnasvijetu0110';

var mongojs = require('mongojs')
var jwt = require('jsonwebtoken');
var db = mongojs('localhost:27017/Bandz', ['events'])
var MongoId = require('mongodb').ObjectID;

app.use(express.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use('/', express.static('files'));

app.use('/rest/v1/', function (request, response, next) {
  var jwt_mine = request.get('JWT');
  jwt.verify(jwt_mine, jwt_secret, function (error, decoded) {
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

app.post('/login/user', function (request, response) {
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
          token: token,
          type: 'user'
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

app.post('/login/band', function (request, response) {
  var user = request.body;

  db.collection("bands").findOne({ 'email': user.email, 'password': user.password }, function (error, user) {
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
          token: token,
          type: 'band'
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

app.post('/rest/v1/event', function (request, response) {
  var event = request.body
  db.collection('events').insert(event, function (err, result) {
    if (err) return console.log(err);
    response.setHeader('Content-Type', 'application/json');
    response.send(event);
  })
})

app.get('/rest/v1/events', function (req, res) {
  db.collection('events').find().toArray((err, event) => {
    if (err) return console.log(err);
    res.setHeader('Content-Type', 'application/json');
    res.send(event);
  })
});

app.get('/events/:event_id', function (req, res) {
  db.collection('events').findOne({ _id: new MongoId(req.params.event_id) }, (err, event) => {
    if (err) return console.log(err);
    res.setHeader('Content-Type', 'application/json');
    res.send(event);
  })
});

app.delete('/events/:event_id', function (req, res) {
  db.collection('events').remove({ _id: new MongoId(req.params.event_id) },
    function (err, data) {
      res.json(data);
    });
});

app.put('/events', function (req, res) {
  event = req.body;
  db.collection('events').findOneAndUpdate({ _id: new MongoId(event._id) }, {
    $set: {
      eventBandName: req.body.eventBandName,
      eventTime: req.body.eventTime,
      eventLocalName: req.body.eventLocalName,
      eventLocalInfo: req.body.eventLocalInfo
    }
  }, (err, result) => {
    if (err) return res.send(err);
    res.send('OK');
  })
});

MongoClient.connect('mongodb://localhost:27017/Bandz', (err, database) => {
  if (err) return console.log(err)
  db = database;
  app.listen(3000, () => console.log('Example app listening on port 3000!'))
})