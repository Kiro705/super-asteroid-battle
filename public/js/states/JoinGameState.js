const JoinGameState = {

    preload: function() {
        //Environment
        this.canMove = true
        this.moveCounter = 0
        this.isReady = false
        this.glowCounter = 0
	    this.isGlowing = false
    },

    create: function() {

        //Load Background and Title
        this.background = this.add.tileSprite(0, 0,  this.game.world.width, this.game.world.height, 'star_background')
		game.add.text(420, 200, 'NOT READY', {font: '58pt Megrim', fill: '#5C804B'})
		game.add.text(490, 360, 'READY', {font: '58pt Megrim', fill: '#5C804B'})
		shadow = game.add.text(420, 200, 'NOT READY', {font: '58pt Megrim', fill: '#77e843'})

		game.add.plugin(PhaserInput.Plugin);
		this.playerName = game.add.inputField(this.game.world.width / 2 - 100, 90, {
			font: '18px Arial',
			fill: '#212121',
			fontWeight: 'bold',
			width: 200,
			height: 25,
			padding: 8,
			borderWidth: 1,
			borderColor: '#000',
			borderRadius: 6,
			placeHolder: 'Enter Player Name',
			//type: PhaserInput.InputType.password
		});
		//console.log('input!!', playerName)

        //  Our controls.
        this.cursors = this.game.input.keyboard.createCursorKeys()
        this.spaceBar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        this.enter = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER)
        this.backspace = this.game.input.keyboard.addKey(Phaser.Keyboard.BACKSPACE)
    },

    update: function(){
		//Select Ready
		if (!this.canMove){
			this.moveCounter++
		}

		if (this.moveCounter > inputDelay){
            this.canMove = true
            this.moveCounter = 0
        }

		if (!this.isReady && this.cursors.down.isDown && this.canMove){
			this.isReady = true
			shadow.destroy()
			shadow = game.add.text(490, 360, 'READY', {font: '58pt Megrim', fill: '#77e843'})
		}

		if (this.isReady && this.cursors.up.isDown && this.canMove){
			this.isReady = false
			shadow.destroy()
			shadow = game.add.text(420, 200, 'NOT READY', {font: '58pt Megrim', fill: '#77e843'})
		}

		//Start Game
		if (this.isReady){
			if (this.spaceBar.isDown || this.enter.isDown){
				this.state.start('PreloadState', true, false, this.playerName.value)
			}
		}

		//Back to Menu
		if (this.backspace.isDown){
		this.state.start('MenuState')
		}
    }
}
