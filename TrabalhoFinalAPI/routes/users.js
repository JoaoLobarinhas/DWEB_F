var express = require('express');
var router = express.Router();
var passport = require('passport')
var Users = require('../controllers/users')

/* GET users listing. */
router.get('/checkSN/:sn', passport.authenticate('jwt',{session:false}),function(req, res, next) {
  Users.checkSN(req.params.sn)
    .then(dados => res.jsonp(dados))
    .catch(e => res.status(500).jsonp(e))
})

router.get('/checkEmail/:email', passport.authenticate('jwt',{session:false}), function(req, res, next) {
  Users.checkEmail(req.params.email)
    .then(dados =>res.jsonp(dados))
    .catch(e => res.status(500).jsonp(e))
})

router.get('/googleLogin/:email', passport.authenticate('jwt',{session:false}), function(req, res, next){
  Users.loginGoogle(req.params.email)
    .then(dados => res.jsonp(dados))
    .catch(e => res.status(500).jsonp(e))
})

router.get('/login/:email', passport.authenticate('jwt',{session:false}), function(req, res, next) {
  Users.loginUser(req.params.email)
    .then(dados =>res.jsonp(dados))
    .catch(e => res.status(500).jsonp(e))
});

router.get('/checkUser/:email', passport.authenticate('jwt',{session:false}), function(req, res, next) {
  Users.checkUser(req.params.email)
    .then(dados =>res.jsonp(dados))
    .catch(e => res.status(500).jsonp(e))
});

router.get('/:studentNumber', passport.authenticate('jwt',{session:false}), function(req, res, next) {
  Users.getUser(req.params.studentNumber)
    .then(dados =>res.jsonp(dados))
    .catch(e => res.status(500).jsonp(e))
});

router.post('/', passport.authenticate('jwt',{session:false}), function(req, res, next){
  Users.insert(req.body)
    .then(dados => res.jsonp(dados))
    .catch(e => res.status(500).jsonp(e))
})


module.exports = router;
