var BootState = {

  // init: function(){
  //   this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  //   this.scale.pageAlignHorizontally = true;
  //   this.game.physics.startSystem(Phaser.Physics.ARCADE)
  //   this.game.physics.arcade.gravity.y = 5;
  //   this.game.world.setBounds(0, 0, 1400, 750)
  //   // this.cursors = this.game.input.keyboard.createCursorKeys();
  //   //this.HERO_MOVEMENT = 100;
  // },

  preload: function(){
  	// A Logo maybe

    //spritePlane to turn gif into a spreadsheet
  },

  create: function() {
    //  We're going to be using physics, so enable the Arcade Physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE)

    //  A simple background for our game
    this.game.stage.backgroundColor = '#000000'
    this.state.start('MenuState')
  }
}
