var express = require('express');
var router = express.Router();
var axios = require('axios');

var url = "http://localhost:3005"

/* GET home page. */
router.get('/checkEmail/:email', function(req, res, next) {
  axios.get(url+"/users/checkEmail/"+req.params.email)
    .then(dados =>{res.jsonp(dados.data)})
    .catch(e =>res.status(500).jsonp(e))
});

router.get('/checkSN/:sn', function(req, res, next) {
  axios.get(url+"/users/checkSN/"+req.params.sn)
    .then(dados =>res.jsonp(dados.data))
    .catch(e => res.status(500).jsonp(e))
});

module.exports = router;
