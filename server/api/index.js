const router = require('express').Router();
module.exports = router;

const db = require('../db')

router.get('/all', function (req, res, next) {
  console.log('*********', db)
  db.Score.findAll()
    .then(links => res.json(links))
    .catch(next);
});
