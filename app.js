/**
 * Created by saqib on 10/3/2017.
 */

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');
var ObjectId = mongojs.ObjectId;

var db = mongojs('customerapp', ['users']);

var app = express();

//middleware
/*var logger = function(req, res, next){
    console.log("logging");
    next();
}
app.use(logger);*/

// view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

/*var usersobj = [
    {
        id: 1,
        first_name: 'Arslan ',
        last_name: 'Hameed',
        email: 'ahameed@abc.com'
    },
    {
        id: 2,
        first_name: 'Bilal ',
        last_name: 'Murtaza',
        email: 'billikabilla@aashqi.com'
    },
    {
        id: 3,
        first_name: 'Taimoor ',
        last_name: 'Khan',
        email: 'sonu@sjkatharki.com'
    }
];*/

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

// ExpressValidator middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value){
        var namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root;
        while(namespace.length){
            formParam + '['+namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));

// form submission to add user
app.post('/users/add', function(req, res){

    req.checkBody('first_name', 'First name is required').notEmpty();
    req.checkBody('last_name', 'Last name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();

    errors =  req.validationErrors();
    if(errors){
        res.render('index', {
            title: 'Customer Express App',
            users: usersobj,
            errers: errors
        });
    }else{
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
    }
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
