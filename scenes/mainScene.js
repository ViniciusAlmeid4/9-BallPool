const mainScene = {
    preload,
    create,
    update,
};

let ball1, ball2, ball3, ball4;
let balls = [];

function preload() {
    this.load.image("ball", "assets/ball.png");
}

function create() {
    ball1 = createBall(this, 100, 310);
    ball2 = createBall(this, 1280, 300);
    ball3 = createBall(this, 850, 340);
    ball4 = createBall(this, 850, 260);

    balls = [ball1, ball2, ball3, ball4];

    ball1.setVelocityX(13);

    this.matter.world.setBounds(0, 0, 1280, 720, 100, true, true, true, true);
}

function update() {
    balls.forEach((ball) => {
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
