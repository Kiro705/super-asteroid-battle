module.exports = io => {
  //let lastPlayderID = 0;

  let asteroidFrequency
  let interval

  let activePlayers = []

  function changeInterval(){
    clearInterval(interval)
    interval = setInterval(() => newAsteroid(), asteroidFrequency)
    console.log('frequency', asteroidFrequency)
  }

  function asteroidLevel(socket){
    if (socket){
      activePlayers = []
      Object.keys(io.sockets.connected).forEach(function(socketID){
        var player = io.sockets.connected[socketID].player;
        if (player && socketID === socket) activePlayers.push(player);
    });
    }

    let difficultyLevel = activePlayers.reduce((sum, player) => {
      return sum += player.level * 0.8
    }, 0)
    difficultyLevel++
    console.log('difficultyLevel', difficultyLevel)

    asteroidFrequency = 500 + (4000 / difficultyLevel)
    changeInterval()
  }

  function getAllPlayers(id){
    let result = activePlayers

    Object.keys(io.sockets.connected).forEach(function(socketID){
        var player = io.sockets.connected[socketID].player;
        if (player && socketID === id) activePlayers.push(player);
    });

    asteroidLevel()

    return result;
  }

  function randomInt (low, high) {
      return Math.floor(Math.random() * (high - low) + low);
  }

  function newAsteroid(){
    var time = new Date()
    console.log('creating a new asteroid', time.getSeconds())
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

    console.log(socket.id, ' has made a persistent connection to the server!');

    function levelPlayer(level, id){
      console.log('level', level, 'id', id)
      activePlayers = activePlayers.map( player => {
        if (player.id === id){
          player.level = level
        }
        return player
      })
      asteroidLevel()
    }

    socket.on('test', function(){
    });

    socket.on('newplayer', function(){
      socket.player = {
          id: socket.id,
          level: 1
      };

      socket.emit('allplayers', getAllPlayers(socket.id, socket));
      socket.emit('myID', socket.id)
      socket.broadcast.emit('newplayer', socket.player);

      socket.on('disconnect', function(){
        asteroidLevel(socket.id)
        activePlayers = activePlayers.filter(player => player.id !== socket.player.id)
        socket.broadcast.emit('remove', socket.player.id);
      });
    });

    socket.on('disconnectedPlayer', function(location, velocity){
      asteroidLevel(socket.id)
      activePlayers = activePlayers.filter(player => player.id !== socket.player.id)
      socket.broadcast.emit('remove', socket.player.id, location, velocity);
    })

    socket.on('movement', function(x, y, rotation, moveState){
      if (socket.player){
        socket.broadcast.emit('movement', socket.player.id, x, y, rotation, moveState)
      }
    })

    socket.on('laser', function(x, y, rotation, type, velocity){
      if (socket.player){
        socket.broadcast.emit('laser', x, y, rotation, type, velocity)
      }
    })

    socket.on('hitAsteroid', function(id){
      socket.broadcast.emit('hitAsteroid', id)
    })

    socket.on('oreCollected', function(id){
      socket.broadcast.emit('killOre', id)
    })

    socket.on('levelUp', function(level, id){
      levelPlayer(level, id)
    })


  });
};
