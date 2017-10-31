var game = new Phaser.Game(1200, 700, Phaser.AUTO)

//environment
var gamesToWin = 3 //3 as a default, can change in game
var inputDelay = 10 // Delay on menu inputs
var powerupTimer = 400 // How long powerups last on players
var powerupsSpawn = 700 // How often powerups spawn
var megaswordSpawn = 1200 //How long until the Megasword appears
var floatAmount = 300 //How much gravity changes to
var characterArray = ['Chow', 'EvilChow', 'Kagu', 'Slick']
var powerLocations = []
var pillarLocations = []
var platformLocations = []
var spawnLocations = []
var mapChoice = 0
var pad1

//Player 1
var score = 0
var character = 0
var weapon = 0
var megaAdd = 0 //Adjust Megasword left attack(Turns to 42px)

//Player 2
var score2 = 0
var character2 = 1
var weapon2 = 0
var megaAdd2 = 0 //Adjust Megasword left attack(Turns to 42px)


game.state.add('GameState', GameState)
game.state.add('PreloadState', PreloadState)
game.state.add('BootState', BootState)
game.state.add('MenuState', MenuState)
game.state.add('DuelOptionState', DuelOptionState)
game.state.add('HowToPlayState', HowToPlayState)
game.state.add('XBOXControlState', XBOXControlState)
game.state.start('BootState')