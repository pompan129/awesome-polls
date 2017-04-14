
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var dotenv = require('dotenv');
var passport = require('passport');
var Auth0strategy = require('passport-auth0')

//load env variables
dotenv.load();

var routes = require('./routes/index');

var strategy = new Auth0strategy({
  domain: process.env.AUTH0_DOMAIN,
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/callback'
},function(accessToken,refreshToken,extraParams,profile,done){
  // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null,profile);
});

passport.use(strategy);

passport.serializeUser(function(user,done){
  done(null,user)
});

passport.deserializeUser(function(user,done){
  done(null,user);
})

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

app.use(passport.initialize());
app.use(passport.session());

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
