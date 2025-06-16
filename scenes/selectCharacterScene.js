function preload() {
    this.load.image("titleSelectChar", "assets/arts/escolha-personagem.png");
    this.load.image("player1TextImg", "assets/arts/player1-select.png");
    this.load.image("player2TextImg", "assets/arts/player2-select.png");
    this.load.image("frameWhite", "assets/arts/border-character-menu.png");
    this.load.image("loreButtonImg", "assets/arts/lore-button.png"); // Você precisará criar esta imagem
    this.load.image(
        "frameYellow",
        "assets/arts/border-selected-character-menu.png"
    );
    this.load.image("startButtonImg", "assets/arts/start-button.png");

    this.load.image(
        "portraitBaianinho",
        "assets/arts/baianinho-select-screen.png"
    );
    this.load.image("nameBaianinho", "assets/arts/baianinho-text.png");

    this.load.image(
        "portraitDonaLurdes",
        "assets/arts/dona-lurdes-select-screen.png"
    );
    this.load.image("nameDonaLurdes", "assets/arts/dona-lurdes-text.png");

    this.load.image("nameZeMadruga", "assets/arts/ze-madruga-text.png");

    this.load.image(
        "portraitZeMadruga",
        "assets/arts/ze-madruga-select-screen.png"
    );
    this.load.image("nameZeMadruga", "assets/arts/ze-madruga-text.png");

    this.load.image(
        "portraitHuguinho",
        "assets/arts/huguinho-select-screen.png"
    );
    this.load.image("nameHuguinho", "assets/arts/huguinho-text.png");

    this.load.audio("clickSfx", "assets/soundEffects/click.wav");
}

function updateCharacterCardVisual(cardData) {
    if (!cardData || !cardData.uiElements) {
        console.warn(
            "[updateCharacterCardVisual] cardData ou uiElements faltando para:",
            cardData ? cardData.id : "ID Desconhecido"
        );
        return;
    }

    const { frameWhite, frameYellow, playerTextImg } = cardData.uiElements;
    const charId = cardData.id;

    if (!this.charactersSelectedBy) {
        console.error(
            "[updateCharacterCardVisual] ERRO: this.charactersSelectedBy é undefined! Contexto 'this':",
            this
        );
        return;
    }

    const isP1Selected = this.charactersSelectedBy.p1 === charId;
    const isP2Selected = this.charactersSelectedBy.p2 === charId;

    frameYellow.setVisible(isP1Selected || isP2Selected);
    frameWhite.setVisible(!isP1Selected && !isP2Selected);

    if (playerTextImg) {
        if (isP1Selected && isP2Selected) {
            playerTextImg.setTexture("player1TextImg");
            playerTextImg.setVisible(true);
        } else if (isP1Selected) {
            playerTextImg.setTexture("player1TextImg");
            playerTextImg.setVisible(true);
        } else if (isP2Selected) {
            playerTextImg.setTexture("player2TextImg");
            playerTextImg.setVisible(true);
        } else {
            playerTextImg.setVisible(false);
        }
    }
}

function handleCardClick(characterId) {
    if (!this.charactersDataList) {
        console.error(
            "[handleCardClick] ERRO: this.charactersDataList é undefined."
        );
        return;
    }
    const characterData = this.charactersDataList.find(
        (c) => c.id === characterId
    );

    if (!characterData) {
        console.warn(
            "[handleCardClick] characterData não encontrado para id:",
            characterId
        );
        return;
    }
    if (!this.charactersSelectedBy) {
        console.error(
            "[handleCardClick] ERRO: this.charactersSelectedBy é undefined."
        );
        return;
    }

    if (this.playerTurn === 1 && this.charactersSelectedBy.p2 === characterId)
        return;
    if (this.playerTurn === 2 && this.charactersSelectedBy.p1 === characterId)
        return;

    SoundManager.playSfx("clickSfx");

    if (this.playerTurn === 1) {
        if (this.charactersSelectedBy.p1) {
            const prevCharDataP1 = this.charactersDataList.find(
                (c) => c.id === this.charactersSelectedBy.p1
            );
            this.charactersSelectedBy.p1 = null;
            if (prevCharDataP1)
                updateCharacterCardVisual.call(this, prevCharDataP1);
        }
        this.charactersSelectedBy.p1 = characterId;
        this.playerTurn = 2;
    } else {
        if (this.charactersSelectedBy.p2) {
            const prevCharDataP2 = this.charactersDataList.find(
                (c) => c.id === this.charactersSelectedBy.p2
            );
            this.charactersSelectedBy.p2 = null;
            if (prevCharDataP2)
                updateCharacterCardVisual.call(this, prevCharDataP2);
        }
        this.charactersSelectedBy.p2 = characterId;
        this.playerTurn = 1;
    }

    updateCharacterCardVisual.call(this, characterData);

    if (this.charactersSelectedBy.p1 && this.charactersSelectedBy.p2) {
        if (this.startButton) this.startButton.setVisible(true);
    } else {
        if (this.startButton) this.startButton.setVisible(false);
    }
}

