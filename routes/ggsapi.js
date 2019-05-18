var express = require('express');
var router = express.Router();
const {ggs} = require('../api/ggs');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET users listing. */
router.post('/update-row', function(req, res, next) {
  ggs(req, res, next);
  // res.end('ok');
});
module.exports = router;
