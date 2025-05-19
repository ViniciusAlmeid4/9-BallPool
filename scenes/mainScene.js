const mainScene = {
    preload,
    create,
    update,
};

let ball1, ball2, ball3, ball4;
let balls = [];

function preload() {
    this.load.image("ball", "assets/ball.png");
    this.load.image("stick", "assets/stick.png");
}

function create() {
    ball1 = createBall(this, 600, 310);
    ball2 = createBall(this, 1280, 300);
    ball3 = createBall(this, 950, 340);
    ball4 = createBall(this, 950, 260);

    balls = [ball1, ball2, ball3, ball4];

    stick = createStick(this, 300, 700);

    this.matter.world.setBounds(0, 0, 1280, 720, 100, true, true, true, true);

    this.input.on("pointermove", (pointer) => {
        updateStickPosition(pointer);
    });
}

function update() {
    balls.forEach((ball) => {
        updateStickPosition(this.input.activePointer);

        const velocity = ball.body.velocity;
        const speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);

        const lowSpeedThreshold = 0.5;
        const stopThreshold = 0.1;
        const bounceLoss = 0.95; // Simulates energy loss on bounce

        // Manual damping
        if (speed < lowSpeedThreshold && speed > stopThreshold) {
            ball.setVelocity(velocity.x * 0.9, velocity.y * 0.9);
        } else if (speed <= stopThreshold) {
            ball.setVelocity(0, 0);
            ball.setAngularVelocity(0);
        }

        // Define world bounds (same as setBounds)
        const left = 0;
        const right = 1280;
        const top = 0;
        const bottom = 720;
        const radius = ball.displayWidth / 2;

        // Manual bounce with energy loss
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
}

function updateStickPosition(pointer) {
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
