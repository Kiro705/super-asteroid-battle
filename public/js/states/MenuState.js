const MenuState = {

    preload: function() {
        //environment
        this.selected = 0
        this.selectArray = ['PLAY', 'HIGH SCORES', 'HOW TO PLAY']
        this.load.image('star_background', 'assets/star_background.png')
        this.canMove = false
        this.moveCounter = 0
	    this.isGlowing = false
	    this.glowCounter = 0
	    this.shadowX = 430
        this.shadowY = 400
        this.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js')

    },

    WebFontConfig: {
	    active: function() { game.time.events.add(Phaser.Timer.SECOND, createText, this); },
	    google: {
	      families: ['Megrim', 'Press Start 2P']
	    }
	},

    create: function() {

        //Load Background and Title
        this.background = this.add.tileSprite(0, 0,  this.game.world.width, this.game.world.height, 'star_background')

        game.add.text(254, 50, 'SUPER ASTEROID', {font: '72pt Megrim', fill: 'white'})
        game.add.text(414, 126, 'BATTLE', {font: '84pt Megrim', fill: '#cc00cc'})
        game.add.text(430, 400, this.selectArray[this.selected], {font: '42pt Megrim', fill: '#5C804B'})
        shadow = game.add.text(this.shadowX, this.shadowY, 'PLAY', {font: '42pt Megrim', fill: '#66FB21'})
        game.add.text(430, 475, 'HIGH SCORES', {font: '42pt Megrim', fill: '#5C804B'})
        game.add.text(430, 550, 'HOW TO PLAY', {font: '42pt Megrim', fill: '#5C804B'})

        if (!playerName){
            playerName = defaultPlayerName
        }

        //  Our controls.
        this.cursors = this.game.input.keyboard.createCursorKeys()
        this.enter = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER)
        this.spaceBar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        this.wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W)
        this.aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A)
        this.sKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S)
        this.dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D)

        //xbox 360 controller setup
        game.input.gamepad.start()
        pad1 = game.input.gamepad.pad1
    },
    update: function(){
        //Select Mode
        if (this.wKey.isDown || this.cursors.up.isDown /*|| pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) */|| pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1){
            if (this.canMove && this.selectArray[this.selected] !== 'PLAY'){
                this.selected--
                shadow.destroy()
                this.shadowY -= 75
                shadow = game.add.text(this.shadowX, this.shadowY, this.selectArray[this.selected], {font: '42pt Megrim', fill: '#66FB21'})
                this.canMove = false
            }
        }
        if (this.sKey.isDown || this.cursors.down.isDown /*|| pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) */|| pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1){
            if (this.canMove && this.selectArray[this.selected] !== 'HOW TO PLAY'){
                this.selected++
                shadow.destroy()
                this.shadowY += 75
                shadow = game.add.text(this.shadowX, this.shadowY, this.selectArray[this.selected], {font: '42pt Megrim', fill: '#66FB21'})
                this.canMove = false
            }
        }

        if (!this.canMove){
            this.moveCounter++
        }

        if (this.moveCounter > inputDelay){
            this.canMove = true
            this.moveCounter = 0
        }

        //Start mode
        if (this.canMove && (this.spaceBar.isDown || this.enter.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_A))){
            let selection = this.selectArray[this.selected]
            if (selection === 'PLAY'){
                this.state.start('JoinGameState')
            } else if (selection === 'HIGH SCORES'){
                // game.add.text(465, 530, 'CANNOT SEE HIGH SCORES YET', {font: '14pt Megrim', fill: '#5C804B'})
                this.state.start('HighScore')
            } else if (selection === 'HOW TO PLAY'){
                this.state.start('HowToPlayState')
            }
        }

        //Glowing
		if (!this.isGlowing){
			temp = Math.random()
			if (temp < 0.04){
				this.isGlowing = true
				glow = game.add.text(414, 126, 'BATTLE', {font: '84pt Megrim', fill: '#ff33ff'})
			}
		}

		if (this.isGlowing){
			this.glowCounter++
	    }

	    if (this.glowCounter > 7){
			this.isGlowing = false
			this.glowCounter = 0
			glow.destroy()
	    }
    }
}
