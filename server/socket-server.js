module.exports = io => {
  console.log('backend is working')
  io.on('connection', socket => {

    console.log(socket.id, ' has made a persistent connection to the server!');

    socket.on('test', function(){
      console.log('test received');
    });

  });

};
