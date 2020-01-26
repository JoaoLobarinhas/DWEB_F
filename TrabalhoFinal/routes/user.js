var express = require('express');
var router = express.Router();
var axios = require('axios');
var passport = require('passport')
var lhost = require('../config/env').host
var thisHost = require('../config/env').host

router.get('/', verificaAutenticacao,function(req, res, next) {
  res.render('profile')
});

router.get('/:sn', verificaAutenticacao, function(req, res, next) {
    axios.get(lhost+"/users/getUserProfile/"+req.params.sn)
      .then(dados =>{
        const datas = dados.data[0]
        res.render('profile',{data:datas})})
      .catch(e => res.status(500).jsonp(e))
});

function verificaAutenticacao(req,res,next){
    if(req.isAuthenticated()){
      next();
    } else{
      res.redirect(thisHost+"/home");}
}

module.exports = router;