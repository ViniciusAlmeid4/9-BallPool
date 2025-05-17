let count = 0;
function createBall(scene, x, y, mass) {
    const ball = scene.physics.add.image(x, y, "ball");
    ball.setName(`ball${count++}`); // Nomeia a bola
    ball.mass = mass || 1; // Massa padrão
    ball.setCircle(ball.width / 2); // Forma circular
    ball.setCollideWorldBounds(true);
    ball.setBounce(0.8); // Rebote perfeito
    // ball.setDrag(10, 10); // Simula atrito
    ball.setMaxVelocity(10000);
    return ball;
}


