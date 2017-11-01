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

  WebFontConfig: {
    active: function() { game.time.events.add(Phaser.Timer.SECOND, createText, this); },
    google: {
      families: ['Megrim', 'Press Start 2P']
    }
  },

  preload: function(){
    this.load.image('star_background', 'assets/star_background.png')
    this.counter = 0
    this.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js')

    //spritePlane to turn gif into a spreadsheet
  },

  create: function() {
    //  We're going to be using physics, so enable the Arcade Physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE)

    //  A simple background for our game
    this.game.stage.backgroundColor = '#000000'
    this.background = this.add.tileSprite(0, 0,  this.game.world.width, this.game.world.height, 'star_background')
  },

  update: function() {
    this.counter++
    if (this.counter > 75){
      this.state.start('MenuState')
    }
    //This is load the Megrin font before it actually needs to be used
    if (this.counter === 1){
      game.add.text(344, 326, 'LOADING . . .', {font: '64pt Megrim', fill: 'black'})
    }
    if (this.counter === 2){
      game.add.text(344, 326, 'LOADING . . .', {font: '64pt Megrim', fill: '#e100ff'})
    }
  }
}
