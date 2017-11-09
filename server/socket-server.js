module.exports = io => {
  //let lastPlayderID = 0;

  let asteroidFrequency
  let interval;
  let s

  let activePlayers = []

  function asteroidLevel(){
    let difficultyLevel = activePlayers.reduce((sum, player) => {
      return sum += player.level * 250
    }, 0)
    console.log('difficultyLevel', difficultyLevel)
    return difficultyLevel
  }

  function setInterval(frequency, socket){
    interval = setInterval(() => newAsteroid(socket), frequency)
  }

  function getAllPlayers(id, socket){
    // console.log('adding player to active player array')
    let result = activePlayers

    Object.keys(io.sockets.connected).forEach(function(socketID){
        var player = io.sockets.connected[socketID].player;
        if (player && socketID === id) activePlayers.push(player);
    });

    asteroidFrequency = 7000 - asteroidLevel()
    console.log('real asteroidFrequency', asteroidFrequency)
    setInterval(asteroidFrequency, socket)

    return result;
  }



  // function levelPlayer(level, id){
  //   console.log('level', level, 'id', id)
  //   activePlayers = activePlayers.map( player => {
  //     if (player.id === id){
  //       player.level = level
  //     }
  //     return player
  //   })
  //   asteroidFrequency = 7000 - asteroidLevel()
  //   setInterval(asteroidFrequency, socket)
  // }

  function randomInt (low, high) {
      return Math.floor(Math.random() * (high - low) + low);
  }

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
      interval = setInterval(() => newAsteroid(socket), 5000)
    }
    console.log(socket.id, ' has made a persistent connection to the server!');

    function levelPlayer(level, id){
      console.log('level', level, 'id', id)
      activePlayers = activePlayers.map( player => {
        if (player.id === id){
          player.level = level
        }
        return player
      })
      asteroidFrequency = 7000 - asteroidLevel()
      setInterval(asteroidFrequency, socket)
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
        activePlayers = activePlayers.filter(player => player.id !== socket.player.id)
        socket.broadcast.emit('remove', socket.player.id);
      });
    });

    socket.on('disconnectedPlayer', function(location, velocity){
      activePlayers = activePlayers.filter(player => player.id !== socket.player.id)
      socket.broadcast.emit('remove', socket.player.id, location, velocity);
    })

    socket.on('movement', function(x, y, rotation, moveState){
      if (socket.player){
        socket.broadcast.emit('movement', socket.player.id, x, y, rotation, moveState)
      }
    })

    // asteroidFrequency = asteroidLevel() * 1000 + 1
    // console.log('difficult level', asteroidFrequency)


    socket.on('createAsteroid', function(){
      let asteroid = newAsteroid()
      socket.emit('newAsteroid', asteroid)
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
