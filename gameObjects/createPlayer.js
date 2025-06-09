let currentPlayer = 1;
let playerText;
let hasBallPocketed = false;

let colorAssigned = false;

const player = {
    color: null,
    character: null,
};

const player1 = player;
const player2 = player;

const baianinho = {
    charName: "Baianinho",
    powerIsOn: false,
    player: null,
    powersLeft: 1,
    usePower: function () {
        if (!this.powersLeft) {
            return {
                result: false,
                msg: "Não é possível utilizar mais essa habilidade.",
            };
        }
        this.powersLeft--;
        this.powerIsOn = true;
        let msg;
        if (!this.powersLeft) {
            msg = "Última habilidade.";
        } else {
            msg = `Restam mais ${this.powersLeft}.`;
        }
        return {
            result: true,
            msg: msg,
        };
    },
    playerSelect: function (player) {
        this.player = player;
        if (currentPlayer === 1) {
            player1.character = this;
        } else {
            player2.character = this;
        }
    },
};

function createPlayerDisplay(scene) {
    playerText = scene.add.text(560, -120, `Jogador ${currentPlayer}`, {
        fontSize: "24px",
        fill: "#fff",
    });
    return { playerText };
}

function switchPlayer() {
    if (currentPlayer === 1 && player1.character.charName == "Baianinho" && player1.character.powerIsOn) {
        return;
    } else if (currentPlayer === 2 && player2.character.charName == "Baianinho" && player2.character.powerIsOn) {
        return;
    }
    
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
        player1.color = color;
        player2.color = color === "vermelho" ? "azul" : "vermelho";
    } else {
        player2.color = color;
        player1.color = color === "vermelho" ? "azul" : "vermelho";
    }

    colorAssigned = true;
}

function getPlayerColor(player) {
    return player === 1 ? player1.color : player2.color;
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

function shouldKeepTurn(ballColor) {
    if (!colorAssigned) {
        return true; // Antes da atribuição, sempre mantém a vez
    }

    const playerColor = getPlayerColor(currentPlayer);

    if (ballColor === "ballRed") {
        return playerColor === "vermelho";
    } else if (ballColor === "ballBlue") {
        return playerColor === "azul";
    }

    return false; // Qualquer outra cor não mantém (mas atualmente só red/blue são relevantes)
}
