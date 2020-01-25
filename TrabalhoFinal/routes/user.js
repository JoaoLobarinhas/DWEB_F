var express = require('express');
var router = express.Router();
var axios = require('axios');
var passport = require('passport')
var lhost = require('../config/env').host
var thisHost = require('../config/env').host

router.get('/:id', verificaAutenticacao,function(req, res, next) {
    axios.get(lhost+"/users/"+req.params.id)
      .then(data =>res.render('home',{data:data.data}))
      .catch(e => res.status(500).jsonp(e))
});

function verificaAutenticacao(req,res,next){
    if(req.isAuthenticated()){
      next();
    } else{
      res.redirect(thisHost+"/home");}
}

module.exports = router;