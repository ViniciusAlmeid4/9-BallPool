const mainScene = {
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

let playerManager;
let canSwitchPlayer = false; // Flag para controlar o momento da troca de jogador
let shotTaken = false;
let shotStarted = false;
let allBallsStopped = true;
let lastPocketedBallColor = null;
const ball1InitialPosition = { x: 300, y: 360 };

function preload() {
    this.load.image("table", "assets/table.png");
    this.load.image("ballRed", "assets/ballRed.png");
    this.load.image("ballBlue", "assets/ballBlue.png");
    this.load.image("ballYellow", "assets/ballYellow.png");
    this.load.image("ballWhite", "assets/ballWhite.png");
    this.load.image("pocket", "assets/pocket.png");
    this.load.image("stick", "assets/stick.png");
    this.load.image("powerBar", "assets/powerBar.png");
    this.load.image("powerSlider", "assets/powerSlider.png");
    this.load.image("shadowBall", "assets/shadowBall.png");
}

function create() {
    this.stickLocked = false;
    this.stickDistance = 20;
    this.isDragging = false;
    this.powerValue = 0;
    this.trajectoryLine = this.add.graphics();

    const Matter = Phaser.Physics.Matter.Matter;
    this.matter.world.engine.positionIterations = 10;
    this.matter.world.engine.velocityIterations = 10;
    Matter.Resolver._restingThresh = 0.001;

    this.matter.world.setBounds(0, 0, 1240, 633, 100, true, true, true, true);

    createBorders(this);

    this.add.image(620, 316.5, "table").setDepth(-1);

    playerManager = createPlayerDisplay(this);

    this.input.on("pointermove", (pointer) => {
        updateStickPosition(this, pointer);
    });

    this.input.on("pointerdown", (pointer) => {
        if (allBallsStopped) {
            const tableArea = {
                x: 100,
                y: 50,
                width: 1180,
                height: 620,
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

    balls = createBalls(this);
    pockets = createPockets(this);
    stick = createStick(this, 300, 700);
    const powerControls = createPowerBar(this);
    this.powerBar = powerControls.powerBar;
    this.powerSlider = powerControls.powerSlider;
    this.shadowBall = this.add.image(0, 0, "shadowBall").setVisible(false);

    const { powerBar, powerSlider } = createPowerBar(this);
    this.powerBar = powerBar;
    this.powerSlider = powerSlider;

    this.shadowBall = this.add.image(0, 0, "shadowBall");
    this.shadowBall.setVisible(false);
    this.shadowBall.setDisplaySize(40, 40);
    this.shadowBall.setDepth(1);

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

            if (speed < 0.01) {
                ball.setVelocity(0, 0);
            } else if (speed < 0.5) {
                ball.setVelocity(vx * 0.98, vy * 0.98);
            } else {
                ball.setVelocity(vx * 0.99, vy * 0.99);
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
            if (ball.isWhite) {
                resetCueBall(scene); // Reseta a bola branca
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

                checkVictory(scene, ball); // Garante verificação de vitória após encaçapamento
            }
        };

        event.pairs.forEach((pair) => {
            const { bodyA, bodyB } = pair;
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
            updatePlayerDisplay();
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
            isStickAnimating = false;
            this.stickLocked = false;
            this.powerValue = 0;
            this.stickDistance = 20;
            this.powerSlider.y = this.powerBar.y - this.powerBar.height / 2;
            updateStickPosition(this, this.input.activePointer);

            shotTaken = true; // A shot was triggered
            shotStarted = false; // … but we haven’t moved the ball yet
        }
    }

    balls.forEach((ball) => {
        ball.setAngle(0);
        ball.setAngularVelocity(0);
    });
}

function checkVictory(scene, pocketedBall) {
    if (!colorAssigned) return; // ainda não temos cores atribuídas

    const playerColor = getPlayerColor(currentPlayer);
    const opponent = currentPlayer === 1 ? 2 : 1;

    // Contar quantas bolas da cor do jogador ainda estão na mesa
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

    scene.input.enabled = false; // Bloqueia entrada após vitória
}

function resetCueBall(scene) {
    // Remove a bola branca atual da física e da cena
    scene.matter.world.remove(ball1.body);
    ball1.destroy();

    // Recria a bola branca na posição inicial
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

    // Atualiza o array balls: remove qualquer referência duplicada e adiciona no início
    balls = balls.filter((b) => !b.isWhite);
    balls.unshift(ball1);
}
