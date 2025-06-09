function createStick(scene, x, y) {
    const stick = scene.add.image(x, y, "stick");
    stick.setOrigin(0.5, 0);
    stick.setVisible(false);
    return stick;
}

function updateStickPosition(scene, pointer) {
    stick.setVisible(false);
    scene.trajectoryLine.clear();
    scene.shadowBall.setVisible(false);
    ball1 = balls[0];
    
    if(scene.isResetingCueBall) {
        return;
    }

    let allStopped = true;
    for (let i = 0; i < balls.length; i++) {
        if (balls[i].body.velocity.x !== 0 || balls[i].body.velocity.y !== 0) {
            allStopped = false;
            break;
        }
    }

    if (allStopped) {
        stick.setVisible(true);
        const distance = scene.stickDistance;

        if (scene.stickLocked) {
            const angle = stick.rotation - Phaser.Math.DegToRad(90);
            stick.x = ball1.x + Math.cos(angle) * -distance;
            stick.y = ball1.y + Math.sin(angle) * -distance;
            updateTrajectoryLine(scene); // Update trajectory when locked and stopped
            return;
        }

        const dx = -pointer.x + ball1.x;
        const dy = -pointer.y + ball1.y;
        const angle = Math.atan2(dy, dx);

        stick.rotation = angle - Math.PI / 2;

        stick.x = ball1.x + Math.cos(angle) * distance;
        stick.y = ball1.y + Math.sin(angle) * distance;

        updateTrajectoryLine(scene);
    }
}

function updateTrajectoryLine(scene) {
    if (ball1.body.velocity.x || ball1.body.velocity.y) {
        scene.trajectoryLine.clear();
        scene.shadowBall.setVisible(false);
        return;
    }

    const angle = stick.rotation - Phaser.Math.DegToRad(90);
    const rayDir = { x: Math.cos(angle), y: Math.sin(angle) };
    const rayOrigin = { x: ball1.x, y: ball1.y };

    let closestIntersection = null;
    let minDistSq = Infinity;

    const cueBallRadius = ball1.displayWidth / 2;

    // Check collision with balls
    for (let i = 1; i < balls.length; i++) {
        const otherBall = balls[i];
        const otherRadius = otherBall.displayWidth / 2;
        const inflatedRadius = cueBallRadius + otherRadius;

        const intersection = getRayCircleIntersection(
            rayOrigin,
            rayDir,
            { x: otherBall.x, y: otherBall.y },
            inflatedRadius
        );

        if (intersection) {
            const dx = intersection.x - rayOrigin.x;
            const dy = intersection.y - rayOrigin.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < minDistSq) {
                minDistSq = distSq;
                closestIntersection = intersection;
            }
        }
    }

    // Check collision with table borders
    const tableBounds = { left: 160, top: 193, right: 1200, bottom: 625 }; // 1180x620 from your table area

    const borderIntersections = getRayAABBIntersections(rayOrigin, rayDir, tableBounds);

    for (const point of borderIntersections) {
        const dx = point.x - rayOrigin.x;
        const dy = point.y - rayOrigin.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < minDistSq) {
            minDistSq = distSq;
            closestIntersection = point;
        }
    }

    let endX, endY;

    if (closestIntersection) {
        endX = closestIntersection.x - rayDir.x; // pequeno recuo visual
        endY = closestIntersection.y - rayDir.y;
    } else {
        endX = rayOrigin.x + rayDir.x * 2000;
        endY = rayOrigin.y + rayDir.y * 2000;
    }

    scene.trajectoryLine.clear();
    scene.trajectoryLine.lineStyle(2, 0xffffff, 0.7);
    scene.trajectoryLine.beginPath();
    scene.trajectoryLine.moveTo(rayOrigin.x, rayOrigin.y);
    scene.trajectoryLine.lineTo(endX, endY);
    scene.trajectoryLine.strokePath();

    scene.shadowBall.setPosition(endX, endY);
    scene.shadowBall.setVisible(true);
}

function getRayCircleIntersection(rayOrigin, rayDir, circleCenter, radius) {
    const toCircle = {
        x: circleCenter.x - rayOrigin.x,
        y: circleCenter.y - rayOrigin.y,
    };

    const projLength = toCircle.x * rayDir.x + toCircle.y * rayDir.y;
    const closestPoint = {
        x: rayOrigin.x + rayDir.x * projLength,
        y: rayOrigin.y + rayDir.y * projLength,
    };

    const distToCenterSq =
        (closestPoint.x - circleCenter.x) ** 2 +
        (closestPoint.y - circleCenter.y) ** 2;

    const radiusSq = radius * radius;

    if (distToCenterSq > radiusSq) {
        return null; // No intersection
    }

    const offset = Math.sqrt(radiusSq - distToCenterSq);

    const intersectionDist = projLength - offset;

    if (intersectionDist < 0) {
        return null; // Intersection is behind the ray origin
    }

    return {
        x: rayOrigin.x + rayDir.x * intersectionDist,
        y: rayOrigin.y + rayDir.y * intersectionDist,
    };
}

function shootCueBall(scene) {
    if (!ball1) return;

    const maxForce = 0.1;
    const force = scene.powerValue * maxForce;

    const angle = stick.rotation - Phaser.Math.DegToRad(90);

    queuedForce = {
        x: Math.cos(angle) * force,
        y: Math.sin(angle) * force,
    };

    stickInitialDistance = scene.stickDistance;
    stickFinalDistance = 5;
    stickAnimationProgress = 0;
    stickAnimationStart = performance.now();

    scene.trajectoryLine.clear();
    scene.shadowBall.setVisible(false); // Ensure shadow ball is hidden on shoot

    isStickAnimating = true;
}

function getRayAABBIntersections(origin, dir, bounds) {
    const points = [];

    const invDirX = 1 / dir.x;
    const invDirY = 1 / dir.y;

    const tx1 = (bounds.left - origin.x) * invDirX;
    const tx2 = (bounds.right - origin.x) * invDirX;

    const ty1 = (bounds.top - origin.y) * invDirY;
    const ty2 = (bounds.bottom - origin.y) * invDirY;

    const tmin = Math.max(Math.min(tx1, tx2), Math.min(ty1, ty2));
    const tmax = Math.min(Math.max(tx1, tx2), Math.max(ty1, ty2));

    if (tmax < 0 || tmin > tmax) return points;

    const t = tmin >= 0 ? tmin : tmax;

    if (t >= 0) {
        points.push({
            x: origin.x + dir.x * t,
            y: origin.y + dir.y * t,
        });
    }

    return points;
}
