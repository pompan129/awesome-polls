
var express = require('express');
var router = express.Router();


router.get('/',function(req,res,next){
  res.send('you are at the homepage');
});

router.get('/login',function(req,res){
  res.send('you are at the login page');
});

router.get('/logout',function(req,res){
  res.send('you are at the logout page');
});

router.get('/polls',function(req,res){
  res.send('you are at the polls page');
})

router.get('/user', function(req,res){
  res.send('you are on the user page');
});

module.exports = router;
