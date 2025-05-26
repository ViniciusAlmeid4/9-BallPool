function createBalls(scene) {
    let balls = [];

    // White ball (cue ball) separated
    const whiteBall = { x: 200, y: 360, isWhite: true };

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
        // ball.setFrictionStatic(0.0);
        ball.setFrictionAir(0.005); // Simula arrasto
        ball.setBounce(0.9);
        balls.push(ball);
    });

    return balls;
}