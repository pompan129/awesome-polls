
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var dotenv = require('dotenv');

//load env variables
dotenv.load();

var routes = require('./routes/index');

var app = express();

app.set('views',path.join(__dirname, 'views'));
app.set('view engine','jade');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret:'shhhhhhhhh',
  resave:true,
  saveUninitialized:true
}));

app.use(express.static(path.join(__dirname,'public')));

app.use('/',routes);

app.use(function(req,res,next){
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err,req,res,next){
  res.status(err.status || 500);
  //res.send(err);
  res.render('error',{
    message:err.message,
    error:err
  })
});
app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'),function(){
  console.log('Node app is running on port', app.get('port'));
});
