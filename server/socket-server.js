module.exports = io => {
  console.log('backend is working')

  let lastPlayderID = 0;

  function getAllPlayers(){
    var players = [];
    Object.keys(io.sockets.connected).forEach(function(socketID){
        var player = io.sockets.connected[socketID].player;
        if (player) players.push(player);
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
      socket.emit('allplayers', getAllPlayers());
      socket.broadcast.emit('newplayer', socket.player);
    });
  });
};
