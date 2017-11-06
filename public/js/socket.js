//console.log('Socket totally has access to the game state', game.state.current)

var Client = {};
Client.socket = io.connect();

Client.askNewPlayer = function(){
  //console.log('asking for a new player to be added')
  Client.socket.emit('newplayer');
};

Client.movePlayer = function(x, y, rotation, moveState){
  //console.log('1. emiting to the back end that there is a movement', Client.socket.id.slice(0, 3), x, y)
  Client.socket.emit('movement', x, y, rotation, moveState)
}

Client.shotLaser = function(x, y, rotation){
  Client.socket.emit('laser', x, y, rotation)
}

Client.hitAsteroid = function(id){
  Client.socket.emit('hitAsteroid', id)
}

Client.disconnectSocket = function(){
  Client.socket.emit('disconnectedPlayer')
}

Client.socket.on('newplayer', function(data){
  //console.log('socket data on newPlayer', data)
  GameState.addNewPlayer(data.id);
});

Client.socket.on('allplayers', function(data){
  //console.log('socket data on allplayers', data);
  for (var i = 0; i < data.length; i++){
    //console.log('allPlayer', data)
    GameState.addNewPlayer(data[i].id, data[i].x, data[i].y);
  }
});

Client.socket.on('remove', function(id){
  //console.log('socket receiving removing request', id)
  GameState.removePlayer(id);
});

Client.socket.on('movement', function(id, x, y, rotation, moveState){
  //console.log('3. I attempted to move, front end side', id, x, y)
  GameState.movePlayer(id, x, y, rotation, moveState)
})

Client.socket.on('laser', function(x, y, rotation){
  GameState.shootLaser(x, y, rotation)
})

Client.socket.on('hitAsteroid', function(id){
  GameState.damageAsteroid(id)
})

Client.socket.on('newAsteroid', function(asteroid){
  //console.log('4. receiving asteroid and sending request to GameState')
  GameState.makeAsteroid(asteroid)
})
