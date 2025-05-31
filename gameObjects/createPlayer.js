let currentPlayer = 1;
let playerText;
let hasBallPocketed = false;

function createPlayerDisplay(scene) {
    playerText = scene.add.text(560, -120, `Jogador ${currentPlayer}`, {
        fontSize: "24px",
        fill: "#fff",
    });
    return { playerText };
}

function switchPlayer() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
}

function setBallPocketed(pocketed) {
    hasBallPocketed = pocketed;
}

function getBallPocketed() {
    return hasBallPocketed;
}

function updatePlayerDisplay() {
    if (playerText) {
        playerText.setText(`Jogador ${currentPlayer}`);
    }
}

function resetBallPocketedFlag() {
    hasBallPocketed = false;
}
