const GameState = {

    preload: function() {
        //environment
        this.fireLaser = function() {
            if (game.time.now > this.laserTime) {
                shot = lasers.getFirstExists(false)
                if (shot) {
                    shot.reset(player.body.x + 23, player.body.y + 23)
                    shot.lifespan = 4000
                    shot.rotation = player.rotation
                    game.physics.arcade.velocityFromRotation(player.rotation - Math.PI / 2, 500, shot.body.velocity);
                    this.laserTime = game.time.now + 50
                }
            }
        }
        this.gameOver = false
        this.gameOverCounter = 0
        this.laserTime = 0

        //Player
        this.attackCooldown = 0
        this.canAttack = true
        this.isAlive = true

    },

    create: function() {
        this.playerMap = {};
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
        player.body.maxVelocity.set(400);

        //  Player Animations
        player.animations.add('forward', [1, 1, 1, 1, 0, 1, 1, 0], 20, true)
        player.animations.add('reverse', [2, 2, 2, 2, 0, 2, 2, 0], 20, true)

        //Add LASERS
        lasers = game.add.group()
        lasers.enableBody = true

        lasers.createMultiple(200, 'blueLaser');
        lasers.setAll('anchor.x', 0.5)
        lasers.setAll('anchor.y', 0.5)


        //  Our controls.
        this.cursors = this.game.input.keyboard.createCursorKeys()
        this.spaceBar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        this.backspace = this.game.input.keyboard.addKey(Phaser.Keyboard.BACKSPACE)

        //console.log('player position', player.body.x, player.body.y)
        Client.askNewPlayer(player.body.x, player.body.y);

    },


    update: function(){
        // ==============================PLAYER 1 SET UP =====================================
        //  Acceleration
        if (this.cursors.up.isDown){
            game.physics.arcade.accelerationFromRotation(player.rotation + Math.PI / 2, -100, player.body.acceleration)
            player.animations.play('forward')
        } else if (this.cursors.down.isDown) {
            game.physics.arcade.accelerationFromRotation(player.rotation + Math.PI / 2, 100, player.body.acceleration)
            player.animations.play('reverse')
        } else {
            game.physics.arcade.accelerationFromRotation(player.rotation, 0, player.body.acceleration)
            player.animations.stop()
            player.frame = 0
        }

        //Turning
        if (this.cursors.left.isDown) {
            player.body.angularVelocity = -200;
        } else if (this.cursors.right.isDown) {
            player.body.angularVelocity = 200;
        } else {
            player.body.angularVelocity = 0;
        }

        Client.movePlayer(player.body.x, player.body.y, player.rotation)


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

        if (!this.canAttack){
            this.attackCooldown++
        }

        if (this.attackCooldown > 10){
            this.attackCooldown = 0
            this.canAttack = true
        }

        if (this.spaceBar.isDown) {
            if (this.canAttack) {
                this.fireLaser()
                this.canAttack = false
            }
        }

        if (this.backspace.isDown){
        this.state.start('MenuState')
        }

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

    },

    addNewPlayer: function(id, x, y){
        console.log('adding a new player', id)
        this.playerMap[id] = this.game.add.sprite(x, y, 'otherShip');
        this.playerMap[id].anchor.set(0.5)
    },

    removePlayer: function(id){
        console.log('gamestate removing ship', id)
        this.playerMap[id].destroy();
        delete this.playerMap[id];
    },

    movePlayer: function(id, x, y, rotation){
        console.log('TOTALLY MOVING THE PLAYER')
        this.playerMap[id].position.x = x
        this.playerMap[id].position.y = y
        this.playerMap[id].rotation = rotation
    }
}

