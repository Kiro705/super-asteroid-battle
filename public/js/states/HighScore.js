const HighScore = {
  preload: function(){
    this.load.image('star_background', 'assets/star_background.png')
  },

  create: function(){

    this.background = this.add.tileSprite(0, 0,  this.game.world.width, this.game.world.height, 'star_background')

    let highScores = []
    fetch('/api/all')
    .then(result => result.json())
    .then(data => {
      data.sort((a, b) => {
        return b.score - a.score
      });
      highScores = data.slice(0, 10)
      console.log('done fetching', highScores)
    })

  },

  update: function(){

  }
}
