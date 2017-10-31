const GameState = {

    preload: function() {
        //environment
        this.gameOver = false
        this.gameOverCounter = 0
        this.occupied = [0, 0, 0, 0]
        this.isMegasword = false
        this.powerUpCount = 0
        this.powerUpSpawn = 0
        this.floatCounter = 0
        this.floatOn = false
        this.slowCounter = 0
        this.slowOn = false

        //Player
        this.attackRight = undefined
        this.attackLeft = undefined
        this.attackCooldown = 0
        this.canAttack = true
        this.isAlive = true
        this.speedup = 1
        this.sparksRight = undefined
        this.sparksLeft = undefined
        this.powerTimer = 0
        this.rightAttack = 'rightSword'
        this.leftAttack = 'leftSword'
        megaAdd = 0

    },

    create: function() {

        this.background = this.add.tileSprite(0, 0,  this.game.world.width, this.game.world.height, 'star_background')



        // The player and its settings
        player = game.add.sprite(575, 326, 'ship')
        player.anchor.set(0.5)
        player.level = 1

        //  We need to enable physics on the player
        game.physics.arcade.enable(player)

        //  Player physics properties
        player.body.bounce.x = 1
        player.body.bounce.y = 1
        player.body.collideWorldBounds = false

        //  Our two animations, walking left and right.
        //Add SWORDS
        rightSword = game.add.group()
        leftSword = game.add.group()
        rightSword.enableBody = true
        leftSword.enableBody = true


        //  Our controls.
        this.cursors = this.game.input.keyboard.createCursorKeys()
        this.spaceBar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        this.backspace = this.game.input.keyboard.addKey(Phaser.Keyboard.BACKSPACE)
    },
    update: function(){
        // ==============================PLAYER 1 SET UP =====================================
        //  Move to the left
        if (this.cursors.up.isDown){
            game.physics.arcade.accelerationFromRotation(player.rotation +Math.PI/2, -100, player.body.acceleration)
        } else if (this.cursors.down.isDown) {
            game.physics.arcade.accelerationFromRotation(player.rotation +Math.PI/2, 100, player.body.acceleration)
        } else {
            game.physics.arcade.accelerationFromRotation(player.rotation, 0, player.body.acceleration)
        }

        //Turning
        if (this.cursors.left.isDown) {
            player.body.angularVelocity = -200;
        } else if (this.cursors.right.isDown) {
            player.body.angularVelocity = 200;
        } else {
            player.body.angularVelocity = 0;
        }

        screenWrap(player)

        function screenWrap (sprite) {
            if (sprite.x < 0) {
                sprite.x = game.width;
            } else if (sprite.x > game.width) {
                sprite.x = 0;
            }

            if (sprite.y < 0) {
                sprite.y = game.height;
            } else if (sprite.y > game.height) {
                sprite.y = 0;
            }
        }

        //ATTACKING

        // if (this.attackCooldown > 8){
        //     if (this.attackRight){
        //         this.attackRight.kill()
        //     }
        //     if (this.attackLeft){
        //         this.attackLeft.kill()
        //     }
        // }

        // if (this.attackCooldown > 50){
        //     this.attackCooldown = 0
        //     this.canAttack = true
        // }
        // if (this.attackRight){
        //     this.attackRight.position.x = player.position.x + 18
        //     this.attackRight.position.y = player.position.y + 19
        // }

        // if (this.attackLeft){
        //     this.attackLeft.position.x = player.position.x - (27 + megaAdd)
        //     this.attackLeft.position.y = player.position.y + 19
        // }

        // if (this.canAttack && this.isAlive){
        //     if (this.dKey.isDown && this.sKey.isDown && !this.aKey.isDown){
        //         this.attackRight = rightSword.create(player.position.x + 18, player.position.y + 19, this.rightAttack)
        //         player.body.velocity.x = 1000
        //         this.canAttack = false
        //     }

        //     if (this.aKey.isDown && this.sKey.isDown){
        //         this.attackLeft = leftSword.create(player.position.x - (27 + megaAdd), player.position.y + 19, this.leftAttack)
        //         player.body.velocity.x = -1000
        //         this.canAttack = false
        //     }
        // } else {
        //     this.attackCooldown++
        // }

        //==============================DEATH AND GAME OVER!!!! =====================================
        // function killPlayer (playerOne, target) {
        //     despawn = game.add.sprite(playerOne.position.x, playerOne.position.y, 'despawn')
        //     despawn.animations.add('despawn', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], 10, false)
        //     playerOne.kill()
        //     this.isAlive = false
        //     score2++
        //     this.gameOver = true
        //     let titleSize2 = 668
        //     let orbSpaceing2 = 36
        //     game.add.sprite(titleSize2 - orbSpaceing2 * score2, 16, 'blueOrb')
        //     game.add.text(52, 97, 'PLAYER TWO', {font: '108pt Impact', fill: 'white'})
        //     game.add.text(232, 297, 'WINS', {font: '108pt Impact', fill: 'white'})
        //     game.add.text(55, 100, 'PLAYER TWO', {font: '108pt Impact', fill: 'black'})
        //     game.add.text(235, 300, 'WINS', {font: '108pt Impact', fill: 'black'})
        // }

      //   if (this.gameOver){
      //       despawn.animations.play('despawn')
      //       if (this.gameOverCounter > 115) {
      //           despawn.kill()
      //       }
      //       this.gameOverCounter++
      //   }
      //   if (this.gameOverCounter > 150){
      //       if (score === gamesToWin || score2 === gamesToWin) {
      //           game.add.text(116, 48, 'PRESS SPACE TO RETURN TO MENU', {font: '32pt Impact', fill: 'white'})
      //           game.add.text(118, 50, 'PRESS SPACE TO RETURN TO MENU', {font: '32pt Impact', fill: 'black'})
      //           if (this.spaceBar.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_B)) {
      //               this.state.start('MenuState')
      //           }
      //       } else {
      //           this.state.start('PreloadState')
      //       }
      //   }

      //   if (this.backspace.isDown){
      //   this.state.start('MenuState')
      // }
    }
}
