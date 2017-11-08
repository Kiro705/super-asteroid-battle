const HighScore = {
  preload: function(){
    this.load.image('star_background', 'assets/star_background.png')
    this.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js')

  },

  create: function(){

    this.background = this.add.tileSprite(0, 0,  this.game.world.width, this.game.world.height, 'star_background')
    this.backspace = this.game.input.keyboard.addKey(Phaser.Keyboard.BACKSPACE)
    game.add.text(344, 50, 'HIGH SCORE', {font: '72pt Megrim', fill: 'white'})


    let highScores = []
    fetch('/api/all')
    .then(result => result.json())
    .then(data => {
      data.sort((a, b) => {
        return b.score - a.score
      });
      highScores = data.slice(0, 10)
      console.log('done fetching', highScores)
      highScores.forEach((data, index) => {
        console.log('I am attempting to display high scores')
        game.add.text(345, 175 + index * 50, data.name, {font: '24pt Megrim', fill: '#66FB21'})
        game.add.text(800, 175 + index * 50, data.score, {font: '24pt Megrim', fill: '#66FB21'})
      })
    })

  },

  update: function(){
    if (this.backspace.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_B)){
      this.state.start('MenuState')
    } else if (pad1.isDown(Phaser.Gamepad.XBOX360_Y)){
      this.state.start('XBOXControlState')
    }
  }
}
