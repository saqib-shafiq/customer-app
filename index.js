/**
 * Created by saqib on 10/3/2017.
 */

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');
var ObjectId = mongojs.ObjectId;
var mongodb = require('mongodb');

var db = mongojs('customerapp', ['users']);

var app = express();

// view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


//connect to database
var MongoClient = mongodb.MongoClient;
//var url = 'mongodb://localhost:27017/customerapp';
var url = 'mongodb://saqib:cappLrnMEAN@ds113775.mlab.com:13775/customerapp';

// Use connect method to connect to the Server
MongoClient.connect(url, function (err, db) {
    if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
        //console.log('Connection established to', url);
        //console.log(db.hostname);

        // do some work here with the database.
        //Close connection
        //db.close();
    }
});


// body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res){
    db.users.find(function(err, docs){
        res.render('index', {
            title: 'Customer Express App',
            users: docs
        });
    });
});

// set static path
app.use(express.static(path.join(__dirname, 'public')));

// Global variables
app.use(function(req, res, next){
    res.locals.errors = null;
    next();
});

// form submission to add user
app.post('/users/add', function(req, res){
    var newUser = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email
    }
    db.users.insert(newUser, function(err, result){
        if(err){
            console.log(err);
        }
        res.redirect('/');
    });
});

app.delete('/users/delete/:id', function(req, res){
    var id = req.params.id;
    db.users.remove({_id: ObjectId(id)}, function(err,result) {
        if (err) {
            console.log(err);
        }else{
            res.redirect('/');
        }
    });
});

app.delete('/users/delete/:id', function(req, res){
    var id = req.params.id;
    db.users.remove({_id: ObjectId(id)}, function(err,result) {
        if (err) {
            console.log(err);
        }else{
            res.redirect('/');
        }
    });
});

app.listen(3200, function(){
    console.log('Server running on port: 3200....');
});
