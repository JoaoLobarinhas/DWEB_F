var express = require('express');
var router = express.Router();
var passport = require('passport');
var Public = require('../controllers/publications');

router.get('/:studentNumber', passport.authenticate('jwt',{session:false}), function(req, res, next){
    Public.getPublicationOfUser(req.params.studentNumber)
      .then(dados => res.jsonp(dados))
      .catch(e => res.status(500).jsonp(e))
})


router.post('/', passport.authenticate('jwt',{session:false}), function(req, res, next){
    Notifi.addNotification(req.body)
      .then(dados => res.jsonp(dados))
      .catch(e => res.status(500).jsonp(e))
})


module.exports = router;