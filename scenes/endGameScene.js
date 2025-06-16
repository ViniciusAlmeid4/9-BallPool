function getCharacterAssetKeysForEndGame(charName) {
    let portraitKey = ''; 
    let nameImageKey = '';   

    switch (charName.toLowerCase()) {
        case 'baianinho':
            portraitKey = 'portraitBaianinho';
            nameImageKey = 'baianinho-text';
            break;
        case 'dona lurdes':
            portraitKey = 'portraitDonaLurdes';
            nameImageKey = 'donaLurdes-text';
            break;
        case 'zé madruga':
            portraitKey = 'portraitZeMadruga';
            nameImageKey = 'zeMadruga-text';
            break;
        case 'huguinho':
            portraitKey = 'portraitHuguinho';
            nameImageKey = 'huguinho-text';
            break;
    }
    return { portraitKey, nameImageKey };
}


function create(data) {
    const scene = this;

    scene.winnerPlayerNum = data.winner;

    const p1CharObject = data.player1Data.character;
    const p2CharObject = data.player2Data.character;

    const p1Assets = getCharacterAssetKeysForEndGame(p1CharObject.charName);
    const p2Assets = getCharacterAssetKeysForEndGame(p2CharObject.charName);

    SoundManager.stopMusic();
    SoundManager.playMusic('victoryMusic', { loop: false, volume: 0.5 });

    const screenCenterX = scene.cameras.main.width / 2;
    const screenCenterY = scene.cameras.main.height / 2;

    scene.add.image(screenCenterX, 100, 'titleEndGame')
        .setOrigin(0.5)
        .setScale(0.8);

    const winnerCardScale = 1.0;
    const loserCardScale = 0.75;
    const cardYPosition = screenCenterY + 0;
    const cardSpacingFromCenter = 220;

    const nameImageScale = 0.7;
    const statusImageScale = 0.3;

    let p1FinalScale = (scene.winnerPlayerNum === 1) ? winnerCardScale : loserCardScale;
    const p1CardContainer = scene.add.container(screenCenterX - cardSpacingFromCenter, cardYPosition);
    p1CardContainer.setScale(p1FinalScale);

    const p1Frame = scene.add.image(0, 0, 'frameWhite')
        .setOrigin(0.5);
    const p1Portrait = scene.add.image(0, 12, p1Assets.portraitKey)
        .setOrigin(0.5)
        .setScale(1);
    
    const p1NameImg = scene.add.image(0, (p1Frame.height / 2) + 5, p1Assets.nameImageKey)
        .setOrigin(0.5, 0)
        .setScale(nameImageScale);

    p1CardContainer.add([p1Frame, p1Portrait, p1NameImg]);

    if (scene.winnerPlayerNum === 1) {
        const p1Venceu = scene.add.image(0, p1NameImg.y + (p1NameImg.displayHeight * nameImageScale) + 10, 'statusVenceuImg')
            .setOrigin(0.5, 0)
            .setScale(statusImageScale);
        p1CardContainer.add(p1Venceu);
        p1Frame.setTexture('frameYellow');
    }

    let p2FinalScale = (scene.winnerPlayerNum === 2) ? winnerCardScale : loserCardScale;
    const p2CardContainer = scene.add.container(screenCenterX + cardSpacingFromCenter, cardYPosition);
    p2CardContainer.setScale(p2FinalScale);

    const p2Frame = scene.add.image(0, 0, 'frameWhite')
        .setOrigin(0.5);
    const p2Portrait = scene.add.image(0, 12, p2Assets.portraitKey)
        .setOrigin(0.5)
        .setScale(1);
    const p2NameImg = scene.add.image(0, (p2Frame.height / 2) + 5, p2Assets.nameImageKey)
        .setOrigin(0.5, 0)
        .setScale(nameImageScale);

    p2CardContainer.add([p2Frame, p2Portrait, p2NameImg]);

    if (scene.winnerPlayerNum === 2) {
        const p2Venceu = scene.add.image(0, p2NameImg.y + (p2NameImg.displayHeight * nameImageScale) + 10, 'statusVenceuImg')
            .setOrigin(0.5, 0)
            .setScale(statusImageScale);

        p2CardContainer.add(p2Venceu);
        p2Frame.setTexture('frameYellow');
    }

    const buttonScale = 0.5;

    const mainMenuButton = scene.add.image(screenCenterX, scene.cameras.main.height - 80, 'mainMenuBtnImg')
        .setOrigin(0.5)
        .setScale(buttonScale)
        .setInteractive({ useHandCursor: true });

    mainMenuButton.on('pointerdown', () => {
        SoundManager.playSfx('clickSfx');
        SoundManager.stopMusic();
        
        
        player1.color = null;
        player1.character = null;
        player1.remainingBalls = [];
    
        player2.color = null;
        player2.character = null;
        player2.remainingBalls = [];

        colorAssigned = false;

        scene.scene.start('MenuScene');
    });
    mainMenuButton.on('pointerover', () => mainMenuButton.setScale(buttonScale * 1.05));
    mainMenuButton.on('pointerout', () => mainMenuButton.setScale(buttonScale));
}

const endGameScene = {
    key: 'EndGameScene',
    create: create
};