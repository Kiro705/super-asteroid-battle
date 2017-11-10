var game = new Phaser.Game(1200, 700, Phaser.AUTO)

//environment
const inputDelay = 10 // Delay on menu inputs
let playerName = null
let playerRank = null
const defaultPlayerName = 'Private Pineapple Jr'
const maxShipSpeed = 400
const shipAcceleration = 500
const shipTurningSpeed = 320
const superAttackCooldown = 200
const mainAttackCooldown = 15
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
