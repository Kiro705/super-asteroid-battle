const XBOXControlState = {

    preload: function() {
        this.startingWait = 0
        this.canMove = false
        this.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js')

    },

    create: function() {
        //Load Background and Text
        this.background = this.add.tileSprite(0, 0,  this.game.world.width, this.game.world.height, 'star_background')
        game.add.text(125, 60, 'XBOX 360 Controls', {font: '32pt Megrim', fill: '#77e843'})
        game.add.text(125, 140, 'Accelerate with the A Button and Break with the B Button', {font: '24pt Megrim', fill: '#77e843'})
        game.add.text(125, 220, 'Rotate your Ship with the Left Thumb Stick', {font: '24pt Megrim', fill: '#77e843'})
        game.add.text(125, 300, 'Use the Right Trigger to Shoot the Asteroids', {font: '24pt Megrim', fill: '#77e843'})
        game.add.text(125, 380, 'Collect Minerals from the Asteroids to Upgrade your Ship', {font: '24pt Megrim', fill: '#77e843'})
        game.add.text(125, 460, 'A Button to select and B Button to go back in menus', {font: '24pt Megrim', fill: '#77e843'})

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
