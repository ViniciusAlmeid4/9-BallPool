function createBall(scene, x, y, index) {
    const ball = scene.matter.add.image(x, y, "ball", null, {
        restitution: 0.9,
        frictionAir: 0.01,
        label: `ball${index}`,
        collisionFilter: {
            category: 0x0001,
            mask: 0xFFFF ^ 0x0002 // Collide with everything except category 0x0002 (pockets)
        }
    });

    ball.setCircle(ball.width / 2);
    ball.setName(`ball${index}`);
    return ball;
}
