const mainScene = {
    preload,
    create,
    update,
};

let ball1;
let balls = [];
let pockets;

let stickLocked = false;
let stickDistance = 20;
let powerBar; // Container gráfico da barra
let powerSlider; // O slider que o jogador arrasta
let powerValue = 0; // Força atual (0-1)
let isDragging = false;

let isStickAnimating = false;
let stickAnimationProgress = 0;
let stickAnimationDuration = 150; // milliseconds
let stickAnimationStart = 0;
let stickInitialDistance = 20;
let stickFinalDistance = 5;
let queuedForce = { x: 0, y: 0 };

function preload() {
    this.load.image("table", "assets/table.png");
    this.load.image("ball", "assets/ball.png");
    this.load.image("pocket", "assets/pocket.png");
    this.load.image("stick", "assets/stick.png");
    this.load.image("powerBar", "assets/powerBar.png");
    this.load.image("powerSlider", "assets/powerSlider.png");
}

function create() {
    const Matter = Phaser.Physics.Matter.Matter;
    this.matter.world.engine.positionIterations = 10;
    this.matter.world.engine.velocityIterations = 10;
    Matter.Resolver._restingThresh = 0.001;

    this.matter.world.setBounds(0, 0, 1380, 720, 100, true, true, true, true);

    this.add.image(690, 404, "table").setDepth(-1);

    this.input.on("pointermove", (pointer) => {
        updateStickPosition(pointer);
    });

    this.input.on("pointerdown", (pointer) => {
        // Define table area where the stick can be locked/unlocked
        const tableArea = {
            x: 100, // table left
            y: 50, // table top
            width: 1180,
            height: 620,
        };

        if (
            pointer.x >= tableArea.x &&
            pointer.x <= tableArea.x + tableArea.width &&
            pointer.y >= tableArea.y &&
            pointer.y <= tableArea.y + tableArea.height
        ) {
            // Only toggle stickLocked if pointer is inside table area
            stickLocked = !stickLocked;
        }
    });

    balls = createBalls(this);
    pockets = createPockets(this);
    stick = createStick(this, 300, 700);

    this.matter.world.on("beforeupdate", () => {
        balls.forEach((ball) => {
            updateStickPosition(this.input.activePointer);

            const vx = ball.body.velocity.x;
            const vy = ball.body.velocity.y;
            const speed = Math.hypot(vx, vy);

            if (speed < 0.08) {
                ball.setVelocity(0, 0);
            } else if (speed < 5) {
                ball.setVelocity(vx * 0.9889, vy * 0.9889);
            } else {
                ball.setVelocity(vx * 0.9999, vy * 0.9999);
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

        removeBallFromWorld = (scene, ball) => {
            const index = balls.indexOf(ball);
            if (index !== -1) {
                balls.splice(index, 1);
                scene.matter.world.remove(ball.body);
                ball.destroy();
            }
        };

        event.pairs.forEach((pair) => {
            const { bodyA, bodyB } = pair;
            let ballBody, pocketBody;

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

    // Barra de força (escondida inicialmente)
    powerBar = this.add.image(50, 360, "powerBar").setOrigin(0.5);
    powerSlider = this.add.image(50, 210, "powerSlider").setOrigin(0.5);

    // Configurações de interação
    powerSlider.setInteractive();
    this.input.setDraggable(powerSlider);

    this.input.on("dragstart", (pointer, gameObject) => {
        if (gameObject === powerSlider && stickLocked) {
            isDragging = true;
        }
    });

    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
        if (gameObject === powerSlider && stickLocked) {
            // Limitar dentro da barra
            const minY = powerBar.y - powerBar.height / 2;
            const maxY = powerBar.y + powerBar.height / 2;

            gameObject.y = Phaser.Math.Clamp(dragY, minY, maxY);

            // Normalizar valor de força entre 0 e 1
            const sliderPosition = (gameObject.y - minY) / powerBar.height;
            powerValue = sliderPosition;
            stickDistance = 20 + powerValue * 200;
            updateStickPosition(pointer);
        }
    });

    this.input.on("dragend", (pointer, gameObject) => {
        if (gameObject === powerSlider && stickLocked) {
            isDragging = false;
            shootCueBall();
            stickDistance = 20;
        }
    });
}

function update() {
    const now = performance.now();

    if (isStickAnimating) {
        const elapsed = now - stickAnimationStart;
        const t = Math.min(elapsed / stickAnimationDuration, 1); // progress from 0 to 1

        // Linear interpolation between initial and final distances
        stickDistance = Phaser.Math.Linear(
            stickInitialDistance,
            stickFinalDistance,
            t
        );
        updateStickPosition(this.input.activePointer);

        if (t >= 1) {
            // Animation finished
            ball1.applyForce(queuedForce);

            isStickAnimating = false;
            stickLocked = false;
            powerValue = 0;
            stickDistance = 20;

            // Reset slider
            powerSlider.y = powerBar.y - powerBar.height / 2;

            updateStickPosition(this.input.activePointer);
        }
    }

    manualSpeedDamping(this.input.activePointer);

    powerBar.setVisible(stickLocked);
    powerSlider.setVisible(stickLocked);
}
