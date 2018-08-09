var express = require('express')
var app = express()

var mongojs = require('mongojs');
// mongojs('username:pas@example.com/mydb', ['mycollection'])
var db = mongojs ('localhost:27017/badz', ['Bands'])

var body_parser = require('body-parser');
app.use(body_parser.json());



app.use(express.static('static'))

app.get('/badz', function(req, res){
    db.Bands.find(function(err, docs) {
        res.json(docs);
    })
});

app.post('/badz', function(req, res) {
    var Bands = req.body;
    Bands._id = null;
    db.Bands.insert(Bands, function(err, doc) {
        res.json(doc);
    });
});


app.listen(3000, () => console.log('Example app listening on port 3000!'))

