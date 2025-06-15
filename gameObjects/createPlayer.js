let currentPlayer = 1;
let playerText;
let hasBallPocketed = false;

let colorAssigned = false;

let player1Frame;
let player2Frame;

const player = () => {
    return {
        color: null,
        character: null,
        remainingBalls: [],
    };
};

const player1 = player();
const player2 = player();

const baianinho = () => {
    return {
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
                player1.character = baianinho();
            } else {
                player2.character = baianinho();
            }
        },
    };
};

const donaLurdes = () => {
    return {
        charName: "Dona Lurdes",
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
                player1.character = donaLurdes();
            } else {
                player2.character = donaLurdes();
            }
        },
    };
};

const huguinho = () => {
    return {
        charName: "Huguinho",
        powerIsOn: false,
        player: null,
        powersLeft: 1,
        createRandomPocketBlocks: function (scene, pockets) {
            const shuffled = Phaser.Utils.Array.Shuffle(pockets);
            const selectedPockets = shuffled.slice(0, 3);

            scene.pocketBlocks = [];

            selectedPockets.forEach((pocket, index) => {
                const block = scene.matter.add.image(pocket.x, pocket.y, null, null, {
                    label: `pocketBlock${index}`,
                });

                block.setCircle(20);
                block.setOrigin(0.5);
                block.setDepth(0);
                block.setStatic(true);

                scene.pocketBlocks.push(block);
            });
        },
        usePower: function (scene, pockets) {
            if (!this.powersLeft) {
                return {
                    result: false,
                    msg: "Não é possível utilizar mais essa habilidade.",
                };
            }
            this.powersLeft--;
            this.powerIsOn = true;
            this.createRandomPocketBlocks(scene, pockets);

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
                player1.character = huguinho();
            } else {
                player2.character = huguinho();
            }
        },
    };
};

function createPlayerDisplay(scene) {
    let playerImage = scene.add.image(680, 30, `player${currentPlayer}`);
    let charName = (currentPlayer === 1 ? player1 : player2).character.charName;
    let charTextImage = scene.add.image(680, 70, `${getPortraitKey(charName)}-text`);

    playerImage.setOrigin(0.5);
    charTextImage.setOrigin(0.5);

    // Agrupar num container para facilitar atualizações
    let playerDisplayContainer = scene.add.container(0, 0, [playerImage, charTextImage]);
    playerDisplayContainer.setDepth(10);

    // Mostrar jogador 1
    let player1Portrait = getPortraitKey(player1.character.charName);
    const player1FrameColor = getFrameKey(player1.color);
    player1Frame = scene.add.image(112, 54, player1FrameColor);
    scene.add.image(112, 61, player1Portrait);
    scene.add.image(240, 35, "player1");

    // Mostrar jogador 2
    let player2Portrait = getPortraitKey(player2.character.charName);
    const player2FrameColor = getFrameKey(player2.color);
    player2Frame = scene.add.image(1248, 54, player2FrameColor);
    scene.add.image(1248, 61, player2Portrait);
    scene.add.image(1120, 35, "player2");

    player1.remainingBalls = ["ballYellow", "", "", "", ""];

    player2.remainingBalls = ["ballYellow", "", "", "", ""];

    drawRemainingBallsUI(scene);

    return { playerDisplayContainer, playerImage, charTextImage };
}

function updatePlayerDisplay() {
    let currentPlayerObject = currentPlayer == 1 ? player1 : player2;
    let charName = currentPlayerObject.character.charName;

    // Atualizar imagem do player (player1.png ou player2.png)
    if (playerManager.playerImage) {
        playerManager.playerImage.setTexture(`player${currentPlayer}`);
    }

    // Atualizar imagem com nome do personagem
    if (playerManager.charTextImage) {
        playerManager.charTextImage.setTexture(`${getPortraitKey(charName)}-text`);
    }
}

function switchPlayer(scene) {
    // function removePocketBlocks(scene) {
    //     if (!scene.pocketBlocks || !Array.isArray(scene.pocketBlocks)) {
    //         console.warn("No pocket blocks to remove.");
    //         return;
    //     }

    //     scene.pocketBlocks.forEach((block, index) => {
    //         if (block && block.body) {
    //             block.destroy(); // This should remove it from both the scene and physics world
    //         } else {
    //             console.warn(`Pocket block ${index} is missing or already destroyed.`);
    //         }
    //     });

    //     scene.pocketBlocks = [];
    // }

    if (currentPlayer === 1 && player1.character.charName == "Baianinho" && player1.character.powerIsOn) {
        player1.character.powerIsOn = false;
        return;
    } else if (currentPlayer === 2 && player2.character.charName == "Baianinho" && player2.character.powerIsOn) {
        player2.character.powerIsOn = false;
        return;
    }

    // removePocketBlocks(scene, pockets);

    currentPlayer = currentPlayer === 1 ? 2 : 1;
}

function setBallPocketed(pocketed) {
    hasBallPocketed = pocketed;
}

function getBallPocketed() {
    return hasBallPocketed;
}

function assignPlayerColors(ballColor, scene) {
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

    player1Frame.setTexture(getFrameKey(player1.color));
    player2Frame.setTexture(getFrameKey(player2.color));

    // Helper to get how many red/blue balls there are
    const getBallCountByColor = (colorKey) => balls.filter((b) => b.color === colorKey).length;

    player1.remainingBalls = [
        "ballYellow", // always shared
        ...Array(getBallCountByColor(player1.color === "vermelho" ? "ballRed" : "ballBlue")).fill(player1.color === "vermelho" ? "ballRed" : "ballBlue"),
    ];

    player2.remainingBalls = [
        "ballYellow", // always shared
        ...Array(getBallCountByColor(player2.color === "vermelho" ? "ballRed" : "ballBlue")).fill(player2.color === "vermelho" ? "ballRed" : "ballBlue"),
    ];

    drawRemainingBallsUI(scene);
}

function getPlayerColor(player) {
    return player === 1 ? player1.color : player2.color;
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

function getPortraitKey(charName) {
    switch (charName) {
        case "Baianinho":
            return "baianinho";
        case "Dona Lurdes":
            return "donaLurdes";
        case "Zé Madruga":
            return "zeMadruga";
        case "Huguinho":
            return "huguinho";
        default:
            return "baianinho"; // padrão
    }
}

function getFrameKey(color) {
    switch (color) {
        case "vermelho":
            return "redFrame";
        case "azul":
            return "blueFrame";
        default:
            return "defaultFrame";
    }
}
