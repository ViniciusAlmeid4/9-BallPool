const mainScene = {
    key: "MainScene",
    create,
    update,
};

let ball1;
let balls = [];
let pockets;

let isStickAnimating = false;
let stickAnimationProgress = 0;
let stickAnimationDuration = 150; // milliseconds
let stickAnimationStart = 0;
let stickInitialDistance = 20;
let stickFinalDistance = 5;
let queuedForce = { x: 0, y: 0 };
let currentShotAngle = 0;

let playerManager;
let canSwitchPlayer = false; // Flag para controlar o momento da troca de jogador
let shotTaken = false;
let shotStarted = false;
let allBallsStopped = true;
let lastPocketedBallColor = null;
const ball1InitialPosition = { x: 300, y: 360 };

function create() {
    this.stickLocked = false;
    this.stickDistance = 20;
    this.isDragging = false;
    this.isResetingCueBall = false;
    this.powerValue = 0;
    this.trajectoryLine = this.add.graphics();
    this.isOnZeMadrugaPower = false;

    const Matter = Phaser.Physics.Matter.Matter;
    this.matter.world.engine.positionIterations = 10;
    this.matter.world.engine.velocityIterations = 10;
    Matter.Resolver._restingThresh = 0.001;

    this.matter.world.setBounds(0, 0, 1360, 768, 100, true, true, true, true);

    this.allowCueBallPlacement = false;

    SoundManager.runPlaylist();

    createBorders(this);

    this.add.image(680, 424, "table").setDepth(-1);

    playerManager = createPlayerDisplay(this);

    balls = createBalls(this);
    pockets = createPockets(this);
    stick = createStick(this, 300, 700);

    const { powerBar, powerSlider } = createPowerBar(this);
    this.powerBar = powerBar;
    this.powerSlider = powerSlider;

    this.shadowBall = this.add.image(0, 0, "shadowBall");
    this.shadowBall.setVisible(false);
    this.shadowBall.setDisplaySize(40, 40);
    this.shadowBall.setDepth(1);

    let isDraggingCueBall = false;
    let cueBallGhost = null;
    let ghostOffset = { x: 0, y: 0 };

    this.input.on("pointerdown", (pointer) => {
        if (this.isOnZeMadrugaPower) {
            const distance = Phaser.Math.Distance.Between(
                pointer.x,
                pointer.y,
                ball1.x,
                ball1.y
            );

            if (distance < 30) {
                isDraggingCueBall = true;

                ghostOffset = {
                    x: pointer.x - ball1.x,
                    y: pointer.y - ball1.y,
                };

                cueBallGhost = this.add.image(ball1.x, ball1.y, "ballWhite");
                cueBallGhost.setDepth(5);
                cueBallGhost.setScale(ball1.scaleX);

                // Hide the white cue ball
                ball1.setVisible(false);
            }

            return;
        }

        this.powerSlider.y = 325;
        if (allBallsStopped) {
            const tableArea = {
                x: 80,
                y: 110,
                width: 1220,
                height: 645,
            };

            if (
                pointer.x >= tableArea.x &&
                pointer.x <= tableArea.x + tableArea.width &&
                pointer.y >= tableArea.y &&
                pointer.y <= tableArea.y + tableArea.height
            ) {
                this.stickLocked = !this.stickLocked;
            }
        }
    });

    this.input.on("pointermove", (pointer) => {
        let currentPlayerObject = currentPlayer == 1 ? player1 : player2;

        if (
            currentPlayerObject.character.charName == "Zé Madruga" &&
            currentPlayerObject.character.powerIsOn
        ) {
            if (!isDraggingCueBall || !cueBallGhost) return;

            const tableBounds = new Phaser.Geom.Rectangle(80, 110, 1220, 645);
            if (tableBounds.contains(pointer.x, pointer.y)) {
                cueBallGhost.setPosition(
                    pointer.x - ghostOffset.x,
                    pointer.y - ghostOffset.y
                );
            }
        }

        updateStickPosition(this, pointer);
    });

    this.input.on("pointerup", () => {
        if (isDraggingCueBall && cueBallGhost) {
            const currentPlayerObject = currentPlayer == 1 ? player1 : player2;

            ball1.setPosition(cueBallGhost.x, cueBallGhost.y).setVisible(true);

            cueBallGhost.destroy();
            cueBallGhost = null;
            isDraggingCueBall = false;
            ghostOffset = { x: 0, y: 0 };

            currentPlayerObject.character.powerIsOn = false;
            this.allowCueBallPlacement = false;
            this.isOnZeMadrugaPower = false;
        }
    });

    this.matter.world.on("beforeupdate", () => {
        let stopped = true;
        for (let i = 0; i < balls.length; i++) {
            const v = balls[i].body.velocity;
            if (v.x !== 0 || v.y !== 0) {
                stopped = false;
                if (shotTaken && balls[i] === ball1) {
                    shotStarted = true;
                }
                break;
            }
        }
        allBallsStopped = stopped;

        balls.forEach((ball) => {
            const vx = ball.body.velocity.x;
            const vy = ball.body.velocity.y;
            const speed = Math.hypot(vx, vy);

            if (speed < 0.02) {
                ball.setVelocity(0, 0);
            }
        });
    });

    this.matter.world.on("collisionstart", (event) => {
        function isBall(body) {
            return balls.some((b) => b.body === body);
        }

        function isPocket(body) {
            return pockets.entryPoints.some((p) => p.body === body);
        }

        const removeBallFromWorld = (scene, ball) => {
            SoundManager.playSfx("pocketSound");

            if (ball.isWhite) {
                this.isResetingCueBall = true;
                updateStickPosition(this, this.input.activePointer);
                ball.setVisible(false);
                setTimeout(() => {
                    this.isResetingCueBall = false;
                    updateStickPosition(this, this.input.activePointer);
                    ball.setVisible(true);
                    resetCueBall(scene);
                }, 3000);
            } else {
                const index = balls.indexOf(ball);
                if (index !== -1) {
                    balls.splice(index, 1);
                    scene.matter.world.remove(ball.body);
                    ball.destroy();

                    setBallPocketed(true);

                    const colorKey = ball.color;

                    player1.remainingBalls = removeBallColor(
                        player1.remainingBalls,
                        colorKey
                    );
                    player2.remainingBalls = removeBallColor(
                        player2.remainingBalls,
                        colorKey
                    );

                    function removeBallColor(ballArray, color) {
                        const idx = ballArray.indexOf(color);
                        if (idx > -1) {
                            ballArray.splice(idx, 1);
                        }
                        return ballArray;
                    }

                    drawRemainingBallsUI(this);

                    if (ball.color) {
                        lastPocketedBallColor = ball.color;
                    }
                }

                checkVictory(scene, ball);
            }
        };

        event.pairs.forEach((pair) => {
            const { bodyA, bodyB } = pair;

            if (isBall(bodyA) && isBall(bodyB)) {
                SoundManager.playSfx("ballHit", { volume: 0.6 });
            }

            let ballBody;

            if (isBall(bodyA) && isPocket(bodyB)) {
                ballBody = bodyA;
            } else if (isBall(bodyB) && isPocket(bodyA)) {
                ballBody = bodyB;
            }

            if (ballBody) {
                const ballSprite = balls.find((b) => b.body === ballBody);
                if (ballSprite) {
                    if (
                        !colorAssigned &&
                        (ballSprite.texture.key === "ballRed" ||
                            ballSprite.texture.key === "ballBlue")
                    ) {
                        assignPlayerColors(ballSprite.texture.key, this);
                    }
                    removeBallFromWorld(this, ballSprite);
                }
            }
        });
    });

    this.matter.world.on("afterupdate", () => {
        updateStickPosition(this, this.input.activePointer);
        updatePlayerDisplay();

        if (shotTaken && shotStarted && allBallsStopped) {
            if (getBallPocketed()) {
                if (!shouldKeepTurn(lastPocketedBallColor)) {
                    switchPlayer(this);
                }
            } else {
                switchPlayer(this);
            }
            lastPocketedBallColor = null;
            resetBallPocketedFlag();
            shotTaken = false;
            shotStarted = false;

            if (!this.pocketBlocks || !Array.isArray(this.pocketBlocks)) {
                console.warn("No pocket blocks to remove.");
                return;
            }

            this.pocketBlocks.forEach((block, index) => {
                if (block && block.body) {
                    block.destroy();
                } else {
                    console.warn(
                        `Pocket block ${index} is missing or already destroyed.`
                    );
                }
            });

            this.pocketBlocks = [];
        }
    });

    // Button for Player 1
    const button1 = this.add
        .image(385, 35, "abilityUseBtn")
        .setScale(0.7)
        .setInteractive()
        .on("pointerdown", () => {
            if (button1.texture.key === "abilityUseBtn") {
                player1.character.usePower(this, pockets.pockets);
                button1.setTexture("abilityUsedBtn");
                button1.disableInteractive();
            }
        });

    // Button for Player 2
    const button2 = this.add
        .image(980, 35, "abilityUseBtn")
        .setScale(0.7)
        .setInteractive()
        .on("pointerdown", () => {
            if (button2.texture.key === "abilityUseBtn") {
                player2.character.usePower(this, pockets.pockets);
                button2.setTexture("abilityUsedBtn");
                button2.disableInteractive();
            }
        });
}

