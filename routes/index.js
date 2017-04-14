
var express = require('express');
var passport = require('passport');
var router = express.Router();
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
var request = require('request');


var env = {
  AUTH0_CLIENT_ID:process.env.AUTH0_CLIENT_ID,
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
  AUTH0_CALLBACK_URL:'http://localhost:3000/callback'
};

router.get('/',function(req,res,next){
  res.render('index',{env:env});
});

router.get('/login',function(req,res){
  res.render('login',{env:env});
});

router.get('/logout',function(req,res){
  req.logout();
  res.redirect('/')
});

router.get('/polls',ensureLoggedIn,function(req,res){
  request('http://elections.huffingtonpost.com/pollster/api/charts.json?topic=2016-president',function(error,response,body){
    if(!error && response.statusCode == 200){
      var polls = JSON.parse(body);
      res.render('polls',{env:env,user:req.user,polls:polls})
    }else{
      console.log("in error, router.get('/polls'>>", err);
      res.render('error');
    }
  })
})

router.get('/user', ensureLoggedIn,function(req,res){
  res.render('user',{env:env,user:req.user});
});

router.get('/callback',
    passport.authenticate('auth0',{failureRedirect:'/'}),
    function(req,res){
      console.log(">>>router.get('/callback'");//todo
      res.redirect(req.session.returnTo || '/polls');
    }
);

module.exports = router;
