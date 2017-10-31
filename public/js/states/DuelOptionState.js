const DuelOptionState = {

    preload: function() {
    		//load characters
    		for (var i = 0; i < characterArray.length; i++) {
    			this.load.spritesheet( characterArray[i], 'assets/'+ characterArray[i] + '.png', 32, 42)
    		}
        //Environment
        this.selected = 0
        this.selected2 = 0
        this.selectArray = ['CHARACTER', 'READY']
        this.arrowPosition = [[120, 240], [270, 510]]
        this.arrowPosition2 = [[624, 240], [480, 510]]
        this.load.image('arrow2', 'assets/arrow2.png')
        this.canEditRounds = true
        this.roundsCounter = 0
        this.canMove = true
        this.moveCounter = 0
        this.canMove2 = true
        this.moveCounter2 = 0
        this.isReady = undefined

        this.makeCharacter = function() {
        	characterSelector = game.add.sprite(190, 240, characterArray[character])
	        characterSelector.animations.add('waiting', [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 6, 7, 8, 5, 6, 7, 8, 5, 6, 7, 8], 10, true)
	        characterNameShadow = game.add.text(178, 298, characterArray[character], {font: '20pt Impact', fill: 'black'})
	        characterName = game.add.text(180, 300, characterArray[character], {font: '20pt Impact', fill: 'darkred'})
        }

        this.moveArrow = function() {
        	arrow.position.x = this.arrowPosition[this.selected][0]
        	arrow.position.y = this.arrowPosition[this.selected][1]
        }

        this.makeCharacter2 = function() {
        	characterSelector2 = game.add.sprite(578, 240, characterArray[character2])
	        characterSelector2.animations.add('waiting2', [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 4, 4, 4, 4], 10, true)
	        characterNameShadow2 = game.add.text(562, 298, characterArray[character2], {font: '20pt Impact', fill: 'black'})
	        characterName2 = game.add.text(564, 300, characterArray[character2], {font: '20pt Impact', fill: '#3399FF'})
        }

        this.moveArrow2 = function() {
        	arrow2.position.x = this.arrowPosition2[this.selected2][0]
        	arrow2.position.y = this.arrowPosition2[this.selected2][1]
        }

    },

    create: function() {
        //Load Background and Title
        this.background = this.add.tileSprite(0, 0,  this.game.world.width, this.game.world.height, 'star_background')
        game.add.text(158, 58, '-', {font: '42pt Impact', fill: 'gold'})
        rounds = game.add.text(160, 60, '-  ROUNDS TO WIN: ' + gamesToWin, {font: '42pt Impact', fill: 'black'})
        game.add.text(613, 58, '+', {font: '42pt Impact', fill: 'gold'})
        game.add.text(615, 60, '+', {font: '42pt Impact', fill: 'black'})
        game.add.text(260, 170, 'CHARACTER SELECT', {font: '28pt Impact', fill: 'black'})
        //game.add.text(278, 350, 'WEAPON SELECT', {font: '28pt Impact', fill: 'gray'})
        game.add.text(330, 500, 'READY', {font: '42pt Impact', fill: 'gray'})
        arrow = game.add.sprite(120, 240, 'arrow')
        arrow.enableBody = true
        this.makeCharacter()

        arrow2 = game.add.sprite(638, 240, 'arrow2')
        arrow2.enableBody = true
        this.makeCharacter2()

        //Reset Scores
        score = 0
        score2 = 0

        //  Our controls.
        this.cursors = this.game.input.keyboard.createCursorKeys()
        this.spaceBar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        this.enter = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER)
        this.wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W)
        this.aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A)
        this.sKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S)
        this.dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D)
        this.plusKey = this.game.input.keyboard.addKey(Phaser.Keyboard.EQUALS)
        this.minusKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UNDERSCORE)
        this.backspace = this.game.input.keyboard.addKey(Phaser.Keyboard.BACKSPACE)
    },
    update: function(){
			//Select Rounds
			if (!this.canEditRounds){
          this.roundsCounter++
      }

      if (this.roundsCounter > inputDelay){
          this.canEditRounds = true
          this.roundsCounter = 0
      }

			if (this.plusKey.isDown && this.canEditRounds && gamesToWin < 5){
				gamesToWin++
				rounds.destroy()
				rounds = game.add.text(160, 60, '-  ROUNDS TO WIN: ' + gamesToWin, {font: '42pt Impact', fill: 'black'})
				this.canEditRounds = false
			}

			if (this.minusKey.isDown && this.canEditRounds && gamesToWin > 1){
				gamesToWin--
				rounds.destroy()
				rounds = game.add.text(160, 60, '-  ROUNDS TO WIN: ' + gamesToWin, {font: '42pt Impact', fill: 'black'})
				this.canEditRounds = false
			}

			characterSelector.animations.play('waiting')
			characterSelector2.animations.play('waiting2')
			// ==============================PLAYER 1 SET UP =====================================
      if (!this.canMove){
          this.moveCounter++
      }

      if (this.moveCounter > inputDelay){
          this.canMove = true
          this.moveCounter = 0
      }
      //Character select
			if (this.selectArray[this.selected] === 'CHARACTER'){
				if (this.dKey.isDown && this.canMove){
					if (character === characterArray.length - 1) {
						character = 0
					} else {
						character++
					}
					characterNameShadow.destroy()
					characterSelector.kill()
					characterName.destroy()
					this.makeCharacter()
					this.canMove = false
				}
			}

			if (this.selectArray[this.selected] === 'CHARACTER'){
				if (this.aKey.isDown && this.canMove){
					if (character === 0) {
						character = characterArray.length - 1
					} else {
						character--
					}
					characterNameShadow.destroy()
					characterSelector.kill()
					characterName.destroy()
					this.makeCharacter()
					this.canMove = false
				}
			}

			//Menu Select
			if (this.wKey.isDown && this.canMove) {
				if (this.selectArray[this.selected] !== 'CHARACTER') {
					this.selected--
					this.moveArrow()
					this.canMove = false
				}
			}

			if (this.sKey.isDown && this.canMove) {
				if (this.selectArray[this.selected] !== 'READY') {
					this.selected++
					this.moveArrow()
					this.canMove = false
				}
			}

			// ==============================PLAYER 2 SET UP =====================================
			if (!this.canMove2){
          this.moveCounter2++
      }

      if (this.moveCounter2 > inputDelay){
          this.canMove2 = true
          this.moveCounter2 = 0
      }
      //Character select
			if (this.selectArray[this.selected2] === 'CHARACTER' && this.canMove2){
				if (this.cursors.right.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1) {
					if (character2 === characterArray.length - 1) {
						character2 = 0
					} else {
						character2++
					}
					characterNameShadow2.destroy()
					characterSelector2.kill()
					characterName2.destroy()
					this.makeCharacter2()
					this.canMove2 = false
				}
				if (this.cursors.left.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1){
					if (character2 === 0) {
						character2 = characterArray.length - 1
					} else {
						character2--
					}
					characterNameShadow2.destroy()
					characterSelector2.kill()
					characterName2.destroy()
					this.makeCharacter2()
					this.canMove2 = false
				}
			}

			//Menu Select
			if(this.canMove2){
				if (this.cursors.up.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1) {
					if (this.selectArray[this.selected2] !== 'CHARACTER') {
						this.selected2--
						this.moveArrow2()
						this.canMove2 = false
					}
				}

				if (this.cursors.down.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1) {
					if (this.selectArray[this.selected2] !== 'READY') {
						this.selected2++
						this.moveArrow2()
						this.canMove2 = false
					}
				}
			}

      //Start mode
      if (this.selectArray[this.selected] === 'READY' && this.selectArray[this.selected2] === 'READY'){
      	if (!this.isReady) {
      		this.isReady = game.add.text(332, 502, 'READY', {font: '42pt Impact', fill: 'gold'})
      	}
      	if (this.spaceBar.isDown || this.enter.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_A)) {
      		this.state.start('PreloadState')
      	}
      }

      if (this.selectArray[this.selected] !== 'READY' || this.selectArray[this.selected2] !== 'READY') {
      	if (this.isReady){
      		this.isReady.destroy()
      		this.isReady = undefined
      	}
      }

      //Back to Menu
      if (this.backspace.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_B)){
      	this.state.start('MenuState')
      }
    }
}