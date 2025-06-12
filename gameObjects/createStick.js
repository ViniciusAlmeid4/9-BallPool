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
    
    // Limpar linha de previsão da bola atingida sempre que a posição do stick muda
    if (scene.predictedTargetLine) {
        scene.predictedTargetLine.clear();
    }
    
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

    if (allBallsStopped) {
        stick.setVisible(true);
        const distance = scene.stickDistance;

        // Se o taco não estiver travado, atualize o ângulo da tacada
        if (!scene.stickLocked) {
            // --- LÓGICA DE ÂNGULO CORRIGIDA ---
            // 1. Calcular o vetor da BOLA para o PONTEIRO
            const dx = pointer.x - ball1.x;
            const dy = pointer.y - ball1.y;

            // 2. Este é o ângulo real e puro da tacada. Armazene-o.
            currentShotAngle = Math.atan2(dy, dx);
        }
        
        // Use SEMPRE o 'currentShotAngle' para tudo a partir de agora

        // 3. Posicionar o taco ATRÁS da bola, usando o ângulo da tacada
        // Note o sinal de menos para colocar o taco na direção oposta
        stick.x = ball1.x - Math.cos(currentShotAngle) * distance;
        stick.y = ball1.y - Math.sin(currentShotAngle) * distance;

        // 4. Rotacionar o sprite do taco para alinhar visualmente
        // Você pode precisar ajustar "+ Math.PI / 2" dependendo da orientação da sua imagem
        stick.rotation = currentShotAngle + Math.PI / 2; 

        // 5. A linha de trajetória também usa o ângulo puro
        updateTrajectoryLine(scene, currentShotAngle); 
    }
}

function updateTrajectoryLine(scene, shotAngle) {
    // Limpeza das linhas
    scene.trajectoryLine.clear();
    if (scene.predictedTargetLine) {
        scene.predictedTargetLine.clear();
    }
    scene.shadowBall.setVisible(false);

    if (ball1.body.speed > 0.01) {
        return;
    }

    const rayDir = { x: Math.cos(shotAngle), y: Math.sin(shotAngle) };
    const rayOrigin = { x: ball1.x, y: ball1.y };

    let closestIntersection = null;
    let targetBallHit = null;
    let minDistSq = Infinity;

    // Raycast para encontrar a bola alvo
    for (let i = 1; i < balls.length; i++) {
        const otherBall = balls[i];
        const inflatedRadius = (ball1.width / 2) + (otherBall.width / 2);
        const intersection = getRayCircleIntersection(rayOrigin, rayDir, { x: otherBall.x, y: otherBall.y }, inflatedRadius);

        if (intersection) {
            const distSq = Phaser.Math.Distance.Squared(rayOrigin.x, rayOrigin.y, intersection.x, intersection.y);
            if (distSq < minDistSq) {
                minDistSq = distSq;
                closestIntersection = intersection; // Posição do centro da bola branca no impacto
                targetBallHit = otherBall;
            }
        }
    }

    // Desenha a linha da bola branca
    scene.trajectoryLine.lineStyle(2, 0xffffff, 0.7);
    if (closestIntersection) {
        scene.trajectoryLine.lineBetween(rayOrigin.x, rayOrigin.y, closestIntersection.x, closestIntersection.y);
        scene.shadowBall.setPosition(closestIntersection.x, closestIntersection.y).setVisible(true);
    } else {
        const endX = rayOrigin.x + rayDir.x * 2000;
        const endY = rayOrigin.y + rayDir.y * 2000;
        scene.trajectoryLine.lineBetween(rayOrigin.x, rayOrigin.y, endX, endY);
    }

    // Chama a função de desenho da previsão, passando a informação correta
    drawTargetBallPrediction(scene, targetBallHit, closestIntersection);
}

