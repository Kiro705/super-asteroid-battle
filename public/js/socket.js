var Client = {};
Client.socket = io.connect();

Client.askNewPlayer = function(playerName){
  Client.socket.emit('newplayer', playerName);
};

Client.movePlayer = function(x, y, rotation, moveState, name){
  Client.socket.emit('movement', x, y, rotation, moveState, name)
}

Client.shotLaser = function(x, y, rotation, type, velocity){
  Client.socket.emit('laser', x, y, rotation, type, velocity)
}

Client.hitAsteroid = function(id){
  Client.socket.emit('hitAsteroid', id)
}

Client.disconnectSocket = function(location, velocity){
  Client.socket.emit('disconnectedPlayer', location, velocity)
}

Client.destroyOre = function(id){
  Client.socket.emit('oreCollected', id)
}

Client.sendScore = function(score){
  Client.socket.emit('newScore', score)
}

Client.levelUp = function(level, id){
  Client.socket.emit('levelUp', level, id)
}

Client.socket.on('newplayer', function(data){
  GameState.addNewPlayer(data.id, data.name);
});

Client.socket.on('allplayers', function(data){
  for (var i = 0; i < data.length; i++){
    GameState.addNewPlayer(data[i].id, data[i].x, data[i].y);
  }
});

Client.socket.on('remove', function(id, location, velocity){
  GameState.removePlayer(id, location, velocity);
});

Client.socket.on('movement', function(id, x, y, rotation, moveState, name){
  GameState.movePlayer(id, x, y, rotation, moveState, name)
})

Client.socket.on('laser', function(x, y, rotation, type, velocity){
  GameState.shootLaser(x, y, rotation, type, velocity)
})

Client.socket.on('hitAsteroid', function(id){
  GameState.damageAsteroid(id)
})

Client.socket.on('killOre', function(id){
  GameState.killOre(id)
})

Client.socket.on('newAsteroid', function(asteroid){
  GameState.makeAsteroid(asteroid)
})

Client.socket.on('myID', function(id){
  GameState.setID(id)
})

