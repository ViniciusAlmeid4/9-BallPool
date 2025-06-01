let currentPlayer = 1;
let playerText;
let hasBallPocketed = false;

let player1Color = null;
let player2Color = null;
let colorAssigned = false;

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

function assignPlayerColors(ballColor) {
    if (colorAssigned) return; // só define uma vez

    const color = ballColor === "ballRed" ? "vermelho" : "azul";

    if (currentPlayer === 1) {
        player1Color = color;
        player2Color = color === "vermelho" ? "azul" : "vermelho";
    } else {
        player2Color = color;
        player1Color = color === "vermelho" ? "azul" : "vermelho";
    }

    colorAssigned = true;
}

function getPlayerColor(player) {
    return player === 1 ? player1Color : player2Color;
}

function updatePlayerDisplay() {
    if (playerText) {
        let color = getPlayerColor(currentPlayer);
        let display = `Jogador ${currentPlayer}`;
        if (color) {
            display += ` - ${color}`;
        }
        playerText.setText(display);
    }
}

function resetBallPocketedFlag() {
    hasBallPocketed = false;
}
