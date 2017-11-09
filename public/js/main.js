var game = new Phaser.Game(1200, 700, Phaser.AUTO)

//environment
var gamesToWin = 3 //3 as a default, can change in game
var inputDelay = 10 // Delay on menu inputs
var playerName = 'Private Pineapple Jr'
var pad1

game.state.add('GameState', GameState)
game.state.add('PreloadState', PreloadState)
game.state.add('BootState', BootState)
game.state.add('MenuState', MenuState)
game.state.add('HighScore', HighScore)
game.state.add('JoinGameState', JoinGameState)
game.state.add('HowToPlayState', HowToPlayState)
game.state.add('XBOXControlState', XBOXControlState)
game.state.start('BootState')
