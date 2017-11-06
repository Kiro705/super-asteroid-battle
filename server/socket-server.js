module.exports = io => {
  //console.log('backend is working')

  let lastPlayderID = 0;

  let interval = setTimeout(newAsteroid, 5000)

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

  // function newAsteroid(){
  //   let asteroid = {}
  //   asteroid.side = Math.floor(Math.random() * 4)
  //   asteroid.location = Math.floor(Math.random() * 100)
  //   asteroid.rotation = Math.floor(Math.random() * 100) + 50
  //   asteroid.velocityObj = {x: Math.floor(Math.random() * 80) + 50, y: Math.floor(Math.random() * 80) + 50}
  //   //return asteroid
  //   socket.emit('newAsteroid', asteroid)
  // }

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

    socket.on('movement', function(x, y, rotation){
      if (socket.player){
        //console.log('2. receiving movement and broadcasting', socket.player.id.slice(0, 3), x, y)
        socket.broadcast.emit('movement', socket.player.id, x, y, rotation)
      }
    })

    function newAsteroid(){
      let asteroid = {}
      asteroid.side = Math.floor(Math.random() * 4)
      asteroid.location = Math.floor(Math.random() * 100)
      asteroid.rotation = Math.floor(Math.random() * 100) + 50
      asteroid.velocityObj = {x: Math.floor(Math.random() * 80) + 50, y: Math.floor(Math.random() * 80) + 50}
      //return asteroid
      socket.emit('newAsteroid', asteroid)
    }

    // socket.on('createAsteroid', function(){
    //   let asteroid = newAsteroid()
    //   console.log('3. receiving resquest and emiting asteroid', asteroid)
    //   socket.emit('newAsteroid', asteroid)
    // })
  });
};
