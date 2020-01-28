var express = require('express');
var router = express.Router();
var axios = require('axios');
var passport = require('passport')
var lhost = require('../config/env').host
var thisHost = require('../config/env').lhost
const fs = require('fs')
var dateFormat = require('dateformat');
var multer = require('multer')
var upload = multer({dest:'uploads/'})

router.get('/', verificaAutenticacao,function(req, res, next) {
  axios.get(lhost+"/users/getCurrentProfile/"+req.user.email)
    .then(dados =>{
      const datas = dados.data[0]
      console.log(datas)
      axios.get(lhost+"/users/photos/"+datas.studentNumber)
        .then(dados =>{
          const images = dados.data
          base64img = _arrayBufferToBase64(images.profilePhoto.photo.data)
          srcProfile = "data:"+images.profilePhoto.filetype+";base64,"+base64img
          base64img = _arrayBufferToBase64(images.bannerPhoto.photo.data)
          srcHeader = "data:"+images.bannerPhoto.filetype+";base64,"+base64img
          res.render('ownProfile',{data:datas,profilePic:srcProfile,headerPic:srcHeader})
        })
        .catch(e =>{
          console.log(e)
          res.status(500).jsonp(e)})
    })
    .catch(e => {
      console.log(e)
      res.status(500).jsonp(e)})
});

router.get('/:sn', verificaAutenticacao, function(req, res, next) {
  const sn = req.params.sn
  axios.get(lhost+"/users/getUserProfile/"+sn)
    .then(dados =>{
      const datas = dados.data[0]
      axios.get(lhost+"/users/photos/"+datas.studentNumber)
        .then(dados =>{
          const images = dados.data
          console.log("Aqui")
          base64img = _arrayBufferToBase64(images.profilePhoto.photo.data)
          srcProfile = "data:"+images.profilePhoto.filetype+";base64,"+base64img
          base64img = _arrayBufferToBase64(images.bannerPhoto.photo.data)
          srcHeader = "data:"+images.bannerPhoto.filetype+";base64,"+base64img
          if(datas.email == req.user.email){
            res.render('ownProfile',{data:datas,profilePic:srcProfile,headerPic:srcHeader})
          }
          else{
            axios.get(lhost+"/users/following/"+req.user.email+"?sn="+sn)
              .then(dados =>{
                if(dados){
                  res.render('profile',{data:datas,profilePic:srcProfile,headerPic:srcHeader,following:true})
                }
                else{
                  res.render('profile',{data:datas,profilePic:srcProfile,headerPic:srcHeader})
                }
              })
              .catch(e =>{
                console.log(e)
                res.status(500).jsonp(e)})
          }
        })
        .catch(e =>{
          console.log(e)
          res.status(500).jsonp(e)})
    })
    .catch(e => {
      console.log(e)
      res.status(500).jsonp(e)})
});

router.post('/followUser', verificaAutenticacao, function(req, res, next){
  const sn = req.body.studentNumber
  axios.get(lhost+"/users/following/"+req.user.email+"?sn="+sn)
    .then(dados =>{
      if(dados){
        if(dados.data){
          axios.put(lhost+"/users/stopFollow/"+req.user.email+"?sn="+sn)
            .then(dados =>{
              axios.put(lhost+"/users/unfollowed/"+req.user.email+"?sn="+sn)
                .then(dados =>{
                  res.redirect('/user/'+sn)
                })
                .catch(e =>{
                  console.log(e)
                  res.status(500).jsonp(e)
                })
            })
            .catch(e =>{
              console.log(e)
              res.status(500).jsonp(e)
            })
        }
        else{
          axios.put(lhost+"/users/follow/"+req.user.email+"?sn="+sn)
          .then(dados =>{
            axios.put(lhost+"/users/followed/"+req.user.email+"?sn="+sn)
              .then(dados =>{
                res.redirect('/user/'+sn)
              })
              .catch(e =>{
                console.log(e)
                res.status(500).jsonp(e)
              })
          })
          .catch(e =>{
            console.log(e)
            res.status(500).jsonp(e)
          })
        }
      }
    })
    .catch(e => res.status(500).jsonp(e))
})

