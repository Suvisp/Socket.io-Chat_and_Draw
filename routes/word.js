var express = require('express');
var router = express.Router();
var dao = require('../services/daoservice');

//hakee kaikki sanat
router.get('/', function (req, res, next) {
  //res.send('Ja yhteys on!');
  dao.getAllWords((rows) => {
    res.json(rows);
  })
});


module.exports = router;