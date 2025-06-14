function createBalls(scene) {
    let balls = [];

    // 1. Bola branca (cue ball)
    ball1 = scene.matter.add.image(300, 360, "ballWhite");
    ball1.setCircle(20);
    ball1.setBounce(0.8);
    ball1.setFriction(0.5);
    ball1.setFrictionAir(0.0085);
    ball1.isWhite = true;
    balls.push(ball1);

    // 2. Posições da pirâmide (mesmas do seu código)
    const pyramidPositions = [
        { x: 820, y: 360 }, // 1
        { x: 854, y: 380 }, // 2
        { x: 854, y: 340 }, // 3
        { x: 888, y: 400 }, // 4
        { x: 888, y: 360 }, // 5 (posição central - bola amarela)
        { x: 888, y: 320 }, // 6
        { x: 922, y: 380 }, // 7
        { x: 922, y: 340 }, // 8
        { x: 956, y: 360 }, // 9
    ];

    // 3. Sempre colocar a bola amarela na posição central (índice 4)
    const yellowPos = pyramidPositions[4];
    const yellowBall = scene.matter.add.image(
        yellowPos.x,
        yellowPos.y,
        "ballYellow"
    );
    yellowBall.setCircle(20);
    yellowBall.setBounce(0.8);
    yellowBall.setFriction(0);
    yellowBall.setFrictionAir(0.0085);
    yellowBall.isYellow = true;
    balls.push(yellowBall);

    // 4. Criar lista das cores restantes: 4 vermelhas, 4 azuis
    const remainingColors = [
        "ballRed",
        "ballRed",
        "ballRed",
        "ballRed",
        "ballBlue",
        "ballBlue",
        "ballBlue",
        "ballBlue",
    ];

    Phaser.Utils.Array.Shuffle(remainingColors);

    // 5. Preencher as posições restantes
    let colorIndex = 0;
    for (let i = 0; i < pyramidPositions.length; i++) {
        if (i === 4) continue; // Pula a posição da bola amarela

        const pos = pyramidPositions[i];
        const color = remainingColors[colorIndex++];

        const ball = scene.matter.add.image(pos.x, pos.y, color);
        ball.setCircle(20);
        ball.setBounce(0.8);
        ball.setFriction(0);
        ball.setFrictionAir(0.0085);
        ball.color = color; // marca a cor para controle
        balls.push(ball);
    }

    return balls;
}