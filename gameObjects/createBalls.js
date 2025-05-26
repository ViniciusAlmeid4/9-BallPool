function createBalls(scene) {
    let balls = [];

    // White ball (cue ball) separated
    const whiteBall = { x: 300, y: 360, isWhite: true };

    // Pyramid (triangle) formation for 9-ball pool
    const pyramidBalls = [
        { x: 820, y: 360 }, // Column 1
        { x: 854, y: 380 }, // Column 2
        { x: 854, y: 340 }, // Column 2
        { x: 888, y: 400 }, // Column 3
        { x: 888, y: 360 }, // Column 3
        { x: 888, y: 320 }, // Column 3
        { x: 922, y: 380 }, // Column 2
        { x: 922, y: 340 }, // Column 2
        { x: 956, y: 360 }, // Column 1
    ];

    // Combine white ball and pyramid balls into positions array
    const positions = [whiteBall, ...pyramidBalls];

    positions.forEach((pos, index) => {
        const ball = scene.matter.add.image(pos.x, pos.y, "ball");
        ball.setCircle(20);
        ball.setFriction(0);
        ball.setFrictionAir(0.005); // Simula arrasto
        ball.setBounce(0.9);
        balls.push(ball);
    });

    return balls;
}

function manualSpeedDamping(scene, pointer) {
    balls.forEach((ball) => {
        updateStickPosition(scene, pointer);

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
}
