var Client = {};
Client.socket = io.connect();

Client.askNewPlayer = function(){
  console.log('asking for a new player to be added')
  Client.socket.emit('newplayer');
};

Client.socket.on('newplayer', function(data){
  console.log('socket data on newPlayer', data)
  GameState.addNewPlayer(data.id, data.x, data.y);
});

Client.socket.on('allplayers', function(data){
  console.log('socket data on allplayers', data);
  for (var i = 0; i < data.length; i++){
    console.log('allPlayer', data)
    GameState.addNewPlayer(data[i].id, data[i].x, data[i].y);
  }
});

Client.socket.on('remove', function(id){
  console.log('socket receiving removing request', id)
  GameState.removePlayer(id);
});
