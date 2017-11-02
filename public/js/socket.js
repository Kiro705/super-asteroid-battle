var Client = {};
Client.socket = io.connect();

Client.askNewPlayer = function(x, y){
  //console.log('asking for a new player to be added')
  Client.socket.emit('newplayer', x, y);
};

Client.movePlayer = function(x, y, rotation){
  console.log('1. emiting to the back end that there is a movement', x, y)
  Client.socket.emit('movement', x, y, rotation)
}

Client.socket.on('newplayer', function(data){
  //console.log('socket data on newPlayer', data)
  GameState.addNewPlayer(data.id, data.x, data.y, data.rotation);
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

Client.socket.on('movement', function(id, x, y, rotation){
  console.log('3. I attempted to move, front end side', id, x, y)
  GameState.movePlayer(id, x, y, rotation)
})
