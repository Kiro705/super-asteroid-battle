const JoinGameState = {

    preload: function() {
        //Environment
        this.canMove = true
        this.moveCounter = 0
        this.isReady = false
    },

    create: function() {
        //Load Background and Title
        this.background = this.add.tileSprite(0, 0,  this.game.world.width, this.game.world.height, 'star_background')
		game.add.text(420, 200, 'NOT READY', {font: '58pt Megrim', fill: 'gray'})
		game.add.text(490, 360, 'READY', {font: '58pt Megrim', fill: 'gray'})
		shadow = game.add.text(420, 200, 'NOT READY', {font: '58pt Megrim', fill: '#77e843'})

        //  Our controls.
        this.cursors = this.game.input.keyboard.createCursorKeys()
        this.spaceBar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        this.enter = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER)
        this.backspace = this.game.input.keyboard.addKey(Phaser.Keyboard.BACKSPACE)
    },

    update: function(){
		//Select Ready
		if(!this.canMove){
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
				this.state.start('PreloadState')
			}
		}

		//Back to Menu
		if (this.backspace.isDown){
		this.state.start('MenuState')
		}
    }
}
