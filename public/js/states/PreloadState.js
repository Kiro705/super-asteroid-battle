var PreloadState = {

	preload: function(){
        //ships
        this.load.spritesheet('ship', 'assets/ship.png', 48, 60)
        this.load.spritesheet('otherShip', 'assets/otherShip.png', 48, 60)
        //dots
        this.load.spritesheet('redDot', 'assets/redDot.png', 2, 2)
        this.load.spritesheet('orangeDot', 'assets/orangeDot.png', 2, 2)
        this.load.spritesheet('whiteDot', 'assets/whiteDot.png', 2, 2)
        this.load.spritesheet('blackDot', 'assets/blackDot.png', 1, 1)
        //lasers
        this.load.spritesheet('redLaser', 'assets/redLaser.png', 5, 14)
        this.load.spritesheet('orangeLaser', 'assets/orangeLaser.png', 5, 14)
        this.load.spritesheet('yellowLaser', 'assets/yellowLaser.png', 5, 14)
        this.load.spritesheet('greenLaser', 'assets/greenLaser.png', 5, 14)
        this.load.spritesheet('blueLaser', 'assets/blueLaser.png', 5, 14)
        this.load.spritesheet('purpleLaser', 'assets/purpleLaser.png', 5, 14)
        //superLasers
        this.load.spritesheet('superBlue', 'assets/superBlue.png', 25, 10)
        this.load.spritesheet('superBlueTop', 'assets/superBlueTop.png', 25, 10)
        this.load.spritesheet('superRed', 'assets/superRed.png', 25, 10)
        this.load.spritesheet('superRedTop', 'assets/superRedTop.png', 25, 10)
        //asteroids
        this.load.spritesheet('asteroid', 'assets/asteroid.png', 55, 57)
        this.load.spritesheet('asteroidExplosion', 'assets/asteroidExplosion.png', 100, 100)
        this.load.spritesheet('redOre', 'assets/redOre.png', 21, 21)
        this.load.spritesheet('blueOre', 'assets/blueOre.png', 21, 21)
        this.load.spritesheet('greenOre', 'assets/greenOre.png', 21, 21)
        this.load.spritesheet('silverOre', 'assets/silverOre.png', 21, 21)
        this.load.spritesheet('fireOre', 'assets/fireOre.png', 21, 21)
        this.load.spritesheet('electricOre', 'assets/electricOre.png', 21, 21)
        this.load.spritesheet('rainbowOre', 'assets/rainbowOre.png', 21, 21)
        this.load.spritesheet('cometOre', 'assets/cometOre.png', 21, 21)
        //other
        this.load.spritesheet('expBar', 'assets/expBar.png', 248, 40)
        //spritePlane to turn gif into a spreadsheet
	},

	create: function(){
        this.state.start('GameState')
  }
}
