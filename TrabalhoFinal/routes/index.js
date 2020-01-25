var express = require('express');
var router = express.Router();
var passport = require('passport')
const fs = require('fs')
var dateFormat = require('dateformat');
var lhost = require('../config/env').host
var bcrypt = require('bcryptjs')
var axios = require('axios')
var multer = require('multer')
var upload = multer({dest:'uploads/'})

/* GET home page. */
router.get('/', verificaAutenticacao, function(req, res, next) {
  axios.get(lhost+"/users/checkUser/"+req.user.email)
    .then(dados =>{
        const data = dados.data
        console.log(data)
        if(data.studentNumber){ res.render('index',{data:data})}
        else{
          //res.render('index',{data:data})
          res.render('register',{data:data})
        }
      })
    .catch(e => res.status(500).jsonp(e))
});

router.get('/auth/google',
  passport.authenticate('google', { scope: ['email profile'] }));

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/home' }),
  function(req, res) {
    res.redirect('/');
  });

router.get('/home', verificaAutenticacaoHome ,function(req, res, next) {
  if(req.query.failedLogin){
    res.render('home',{failed:true});
  }
  else{
    res.render('home');
  }
});

router.get('/logout',verificaAutenticacao,function(req, res, next) {
  req.logout()
  res.redirect('/home')
})

router.post('/home', passport.authenticate('local', 
{ successRedirect: '/',
  failureRedirect: '/home?failedLogin=true',
})
);

router.get('/register',function(req, res, next) {
  res.render('register');
})

router.post('/register', upload.fields([{name:'pictureProfile', maxCount: 1},{name:'pictureHeader', maxCount: 1}]), function(req, res, next){
  aux = req.body
  auxf = req.files
  if( aux.email != "" && aux.firstName != "" && aux.lastName != "" && aux.studentNumber != "" && aux.firstName != ""
  && auxf["pictureProfile"][0].path != "" && auxf["pictureHeader"][0].path != "" && aux.year != "" && aux.yearOfInscription != ""){
    if(checkPwd(aux.password)){
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      _aux = re.test(aux.email)
      if(_aux){
        axios.get("http://localhost:3001/aux/checkEmail/"+aux.email)
          .then(data=>{
            if(data.data == true){
              res.render('register',{error:true});
            }
            else{
              axios.get("http://localhost:3001/aux/checkSN/"+aux.studentNumber)
                .then(data=>{
                  if(data.data == true){
                    res.render('register',{error:true});
                  }
                  else{
                    var today = new Date()
                    today = dateFormat(today, 'dd-mm-yyyy HH:MM:ss')
                    var hash = bcrypt.hashSync(aux.password, 10);
                    var profilePic = fs.readFileSync(auxf["pictureProfile"][0].path)
                    var headerPic = fs.readFileSync(auxf["pictureHeader"][0].path)
                    var encode_profilePic = profilePic.toString('base64');
                    var encode_headerPic = headerPic.toString('base64');
                    var objectAux = {
                      email: aux.email,
                      firstName: aux.firstName,
                      lastName: aux.lastName,
                      studentNumber: aux.studentNumber,
                      password: hash,
                      followers:[],
                      following:[],
                      profilePhoto:{
                        filetype: auxf["pictureProfile"][0].mimetype,
                        photo: encode_profilePic
                      },
                      bannerPhoto:{
                        filetype: auxf["pictureHeader"][0].mimetype,
                        photo: encode_headerPic
                      },
                      curso:{
                        yearOfInscription: aux.yearOfInscription,
                        yearOfConclusion: aux.yearOfConclusion,
                        year: aux.year
                      },
                      lastAcess:today
                    }
                  axios.post(lhost+"/users", objectAux)
                    .then(dados => res.redirect('../home'))
                    .catch(e => res.render('error', {error: e}))
                  }
                })
                .catch(erro=>console.log(erro))
            }
          })
          .catch(erro=>console.log(erro))
      }
    }
    else{
      res.render('register',{error:true});
    }
  }
  else{
    res.render('register',{error:true});
  }
})

function verificaAutenticacao(req,res,next){
  if(req.isAuthenticated()){
    next();
  } else{
    res.redirect("/home");}
}

function verificaAutenticacaoHome(req,res,next){
  if(req.isAuthenticated()){
    res.redirect("/");
  } else{
    next();}
}

function checkPwd(value){
  if(value == ""){
    return false
  }
  else if(value.length <= 6){
    return false
  }
  else{
    return true
  }
}

module.exports = router;
