const mainScene = {
    preload,
    create,
    update,
};

let ball1, ball2, ball3, ball4;
let balls = [];
let pockets;

let stickLocked = false;

function preload() {
    this.load.image("ball", "assets/ball.png");
    this.load.image("pocket", "assets/pocket.png");
    this.load.image("stick", "assets/stick.png");
}

function create() {
    const Matter = Phaser.Physics.Matter.Matter;
    this.matter.world.engine.positionIterations = 10;
    this.matter.world.engine.velocityIterations = 10;
    Matter.Resolver._restingThresh = 0.001;

    this.matter.world.setBounds(0, 0, 1280, 720, 100, true, true, true, true);

    this.input.on("pointermove", (pointer) => {
        updateStickPosition(pointer);
    });

    this.input.on("pointerdown", () => {
        stickLocked = !stickLocked;
    });
}

    balls = createBalls(this);
    pockets = createPockets(this);
    stick = createStick(this, 300, 700);

    setTimeout(() => {
        balls[0].setVelocity(20, 0);
    }, 1000);

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
}

function update() {}

function updateStickPosition(pointer) {
    if(stickLocked) return;

    const dx = pointer.x - ball1.x;
    const dy = pointer.y - ball1.y;
    const angle = Math.atan2(dy, dx);

    // Set rotation to point from ball to opposite side of mouse
    stick.rotation = angle + -1.6;
    // console.log(angle);

    // Offset the stick to the opposite side of the pointer (behind ball)
    const distance = 30; // Adjust this for how far back the stick sits
    stick.x = ball1.x + Math.cos(angle) * distance;
    stick.y = ball1.y + Math.sin(angle) * distance;
}