function drawTargetBallPrediction(scene, targetBall, cueBallImpactPosition) {
    // Garante que a linha de previsão exista
    if (!scene.predictedTargetLine) {
        scene.predictedTargetLine = scene.add.graphics();
    }
    scene.predictedTargetLine.clear();

    // Se não há colisão com uma bola, não há o que desenhar.
    if (!targetBall || !cueBallImpactPosition) {
        return;
    }

    // A direção do impacto é um vetor que aponta do centro da bola branca (no momento do impacto)
    // para o centro da bola alvo.
    const impactDirection = {
        x: targetBall.x - cueBallImpactPosition.x,
        y: targetBall.y - cueBallImpactPosition.y
    };
    
    // Normaliza o vetor para ter apenas a direção (comprimento 1)
    const length = Math.hypot(impactDirection.x, impactDirection.y);
    if (length > 0) {
        impactDirection.x /= length;
        impactDirection.y /= length;
    }

    // Define o comprimento da nossa linha de previsão
    const predictionLength = 50; 

    // O ponto inicial da linha é o centro da bola que será atingida
    const startX = targetBall.x;
    const startY = targetBall.y;

    // O ponto final é calculado a partir do início, na direção do impacto
    const endX = startX + impactDirection.x * predictionLength;
    const endY = startY + impactDirection.y * predictionLength;

    // Desenha a linha
    scene.predictedTargetLine.lineStyle(3, 0xffffff, 0.9);
    scene.predictedTargetLine.lineBetween(startX, startY, endX, endY);
}

function clampLineToTableBounds(startX, startY, endX, endY, bounds) {
    // Se o ponto final já está dentro da mesa, retornar como está
    if (endX >= bounds.left && endX <= bounds.right && 
        endY >= bounds.top && endY <= bounds.bottom) {
        return { x: endX, y: endY };
    }

    // Calcular interseção com as bordas da mesa
    const dx = endX - startX;
    const dy = endY - startY;
    let t = 1; // Parâmetro da linha (0 = início, 1 = fim)

    // Verificar interseção com cada borda
    if (dx > 0 && endX > bounds.right) {
        t = Math.min(t, (bounds.right - startX) / dx);
    } else if (dx < 0 && endX < bounds.left) {
        t = Math.min(t, (bounds.left - startX) / dx);
    }

    if (dy > 0 && endY > bounds.bottom) {
        t = Math.min(t, (bounds.bottom - startY) / dy);
    } else if (dy < 0 && endY < bounds.top) {
        t = Math.min(t, (bounds.top - startY) / dy);
    }

    return {
        x: startX + dx * t,
        y: startY + dy * t
    };
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
        return null;
    }

    const offset = Math.sqrt(radiusSq - distToCenterSq);
    const intersectionDist = projLength - offset;

    if (intersectionDist < 0) {
        return null;
    }

    return {
        x: rayOrigin.x + rayDir.x * intersectionDist,
        y: rayOrigin.y + rayDir.y * intersectionDist,
    };
}

function shootCueBall(scene) {
    if (!ball1 || !allBallsStopped) return;

    const maxForce = 0.1; // Use a sua força máxima original
    const force = scene.powerValue * maxForce;

    // Isso usa a variável 'currentShotAngle' que é definida em updateStickPosition.
    const angle = currentShotAngle;

    let forceX = Math.cos(angle) * force;
    let forceY = Math.sin(angle) * force;

    // Definimos um valor de força mínimo, apenas para garantir que não seja zero.
    // Este valor é muito pequeno e não afetará a força geral da tacada.
    const minComponentForce = 0.000001; 

    // Se o componente X for quase zero (mas não exatamente zero), damos a ele um valor mínimo.
    if (Math.abs(forceX) > 0 && Math.abs(forceX) < minComponentForce) {
        // Math.sign garante que mantemos a direção original (positiva ou negativa)
        forceX = minComponentForce * Math.sign(forceX);
    }

    // Fazemos o mesmo para o componente Y.
    if (Math.abs(forceY) > 0 && Math.abs(forceY) < minComponentForce) {
        forceY = minComponentForce * Math.sign(forceY);
    }
    
    // Agora, a queuedForce terá componentes que o Matter.js não irá ignorar.
    queuedForce = {
        x: forceX,
        y: forceY,
    };

    // O resto da sua lógica original para iniciar a animação
    stickInitialDistance = scene.stickDistance;
    stickFinalDistance = 5;
    stickAnimationProgress = 0;
    stickAnimationStart = performance.now();

    scene.trajectoryLine.clear();
    scene.shadowBall.setVisible(false);
    if (scene.predictedTargetLine) {
        scene.predictedTargetLine.clear();
    }

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