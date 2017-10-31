var PreloadState = {

	preload: function(){
    this.load.image('ground', 'assets/ground.png')
    this.load.image('pillar', 'assets/pillar.png')
    this.load.image('platform', 'assets/platform.png')
    this.load.image('SPEED', 'assets/speedUp.png')
    this.load.image('FLOAT', 'assets/float.png')
    this.load.image('SLOWDOWN', 'assets/slowDown.png')
    this.load.image('megaswordPowerup', 'assets/megaswordPowerup.png')
    this.load.image('title1', 'assets/Player1Title.png')
    this.load.image('title2', 'assets/Player2Title.png')
	this.load.image('emptyOrb', 'assets/emptyWin1.png')
    this.load.image('emptyOrb2', 'assets/emptyWin2.png')
    this.load.image('redOrb', 'assets/redWin.png')
    this.load.image('blueOrb', 'assets/blueWin.png')
    this.load.spritesheet('despawn', 'assets/despawn.png', 27, 36)
    this.load.spritesheet('rightSword', 'assets/rightSword.png', 42, 18)
    this.load.spritesheet('leftSword', 'assets/leftSword.png', 42, 18)
    this.load.spritesheet('megaRight', 'assets/megaswordRight.png', 84, 21)
    this.load.spritesheet('megaLeft', 'assets/megaswordLeft.png', 84, 21)
    this.load.spritesheet('leftSparks', 'assets/speedupRight.png', 32, 32)
    this.load.spritesheet('rightSparks', 'assets/speedupLeft.png', 32, 32)
    //spritePlane to turn gif into a spreadsheet
	},
	create: function(){
    //Select starting map
    if (mapChoice === 0) {
        mapChoice = Math.floor(Math.random() * 3 + 1)
    } else if (mapChoice === 3) {
        mapChoice = 1
    } else {
        mapChoice++
    }

    //reset game speed
    game.time.slowMotion = 1.0

    if (mapChoice === 1) {
        //Level 1
        powerLocations = [[80, 40], [700, 40], [55, 470], [725, 470], [388, 100], [388, 425]]
        pillarLocations = [[250, 150], [525, 150]]
        platformLocations = [[350, 250], [275, 430], [425, 430], [0, 450], [700, 450], [150, 345], [550, 345], [0, 240], [700, 240], [50, 120], [650, 120]]
        spawnLocations = [[32, 250], [748, 250]]

    } else if (mapChoice === 2) {
        //Level 2
        powerLocations = [[213, 160], [563, 160], [325, 400], [448, 400], [388, 505], [388, 20]]
        pillarLocations = [[375, 180], [400, 180]]
        platformLocations = [[0, 330], [700, 330], [0, 120], [700, 120], [300, 120], [400, 120], [175, 220], [525, 220], [100, 440], [200, 460], [300, 480], [400, 480], [500, 460], [600, 440]]
        spawnLocations = [[32, 250], [748, 250]]
    } else if (mapChoice === 3) {
        //Level 3
        powerLocations = [[176, 451], [601, 451], [138, 140], [638, 140], [388, 230], [388, 240]]
        pillarLocations = [[375, -100], [400, -100], [375, 300], [400, 300]]
        platformLocations = [[625, 450], [500, 450], [562, 430], [75, 450], [200, 450], [138, 430], [100, 200], [600, 200], [275, 300], [425, 300], [0, 300], [700, 300], [275, 100], [425, 100]]
        spawnLocations = [[325, 45], [443, 45]]
    }

    setTimeout(this.state.start('GameState', 5000))
  }
}
