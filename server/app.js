const {resolve} = require('path')
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = require('./db');

db.sync().then(() => console.log('Database is synced'));

app.use(express.static(resolve(__dirname, '..', 'public'))) // Serve static files from ../public
app.use(express.static(resolve(__dirname, '..', 'node_modules')))
// app.use('/api', require('./routes/api'));

//Other middlewear
if (process.env.NODE_ENV !== 'production') {
  // Logging middleware (non-production only)
  app.use(require('volleyball'))
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', require('./api'));

app.get('*', function (req, res, next) {
  res.sendFile(resolve(__dirname, '..', 'public', 'index.html'));
});

const port = process.env.PORT || 3001;
const server = app.listen(port, function () {
  console.log('Server is listening...');
  console.log('http://localhost:3001/');
});

const io = require('socket.io')(server);
require('./socket-server')(io);

//500 error middlewear
app.use(function (err, req, res, next) {
  console.error(err);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || 'Internal server error.');
});
