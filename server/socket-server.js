module.exports = io => {
  //let lastPlayderID = 0;

  let activePlayers = []
  function getAllPlayers(id){
    let result = activePlayers

    Object.keys(io.sockets.connected).forEach(function(socketID){
        var player = io.sockets.connected[socketID].player;
        if (player && socketID === id) activePlayers.push(player);
    });
    return result;
  }

  function randomInt (low, high) {
      return Math.floor(Math.random() * (high - low) + low);
  }

  let interval;

  function newAsteroid(socket){
    let newId = new Date()
    let asteroid = {}
    let random = Math.random() > 0.5
    asteroid.upOrDown = random ? 1 : -1
    asteroid.id = newId.getTime()
    asteroid.side = Math.floor(Math.random() * 4)
    asteroid.location = Math.floor(Math.random() * 100)
    asteroid.rotation = Math.floor(Math.random() * 100) + 50
    asteroid.velocityObj = {x: Math.floor(Math.random() * 80) + 50, y: Math.floor(Math.random() * 80) + 50}
    //return asteroid

    io.sockets.emit('newAsteroid', asteroid)
    //Client.socket.emit('createAsteroid')
  }

  io.on('connection', socket => {


    if (!interval) {
      interval = setInterval(() => newAsteroid(socket), 1700)
    }

    console.log(socket.id, ' has made a persistent connection to the server!');

    socket.on('test', function(){
      //console.log('test received');
    });

    socket.on('newplayer', function(){
      socket.player = {
          id: socket.id
      };
      socket.emit('allplayers', getAllPlayers(socket.id));

      socket.broadcast.emit('newplayer', socket.player);

      socket.on('disconnect', function(){
        //console.log('someone disconnected', socket.player.id)
        activePlayers = activePlayers.filter(player => player.id !== socket.player.id)
        socket.broadcast.emit('remove', socket.player.id);
      });
    });

    socket.on('disconnectedPlayer', function(){
      //console.log('****** attempted to removing user', socket.player.id)
      activePlayers = activePlayers.filter(player => player.id !== socket.player.id)
      socket.broadcast.emit('remove', socket.player.id);
    })

    socket.on('movement', function(x, y, rotation, moveState){
      if (socket.player){
        //console.log('2. receiving movement and broadcasting', socket.player.id.slice(0, 3), x, y)
        socket.broadcast.emit('movement', socket.player.id, x, y, rotation, moveState)
      }
    })

    socket.on('createAsteroid', function(){
      let asteroid = newAsteroid()
      console.log('3. receiving resquest and emiting asteroid', asteroid)
      socket.emit('newAsteroid', asteroid)
    })

    socket.on('laser', function(x, y, rotation){
      if (socket.player){
        socket.broadcast.emit('laser', x, y, rotation)
      }
    })

    socket.on('hitAsteroid', function(id){
      socket.broadcast.emit('hitAsteroid', id)
    })

  });
};
