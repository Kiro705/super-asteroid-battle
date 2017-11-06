module.exports = io => {
  //console.log('backend is working')

  let lastPlayderID = 0;

  function getAllPlayers(id){
    var players = [];
    //console.log('ID of the connected Socket', id)
    Object.keys(io.sockets.connected).forEach(function(socketID){
      //console.log('socketID', socketID)
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
      //console.log('test received');
    });

    socket.on('newplayer', function(x, y, rotation){
      socket.player = {
          id: socket.id,
          x: x,
          y: y,
          rotation: rotation
      };
      socket.emit('allplayers', getAllPlayers(socket.id));

      socket.broadcast.emit('newplayer', socket.player);

      socket.on('disconnect', function(){
        //console.log('someone disconnected', socket.player.id)
        socket.broadcast.emit('remove', socket.player.id);
      });
    });

    socket.on('disconnectedPlayer', function(){
      //console.log('****** attempted to removing user', socket.player.id)
      socket.broadcast.emit('remove', socket.player.id);
    })

    socket.on('movement', function(x, y, rotation, moveState){
      if (socket.player){
        //console.log('2. receiving movement and broadcasting', socket.player.id.slice(0, 3), x, y)
        socket.broadcast.emit('movement', socket.player.id, x, y, rotation, moveState)
      }
    })

    socket.on('laser', function(x, y, rotation){
      if (socket.player){
        socket.broadcast.emit('laser', x, y, rotation)
      }
    })

  });
};
