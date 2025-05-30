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

    this.add.image(620, 316.5, "table").setDepth(-1);

    this.input.on("pointermove", (pointer) => {
        updateStickPosition(this, pointer);
    });

    this.input.on("pointerdown", (pointer) => {
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
    });

    balls = createBalls(this);
    pockets = createPockets(this);
    stick = createStick(this, 300, 700);
    const powerControls = createPowerBar(this);
    this.powerBar = powerControls.powerBar;
    this.powerSlider = powerControls.powerSlider;
    this.shadowBall = this.add.image(0, 0, "shadowBall").setVisible(false);

    // Table barrier (cushion) settings
    const width = this.sys.game.config.width;
    const height = this.sys.game.config.height;
    const barrierThickness = 8;
    const tableOffset = 74; // Offset for the table edges
    const pocketOffset = 114;

    // Top barrier (left segment)
    this.matter.add.rectangle(
        tableOffset + (pocketOffset / 2) - 15 + ((width / 2) - tableOffset * 2 - 8) / 2, // center x
        barrierThickness / 2 + barrierThickness + tableOffset, // center y
        (width / 2) - tableOffset * 2 - 8, // width
        barrierThickness, // height
        { isStatic: true, restitution: 1, label: "barrier" }
    );
    
    // Top barrier (right segment)
    this.matter.add.rectangle(
        (width / 2) + pocketOffset - tableOffset + ((width / 2) - tableOffset * 2 - 8) / 2,
        barrierThickness / 2 + barrierThickness + tableOffset,
        (width / 2) - tableOffset * 2 - 8,
        barrierThickness,
        { isStatic: true, restitution: 1, label: "barrier" }
    );

    // Bottom barrier (left segment)
    this.matter.add.rectangle(
        tableOffset + (pocketOffset / 2) - 15 + ((width / 2) - tableOffset * 2 - 8) / 2,
        height - barrierThickness / 2 - barrierThickness - tableOffset,
        (width / 2) - tableOffset * 2 - 8,
        barrierThickness,
        { isStatic: true, restitution: 1, label: "barrier" }
    );

    // Bottom barrier (right segment)
    this.matter.add.rectangle(
        (width / 2) + pocketOffset - tableOffset + ((width / 2) - tableOffset * 2 - 8) / 2,
        height - barrierThickness / 2 - barrierThickness - tableOffset,
        (width / 2) - tableOffset * 2 - 8,
        barrierThickness,
        { isStatic: true, restitution: 1, label: "barrier" }
    );

    // Left barrier (top segment)
    this.matter.add.rectangle(
        0 + tableOffset + barrierThickness / 2,
        pocketOffset + 1.5 + (height - pocketOffset * 2 - 4) / 2,
        barrierThickness,
        height - pocketOffset * 2 - 4,
        { isStatic: true, restitution: 1, label: "barrier" }
    );

    // Right barrier (top segment)
    this.matter.add.rectangle(
        width - barrierThickness - tableOffset + barrierThickness / 2,
        pocketOffset + 1.5 + (height - pocketOffset * 2 - 4) / 2,
        barrierThickness,
        height - pocketOffset * 2 - 4,
        { isStatic: true, restitution: 1, label: "barrier" }
    );

    const graphics = this.add.graphics();
    graphics.fillStyle(0xffffff, 1); // White, fully opaque

    // Top barrier (left segment)
    graphics.fillRect(
        tableOffset + (pocketOffset / 2) - 15,
        barrierThickness + tableOffset,
        (width / 2) - tableOffset * 2 - 8,
        barrierThickness
    );
    // Top barrier (right segment)
    graphics.fillRect(
        (width / 2) + pocketOffset - tableOffset,
        barrierThickness + tableOffset,
        (width / 2) - tableOffset * 2 - 8,
        barrierThickness
    );
    // Bottom barrier (left segment)
    graphics.fillRect(
        tableOffset + (pocketOffset / 2) - 15,
        height - barrierThickness - tableOffset,
        (width / 2) - tableOffset * 2 - 8,
        barrierThickness
    );
    // Bottom barrier (right segment)
    graphics.fillRect(
        (width / 2) + pocketOffset - tableOffset,
        height - barrierThickness - tableOffset,
        (width / 2) - tableOffset * 2 - 8,
        barrierThickness
    );
    // Left barrier
    graphics.fillRect(
        0  + tableOffset,
        pocketOffset + 1.5,
        barrierThickness,
        height - pocketOffset * 2 - 4
    );
    // Right barrier
    graphics.fillRect(
        width - barrierThickness - tableOffset,
        pocketOffset + 1.5,
        barrierThickness,
        height - pocketOffset * 2 - 4
    );

this.matter.world.on("beforeupdate", () => {
        balls.forEach((ball) => {
            const vx = ball.body.velocity.x;
            const vy = ball.body.velocity.y;
            const speed = Math.hypot(vx, vy);

            if (speed < 0.03) {
                ball.setVelocity(0, 0);
            } else {
                ball.setVelocity(vx * 0.995, vy * 0.995);
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
}

function update() {
    const now = performance.now();

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
        }
    }

    this.powerBar.setVisible(this.stickLocked);
    this.powerSlider.setVisible(this.stickLocked);
}
