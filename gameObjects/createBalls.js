function createBalls(scene) {
    let balls = [];

    // White ball (cue ball) separated
    const whiteBall = { x: 200, y: 360, isWhite: true};

    // Pyramid (triangle) formation for 9-ball pool
    const pyramidBalls = [
        { x: 800, y: 360 }, // Row 1
        { x: 844, y: 384 }, { x: 844, y: 336 }, // Row 2
        { x: 888, y: 408 }, { x: 888, y: 360 }, { x: 888, y: 312 }, // Row 3
        { x: 932, y: 384 }, { x: 932, y: 336 }, // Row 2
        { x: 976, y: 360 }, // Row 1
    ];

    // Combine white ball and pyramid balls into positions array
    const positions = [whiteBall, ...pyramidBalls];

    positions.forEach((pos, index) => {
        const ball = scene.matter.add.image(pos.x, pos.y, "ball");
        ball.setCircle(25);
        ball.setFriction(0);
        // ball.setFrictionStatic(0.0);
        ball.setFrictionAir(0.005); // Simula arrasto
        ball.setBounce(0.9);
        balls.push(ball);
    });

    return balls;
}
