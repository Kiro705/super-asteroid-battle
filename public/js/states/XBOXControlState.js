const XBOXControlState = {

    preload: function() {
        this.startingWait = 0
        this.canMove = false

    },

    create: function() {
        //Load Background and Text
        this.background = this.add.tileSprite(0, 0,  this.game.world.width, this.game.world.height, 'city')
        game.add.text(62, 58, 'Plug in your Xbox 360 controller for Player 2', {font: '24pt Impact', fill: 'black'})
        game.add.text(62, 138, 'Left Thumb Stick to move left or right', {font: '24pt Impact', fill: 'black'})
        game.add.text(62, 218, 'Jump or Double Jump with the A Button', {font: '24pt Impact', fill: 'black'})
        game.add.text(62, 298, 'Attack Left or Right with the Triggers', {font: '24pt Impact', fill: 'black'})
        game.add.text(62, 378, 'The A Button to select and the B Button to go back', {font: '24pt Impact', fill: 'black'})
        game.add.text(65, 60, 'Plug in your Xbox 360 controller for Player 2', {font: '24pt Impact', fill: 'white'})
        game.add.text(65, 140, 'Left Thumb Stick to move left or right', {font: '24pt Impact', fill: 'white'})
        game.add.text(65, 220, 'Jump or Double Jump with the A Button', {font: '24pt Impact', fill: 'white'})
        game.add.text(65, 300, 'Attack Left or Right with the Triggers', {font: '24pt Impact', fill: 'white'})
        game.add.text(65, 380, 'The A Button to select and the B Button to go back', {font: '24pt Impact', fill: 'white'})

        //  Controls.
        this.backspace = this.game.input.keyboard.addKey(Phaser.Keyboard.BACKSPACE)
    },
    update: function(){
        if(!this.canMove){
            this.startingWait++
        }

        if(this.startingWait > 30){
            this.canMove = true
        }

        //Start mode
        if (this.canMove){
            if (this.backspace.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_B)){
                this.state.start('MenuState')
            }
        }
    }
}
