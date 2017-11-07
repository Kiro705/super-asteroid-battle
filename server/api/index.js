const router = require('express').Router();
module.exports = router;

//const db = require('../db')
const Score = require('../db')

router.get('/all', function (req, res, next) {
  console.log('*********', Score)
  Score.findAll({})
    .then(links => res.json(links))
    .catch(next);
});

router.post('/', function(req, res, next){
  console.log('sending data to the database', req.body)
  Score.create(req.body)
  .then(response => res.send(response))
  .catch((error) => {
    res.json(error)
    console.log('There was an error', error)
  })
})