function update() {
    const now = performance.now();

    this.powerBar.setVisible(allBallsStopped && this.stickLocked);
    this.powerSlider.setVisible(allBallsStopped && this.stickLocked);

    let currentPlayerObject = currentPlayer == 1 ? player1 : player2;
    if (
        currentPlayerObject.character.charName === "Zé Madruga" &&
        currentPlayerObject.character.powerIsOn
    )
        this.isOnZeMadrugaPower = true;

    if (isStickAnimating) {
        const elapsed = now - stickAnimationStart;
        const t = Math.min(elapsed / stickAnimationDuration, 1);

        this.stickDistance = Phaser.Math.Linear(
            stickInitialDistance,
            stickFinalDistance,
            t
        );

        updateStickPosition(this, this.input.activePointer);

        if (t >= 1) {
            ball1.applyForce(queuedForce);

            SoundManager.playSfx("shot");

            isStickAnimating = false;
            this.stickLocked = false;
            this.powerValue = 0;
            this.stickDistance = 20;
            this.powerSlider.y = this.powerBar.y - this.powerBar.height / 2;

            shotTaken = true;
            shotStarted = false;
        }
    }

    balls.forEach((ball) => {
        ball.setAngle(0);
        ball.setAngularVelocity(0);
    });
}

function checkVictory(scene, pocketedBall) {
    const opponent = currentPlayer === 1 ? 2 : 1;
    let winner = null;
    let loser = null;

    if (pocketedBall.texture.key === "ballYellow") {
        if (!colorAssigned) {
            winner = opponent;
            loser = currentPlayer;
        } else {
            const playerColor = getPlayerColor(currentPlayer);
            const remainingPlayerBalls = balls.filter(
                (b) => b.active && b.texture.key !== "ballWhite" && b.texture.key !== "ballYellow" &&
                       b.color === (playerColor === "vermelho" ? "ballRed" : "ballBlue")
            ).length;

            if (remainingPlayerBalls === 0) {
                winner = currentPlayer;
                loser = opponent;
            } else {
                winner = opponent;
                loser = currentPlayer;
            }
        }
    }

    if (winner !== null) {
        scene.input.enabled = false;
        scene.scene.start('EndGameScene', { 
            winner: winner,
            loser: loser,
            player1Data: player1,
            player2Data: player2
        });
        return;
    }
}

function resetCueBall(scene) {
    scene.matter.world.remove(ball1.body);
    ball1.destroy();

    ball1 = scene.matter.add.image(
        ball1InitialPosition.x,
        ball1InitialPosition.y,
        "ballWhite"
    );
    ball1.setCircle(20);
    ball1.setBounce(0.8);
    ball1.setFriction(0);
    ball1.setFrictionAir(0.0085);
    ball1.isWhite = true;

    balls = balls.filter((b) => !b.isWhite);
    balls.unshift(ball1);
}
