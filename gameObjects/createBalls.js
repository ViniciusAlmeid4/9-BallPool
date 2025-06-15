function createBalls(scene) {
    let balls = [];

    // 1. Bola branca (cue ball)
    ball1 = scene.matter.add.image(300, 360, "ballWhite");
    ball1.setCircle(20);
    ball1.setBounce(0.8);
    ball1.setFriction(0);
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

function drawRemainingBallsUI(scene) {
    // First: clear any previous UI elements
    if (scene.player1BallsUI)
        scene.player1BallsUI.forEach((img) => img.destroy());
    if (scene.player2BallsUI)
        scene.player2BallsUI.forEach((img) => img.destroy());

    scene.player1BallsUI = [];
    scene.player2BallsUI = [];

    const spacing = 32; // space between each ball UI
    const startX1 = 184; // starting x for player 1 (left)
    const startX2 = 1178; // starting x for player 2 (right)
    const y = 75; // common y position

    // Helper to get the image key from the string
    const getUIImageKey = (color) => {
        switch (color) {
            case "ballRed":
                return "ballRedUI";
            case "ballBlue":
                return "ballBlueUI";
            case "ballYellow":
                return "ballYellowUI";
            default:
                return "ballDefaultUI"; // fallback
        }
    };

    // Draw for player 1
    player1.remainingBalls.forEach((color, i) => {
        const key = getUIImageKey(color);
        const x = startX1 + i * spacing;
        const img = scene.add.image(x, y, key).setScale(0.75).setDepth(10);
        scene.player1BallsUI.push(img);
    });

    // Draw for player 2 (right to left)
    let player2RemainingBallsCopy = player2.remainingBalls;
    let reverseList =
        player2RemainingBallsCopy[0] != "ballYellow"
            ? player2RemainingBallsCopy.reverse()
            : player2RemainingBallsCopy;
    reverseList.forEach((color, i) => {
        const key = getUIImageKey(color);
        const x = startX2 - i * spacing; // go *left* instead of right
        const img = scene.add.image(x, y, key).setScale(0.75).setDepth(10);
        scene.player2BallsUI.push(img);
    });
}
