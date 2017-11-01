var PreloadState = {

	preload: function(){
    this.load.spritesheet('ship', 'assets/ship.png', 48, 60)
    this.load.spritesheet('yellowLaser', 'assets/yellowLaser.png', 5, 14)
    //spritePlane to turn gif into a spreadsheet
	},
	create: function(){
    setTimeout(this.state.start('GameState', 5000))
  }
}
