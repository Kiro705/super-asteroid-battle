var BootState = {

  WebFontConfig: {
    active: function() { game.time.events.add(Phaser.Timer.SECOND, createText, this); },
    google: {
      families: ['Megrim', 'Press Start 2P']
    }
  },

  preload: function(){
    this.load.image('star_background', 'assets/star_background.png')
    this.counter = 0
    this.glowCounter = 0
    this.glowArray = [10, 19, 51, 56]
    this.isGlowing = false
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
    //This is to load the Megrin font before it actually needs to be used
    if (this.counter === 1){
      game.add.text(360, 326, 'LOADING . . .', {font: '64pt Megrim', fill: 'black'})
    }
    if (this.counter === 2){
      game.add.text(360, 326, 'LOADING . . .', {font: '64pt Megrim', fill: '#cc00cc'})
    }

    if (this.glowArray[0] === this.counter) {
      this.glowArray.shift()
      this.glowCounter = 0
      this.isGlowing = true
      glow = game.add.text(360, 326, 'LOADING . . .', {font: '64pt Megrim', fill: '#ff33ff'})
    }

    if (this.isGlowing){
      this.glowCounter++
    }

    if (this.glowCounter > 5){
      this.isGlowing = false
      glow.destroy()
    }
  }
}
