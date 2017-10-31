const GameState = {

    preload: function() {
        //environment
        this.gameOver = false
        this.gameOverCounter = 0
        this.occupied = [0, 0, 0, 0]
        this.powerTypeArray = ['SPEED', 'FLOAT', 'SLOWDOWN']
        this.megaswordTimer = 0
        this.isMegasword = false
        this.powerUpCount = 0
        this.powerUpSpawn = 0
        this.floatCounter = 0
        this.floatOn = false
        this.slowCounter = 0
        this.slowOn = false

        //Player 1
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

        //Player 2
        this.attackRight2 = undefined
        this.attackLeft2 = undefined
        this.attackCooldown2 = 0
        this.canAttack = true
        this.isAlive2 = true
        this.speedup2 = 1
        this.sparksRight2 = undefined
        this.sparksLeft2 = undefined
        this.powerTimer2 = 0
        this.rightAttack2 = 'rightSword'
        this.leftAttack2 = 'leftSword'
        megaAdd2 = 0
    },

    create: function() {

        this.background = this.add.tileSprite(0, 0,  this.game.world.width, this.game.world.height, 'city')

        // Adding scoreboard
        game.add.sprite(10, 12, 'title1')
        game.add.sprite(664, 12, 'title2')

        //Adding player1 orbs
        let titleSize = 98
        let orbSpaceing = 36

        for (var i = 1; i <= gamesToWin; i++) {
            if (score >= i){
                game.add.sprite(titleSize + orbSpaceing * i, 16, 'redOrb')
            } else {
                game.add.sprite(titleSize + orbSpaceing * i, 16, 'emptyOrb')
            }
        }

        //Adding player2 orbs
        let titleSize2 = 668
        let orbSpaceing2 = 36

        for (var i = 1; i <= gamesToWin; i++) {
            if (score2 >= i){
                game.add.sprite(titleSize2 - orbSpaceing2 * i, 16, 'blueOrb')
            } else {
                game.add.sprite(titleSize2 - orbSpaceing2 * i, 16, 'emptyOrb2')
            }
        }

        //  The platforms group contains the ground and the 2 ledges we can jump on
        platforms = game.add.group()

        //  We will enable physics for any object that is created in this group
        platforms.enableBody = true

        // Here we create the ground.
        var ground = platforms.create(0, game.world.height - 50, 'ground')
        //ground.scale.setTo(2, 2)

        //  This stops it from falling away when you jump on it
        ground.body.immovable = true

        //  Create Ledges create(shift left, shift down, group)
        pillarLocations.forEach(location => {
            let ledge = platforms.create(location[0], location[1], 'pillar')
            // ledge.scale.setTo(0.5, 0.5)
            ledge.body.immovable = true
        })

        platformLocations.forEach(location => {
            let ledge = platforms.create(location[0], location[1], 'platform')
            ledge.body.immovable = true
        })

        //Creating powerups
        powerups = game.add.group()
        powerups.enableBody = true

        //Starting Speed power up
            //ONLY SET UP FOR 3 POWER UPS AND 3 MAPS
            //MAY ERROR OTHERWISE
        var startPowerup = powerups.create(powerLocations[5][0], powerLocations[5][1], this.powerTypeArray[mapChoice - 1])
        startPowerup.body.gravity.y = 300
        startPowerup.powerType = this.powerTypeArray[mapChoice - 1]
        startPowerup.body.bounce.y = 1
        this.powerUpCount++

        // The player and its settings
        player = game.add.sprite(spawnLocations[0][0], spawnLocations[0][1], characterArray[character])
        player.powerOn = undefined
        player.name = 'p1'
        player2 = game.add.sprite(spawnLocations[1][0], spawnLocations[1][1], characterArray[character2])
        player2.powerOn = undefined
        player2.name = 'p2'

        //  We need to enable physics on the player
        game.physics.arcade.enable(player)
        game.physics.arcade.enable(player2)

        //  Player physics properties
        player.body.bounce.y = 0.2
        player.body.gravity.y = 1000
        player.body.collideWorldBounds = true
        player2.body.bounce.y = 0.2
        player2.body.gravity.y = 1000
        player2.body.collideWorldBounds = true

        //  Our two animations, walking left and right.
        player.animations.add('left', [0, 1, 2, 3], 10, true)
        player.animations.add('right', [5, 6, 7, 8], 10, true)
        player2.animations.add('left', [0, 1, 2, 3], 10, true)
        player2.animations.add('right', [5, 6, 7, 8], 10, true)

        //Add SWORDS
        rightSword = game.add.group()
        leftSword = game.add.group()
        rightSword.enableBody = true
        leftSword.enableBody = true

        rightSword2 = game.add.group()
        leftSword2 = game.add.group()
        rightSword2.enableBody = true
        leftSword2.enableBody = true

        // Add Sparks
        speedSparks = game.add.group()

        //  Our controls.
        this.cursors = this.game.input.keyboard.createCursorKeys()
        this.spaceBar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        this.wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W)
        this.aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A)
        this.sKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S)
        this.dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D)
        this.backspace = this.game.input.keyboard.addKey(Phaser.Keyboard.BACKSPACE)
    },
    update: function(){
        //player 1
        //  Collide the player and the powerups with the platforms
        game.physics.arcade.collide(player, platforms)
        game.physics.arcade.collide(player2, platforms)
        game.physics.arcade.collide(powerups, platforms)

        //  Checks to see if you got the other player
        game.physics.arcade.overlap(player, powerups, getPowerUp, null, this)
        game.physics.arcade.overlap(rightSword, player2, killPlayer2, null, this)
        game.physics.arcade.overlap(leftSword, player2, killPlayer2, null, this)

        game.physics.arcade.overlap(player2, powerups, getPowerUp, null, this)
        game.physics.arcade.overlap(rightSword2, player, killPlayer, null, this)
        game.physics.arcade.overlap(leftSword2, player, killPlayer, null, this)
        //  Reset the players velocity (movement)
        player.body.velocity.x = 0
        player2.body.velocity.x = 0

        // ==============================PLAYER 1 SET UP =====================================
        //  Move to the left
        if (this.aKey.isDown){
            if (player.body.touching.down){
               player.body.velocity.x = -150 * this.speedup
            } else {
                player.body.velocity.x = -75 * this.speedup
            }
            player.animations.play('left')

        //  Move to the right
        } else if (this.dKey.isDown) {
            if (player.body.touching.down){
               player.body.velocity.x = 150 * this.speedup
            } else {
                player.body.velocity.x = 75 * this.speedup
            }
            player.animations.play('right')
        } else {
            //  Stand still
            player.animations.stop()
            player.frame = 4
        }

        //JUMPING
        //only if you havent recently jumped
        if(player.body.velocity.y > -75){
            if (player.body.touching.down) {
                player.doubleJump = true
            }

            if (this.wKey.isDown && !player.body.touching.down){
                if (player.doubleJump){
                    player.body.velocity.y = -325
                    player.doubleJump = false
                }
            }

            //  Allow the player to jump if they are touching the ground.
            if (this.wKey.isDown && player.body.touching.down){
                player.body.velocity.y = -450
            }
        }

        //ATTACKING

        if (this.attackCooldown > 8){
            if (this.attackRight){
                this.attackRight.kill()
            }
            if (this.attackLeft){
                this.attackLeft.kill()
            }
        }

        if (this.attackCooldown > 50){
            this.attackCooldown = 0
            this.canAttack = true
        }
        if (this.attackRight){
            this.attackRight.position.x = player.position.x + 18
            this.attackRight.position.y = player.position.y + 19
        }

        if (this.attackLeft){
            this.attackLeft.position.x = player.position.x - (27 + megaAdd)
            this.attackLeft.position.y = player.position.y + 19
        }

        if (this.canAttack && this.isAlive){
            if (this.dKey.isDown && this.sKey.isDown && !this.aKey.isDown){
                this.attackRight = rightSword.create(player.position.x + 18, player.position.y + 19, this.rightAttack)
                player.body.velocity.x = 1000
                this.canAttack = false
            }

            if (this.aKey.isDown && this.sKey.isDown){
                this.attackLeft = leftSword.create(player.position.x - (27 + megaAdd), player.position.y + 19, this.leftAttack)
                player.body.velocity.x = -1000
                this.canAttack = false
            }
        } else {
            this.attackCooldown++
        }

    // ==============================PLAYER 2 SET UP =====================================
        //  Move to the left
        if (this.cursors.left.isDown || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1){
            if (player2.body.touching.down){
               player2.body.velocity.x = -150 * this.speedup2
            } else {
                player2.body.velocity.x = -75 * this.speedup2
            }
            player2.animations.play('left')
        //  Move to the right
        } else if (this.cursors.right.isDown || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1) {
            if (player2.body.touching.down){
               player2.body.velocity.x = 150 * this.speedup2
            } else {
                player2.body.velocity.x = 75 * this.speedup2
            }
            player2.animations.play('right')
        } else {
            //  Stand still
            player2.animations.stop()
            player2.frame = 4
        }

    //     //JUMPING
        //only if you havent recently jumped
        if (player2.body.velocity.y > -75){
            if (player2.body.touching.down) {
                player2.doubleJump2 = true
            }

            if ((this.cursors.up.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_A)) && !player2.body.touching.down){
                if (player2.doubleJump2){
                    player2.body.velocity.y = -325
                    player2.doubleJump2 = false
                }
            }

            //  Allow the player to jump if they are touching the ground.
            if ((this.cursors.up.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_A)) && player2.body.touching.down){
                player2.body.velocity.y = -450
            }
        }

    //     //ATTACKING

        if (this.attackCooldown2 > 8){
            if (this.attackRight2){
                this.attackRight2.kill()
            }
            if (this.attackLeft2){
                this.attackLeft2.kill()
            }
        }

        if (this.attackCooldown2 > 50){
            this.attackCooldown2 = 0
            this.canAttack2 = true
        }
        if (this.attackRight2){
            this.attackRight2.position.x = player2.position.x + 18
            this.attackRight2.position.y = player2.position.y + 19
        }

        if (this.attackLeft2){
            this.attackLeft2.position.x = player2.position.x - (27 + megaAdd2)
            this.attackLeft2.position.y = player2.position.y + 19
        }

        if (this.canAttack2 && this.isAlive2){
            if ((this.cursors.right.isDown && this.cursors.down.isDown && !this.cursors.left.isDown) || pad1.isDown(Phaser.Gamepad.XBOX360_RIGHT_TRIGGER)){
                this.attackRight2 = rightSword2.create(player2.position.x + 18, player2.position.y + 19, this.rightAttack2)
                player2.body.velocity.x = 1000
                this.canAttack2 = false
            }

            if ((this.cursors.left.isDown && this.cursors.down.isDown) || pad1.isDown(Phaser.Gamepad.XBOX360_LEFT_TRIGGER)){
                this.attackLeft2 = leftSword2.create(player2.position.x - (27 + megaAdd2), player2.position.y + 19, this.leftAttack2)
                player2.body.velocity.x = -1000
                this.canAttack2 = false
            }
        } else {
            this.attackCooldown2++
        }

        //==============================Powerups!!!! =====================================
        //spawn new powerups
        if(this.powerUpCount < 3){
            this.powerUpSpawn++
        }

        if(this.powerUpSpawn > powerupsSpawn){
            this.powerUpCount++
            this.powerUpSpawn = 0
            let type = this.powerTypeArray[Math.floor(Math.random() * 3)]
            let locationIndex = Math.floor(Math.random() * 4)
            //so two powerups arn not in the same spot
            while (this.occupied[locationIndex] === 1) {
                locationIndex++
            }
            let location = powerLocations[locationIndex]
            let newPowerUp = powerups.create(location[0], location[1], type)
            newPowerUp.body.gravity.y = 300
            newPowerUp.powerType = type
            newPowerUp.body.bounce.y = 1
            newPowerUp.locationOnMap = locationIndex
            this.occupied[locationIndex] = 1
        }

        function getPowerUp(thePlayer, powerup) {
            this.powerUpCount--
            this.occupied[powerup.locationOnMap] = 0
            thePlayer.powerOn = powerup.powerType
            if (powerup.powerType === 'FLOAT') {
                this.floatOn = true
                this.floatCounter = 0
                player.body.gravity.y = floatAmount
                player2.body.gravity.y = floatAmount
            } else if (powerup.powerType === 'SLOWDOWN'){
                this.slowOn = true
                this.slowCounter = 0
                game.time.slowMotion = 2.0
            }
            if (thePlayer.name === 'p1'){
                this.powerTimer = 0
            } else if (thePlayer.name === 'p2'){
                this.powerTimer2 = 0
            }
            powerup.kill()
        }

        if (player.powerOn) {
            this.powerTimer++
            if (player.powerOn === 'SPEED' && this.speedup === 1) {
                this.speedup = 2
            } else if (player.powerOn === 'MEGASWORD' && this.rightAttack === 'rightSword') {
                this.rightAttack = 'megaRight'
                this.leftAttack = 'megaLeft'
                megaAdd = 42
            }
        }

        if (this.powerTimer > powerupTimer){
            player.powerOn = undefined
            this.speedup = 1
            this.powerTimer = 0
            this.rightAttack = 'rightSword'
            this.leftAttack = 'leftSword'
            megaAdd = 0
            if (this.sparksRight){
                this.sparksRight.kill()
                this.sparksRight = undefined
            }
            if (this.sparksLeft){
                this.sparksLeft.kill()
                this.sparksLeft = undefined
            }
        }
        //==============================SPEED UP!!!! =====================================
        if (this.speedup === 2) {
            if (player.body.velocity.x > 0 && !this.sparksLeft) {
                if (this.sparksRight){
                    this.sparksRight.kill()
                    this.sparksRight = undefined
                }
                this.sparksLeft = speedSparks.create(player.position.x - 19, player.position.y + 14, 'leftSparks')
                this.sparksLeft.animations.add('sparking', [0, 1, 2, 3], 10, true)
            }
            if (player.body.velocity.x < 0 && !this.sparksRight){
                if (this.sparksLeft){
                    this.sparksLeft.kill()
                    this.sparksLeft = undefined
                }
                this.sparksRight = speedSparks.create(player.position.x + 19, player.position.y + 14, 'rightSparks')
                this.sparksRight.animations.add('sparking', [0, 1, 2, 3], 10, true)
            }
            if (this.sparksRight) {
                this.sparksRight.animations.play('sparking')
                this.sparksRight.position.x = player.position.x + 19
                this.sparksRight.position.y = player.position.y + 14
            } else if (this.sparksLeft) {
                this.sparksLeft.animations.play('sparking')
                this.sparksLeft.position.x = player.position.x - 19
                this.sparksLeft.position.y = player.position.y + 14
            }
            if (player.body.velocity.x === 0){
                if (this.sparksLeft){
                    this.sparksLeft.kill()
                    this.sparksLeft = undefined
                } else if (this.sparksRight){
                    this.sparksRight.kill()
                    this.sparksRight = undefined
                }
            }

        }

        if (player2.powerOn) {
            this.powerTimer2++
            if (player2.powerOn === 'SPEED' && this.speedup2 === 1) {
                this.speedup2 = 2
            } else if (player2.powerOn === 'MEGASWORD' && this.rightAttack2 === 'rightSword') {
                this.rightAttack2 = 'megaRight'
                this.leftAttack2 = 'megaLeft'
                megaAdd2 = 42
            }
        }

        if (this.powerTimer2 > powerupTimer){
            player2.powerOn = undefined
            this.speedup2 = 1
            this.powerTimer2 = 0
            this.rightAttack2 = 'rightSword'
            this.leftAttack2 = 'leftSword'
            megaAdd2 = 0
            if (this.sparksRight2){
                this.sparksRight2.kill()
                this.sparksRight2 = undefined
            }
            if (this.sparksLeft2){
                this.sparksLeft2.kill()
                this.sparksLeft2 = undefined
            }
        }

        if (this.speedup2 === 2) {
            if (player2.body.velocity.x > 0 && !this.sparksLeft2) {
                if (this.sparksRight2){
                    this.sparksRight2.kill()
                    this.sparksRight2 = undefined
                }
                this.sparksLeft2 = speedSparks.create(player2.position.x - 19, player2.position.y + 14, 'leftSparks')
                this.sparksLeft2.animations.add('sparking', [0, 1, 2, 3], 10, true)
            }
            if (player2.body.velocity.x < 0 && !this.sparksRight2){
                if (this.sparksLeft2){
                    this.sparksLeft2.kill()
                    this.sparksLeft2 = undefined
                }
                this.sparksRight2 = speedSparks.create(player2.position.x + 19, player2.position.y + 14, 'rightSparks')
                this.sparksRight2.animations.add('sparking', [0, 1, 2, 3], 10, true)
            }
            if (this.sparksRight2) {
                this.sparksRight2.animations.play('sparking')
                this.sparksRight2.position.x = player2.position.x + 19
                this.sparksRight2.position.y = player2.position.y + 14
            } else if (this.sparksLeft2) {
                this.sparksLeft2.animations.play('sparking')
                this.sparksLeft2.position.x = player2.position.x - 19
                this.sparksLeft2.position.y = player2.position.y + 14
            }
            if (player2.body.velocity.x === 0){
                if (this.sparksLeft2){
                    this.sparksLeft2.kill()
                    this.sparksLeft2 = undefined
                } else if (this.sparksRight2){
                    this.sparksRight2.kill()
                    this.sparksRight2 = undefined
                }
            }

        }
        //==============================FLOAT ===================================================
        if (this.floatOn) {
            this.floatCounter++
        }

        if (this.floatCounter > powerupTimer) {
            player.body.gravity.y = 1000
            player2.body.gravity.y = 1000
            this.floatOn = false
            this.floatCounter = 0
        }

        //==============================SLOW TIME ===================================================
        if (this.slowOn) {
            this.slowCounter++
        }

        if (this.slowCounter > powerupTimer) {
            game.time.slowMotion = 1.0
            this.slowOn = false
            this.slowCounter = 0
        }
        //==============================MEGASWORD ===================================================
        if (!this.isMegasword) {
            this.megaswordTimer++
        }
        //Spawn the sword
        if (this.megaswordTimer > megaswordSpawn) {
            this.megaswordTimer = 0
            this.isMegasword = true
            theSword = powerups.create(powerLocations[4][0], powerLocations[4][1], 'megaswordPowerup')
            theSword.body.gravity.y = 100
            theSword.powerType = 'MEGASWORD'
            theSword.body.bounce.y = 1
            this.powerUpCount++
        }




        //==============================DEATH AND GAME OVER!!!! =====================================
        function killPlayer (playerOne, target) {
            despawn = game.add.sprite(playerOne.position.x, playerOne.position.y, 'despawn')
            despawn.animations.add('despawn', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], 10, false)
            playerOne.kill()
            this.isAlive = false
            score2++
            this.gameOver = true
            let titleSize2 = 668
            let orbSpaceing2 = 36
            game.add.sprite(titleSize2 - orbSpaceing2 * score2, 16, 'blueOrb')
            game.add.text(52, 97, 'PLAYER TWO', {font: '108pt Impact', fill: 'white'})
            game.add.text(232, 297, 'WINS', {font: '108pt Impact', fill: 'white'})
            game.add.text(55, 100, 'PLAYER TWO', {font: '108pt Impact', fill: 'black'})
            game.add.text(235, 300, 'WINS', {font: '108pt Impact', fill: 'black'})
        }

        function killPlayer2 (playerTwo, target){
            despawn = game.add.sprite(playerTwo.position.x, playerTwo.position.y, 'despawn')
            despawn.animations.add('despawn', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], 10, false)
            playerTwo.kill()
            this.isAlive2 = false
            score++
            this.gameOver = true
            let titleSize = 98
            let orbSpaceing = 36
            game.add.sprite(titleSize + orbSpaceing * score, 16, 'redOrb')
            game.add.text(52, 97, 'PLAYER ONE', {font: '108pt Impact', fill: 'white'})
            game.add.text(232, 297, 'WINS', {font: '108pt Impact', fill: 'white'})
            game.add.text(55, 100, 'PLAYER ONE', {font: '108pt Impact', fill: 'black'})
            game.add.text(235, 300, 'WINS', {font: '108pt Impact', fill: 'black'})
        }

        if (this.gameOver){
            despawn.animations.play('despawn')
            if (this.gameOverCounter > 115) {
                despawn.kill()
            }
            this.gameOverCounter++
        }
        if (this.gameOverCounter > 150){
            if (score === gamesToWin || score2 === gamesToWin) {
                game.add.text(116, 48, 'PRESS SPACE TO RETURN TO MENU', {font: '32pt Impact', fill: 'white'})
                game.add.text(118, 50, 'PRESS SPACE TO RETURN TO MENU', {font: '32pt Impact', fill: 'black'})
                if (this.spaceBar.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_B)) {
                    this.state.start('MenuState')
                }
            } else {
                this.state.start('PreloadState')
            }
        }

        if (this.backspace.isDown){
        this.state.start('MenuState')
      }
    }
}
