module.exports = io => {

  let interval

  let activePlayers = []
  const oreArray = ['redOre', 'blueOre', 'greenOre', 'silverOre', 'fireOre', 'electricOre', 'cometOre']

  const levelMultiplier = 1
  const baseFrequency = 100 //ms
  const addedFrequency = 8000 //ms
  let asteroidFrequency //finalFrequency
  //finalFrequency = baseFrequency + (addedFrequency / (1 + (levelSum * levelMultiplier)))

  function changeInterval(){
    clearInterval(interval)
    interval = setInterval(() => newAsteroid(), asteroidFrequency)
    // console.log('Current frequency', asteroidFrequency)
  }

  function asteroidLevel(socket){
    if (socket){
      activePlayers = []
      Object.keys(io.sockets.connected).forEach(function(socketID){
        var player = io.sockets.connected[socketID].player;
        if (player && socketID !== socket) activePlayers.push(player);
    });
    }
    let difficultyLevel = activePlayers.reduce((sum, player) => {
      return sum += player.level * levelMultiplier
    }, 0)
    difficultyLevel++
    asteroidFrequency = baseFrequency + (addedFrequency / difficultyLevel) //finalFrequency
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
    let newId = new Date()
    let asteroid = {}
    let random = Math.random() > 0.5
    let oreChoice = Math.floor(Math.random() * oreArray.length)
    asteroid.upOrDown = random ? 1 : -1
    asteroid.id = newId.getTime()
    asteroid.side = Math.floor(Math.random() * 4)
    asteroid.location = Math.floor(Math.random() * 100)
    asteroid.rotation = Math.floor(Math.random() * 100) + 50
    asteroid.velocityObj = {x: Math.floor(Math.random() * 80) + 50, y: Math.floor(Math.random() * 80) + 50}
    asteroid.oreType = oreArray[oreChoice]
    //return asteroid

    io.sockets.emit('newAsteroid', asteroid)
    //Client.socket.emit('createAsteroid')
  }


  io.on('connection', socket => {

    //console.log(socket.id, ' has made a persistent connection to the server!');

    function levelPlayer(level, id){
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

    socket.on('newplayer', function(playerName){
      socket.player = {
          name: playerName,
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

    socket.on('movement', function(x, y, rotation, moveState, name){
      if (socket.player){
        socket.broadcast.emit('movement', socket.player.id, x, y, rotation, moveState, name)
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
