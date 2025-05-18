function createBall(scene, x, y, velocity = null) {
    const ball = scene.matter.add.image(x, y, "ball");
    ball.setCircle(25);
    ball.setFriction(0.0);
    // ball.setFrictionStatic(0.0);
    ball.setFrictionAir(0.0035); // Simula arrasto
    ball.setBounce(0.95);

    return ball;
}
