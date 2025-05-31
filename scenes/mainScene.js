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

function preload() {
    this.load.image("table", "assets/table.png");
    this.load.image("ball", "assets/ball.png");
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
        let allStopped = true;
        for (let i = 0; i < balls.length; i++) {
            if (
                balls[i].body.velocity.x !== 0 ||
                balls[i].body.velocity.y !== 0
            ) {
                allStopped = false;
                break;
            }
        }

        if (allStopped) {
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
            const index = balls.indexOf(ball);
            if (index !== -1) {
                balls.splice(index, 1);
                scene.matter.world.remove(ball.body);
                ball.destroy();
                setBallPocketed(true); // Marca que uma bola foi encaçapada
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
                    removeBallFromWorld(this, ballSprite);
                }
            }
        });
    });

    this.matter.world.on("afterupdate", () => {
        if (isStickAnimating) {
            resetBallPocketedFlag();
            canSwitchPlayer = false; // Impede a troca até o final da animação
        } else if (canSwitchPlayer) {
            if (!getBallPocketed()) {
                switchPlayer();
            }
            resetBallPocketedFlag();
            updatePlayerDisplay();
            canSwitchPlayer = false; // Reseta a flag
        }
    });
}

function update() {
    const now = performance.now();
    let allStopped = true;
    for (let i = 0; i < balls.length; i++) {
        if (balls[i].body.velocity.x !== 0 || balls[i].body.velocity.y !== 0) {
            allStopped = false;
            break;
        }
    }

    this.powerBar.setVisible(allStopped && this.stickLocked);
    this.powerSlider.setVisible(allStopped && this.stickLocked);

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
            canSwitchPlayer = true; // Permite a troca após a tacada
        }
    }
}
