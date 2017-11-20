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
            explosion = asteroidsExplosion.create(asteroid.position.x, asteroid.position.y, 'asteroidExplosion')
            explosion.animations.add('explode', [0, 1, 2, 3, 4, 5, 6, 7], 10, false)
            explosion.anchor.set(0.5)
            explosion.body.velocity.x = asteroid.body.velocity.x
            explosion.body.velocity.y = asteroid.body.velocity.y
            explosion.body.angularVelocity = asteroid.body.angularVelocity
            explosion.lifespan = 750
            this.makeOre(asteroid.id, {x: asteroid.position.x, y: asteroid.position.y}, {x: asteroid.body.velocity.x, y: asteroid.body.velocity.y}, asteroid.oreType)
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
            score: player.score,
            number: player.numberCollected,
            key: player.key
        }
        fetch('/api/', {
            method: 'POST',
            body: JSON.stringify(opts),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(response) {
                return response.json()
        }).then(function(){
            fetch('/api/all')
            .then(result => result.json())
            .then(data => {
              this.rankList = data
              this.rankList.sort((a, b) => {
                return b.score - a.score
                })
                this.rankList.forEach((scoreObj, index) => {
                    if (scoreObj.name === playerName && scoreObj.score === player.score){
                        playerRank = index + 1
                    }
                })
            })
        })
    },

    fireTracker: function(x, y, trackerRotation, rotation, type, velocity, finalVelocity) {
        track = trackers.create(x, y, 'blackDot')
        if (track){
            track.reset(x, y)
            track.laserType = type
            track.initation = 0
            track.rotation = rotation
            track.finalVelocity = finalVelocity
            track.anchor.set(0.5)
            game.physics.arcade.velocityFromRotation(trackerRotation - Math.PI / 2, velocity, track.body.velocity)
        }
    },

    fireLaser: function(x, y, rotation, type, velocity){
        if (type === 'real1'){
            shot = lasers.getFirstExists(false)
        } else if (type === 'real2'){
            shot = lasers2.getFirstExists(false)
        } else if (type === 'real3'){
            shot = lasers3.getFirstExists(false)
        } else if (type === 'superLaser'){
            shot = superLasers.getFirstExists(false)
        } else if (type === 'superLaserTop'){
            shot = superLaserTops.getFirstExists(false)
        } else if (type === 'fake1'){
            shot = fakeLasers.getFirstExists(false)
        } else if (type === 'fake2'){
            shot = fakeLasers2.getFirstExists(false)
        } else if (type === 'fake3'){
            shot = fakeLasers3.getFirstExists(false)
        } else if (type === 'superFake'){
            shot = superFakes.getFirstExists(false)
        } else if (type === 'superFakeTop'){
            shot = superFakeTops.getFirstExists(false)
        } else {
            shot = fakeLasers.getFirstExists(false)
        }
        if (shot) {
            shot.reset(x, y)
            shot.lifespan = 3000
            shot.rotation = rotation
            shot.anchor.set(0.5)
            game.physics.arcade.velocityFromRotation(rotation - Math.PI / 2, velocity, shot.body.velocity)
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

    makeOre: function(id, location, velocity, oreType){
        newOre = ore.create(location.x, location.y, oreType)
        if(oreType === 'silverOre'){
            newOre.animations.add('live', [0, 1, 2, 3, 4, 5], 12, true)
        } else if (oreType === 'fireOre'){
            newOre.animations.add('live', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 6, true)
        } else if (oreType === 'electricOre'){
            newOre.animations.add('live', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 12, true)
        } else if (oreType === 'rainbowOre'){
            newOre.animations.add('live', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 6, true)
        } else if (oreType === 'cometOre'){
            newOre.animations.add('live', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 12, true)
        } else {
            newOre.animations.add('live', [0], 12, true)
        }
        newOre.id = id
        newOre.body.velocity.x = velocity.x
        newOre.body.velocity.y = velocity.y
    },

    oreCollect: function(player, ore){
        player.numberCollected++
        player.score += 10 * player.level
        player.exp += 20 / player.level
        Client.destroyOre(ore.id)
        scoreText.destroy()
        scoreText = game.add.text(20, 10, 'SCORE: ' + player.score, {font: '24pt Megrim', fill: '#02f3f7'})
        ore.destroy()
    },

    preload: function() {
        //environment
        this.gameOver = false
        this.gameOverCounter = 0
        this.rankList = null

        //Player
        this.canAttack = true
        this.attackCooldown = 0
        this.attackWaitTime = mainAttackCooldown
        this.superAttackCounter = 0
        this.superAttackTimes = 0
        this.superAttack = false
        this.isAlive = true
        this.gameOverTimer = 0
        this.isLeveling = false
        this.levelTimer = 0
    },

    create: function() {

        this.playerMap = {};
        this.playerName = {};
        this.background = this.add.tileSprite(0, 0,  this.game.world.width, this.game.world.height, 'star_background')

        // The player and its settings
        player = game.add.sprite(575, 326, 'ship')
        player.anchor.set(0.5)
        player.level = 1
        player.exp = 0
        player.moveState = 0
        player.name = playerName
        player.id = 0
        player.score = 0
        player.numberCollected = 0
        player.key = null
        fetch('/key')
            .then(result => result.json())
            .then(data => {
              player.key = data
            })
        //  We need to enable physics on the player
        game.physics.arcade.enable(player)

        //  Player physics properties
        player.body.bounce.x = 1
        player.body.bounce.y = 1
        player.body.collideWorldBounds = false
        player.body.maxVelocity.set(maxShipSpeed);

        //  Player Animations
        player.animations.add('forward', [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0], 20, true)
        player.animations.add('reverse', [2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 0], 20, true)

        dots = game.add.group()
        dots.enableBody = true

        //ORE
        ore = game.add.group()
        ore.enableBody = true

        //Add Tracker
        trackers = game.add.group()
        trackers.enableBody = true

        //Add LASERS
        lasers = game.add.group()
        lasers.enableBody = true

        lasers.createMultiple(100, 'greenLaser');
        lasers.setAll('anchor.x', 0.5)
        lasers.setAll('anchor.y', 0.5)

        lasers2 = game.add.group()
        lasers2.enableBody = true

        lasers2.createMultiple(200, 'yellowLaser');
        lasers2.setAll('anchor.x', 0.5)
        lasers2.setAll('anchor.y', 0.5)

        lasers3 = game.add.group()
        lasers3.enableBody = true

        lasers3.createMultiple(300, 'blueLaser');
        lasers3.setAll('anchor.x', 0.5)
        lasers3.setAll('anchor.y', 0.5)

        //SUPER LASER
        superLasers = game.add.group()
        superLasers.enableBody = true

        superLasers.createMultiple(300, 'superBlue');
        superLasers.setAll('anchor.x', 0.5)
        superLasers.setAll('anchor.y', 0.5)

        superLaserTops = game.add.group()
        superLaserTops.enableBody = true

        superLaserTops.createMultiple(5, 'superBlueTop');
        superLaserTops.setAll('anchor.x', 0.5)
        superLaserTops.setAll('anchor.y', 0.5)

        //Add *fake* LASERS
        fakeLasers = game.add.group()
        fakeLasers.enableBody = true

        fakeLasers.createMultiple(400, 'orangeLaser');
        fakeLasers.setAll('anchor.x', 0.5)
        fakeLasers.setAll('anchor.y', 0.5)

        fakeLasers2 = game.add.group()
        fakeLasers2.enableBody = true

        fakeLasers2.createMultiple(300, 'purpleLaser');
        fakeLasers2.setAll('anchor.x', 0.5)
        fakeLasers2.setAll('anchor.y', 0.5)

        fakeLasers3 = game.add.group()
        fakeLasers3.enableBody = true

        fakeLasers3.createMultiple(400, 'redLaser');
        fakeLasers3.setAll('anchor.x', 0.5)
        fakeLasers3.setAll('anchor.y', 0.5)

        superFakes = game.add.group()
        superFakes.enableBody = true

        superFakes.createMultiple(900, 'superRed');
        superFakes.setAll('anchor.x', 0.5)
        superFakes.setAll('anchor.y', 0.5)

        superFakeTops = game.add.group()
        superFakeTops.enableBody = true

        superFakeTops.createMultiple(15, 'superRedTop');
        superFakeTops.setAll('anchor.x', 0.5)
        superFakeTops.setAll('anchor.y', 0.5)

        // Asteroids
        asteroids = game.add.group()
        asteroids.enableBody = true

        asteroidsExplosion = game.add.group()
        asteroidsExplosion.enableBody = true

        //EXP Bar
        expBar = game.add.sprite(930, 640, 'expBar')
        expBar.animations.add('flash', [10, 11], 8, true)
        levelText = game.add.text(934, 600, 'LEVEL ' + player.level, {font: '24pt Megrim', fill: '#02f3f7'})

        scoreText = game.add.text(20, 10, 'SCORE: 00', {font: '24pt Megrim', fill: '#02f3f7'})

        //  Our controls.
        this.cursors = this.game.input.keyboard.createCursorKeys()
        this.spaceBar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        this.enter = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER)
        this.backspace = this.game.input.keyboard.addKey(Phaser.Keyboard.BACKSPACE)

        Client.askNewPlayer(player.name);

    },

    update: function(){

        game.physics.arcade.overlap(lasers, asteroids, this.hitAsteroid, null, this)
        game.physics.arcade.overlap(lasers2, asteroids, this.hitAsteroid, null, this)
        game.physics.arcade.overlap(lasers3, asteroids, this.hitAsteroid, null, this)
        game.physics.arcade.overlap(superLasers, asteroids, this.hitAsteroid, null, this)
        game.physics.arcade.overlap(superLaserTops, asteroids, this.hitAsteroid, null, this)
        game.physics.arcade.overlap(fakeLasers, asteroids, this.laserFizzle, null, this)
        game.physics.arcade.overlap(fakeLasers2, asteroids, this.laserFizzle, null, this)
        game.physics.arcade.overlap(fakeLasers3, asteroids, this.laserFizzle, null, this)
        game.physics.arcade.overlap(superFakes, asteroids, this.hitAsteroid, null, this)
        game.physics.arcade.overlap(superFakeTops, asteroids, this.hitAsteroid, null, this)
        game.physics.arcade.overlap(player, asteroids, this.playerHit, null, this)
        game.physics.arcade.overlap(player, ore, this.oreCollect, null, this)

        // ==============================PLAYER 1 SET UP =====================================
        //  Acceleration
        if (this.isAlive){
            if (this.cursors.up.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_A)){
                player.moveState = 1
                game.physics.arcade.accelerationFromRotation(player.rotation + Math.PI / 2, -1 * shipAcceleration, player.body.acceleration)
                player.animations.play('forward')
            } else if (this.cursors.down.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_B)) {
                player.moveState = 2
                game.physics.arcade.accelerationFromRotation(player.rotation + Math.PI / 2, shipAcceleration, player.body.acceleration)
                player.animations.play('reverse')
            } else {
                player.moveState = 0
                game.physics.arcade.accelerationFromRotation(player.rotation, 0, player.body.acceleration)
                player.animations.stop()
                player.frame = 0
            }

            //Turning
            if (this.cursors.left.isDown || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1) {
                player.body.angularVelocity = -1 * shipTurningSpeed;
            } else if (this.cursors.right.isDown || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1) {
                player.body.angularVelocity = shipTurningSpeed;
            } else {
                player.body.angularVelocity = 0;
            }

            screenWrap(player)
            Client.movePlayer(player.position.x, player.position.y, player.rotation, player.moveState, player.name)
        }
        asteroids.children.forEach(asteroid => screenWrap(asteroid))
        ore.children.forEach(singleOre => {
            screenWrap(singleOre)
            singleOre.animations.play('live')
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

            if (this.attackCooldown > this.attackWaitTime){
                this.attackCooldown = 0
                this.canAttack = true
            }

            if (this.spaceBar.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_RIGHT_TRIGGER)) {
                if (this.canAttack) {
                    this.canAttack = false
                    if (player.level === 1){
                        this.fireTracker(player.position.x, player.position.y, player.rotation, player.rotation, 'real', 2000, 500)
                    } else if (player.level === 2) {
                        this.fireTracker(player.position.x, player.position.y, player.rotation + Math.PI / 8, player.rotation, 'real', 1500, 500)
                        this.fireTracker(player.position.x, player.position.y, player.rotation - Math.PI / 8.7, player.rotation, 'real', 1000, 500)
                    } else if (player.level === 3){
                        this.fireTracker(player.position.x, player.position.y, player.rotation, player.rotation + Math.PI / 8, 'real', 2000, 500)
                        this.fireTracker(player.position.x, player.position.y, player.rotation, player.rotation - Math.PI / 7.6, 'real', 1270, 500)
                        this.fireTracker(player.position.x, player.position.y, player.rotation, player.rotation, 'real', 2000, 500)
                    } else {
                        this.fireTracker(player.position.x, player.position.y, player.rotation, player.rotation, 'realTop', 1100, 500)
                        this.superAttack = true
                    }
                }
            }
        }

        //SuperLaser

        if (this.superAttack){
            if (this.isAlive){
              this.fireTracker(player.position.x, player.position.y, player.rotation, player.rotation, 'real', 1100, 500)
            }
            this.superAttackTimes++
        }

        if (this.superAttackTimes >= 35){
            this.superAttack = false
            this.superAttackTimes = 0
        }


        trackers.children.forEach(tracker => {
            if (tracker.initation < 2){
                tracker.initation++
            } else {
                if (player.level > 3){
                    if (tracker.laserType === 'realTop'){
                        this.fireLaser(tracker.position.x, tracker.position.y, tracker.rotation, 'superLaserTop', tracker.finalVelocity)
                        Client.shotLaser(tracker.position.x, tracker.position.y, tracker.rotation, 'superFakeTop', tracker.finalVelocity)
                    } else {
                        this.fireLaser(tracker.position.x, tracker.position.y, tracker.rotation, 'superLaser', tracker.finalVelocity)
                        Client.shotLaser(tracker.position.x, tracker.position.y, tracker.rotation, 'superFake', tracker.finalVelocity)
                    }
                } else {
                    this.fireLaser(tracker.position.x, tracker.position.y, tracker.rotation, 'real' + player.level, tracker.finalVelocity)
                    Client.shotLaser(tracker.position.x, tracker.position.y, tracker.rotation, 'fake' + player.level, tracker.finalVelocity)
                }
                tracker.destroy()
            }
        })

        //Escape Button
        if (this.backspace.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_BACK)){
            Client.disconnectSocket()
            this.state.start('MenuState')
        }

        if (game.state.current !== 'GameState'){
            Client.disconnectSocket()
        }

        //EXP BAR
        if (player.exp >= 100){
            this.isLeveling = true
            player.exp = 0
            player.level++
            //Can attack right after leveling
            this.canAttack = true
            this.attackCooldown = 0
            Client.levelUp(player.level, player.id)
            if (player.level === 4){
                this.attackWaitTime = superAttackCooldown
            }
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
            game.add.text(this.game.world.width / 2, 300, 'You Died', {font: '84pt Megrim', fill: '#66FB21'}).anchor.set(0.5)
        }

        if (this.gameOverCounter === 100){
            game.add.text(this.game.world.width / 2, 360, 'Press ENTER to Return to the Menu', {font: '24pt Megrim', fill: '#66FB21'}).anchor.set(0.5)
            var nameText = game.add.text(this.game.world.width / 2, 425, playerName, {font: '24pt Megrim', fill: '#66FB21'})
            nameText.anchor.set(0.5)
            var scoreText = game.add.text(this.game.world.width / 2, 460, 'SCORE: ' + player.score, {font: '20pt Megrim', fill: '#66FB21'})
            scoreText.anchor.set(0.5)
            if (playerRank){
                var rankText = game.add.text(this.game.world.width / 2, 490, 'RANK: ' + playerRank, {font: '20pt Megrim', fill: '#66FB21'})
                rankText.anchor.set(0.5)
                playerRank = null
            }
        }

        if (this.gameOverCounter > 101){
            if (this.enter.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_A) || pad1.isDown(Phaser.Gamepad.XBOX360_START)){
                this.state.start('MenuState')
            }
        }

        asteroidsExplosion.children.forEach(explosion => {
            explosion.animations.play('explode')
        })
    },

    //SOCKET CODE ==================================

    addNewPlayer: function(id, name){
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
            this.playerName[id].destroy();
            delete this.playerName[id];
        }
    },

    movePlayer: function(id, x, y, rotation, moveState, name){
        if (game.state.current === 'GameState'){
            if (this.playerMap[id]){
                this.playerMap[id].position.x = x
                this.playerMap[id].position.y = y
                this.playerMap[id].rotation = rotation
                this.playerMap[id].frame = moveState
            }
            if (!this.playerName[id]){
            this.playerName[id] = game.add.text(-360, -200, name, {font: '12pt Megrim', fill: '#02F3F7'})
            this.playerName[id].anchor.set(0.5)
            }
            if (this.playerName[id]){
                this.playerName[id].position.x = x
                this.playerName[id].position.y = y + 60
            }
        }
    },

    shootLaser: function(x, y, rotation, type, velocity){
       if (game.state.current === 'GameState'){
            this.fireLaser(x, y, rotation, type, velocity)
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
            newAsteroid.oreType = asteroid.oreType
        }
    },
}
