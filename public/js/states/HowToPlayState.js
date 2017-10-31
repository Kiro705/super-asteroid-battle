const HowToPlayState = {

    preload: function() {
        this.startingWait = 0
        this.canMove = false

    },

    create: function() {
        //Load Background and Text
        this.background = this.add.tileSprite(0, 0,  this.game.world.width, this.game.world.height, 'city')
        game.add.text(62, 58, 'W,A,S,D for Player 1 and Arrow Keys for Player 2', {font: '24pt Impact', fill: 'black'})
        game.add.text(62, 138, 'Move Left or Right with those Arrow Keys', {font: '24pt Impact', fill: 'black'})
        game.add.text(62, 218, 'Jump or Double Jump with the Up Arrow', {font: '24pt Impact', fill: 'black'})
        game.add.text(62, 298, 'Down + Left or Down + Right to Attack in that direction', {font: '24pt Impact', fill: 'black'})
        game.add.text(62, 378, 'Get the Power-Ups to help defeat your opponent', {font: '24pt Impact', fill: 'black'})
        game.add.text(62, 458, 'Spacebar to select and Backspace to go back', {font: '24pt Impact', fill: 'black'})
        game.add.text(398, 518, 'Press Y for Xbox controls', {font: '24pt Impact', fill: 'black'})
        game.add.text(65, 60, 'W,A,S,D for Player 1 and Arrow Keys for Player 2', {font: '24pt Impact', fill: 'white'})
        game.add.text(65, 140, 'Move Left or Right with those Arrow Keys', {font: '24pt Impact', fill: 'white'})
        game.add.text(65, 220, 'Jump or Double Jump with the Up Arrow', {font: '24pt Impact', fill: 'white'})
        game.add.text(65, 300, 'Down + Left or Down + Right to Attack in that direction', {font: '24pt Impact', fill: 'white'})
        game.add.text(65, 380, 'Get the Power-Ups to help defeat your opponent', {font: '24pt Impact', fill: 'white'})
        game.add.text(65, 460, 'Spacebar to select and Backspace to go back', {font: '24pt Impact', fill: 'white'})
        game.add.text(400, 520, 'Press Y for Xbox controls', {font: '24pt Impact', fill: 'white'})

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
            } else if (pad1.isDown(Phaser.Gamepad.XBOX360_Y)){
                this.state.start('XBOXControlState')
            }
        }
    }
}
