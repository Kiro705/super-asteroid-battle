const HighScore = {
  preload: function(){
    this.load.image('star_background', 'assets/star_background.png')

  },

  create: function(){

    this.background = this.add.tileSprite(0, 0,  this.game.world.width, this.game.world.height, 'star_background')
    this.backspace = this.game.input.keyboard.addKey(Phaser.Keyboard.BACKSPACE)
    this.colorArray = ['#ff33ff', '#66FC20', '#60FA19', '#59F810', '#51F207', '#4BDE06', '#46CE07', '#41BE07', '#3CB007', '#37A106']
    this.firstScore = null
    game.add.text(315, 50, 'HIGH SCORES', {font: '72pt Megrim', fill: 'white'})


    let highScores = []
    fetch('/api/all')
    .then(result => result.json())
    .then(data => {
      data.sort((a, b) => {
        return b.score - a.score
      });
      highScores = data.slice(0, 10)
      highScores.forEach((data, index) => {
        if (index === 0){
          this.firstScore = {name: data.name, score: data.score}
          game.add.text(345, 175 + index * 50, data.name, {font: '24pt Megrim', fill: this.colorArray[index]})
          game.add.text(800, 175 + index * 50, data.score, {font: '24pt Megrim', fill: this.colorArray[index]})
        } else {
          game.add.text(345, 175 + index * 50, data.name, {font: '24pt Megrim', fill: this.colorArray[index]})
          game.add.text(800, 175 + index * 50, data.score, {font: '24pt Megrim', fill: this.colorArray[index]})
        }
      })
    })

  },

  update: function(){
    if (this.backspace.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_B)){
      this.state.start('MenuState')
    }
  }
}
