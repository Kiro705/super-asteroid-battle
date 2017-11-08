const router = require('express').Router();
module.exports = router;

//const db = require('../db')
const Score = require('../db')

router.get('/all', function (req, res, next) {
  Score.findAll({})
    .then(links => res.json(links))
    .catch(next);
});

router.post('/', function(req, res, next){
  Score.create(req.body)
  .then(response => res.send(response))
  .catch((error) => {
    res.json(error)
  })
})
