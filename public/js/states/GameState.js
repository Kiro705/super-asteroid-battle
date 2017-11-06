const GameState = {

    hitAsteroid: function(laser, asteroid, broadcast) {
        if (laser){
            laser.kill()
        }
        if (!broadcast){
            Client.hitAsteroid(asteroid.id)
        }
        asteroid.damage++
        if (asteroid.damage === 3){
            asteroid.destroy()
        } else {
            asteroid.frame++
        }
    },

    laserFizzle: function(laser, something) {
        laser.kill()
    },

    playerHit: function(player, asteroid){
        Client.disconnectSocket()
        player.kill()
        this.hitAsteroid(null, asteroid, false)
        this.isAlive = false
    },

    fireLaser: function(x, y, rotation, type) {
        if(type === 'real'){
            shot = lasers.getFirstExists(false)
        } else {
            shot = fakeLasers.getFirstExists(false)
        }
        if (shot) {
            shot.reset(x, y)
            shot.lifespan = 3000
            shot.rotation = rotation
            shot.anchor.set(0.5)
            game.physics.arcade.velocityFromRotation(rotation - Math.PI / 2, 500, shot.body.velocity);
        }
    },

    preload: function() {
        //environment
        this.gameOver = false
        this.gameOverCounter = 0
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
        player.moveState = 0

        //  We need to enable physics on the player
        game.physics.arcade.enable(player)

        //  Player physics properties
        player.body.bounce.x = 1
        player.body.bounce.y = 1
        player.body.collideWorldBounds = false
        player.body.maxVelocity.set(400);

        //  Player Animations
        player.animations.add('forward', [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0], 20, true)
        player.animations.add('reverse', [2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 0], 20, true)

        //Add LASERS
        lasers = game.add.group()
        lasers.enableBody = true

        lasers.createMultiple(100, 'greenLaser');
        lasers.setAll('anchor.x', 0.5)
        lasers.setAll('anchor.y', 0.5)

        //Add *fake* LASERS
        fakeLasers = game.add.group()
        fakeLasers.enableBody = true

        fakeLasers.createMultiple(200, 'redLaser');
        fakeLasers.setAll('anchor.x', 0.5)
        fakeLasers.setAll('anchor.y', 0.5)

        // Asteroids
        asteroids = game.add.group()
        asteroids.enableBody = true

        //  Our controls.
        this.cursors = this.game.input.keyboard.createCursorKeys()
        this.spaceBar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        this.backspace = this.game.input.keyboard.addKey(Phaser.Keyboard.BACKSPACE)

        Client.askNewPlayer();

    },


    update: function(){

        game.physics.arcade.overlap(lasers, asteroids, this.hitAsteroid, null, this)
        game.physics.arcade.overlap(fakeLasers, asteroids, this.laserFizzle, null, this)
        game.physics.arcade.overlap(player, asteroids, this.playerHit, null, this)

        // ==============================PLAYER 1 SET UP =====================================
        //  Acceleration
        if (this.isAlive){
            if (this.cursors.up.isDown){
                player.moveState = 1
                game.physics.arcade.accelerationFromRotation(player.rotation + Math.PI / 2, -100, player.body.acceleration)
                player.animations.play('forward')
            } else if (this.cursors.down.isDown) {
                player.moveState = 2
                game.physics.arcade.accelerationFromRotation(player.rotation + Math.PI / 2, 100, player.body.acceleration)
                player.animations.play('reverse')
            } else {
                player.moveState = 0
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

            screenWrap(player)
            Client.movePlayer(player.position.x, player.position.y, player.rotation, player.moveState)
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

            if (this.attackCooldown > 15){
                this.attackCooldown = 0
                this.canAttack = true
            }

            if (this.spaceBar.isDown) {
                if (this.canAttack) {
                    this.fireLaser(player.position.x, player.position.y, player.rotation, 'real')
                    Client.shotLaser(player.position.x, player.position.y, player.rotation)
                    this.canAttack = false
                }
            }
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
            game.add.text(385, 285, 'You Died', {font: '84pt Megrim', fill: '#66FB21'})
        }

        if (this.gameOverCounter > 300){
            this.state.start('MenuState')
        }
    },

    //SOCKET CODE ==================================

    addNewPlayer: function(id){
        if (game.state.current === 'GameState'){
            this.playerMap[id] = this.game.add.sprite(-200, -200, 'otherShip');
            this.playerMap[id].anchor.set(0.5)
        }

    },

    removePlayer: function(id){
        if (this.playerMap[id]){
            this.playerMap[id].destroy();
            delete this.playerMap[id];
        }
    },

    movePlayer: function(id, x, y, rotation, moveState){
        if (game.state.current === 'GameState'){
            this.playerMap[id].position.x = x
            this.playerMap[id].position.y = y
            this.playerMap[id].rotation = rotation
            this.playerMap[id].frame = moveState
        }
    },

    shootLaser: function(x, y, rotation){
       if (game.state.current === 'GameState'){
            this.fireLaser(x, y, rotation, 'fake')
        }
    },

    damageAsteroid: function(id){
        if (game.state.current === 'GameState'){
            let target = asteroids.children.find(asteroid => {
                return asteroid.id === id
            })
            this.hitAsteroid(null, target, true)        }
    },

    makeAsteroid: function(asteroid) {
        if (game.state.current === 'GameState'){
            if (asteroid.side === 0){
                newAsteroid = asteroids.create(asteroid.location * 12, 1, 'asteroid')
                newAsteroid.body.velocity.x = asteroid.velocityObj.x * asteroid.upOrDown
                newAsteroid.body.velocity.y = asteroid.velocityObj.y
            } else if (asteroid.side === 1){
                newAsteroid = asteroids.create(1199, asteroid.location * 7, 'asteroid')
                newAsteroid.body.velocity.x = asteroid.velocityObj.x * -1
                newAsteroid.body.velocity.y = asteroid.velocityObj.y * asteroid.upOrDown
            } else if (asteroid.side === 2) {
                newAsteroid = asteroids.create(asteroid.location * 12, 699, 'asteroid')
                newAsteroid.body.velocity.x = asteroid.velocityObj.x * asteroid.upOrDown
                newAsteroid.body.velocity.y = asteroid.velocityObj.y * -1
            } else {
                newAsteroid = asteroids.create(1199, asteroid.location * 7, 'asteroid')
                newAsteroid.body.velocity.x = asteroid.velocityObj.x
                newAsteroid.body.velocity.y = asteroid.velocityObj.y * asteroid.upOrDown
            }
            newAsteroid.id = asteroid.id
            newAsteroid.anchor.set(0.5)
            newAsteroid.damage = 0
            newAsteroid.body.angularVelocity = asteroid.rotation
        }
    },
}