router.post('/updateUser',[verificaAutenticacao,upload.fields([{name:'pictureProfile', maxCount: 1},{name:'pictureHeader', maxCount: 1}])], function(req, res, next) {
  const aux = req.body
  const files = req.files
  if(files["pictureProfile"] && files["pictureHeader"]){
    if(aux.firstName != "" && aux.lastName != "" && aux.studentNumber != "" && files["pictureProfile"][0].path != "" && files["pictureHeader"][0].path != "" && aux.year != "" && aux.yearOfInscription != ""){
      axios.get(lhost+"/users/"+aux.studentNumber)
      .then(dados =>{
          var same = false
          const data = dados.data
          if(data){
            if(data.email == req.user.email){
              same=true
            }
            else{
              res.redirect('/user')
            }
          }
          else{
            same=true
          }
          if(data && same){
            var today = new Date()
            today = dateFormat(today, 'dd-mm-yyyy HH:MM:ss')
            var profilePic = fs.readFileSync(files["pictureProfile"][0].path)
            var headerPic = fs.readFileSync(files["pictureHeader"][0].path)
            var encode_profilePic = profilePic.toString('base64');
            var encode_headerPic = headerPic.toString('base64');
            var objectAux = {
              firstName: aux.firstName,
              lastName: aux.lastName,
              studentNumber: aux.studentNumber,
              profilePhoto:{
                filetype: files["pictureProfile"][0].mimetype,
                photo: new Buffer(encode_profilePic, 'base64')
              },
              bannerPhoto:{
                filetype: files["pictureHeader"][0].mimetype,
                photo: new Buffer(encode_headerPic, 'base64')
              },
              curso:{
                yearOfInscription: aux.yearOfInscription,
                yearOfConclusion: aux.yearOfConclusion,
                year: aux.year
              },
              lastAcess:today
            }
            axios.put(lhost+"/users/googleRegister/"+req.user.email, objectAux)
            .then(dados => res.redirect('/user'))
            .catch(e => res.render('error', {error: e}))
          }
        })
      .catch(e => res.status(500).jsonp(e))
    }
  }
  else if(files["pictureProfile"]){
    if(aux.firstName != "" && aux.lastName != "" && aux.studentNumber != "" && files["pictureProfile"][0].path != "" && aux.year != "" && aux.yearOfInscription != ""){
      axios.get(lhost+"/users/"+aux.studentNumber)
      .then(dados =>{
          var same = false
          const data = dados.data
          if(data){
            if(data.email == req.user.email){
              same=true
            }
            else{
              res.redirect('/user')
            }
          }
          else{
            same=true
          }
          if(data && same){
            console.log("here")
            var today = new Date()
            today = dateFormat(today, 'dd-mm-yyyy HH:MM:ss')
            var profilePic = fs.readFileSync(files["pictureProfile"][0].path)
            var encode_profilePic = profilePic.toString('base64');
            console.log("here 2")
            var objectAux = {
              firstName: aux.firstName,
              lastName: aux.lastName,
              studentNumber: aux.studentNumber,
              profilePhoto:{
                filetype: files["pictureProfile"][0].mimetype,
                photo: new Buffer(encode_profilePic, 'base64')
              },
              curso:{
                yearOfInscription: aux.yearOfInscription,
                yearOfConclusion: aux.yearOfConclusion,
                year: aux.year
              },
              lastAcess:today
            }
            console.log(objectAux)
            axios.put(lhost+"/users/googleRegister/"+req.user.email, objectAux)
              .then(dados => res.redirect('/user'))
              .catch(e => res.render('error', {error: e}))
          }
        })
      .catch(e => res.status(500).jsonp(e))
    }
  }
  else if(files["pictureHeader"]){
    if(aux.firstName != "" && aux.lastName != "" && aux.studentNumber != "" && files["pictureHeader"][0].path != "" && aux.year != "" && aux.yearOfInscription != ""){
      axios.get(lhost+"/users/"+aux.studentNumber)
      .then(dados =>{
          var same = false
          const data = dados.data
          if(data){
            if(data.email == req.user.email){
              same=true
            }
            else{
              res.redirect('/user')
            }
          }
          else{
            same=true
          }
          if(data && same){
            var today = new Date()
            today = dateFormat(today, 'dd-mm-yyyy HH:MM:ss')
            var headerPic = fs.readFileSync(files["pictureHeader"][0].path)
            var encode_headerPic = headerPic.toString('base64');
            var objectAux = {
              firstName: aux.firstName,
              lastName: aux.lastName,
              studentNumber: aux.studentNumber,
              bannerPhoto:{
                filetype: files["pictureHeader"][0].mimetype,
                photo: new Buffer(encode_headerPic, 'base64')
              },
              curso:{
                yearOfInscription: aux.yearOfInscription,
                yearOfConclusion: aux.yearOfConclusion,
                year: aux.year
              },
              lastAcess:today
            }
            axios.put(lhost+"/users/googleRegister/"+req.user.email, objectAux)
            .then(dados => res.redirect('/user'))
            .catch(e => res.render('error', {error: e}))
          }
        })
      .catch(e => res.status(500).jsonp(e))
    }
  }
  else{
    if(aux.firstName != "" && aux.lastName != "" && aux.studentNumber != "" && aux.year != "" && aux.yearOfInscription != ""){
      axios.get(lhost+"/users/"+aux.studentNumber)
      .then(dados =>{
          var same = false
          const data = dados.data
          if(data){
            if(data.email == req.user.email){
              same=true
            }
            else{
              res.redirect('/user')
            }
          }
          else{
            same=true
          }
          if(data && same){
            var today = new Date()
            today = dateFormat(today, 'dd-mm-yyyy HH:MM:ss')
            var objectAux = {
              firstName: aux.firstName,
              lastName: aux.lastName,
              studentNumber: aux.studentNumber,
              curso:{
                yearOfInscription: aux.yearOfInscription,
                yearOfConclusion: aux.yearOfConclusion,
                year: aux.year
              },
              lastAcess:today
            }
            axios.put(lhost+"/users/googleRegister/"+req.user.email, objectAux)
              .then(dados => res.redirect('/user'))
              .catch(e =>{
                console.log(e)
                res.render('error', {error: e})
              })
          }
        })
      .catch(e => res.status(500).jsonp(e))
    }
  }
})

function verificaAutenticacao(req,res,next){
    if(req.isAuthenticated()){
      next();
    } else{
      res.redirect(thisHost+"/home");}
}

function _arrayBufferToBase64( buffer ) {
  var binary = '';
  var bytes = new Uint8Array( buffer );
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
      binary += String.fromCharCode( bytes[ i ] );
  }
  var image = Buffer.from(binary,'binary').toString('base64');
  return image
}

module.exports = router;