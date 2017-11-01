const socket = io();

socket.on('connect', () => {
  console.log('I am now connected to the server!');

  // socket.on('new-message', message => {
  //   store.dispatch(getMessage(message));
  // });
  // socket.on('new-channel', channel => {
  //   console.log('socket channel: ', channel)
  //   store.dispatch(getChannel(channel));
  // });
});
