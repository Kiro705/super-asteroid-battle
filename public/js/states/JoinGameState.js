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
		game.add.text(420, 100, 'NOT READY', {font: '58pt Megrim', fill: '#5C804B'})
		game.add.text(520, 260, 'Enter Your Name', {font: '16pt Megrim', fill: '#66FB21'})
		game.add.text(490, 450, 'READY', {font: '58pt Megrim', fill: '#5C804B'})
		shadow = game.add.text(420, 100, 'NOT READY', {font: '58pt Megrim', fill: '#77e843'})

		game.add.plugin(PhaserInput.Plugin);
		this.nameInput = game.add.inputField(this.game.world.width / 2 - 200, 290, {
			font: '36px Megrim',
			fill: '#66FB21',
			fontWeight: 'bold',
			backgroundColor: 'black',
			width: 400,
			height: 40,
			padding: 8,
			borderWidth: 3,
			borderColor: '#5C804B',
			borderRadius: 6,
			placeHolder: playerName,
		});

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

		if (this.cursors.down.isDown || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1){
			if (!this.isReady && this.canMove){
				this.isReady = true
				this.canMove = false
				shadow.destroy()
				shadow = game.add.text(490, 450, 'READY', {font: '58pt Megrim', fill: '#77e843'})
			}
		}

		if (this.cursors.up.isDown || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1){
			if (this.isReady && this.canMove){
				this.canMove = false
				this.isReady = false
				shadow.destroy()
				shadow = game.add.text(420, 100, 'NOT READY', {font: '58pt Megrim', fill: '#77e843'})
			}
		}

		//Start Game

		if (this.isReady){
			if (this.spaceBar.isDown || this.enter.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_A)){
				if (this.nameInput.value.length){
					playerName = this.nameInput.value.slice(0, 19)
				}
				this.state.start('PreloadState')
			}
		}

		//Back to Menu
		if (this.backspace.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_B)){
		this.state.start('MenuState')
		}
    }
}
