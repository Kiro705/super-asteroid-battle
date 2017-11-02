module.exports = io => {
  console.log('backend is working')

  let lastPlayderID = 0;

  function getAllPlayers(id){
    var players = [];
    console.log('ID of the connected Socket', id)
    Object.keys(io.sockets.connected).forEach(function(socketID){
      console.log('socketID', socketID)
        var player = io.sockets.connected[socketID].player;
        if (player && socketID !== id) players.push(player);
    });
    return players;
  }

  function randomInt (low, high) {
      return Math.floor(Math.random() * (high - low) + low);
  }


  io.on('connection', socket => {

    console.log(socket.id, ' has made a persistent connection to the server!');

    socket.on('test', function(){
      console.log('test received');
    });

    socket.on('newplayer', function(){
      socket.player = {
          id: lastPlayderID++,
          x: randomInt(100, 400),
          y: randomInt(100, 400)
      };
      socket.emit('allplayers', getAllPlayers(socket.id));

      socket.broadcast.emit('newplayer', socket.player);

      socket.on('disconnect', function(){
        console.log('someone disconnected', socket.player.id)
        io.emit('remove', socket.player.id);
      });
    });
  });
};