function create() {
    const sceneContext = this;

    sceneContext.charactersSelectedBy = { p1: null, p2: null };
    sceneContext.playerTurn = 1;

    sceneContext.charactersDataList = [
        {
            id: 1,
            portraitKey: "portraitBaianinho",
            nameImageKey: "nameBaianinho",
            constructorFunc: baianinho,
            lore: "Baianinho é uma lenda da sinuca de bar. Com seu chapéu característico e calma inabalável, ele transforma cada jogada em uma obra de arte. Dizem que ele consegue prever a trajetória de cada bola apenas com o olhar."
        },
        {
            id: 2,
            portraitKey: "portraitDonaLurdes",
            nameImageKey: "nameDonaLurdes",
            constructorFunc: donaLurdes,
            lore: "Dona Lurdes pode parecer uma avó gentil, mas na mesa de sinuca, ela é uma competidora feroz. Cada tacada é calculada com a precisão de quem conhece todos os segredos do jogo, deixando adversários perplexos com sua habilidade."
        },
        {
            id: 3,
            portraitKey: "portraitZeMadruga",
            nameImageKey: "nameZeMadruga",
            constructorFunc: zeMadruga,
            lore: "Com um passado misterioso e uma dívida eterna de aluguel, Zé Madruga joga sinuca para esquecer os problemas. Sua técnica pouco ortodoxa e suas jogadas 'sem querer querendo' o tornam um adversário imprevisível e perigoso."
        },
        {
            id: 4,
            portraitKey: "portraitHuguinho",
            nameImageKey: "nameHuguinho",
            constructorFunc: huguinho,
            lore: "Jovem e cheio de energia, Huguinho é a nova promessa da sinuca. O que lhe falta em experiência, ele compensa com pura audácia e jogadas de alto risco que, quando funcionam, levantam a torcida e desmoralizam os oponentes."
        },
    ];

    const screenCenterX = sceneContext.cameras.main.width / 2;
    const screenCenterY = sceneContext.cameras.main.height / 2;

    sceneContext.add
        .image(screenCenterX, 80, "titleSelectChar")
        .setOrigin(0.5)
        .setScale(0.7);

    const numChars = sceneContext.charactersDataList.length;
    const cardTotalWidth = numChars * 200 + (numChars - 1) * 50;
    let startX = screenCenterX - cardTotalWidth / 2 + 100;

    const cardPositions = [];
    for (let i = 0; i < numChars; i++) {
        cardPositions.push({
            x: startX + i * (200 + 50),
            y: screenCenterY - 0,
        }); // 200 card, 50 espaço
    }

    const cardScale = 0.7;

    sceneContext.charactersDataList.forEach((charData, index) => {
        if (index >= cardPositions.length) {
            console.warn(
                "Mais personagens definidos em charactersDataList do que posições em cardPositions."
            );
            return;
        }

        const pos = cardPositions[index];
        const cardContainer = sceneContext.add.container(pos.x, pos.y);

        const baseContainerScale = 1.1;
        cardContainer.setScale(baseContainerScale);

        const frameWhiteImg = sceneContext.add
            .image(0, 0, "frameWhite")
            .setOrigin(0.5)
            .setScale(cardScale);
        const frameYellowImg = sceneContext.add
            .image(0, 0, "frameYellow")
            .setOrigin(0.5)
            .setScale(cardScale)
            .setVisible(false);
        const portraitImg = sceneContext.add
            .image(0, 10, charData.portraitKey)
            .setOrigin(0.5)
            .setScale(cardScale * 1);
        const playerTextIndicator = sceneContext.add
            .image(
                0,
                -(frameWhiteImg.displayHeight * cardScale * 0.5) - 30,
                "player1TextImg"
            )
            .setOrigin(0.5, 1)
            .setScale(0.6)
            .setVisible(false);

        const nameImageYOffSet =
            frameWhiteImg.displayHeight * cardScale * 0.5 + 30;
        const nameImage = sceneContext.add
            .image(0, nameImageYOffSet, charData.nameImageKey)
            .setOrigin(0.5, 0)
            .setScale(0.6);

        const loreButtonYOffset = nameImage.y + nameImage.displayHeight + 20;
        const loreButton = sceneContext.add.image(0, loreButtonYOffset, "loreButtonImg")
            .setOrigin(0.5, 0)
            .setScale(0.1)
            .setInteractive({ useHandCursor: true });
        
        loreButton.on('pointerdown', (pointer, localX, localY, event) => {
        portraitImg.setTint(0xff0000); 

        SoundManager.playSfx("clickSfx");
        sceneContext.scene.start('LoreScene', { character: charData });
        });
        
        loreButton.on('pointerover', () => loreButton.setScale(0.11));
        loreButton.on('pointerout', () => loreButton.setScale(0.1));

        cardContainer.add([
            frameWhiteImg,
            frameYellowImg,
            portraitImg,
            playerTextIndicator,
            nameImage,
            loreButton,
        ]);
        
        cardContainer.setSize(frameWhiteImg.width, frameWhiteImg.height);
        cardContainer.setInteractive({ useHandCursor: true });

        charData.uiElements = {
            container: cardContainer,
            frameWhite: frameWhiteImg,
            frameYellow: frameYellowImg,
            playerTextImg: playerTextIndicator,
            nameImg: nameImage,
        };

        cardContainer.on("pointerdown", () => {
            handleCardClick.call(sceneContext, charData.id);
        });

        cardContainer.on("pointerover", () => {
            if (!charData.uiElements.frameYellow.visible)
                cardContainer.setScale(baseContainerScale * 1.05);
        });
        cardContainer.on("pointerout", () => {
            cardContainer.setScale(baseContainerScale);
        });

        updateCharacterCardVisual.call(sceneContext, charData);
    });

    sceneContext.startButton = sceneContext.add
        .image(
            screenCenterX,
            sceneContext.cameras.main.height - 70,
            "startButtonImg"
        )
        .setOrigin(0.5)
        .setScale(0.7)
        .setInteractive({ useHandCursor: true })
        .setVisible(false);

    sceneContext.startButton.on("pointerover", () => {
        sceneContext.startButton.setScale(0.7 * 1.1);
    });

    sceneContext.startButton.on("pointerout", () => {
        sceneContext.startButton.setScale(0.7);
    });

    sceneContext.startButton.on("pointerdown", () => {
        if (
            sceneContext.charactersSelectedBy.p1 &&
            sceneContext.charactersSelectedBy.p2
        ) {
            SoundManager.playSfx("clickSfx");

            const char1Data = sceneContext.charactersDataList.find(
                (c) => c.id === sceneContext.charactersSelectedBy.p1
            );
            const char2Data = sceneContext.charactersDataList.find(
                (c) => c.id === sceneContext.charactersSelectedBy.p2
            );

            if (char1Data && char2Data) {
                player1.character = char1Data.constructorFunc();
                player2.character = char2Data.constructorFunc();

                console.log(
                    "P1 char:",
                    player1.character.charName,
                    "P2 char:",
                    player2.character.charName
                );
                SoundManager.stopMusic();
                sceneContext.scene.start("MainScene");
            } else {
                console.error(
                    "Não foi possível encontrar os dados dos personagens selecionados para iniciar o jogo."
                );
            }
        }
    });
}

const selectCharacterScene = {
    key: "SelectCharacterScene",
    preload: preload,
    create: create,
    updateCharacterCardVisual: updateCharacterCardVisual,
    handleCardClick: handleCardClick,
};
