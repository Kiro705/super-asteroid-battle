const {resolve} = require('path')
const express = require('express');
const app = express();
// const bodyParser = require('body-parser');

// static middlewear
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(resolve(__dirname, '..', 'public'))) // Serve static files from ../public
app.use(express.static(resolve(__dirname, '..', 'node_modules')))
// app.use('/api', require('./routes/api'));

//Other middlewear
if (process.env.NODE_ENV !== 'production') {
  // Logging middleware (non-production only)
  app.use(require('volleyball'))
}

app.get('*', function (req, res, next) {
  res.sendFile(resolve(__dirname, '..', 'public', 'index.html'));
});

const port = process.env.PORT || 6060;
app.listen(port, function () {
  console.log('Server is listening...');
  console.log('http://localhost:6060/');
});

//500 error middlewear
app.use(function (err, req, res, next) {
  console.error(err);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || 'Internal server error.');
});
