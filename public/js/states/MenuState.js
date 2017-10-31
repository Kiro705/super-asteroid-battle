const MenuState = {

    preload: function() {
        //environment
        this.selected = 0
        this.selectArray = ['DUEL', 'ADVENTURE', 'HOW TO PLAY']
        this.load.image('title', 'assets/title.png')
        this.load.image('star_background', 'assets/star_background.png')
        this.load.image('arrow', 'assets/arrow.png')
        this.canMove = true
        this.moveCounter = 0
        this.shadowX = 223
        this.shadowY = 303
        this.adventureCheck = false
    },

    create: function() {
        //Load Background and Title
        this.background = this.add.tileSprite(0, 0,  this.game.world.width, this.game.world.height, 'star_background')
        game.add.image(180, 30, 'title')
        //game.add.text(65, 60, 'SUPER DUEL', {font: '108pt Impact', fill: 'black'})
        game.add.text(220, 300, this.selectArray[this.selected], {font: '42pt Impact', fill: 'gray'})
        shadow = game.add.text(this.shadowX, this.shadowY, 'DUEL', {font: '42pt Impact', fill: '#AF1010'})
        game.add.text(220, 375, 'ADVENTURE', {font: '42pt Impact', fill: 'gray'})
        game.add.text(220, 450, 'HOW TO PLAY', {font: '42pt Impact', fill: 'gray'})
        arrow = game.add.sprite(168, 312, 'arrow')
        arrow.enableBody = true

        //Reset Scores
        score = 0
        score2 = 0

        //reset map cycle
        mapChoice = 0

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
        // console.log(game.input)

        // if (game.input.gamepad.supported && game.input.gamepad.active && pad1.connected) {
        //     console.log('Controller is connected!');
        // } else {
        //     console.log('controller not connected :(')
        //     console.log('suported:', game.input.gamepad.supported, 'active:', game.input.gamepad.active, 'connected:', pad1.connected)
        // }
    },
    update: function(){
        // if (pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1) {
        //     console.log(pad1)
        // }

        //Select Mode
        if (this.wKey.isDown || this.cursors.up.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1){
            if (this.canMove && this.selectArray[this.selected] !== 'DUEL'){
                arrow.position.y -= 75
                this.selected--
                shadow.destroy()
                this.shadowY -= 75
                shadow = game.add.text(this.shadowX, this.shadowY, this.selectArray[this.selected], {font: '42pt Impact', fill: '#AF1010'})
                this.canMove = false
            }
        }
        if (this.sKey.isDown || this.cursors.down.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1){
            if (this.canMove && this.selectArray[this.selected] !== 'HOW TO PLAY'){
                arrow.position.y += 75
                this.selected++
                shadow.destroy()
                this.shadowY += 75
                shadow = game.add.text(this.shadowX, this.shadowY, this.selectArray[this.selected], {font: '42pt Impact', fill: '#AF1010'})
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
        if (this.spaceBar.isDown || this.enter.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_A)){
            let selection = this.selectArray[this.selected]
            if (selection === 'DUEL'){
                this.state.start('DuelOptionState')
            } else if (selection === 'ADVENTURE' && !this.adventureCheck){
                game.add.text(500, 400, 'NO ADVENTURE MODE YET', {font: '14pt Ariel', fill: 'gray'})
                this.adventureCheck = true
            } else if (selection === 'HOW TO PLAY'){
                this.state.start('HowToPlayState')
            }
        }
    }
}