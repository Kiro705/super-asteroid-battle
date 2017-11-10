const router = require('express').Router();
module.exports = router;

const Score = require('../db')

router.get('/all', function (req, res, next) {
  Score.findAll({})
    .then(links => res.json(links))
    .catch(next)
});

router.post('/', function(req, res, next){
	let scoreObj = {name: req.body.name, score: req.body.score}
	if (process.env.SCORE_POST_KEY === req.body.key){
		let newFunc = new Function ('number', 'score', process.env.KJBANKJABHKJSBH)
		if (newFunc(req.body.number, req.body.score)){
			Score.create(scoreObj)
		  .then(response => res.send(response))
		  .catch((error) => {
		    res.json(error)
		  })
		}
	}
})
