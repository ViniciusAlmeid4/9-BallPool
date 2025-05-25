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
        const decay = 0.999; // Decay factor (closer to 1 = slower stop)

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

    balls.forEach((ball) => {
        updateStickPosition(this.input.activePointer);

        const velocity = ball.body.velocity;
        const speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);

        const lowSpeedThreshold = 0.5;
        const stopThreshold = 0.1;
        const bounceLoss = 0.95;

        if (speed < lowSpeedThreshold && speed > stopThreshold) {
            ball.setVelocity(velocity.x * 0.9, velocity.y * 0.9);
        } else if (speed <= stopThreshold) {
            ball.setVelocity(0, 0);
            ball.setAngularVelocity(0);
        }

        const left = 0,
            right = 1380,
            top = 0,
            bottom = 720;
        const radius = ball.displayWidth / 2;

        if (ball.x - radius <= left && velocity.x < 0) {
            ball.setVelocity(-velocity.x * bounceLoss, velocity.y * bounceLoss);
        } else if (ball.x + radius >= right && velocity.x > 0) {
            ball.setVelocity(-velocity.x * bounceLoss, velocity.y * bounceLoss);
        }

        if (ball.y - radius <= top && velocity.y < 0) {
            ball.setVelocity(velocity.x * bounceLoss, -velocity.y * bounceLoss);
        } else if (ball.y + radius >= bottom && velocity.y > 0) {
            ball.setVelocity(velocity.x * bounceLoss, -velocity.y * bounceLoss);
        }
    });

    powerBar.setVisible(stickLocked);
    powerSlider.setVisible(stickLocked);
}

function updateStickPosition(pointer) {
    stick.setVisible(false);
    ball1 = balls[0];
    // console.log(ball1.body.velocity.x);
    if (!ball1.body.velocity.x && !ball1.body.velocity.y) {
        stick.setVisible(true);
    }

    const distance = stickDistance; // Adjust this for how far back the stick sits

    if (stickLocked) {
        const angle = stick.rotation - Phaser.Math.DegToRad(90);
        stick.x = ball1.x + Math.cos(angle) * -distance;
        stick.y = ball1.y + Math.sin(angle) * -distance;
        return;
    }
    const dx = pointer.x - ball1.x;
    const dy = pointer.y - ball1.y;
    const angle = Math.atan2(dy, dx);
    // Set rotation to point from ball to opposite side of mouse
    stick.rotation = angle + -1.57079633;

    // Offset the stick to the opposite side of the pointer (behind ball)
    stick.x = ball1.x + Math.cos(angle) * distance;
    stick.y = ball1.y + Math.sin(angle) * distance;
}

function shootCueBall() {
    if (!ball1) return;

    const maxForce = 0.15;
    const force = powerValue * maxForce;

    const angle = stick.rotation - Phaser.Math.DegToRad(90);

    queuedForce = {
        x: Math.cos(angle) * force,
        y: Math.sin(angle) * force,
    };

    stickInitialDistance = stickDistance;
    stickFinalDistance = 5; // almost hitting the ball
    stickAnimationProgress = 0;
    stickAnimationStart = performance.now();

    isStickAnimating = true;
}
