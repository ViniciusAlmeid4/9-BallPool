function createStick(scene, x, y) {
    const stick = scene.add.image(x, y, "stick");
    stick.setOrigin(0.5, 0); // Pivot at tip of stick (top of vertical image)
    // stick.setDisplaySize(15, 300);

    return stick;
}

function updateStickPosition(pointer) {
    stick.setVisible(false);
    ball1 = balls[0];
    // console.log(ball1.body.velocity.x);
    if (!ball1.body.velocity.x && !ball1.body.velocity.y) {
        stick.setVisible(true);
    }

    const distance = stickDistance; // Adjust this for how far back the stick sits

    if (stickLocked) {
        const angle = stick.rotation - Phaser.Math.DegToRad(90);
        stick.x = ball1.x + Math.cos(angle) * -distance;
        stick.y = ball1.y + Math.sin(angle) * -distance;
        return;
    }
    const dx = pointer.x - ball1.x;
    const dy = pointer.y - ball1.y;
    const angle = Math.atan2(dy, dx);
    // Set rotation to point from ball to opposite side of mouse
    stick.rotation = angle + -1.57079633;

    // Offset the stick to the opposite side of the pointer (behind ball)
    stick.x = ball1.x + Math.cos(angle) * distance;
    stick.y = ball1.y + Math.sin(angle) * distance;
}

function shootCueBall() {
    if (!ball1) return;

    const maxForce = 0.15;
    const force = powerValue * maxForce;

    const angle = stick.rotation - Phaser.Math.DegToRad(90);

    queuedForce = {
        x: Math.cos(angle) * force,
        y: Math.sin(angle) * force,
    };

    stickInitialDistance = stickDistance;
    stickFinalDistance = 5; // almost hitting the ball
    stickAnimationProgress = 0;
    stickAnimationStart = performance.now();

    isStickAnimating = true;
}
