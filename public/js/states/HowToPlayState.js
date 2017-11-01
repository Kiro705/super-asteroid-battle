const HowToPlayState = {

    WebFontConfig: {
        active: function() { game.time.events.add(Phaser.Timer.SECOND, createText, this); },
        google: {
          families: ['Megrim', 'Press Start 2P']
        }
    },

    preload: function() {
        this.startingWait = 0
        this.canMove = false
        this.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js')

    },

    create: function() {
        //Load Background and Text
        this.background = this.add.tileSprite(0, 0,  this.game.world.width, this.game.world.height, 'star_background')
        game.add.text(125, 60, 'Use the Arrow Keys to control your Space Ship', {font: '24pt Megrim', fill: '#77e843'})
        game.add.text(125, 140, 'Accelerate with the Up Arrow and Break with the Down Arrow', {font: '24pt Megrim', fill: '#77e843'})
        game.add.text(125, 220, 'Rotate your Ship with the Left and Right Arrows', {font: '24pt Megrim', fill: '#77e843'})
        game.add.text(125, 300, 'Use Spacebar to Shoot the Asteroids', {font: '24pt Megrim', fill: '#77e843'})
        game.add.text(125, 380, 'Collect Minerals from the Asteroids to Upgrade your Ship', {font: '24pt Megrim', fill: '#77e843'})
        game.add.text(125, 460, 'Spacebar to select and Backspace to go back in menus', {font: '24pt Megrim', fill: '#77e843'})
        game.add.text(700, 620, 'Press Y for Xbox controls', {font: '24pt Megrim', fill: '#77e843'})

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
