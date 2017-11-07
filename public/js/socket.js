var Client = {};
Client.socket = io.connect();

Client.askNewPlayer = function(){
  Client.socket.emit('newplayer');
};

Client.movePlayer = function(x, y, rotation, moveState){
  Client.socket.emit('movement', x, y, rotation, moveState)
}

Client.shotLaser = function(x, y, rotation){
  Client.socket.emit('laser', x, y, rotation)
}

Client.hitAsteroid = function(id){
  Client.socket.emit('hitAsteroid', id)
}

Client.disconnectSocket = function(location, velocity){
  Client.socket.emit('disconnectedPlayer', location, velocity)
}

Client.sendScore = function(score){
  Client.socket.emit('newScore', score)
}

Client.socket.on('newplayer', function(data){
  GameState.addNewPlayer(data.id);
});

Client.socket.on('allplayers', function(data){
  for (var i = 0; i < data.length; i++){
    GameState.addNewPlayer(data[i].id, data[i].x, data[i].y);
  }
});

Client.socket.on('remove', function(id, location, velocity){
  GameState.removePlayer(id, location, velocity);
});

Client.socket.on('movement', function(id, x, y, rotation, moveState){
  GameState.movePlayer(id, x, y, rotation, moveState)
})

Client.socket.on('laser', function(x, y, rotation){
  GameState.shootLaser(x, y, rotation)
})

Client.socket.on('hitAsteroid', function(id){
  GameState.damageAsteroid(id)
})

Client.socket.on('newAsteroid', function(asteroid){
  GameState.makeAsteroid(asteroid)
})

Client.socket.on('myID', function(id){
  GameState.setID(id)
})

