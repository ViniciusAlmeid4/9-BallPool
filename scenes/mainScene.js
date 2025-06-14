const mainScene = {
    key: 'MainScene',
    preload,
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

function preload() {
    this.load.image("table", "assets/arts/table.png");
    this.load.image("ballRed", "assets/arts/ballRed.png");
    this.load.image("ballBlue", "assets/arts/ballBlue.png");
    this.load.image("ballYellow", "assets/arts/ballYellow.png");
    this.load.image("ballWhite", "assets/arts/ballWhite.png");
    this.load.image("pocket", "assets/arts/pocket.png");
    this.load.image("stick", "assets/arts/stick.png");
    this.load.image("powerBar", "assets/arts/powerBar.png");
    this.load.image("powerSlider", "assets/arts/powerSlider.png");
    this.load.image("shadowBall", "assets/arts/shadowBall.png");

    this.load.on("loaderror", (file) => {
        console.error(`Erro ao carregar: ${file.key}, URL: ${file.src}`);
    });
}

function create() {
    this.stickLocked = false;
    this.stickDistance = 20;
    this.isDragging = false;
    this.isResetingCueBall = false;
    this.powerValue = 0;
    this.trajectoryLine = this.add.graphics();

    const Matter = Phaser.Physics.Matter.Matter;
    this.matter.world.engine.positionIterations = 10;
    this.matter.world.engine.velocityIterations = 10;
    Matter.Resolver._restingThresh = 0.001;

    this.matter.world.setBounds(0, 0, 1360, 768, 100, true, true, true, true);

    SoundManager.runPlaylist();

    createBorders(this);

    this.add.image(680, 409, "table").setDepth(-1);

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

    this.input.on("pointermove", (pointer) => {
        updateStickPosition(this, pointer);
    });

    this.input.on("pointerdown", (pointer) => {
        this.powerSlider.y = 325
        if (allBallsStopped) {
            const tableArea = {
                x: 80,
                y: 50,
                width: 1220,
                height: 670,
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
                        assignPlayerColors(ballSprite.texture.key);
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
                    switchPlayer();
                }
            } else {
                switchPlayer();
            }
            lastPocketedBallColor = null;
            resetBallPocketedFlag();
            shotTaken = false;
            shotStarted = false;
        }
    });
}

function update() {
    const now = performance.now();

    this.powerBar.setVisible(allBallsStopped && this.stickLocked);
    this.powerSlider.setVisible(allBallsStopped && this.stickLocked);

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
    const playerColor = getPlayerColor(currentPlayer);
    const opponent = currentPlayer === 1 ? 2 : 1;

    if (pocketedBall.texture.key === "ballYellow" && !colorAssigned) {
        showVictoryText(scene, `Jogador ${opponent} venceu!`);
        return;
    }

    if (!colorAssigned) return; // ainda não temos cores atribuídas

    const remainingBalls = balls.filter(
        (b) => b.color === (playerColor === "vermelho" ? "ballRed" : "ballBlue")
    );

    if (pocketedBall.texture.key === "ballYellow") {
        if (remainingBalls.length === 0) {
            showVictoryText(scene, `Jogador ${currentPlayer} venceu!`);
        } else {
            showVictoryText(scene, `Jogador ${opponent} venceu!`);
        }
    }
}

function showVictoryText(scene, message) {
    const victoryText = scene.add
        .text(620, 316, message, {
            fontSize: "48px",
            fill: "#fff",
            backgroundColor: "#000",
            padding: { x: 20, y: 10 },
            align: "center",
        })
        .setOrigin(0.5)
        .setDepth(10);

    scene.input.enabled = false;
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
    ball1.setFriction(0);
    ball1.setFrictionAir(0.0025);
    ball1.setBounce(0.9);
    ball1.isWhite = true;

    balls = balls.filter((b) => !b.isWhite);
    balls.unshift(ball1);
}