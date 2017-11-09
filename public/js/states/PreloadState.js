var PreloadState = {

    init: function(playerName){
      this.playerName = playerName
    },

	preload: function(){
    this.load.spritesheet('ship', 'assets/ship.png', 48, 60)
    this.load.spritesheet('otherShip', 'assets/otherShip.png', 48, 60)
    this.load.spritesheet('redDot', 'assets/redDot.png', 2, 2)
    this.load.spritesheet('orangeDot', 'assets/orangeDot.png', 2, 2)
    this.load.spritesheet('whiteDot', 'assets/whiteDot.png', 2, 2)
    this.load.spritesheet('yellowLaser', 'assets/yellowLaser.png', 5, 14)
    this.load.spritesheet('redLaser', 'assets/redLaser.png', 5, 14)
    this.load.spritesheet('greenLaser', 'assets/greenLaser.png', 5, 14)
    this.load.spritesheet('blueLaser', 'assets/blueLaser.png', 5, 14)
    this.load.spritesheet('asteroid', 'assets/asteroid.png', 55, 57)
    this.load.spritesheet('asteroidExplosion', 'assets/asteroidExplosion.png', 100, 100)
    this.load.spritesheet('expBar', 'assets/expBar.png', 248, 40)
    this.load.spritesheet('ore', 'assets/ore.png', 21, 21)
    //spritePlane to turn gif into a spreadsheet
    },

	create: function(){
    setTimeout(this.state.start('GameState', 5000, false, this.playerName))
  }
}
