// const socket = io();

// socket.on('connect', () => {
//   console.log('I am now connected to the server!');

//   socket.on('askNewPlayer', message => {
//     socket.emit('newPlayer');
//   });
//   // socket.on('new-channel', channel => {
//   //   console.log('socket channel: ', channel)
//   //   store.dispatch(getChannel(channel));
//   // });
// });

var Client = {};
Client.socket = io.connect();

Client.askNewPlayer = function(){
  Client.socket.emit('newplayer');
};

Client.socket.on('newplayer', function(data){
  console.log('socket data on newPlayer', data)
  game.addNewPlayer(data.id, data.x, data.y);
});

Client.socket.on('allplayers', function(data){
  console.log('socket data on allplayers', data);
  for (var i = 0; i < data.length; i++){
      game.addNewPlayer(data[i].id, data[i].x, data[i].y);
  }
});
