const GameState = {

    hitAsteroid: function(laser, asteroid) {
        laser.kill()
        asteroid.damage++
        if (asteroid.damage === 1){
            asteroid.frame = 1
        } else if (asteroid.damage === 2){
            asteroid.frame = 2
        } else if (asteroid.damage === 3){
            asteroid.destroy()
        }
    },

    playerHit: function(player, asteroid){
        player.kill()
        asteroid.kill()
        this.isAlive = false
    },

    makeAsteroid: function(asteroid) {
        console.log('5. creating asteroid sprite')
        this.asteroidCounter = 0
        let newAsteroidnpm
        let random = Math.random() > 0.5
        upOrDown = random ? 1 : -1
        if (asteroid.side === 0){
            newAsteroid = asteroids.create(location * 12, 1, 'asteroid')
            newAsteroid.body.velocity.x = asteroid.velocityObj.x * upOrDown
            newAsteroid.body.velocity.y = asteroid.velocityObj.y
        } else if (asteroid.side === 1){
            newAsteroid = asteroids.create(1199, asteroid.location * 7, 'asteroid')
            newAsteroid.body.velocity.x = asteroid.velocityObj.x * -1
            newAsteroid.body.velocity.y = asteroid.velocityObj.y + upOrDown
        } else if (asteroid.side === 2) {
            newAsteroid = asteroids.create(asteroid.location * 12, 699, 'asteroid')
            newAsteroid.body.velocity.x = asteroid.velocityObj.x * upOrDown
            newAsteroid.body.velocity.y = asteroid.velocityObj.y * -1
        } else {
            newAsteroid = asteroids.create(1199, asteroid.location * 7, 'asteroid')
            newAsteroid.body.velocity.x = asteroid.velocityObj.x
            newAsteroid.body.velocity.y = asteroid.velocityObj.y * upOrDown
        }

        newAsteroid.anchor.set(0.5)
        newAsteroid.damage = 0
        newAsteroid.body.angularVelocity = asteroid.rotation
    },

    preload: function() {
        this.fireLaser = function() {
            if (game.time.now > this.laserTime) {
                shot = lasers.getFirstExists(false)
                if (shot) {
                    shot.reset(player.body.x + 23, player.body.y + 23)
                    shot.lifespan = 4000
                    shot.rotation = player.rotation
                    shot.anchor.set(0.5)
                    game.physics.arcade.velocityFromRotation(player.rotation - Math.PI / 2, 500, shot.body.velocity);
                    this.laserTime = game.time.now + 50
                }
            }
        }
        //environment
        this.gameOver = false
        this.gameOverCounter = 0
        this.laserTime = 0
        this.asteroidCounter = 250

        //Player
        this.attackCooldown = 0
        this.canAttack = true
        this.isAlive = true
        this.gameOverTimer = 0
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

        lasers.createMultiple(200, 'greenLaser');
        lasers.setAll('anchor.x', 0.5)
        lasers.setAll('anchor.y', 0.5)


        // Asteroids
        asteroids = game.add.group()
        asteroids.enableBody = true

        //  Our controls.
        this.cursors = this.game.input.keyboard.createCursorKeys()
        this.spaceBar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        this.backspace = this.game.input.keyboard.addKey(Phaser.Keyboard.BACKSPACE)

        //console.log('player position', player.body.x, player.body.y)
        Client.askNewPlayer(player.body.x, player.body.y);

    },


    update: function(){

        game.physics.arcade.overlap(lasers, asteroids, this.hitAsteroid, null, this)
        game.physics.arcade.overlap(player, asteroids, this.playerHit, null, this)

        // ==============================PLAYER 1 SET UP =====================================
        //  Acceleration
        if (this.isAlive){
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
        }
        asteroids.children.forEach(asteroid => screenWrap(asteroid))

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
        if (this.isAlive){
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
        }

        //ASTEROIDS
        this.asteroidCounter++

        if (this.asteroidCounter > 120){
            console.log('1. initiating asteroid creation in update')
            Client.createAsteroid()
            //side, location, rotation, velocityObj
            // let side = Math.floor(Math.random() * 4)
            // let location = Math.floor(Math.random() * 100)
            // let rotation = Math.floor(Math.random() * 100) + 50
            // let velocityObj = {x: Math.floor(Math.random() * 80) + 50, y: Math.floor(Math.random() * 80) + 50}
            // this.makeAsteroid(side, location, rotation, velocityObj)
        }

        if (this.backspace.isDown){
            this.state.start('MenuState')
            Client.disconnectSocket()
        }

        if (game.state.current !== 'GameState'){
            Client.disconnectSocket()
        }

        //GAME OVER
        if (!this.isAlive){
            this.gameOverCounter++
        }

        if (this.gameOverCounter === 1){
            game.add.text(400, 300, 'You Died', {font: '84pt Megrim', fill: '#66FB21'})
        }

        if (this.gameOverCounter > 300){
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
        console.log('adding a new player', id, game.state.current)
        if (game.state.current === 'GameState'){
            this.playerMap[id] = this.game.add.sprite(x, y, 'otherShip');
            this.playerMap[id].anchor.set(0.5)
        }

    },

    removePlayer: function(id){
        console.log('gamestate removing ship', id)
        if (this.playerMap[id]){
            this.playerMap[id].destroy();
            delete this.playerMap[id];
        }
    },

    movePlayer: function(id, x, y, rotation){
        if (game.state.current === 'GameState'){
            console.log('TOTALLY MOVING THE PLAYER', game.state.current)
            this.playerMap[id].position.x = x
            this.playerMap[id].position.y = y
            this.playerMap[id].rotation = rotation
        }
    }
}

