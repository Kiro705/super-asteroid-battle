const GameState = {

    init: function(playerName){
        if (playerName){
            this.playerName = playerName
        }
        else {
            this.playerName = 'Private Pineapple Jr'
        }

    },

    hitAsteroid: function(laser, asteroid, broadcast) {
        if (laser){
            laser.kill()
        }
        if (!broadcast){
            Client.hitAsteroid(asteroid.id)
        }
        asteroid.damage++
        if (asteroid.damage === 3){
            explosion = asteroidsExplosion.create(asteroid.position.x, asteroid.position.y, 'asteroidExplosion')
            explosion.animations.add('explode', [0, 1, 2, 3, 4, 5, 6, 7], 10, false)
            explosion.anchor.set(0.5)
            explosion.body.velocity.x = asteroid.body.velocity.x
            explosion.body.velocity.y = asteroid.body.velocity.y
            explosion.body.angularVelocity = asteroid.body.angularVelocity
            explosion.lifespan = 750
            this.makeOre(asteroid.id, {x: asteroid.position.x, y: asteroid.position.y}, {x: asteroid.body.velocity.x, y: asteroid.body.velocity.y})
            asteroid.destroy()
        } else {
            asteroid.frame++
        }
    },

    laserFizzle: function(laser, something) {
        laser.kill()
    },

    playerHit: function(player, asteroid){
        Client.disconnectSocket({x: player.position.x, y: player.position.y}, {x: player.body.velocity.x, y: player.body.velocity.y})
        this.explodeShip({x: player.position.x, y: player.position.y}, {x: player.body.velocity.x, y: player.body.velocity.y})
        player.kill()
        this.hitAsteroid(null, asteroid, false)
        this.isAlive = false

        const opts = {
            name: player.name,
            score: player.score
        }
        fetch('/api/', {
            method: 'POST',
            body: JSON.stringify(opts),
            headers: {
                'Content-Type': 'application/json'
              }
          }).then(function(response) {
            return response.json();
          }).then(function(data) {
          });

    },

    fireLaser: function(x, y, rotation, type) {
        if (type === 'real'){
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

    explodeShip: function(location, velocity){
        this.colorSpray(location, velocity, 'redDot', 130)
        this.colorSpray(location, velocity, 'orangeDot', 150)
        this.colorSpray(location, velocity, 'whiteDot', 130)
    },

    colorSpray: function (location, velocity, colorDot, number) {
        for (var i = 1; i <= number; i++){
            newDot = dots.create(location.x, location.y, colorDot)
            newDot.lifespan = 300 + 1500 * Math.random()
            newDot.body.velocity.x = (velocity.x - 200 * Math.random()) + 200 * Math.random()
            newDot.body.velocity.y = (velocity.y - 200 * Math.random()) + 200 * Math.random()
        }
    },

    makeOre: function(id, location, velocity){
        newOre = ore.create(location.x, location.y, 'ore')
        newOre.id = id
        newOre.body.velocity.x = velocity.x
        newOre.body.velocity.y = velocity.y
    },

    oreCollect: function(player, ore){
        player.score += 10 * player.level
        player.exp += 20 / player.level
        Client.destroyOre(ore.id)
        scoreText.destroy()
        scoreText = game.add.text(20, 10, 'SCORE: ' + player.score, {font: '24pt Megrim', fill: '#02f3f7'})
        ore.destroy()
    },

    // scoreUp: function(player){
    //     player.score += 10;
    //     return true
    // },

    preload: function() {
        //environment
        this.gameOver = false
        this.gameOverCounter = 0
        this.asteroidCounter = 250

        //Player
        this.canAttack = true
        this.attackCooldown = 0
        this.isAlive = true
        this.gameOverTimer = 0
        this.isLeveling = false
        this.levelTimer = 0
    },

    create: function() {
        this.playerMap = {};
        this.background = this.add.tileSprite(0, 0,  this.game.world.width, this.game.world.height, 'star_background')

        // The player and its settings
        player = game.add.sprite(575, 326, 'ship')
        player.anchor.set(0.5)
        player.level = 1
        player.exp = 0
        player.moveState = 0
        player.name = this.playerName
        player.id = 0
        player.score = 0
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

        dots = game.add.group()
        dots.enableBody = true

        //ORE
        ore = game.add.group()
        ore.enableBody = true

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

        asteroidsExplosion = game.add.group()
        asteroidsExplosion.enableBody = true

        //EXP Bar
        expBar = game.add.sprite(930, 640, 'expBar')
        expBar.animations.add('flash', [10, 11], 8, true)
        levelText = game.add.text(934, 600, 'LEVEL 1', {font: '24pt Megrim', fill: '#02f3f7'})

        scoreText = game.add.text(20, 10, 'SCORE: 00', {font: '24pt Megrim', fill: '#02f3f7'})

        //  Our controls.
        this.cursors = this.game.input.keyboard.createCursorKeys()
        this.spaceBar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        this.enter = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER)
        this.backspace = this.game.input.keyboard.addKey(Phaser.Keyboard.BACKSPACE)

        Client.askNewPlayer();

    },

    update: function(){

        game.physics.arcade.overlap(lasers, asteroids, this.hitAsteroid, null, this)
        game.physics.arcade.overlap(fakeLasers, asteroids, this.laserFizzle, null, this)
        game.physics.arcade.overlap(player, asteroids, this.playerHit, null, this)
        game.physics.arcade.overlap(player, ore, this.oreCollect, null, this)

        // ==============================PLAYER 1 SET UP =====================================
        //  Acceleration
        if (this.isAlive){
            if (this.cursors.up.isDown){
                player.moveState = 1
                game.physics.arcade.accelerationFromRotation(player.rotation + Math.PI / 2, -500, player.body.acceleration)
                player.animations.play('forward')
            } else if (this.cursors.down.isDown) {
                player.moveState = 2
                game.physics.arcade.accelerationFromRotation(player.rotation + Math.PI / 2, 500, player.body.acceleration)
                player.animations.play('reverse')
            } else {
                player.moveState = 0
                game.physics.arcade.accelerationFromRotation(player.rotation, 0, player.body.acceleration)
                player.animations.stop()
                player.frame = 0
            }

            //Turning
            if (this.cursors.left.isDown) {
                player.body.angularVelocity = -350;
            } else if (this.cursors.right.isDown) {
                player.body.angularVelocity = 350;
            } else {
                player.body.angularVelocity = 0;
            }

            screenWrap(player)
            Client.movePlayer(player.position.x, player.position.y, player.rotation, player.moveState)
        }
        asteroids.children.forEach(asteroid => screenWrap(asteroid))
        ore.children.forEach(singleOre => {
            if (singleOre.body.velocity.x < 10 && singleOre.body.velocity.x > -10){
               singleOre.body.velocity.x = 0
            } else {
                singleOre.body.velocity.x = singleOre.body.velocity.x * 0.98
            }
            if (singleOre.body.velocity.y < 10 && singleOre.body.velocity.y > -10){
               singleOre.body.velocity.y = 0
            } else {
                singleOre.body.velocity.y = singleOre.body.velocity.y * 0.98
            }
        })
        ore.children.forEach(singleOre => screenWrap(singleOre))

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

        //Escape Button
        if (this.backspace.isDown){
            this.state.start('MenuState')
            Client.disconnectSocket()
        }

        if (game.state.current !== 'GameState'){
            Client.disconnectSocket()
        }

        //EXP BAR
        if (player.exp >= 100){
            this.isLeveling = true
            player.exp = 0
            player.level++
            Client.levelUp(player.lever, player.id)
            levelText.destroy()
            levelText = game.add.text(934, 600, 'LEVEL ' + player.level, {font: '24pt Megrim', fill: '#02f3f7'})
        }

        if (this.isLeveling) {
            this.levelTimer++
            expBar.animations.play('flash')
        } else if (player.exp > 0 && player.exp <= 10){
            expBar.frame = 1
            } else {
                expBar.frame = Math.floor(player.exp / 10)
            }

        if (this.levelTimer > 200){
            this.isLeveling = false
            this.levelTimer = 0
        }

        //GAME OVER
        if (!this.isAlive){
            this.gameOverCounter++
        }

        if (this.gameOverCounter === 1){
            game.add.text(385, 285, 'You Died', {font: '84pt Megrim', fill: '#66FB21'})
        }

        if (this.gameOverCounter === 149){
            game.add.text(338, 385, 'Press ENTER to Return to the Menu', {font: '24pt Megrim', fill: '#66FB21'})
        }

        if (this.gameOverCounter > 150){
            if (this.enter.isDown){
                this.state.start('MenuState')
            }
        }

        asteroidsExplosion.children.forEach(explosion => {
            explosion.animations.play('explode')
        })
    },

    //SOCKET CODE ==================================

    addNewPlayer: function(id){
        if (game.state.current === 'GameState'){
            this.playerMap[id] = this.game.add.sprite(-200, -200, 'otherShip');
            this.playerMap[id].anchor.set(0.5)
        }

    },

    removePlayer: function(id, location, velocity){
        if (this.playerMap[id]){
            this.explodeShip(location, velocity)
            this.playerMap[id].destroy();
            delete this.playerMap[id];
        }
    },

    movePlayer: function(id, x, y, rotation, moveState){
        if (game.state.current === 'GameState'){
            if (this.playerMap[id]){
                this.playerMap[id].position.x = x
                this.playerMap[id].position.y = y
                this.playerMap[id].rotation = rotation
                this.playerMap[id].frame = moveState
            }
        }
    },

    shootLaser: function(x, y, rotation){
       if (game.state.current === 'GameState'){
            this.fireLaser(x, y, rotation, 'fake')
        }
    },

    setID: function(id){
        if (player.id === 0){
            player.id = id
        }
    },

    damageAsteroid: function(id){
        if (game.state.current === 'GameState'){
            let target = asteroids.children.find(asteroid => {
                return asteroid.id === id
            })
            if (target){
                this.hitAsteroid(null, target, true)
            }
        }
    },

    killOre: function(id){
        if (game.state.current === 'GameState'){
            let target = ore.children.find(singleOre => {
                return singleOre.id === id
            })
            if (target){
                target.destroy()
            }
        }
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
                newAsteroid = asteroids.create(1, asteroid.location * 7, 'asteroid')
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
