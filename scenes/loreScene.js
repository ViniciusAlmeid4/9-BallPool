function createLoreScene() {
    function init(data) {
        this.characterData = data.character;
    }

    function preload() {
        // Carrega os assets que você usará nesta cena
        // (Você precisará criar essas imagens)
        this.load.image('backButton', 'assets/arts/back-button.png');
    }

    function create() {
        const screenCenterX = this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.height / 2;

        this.add.image(screenCenterX, screenCenterY - 150, this.characterData.portraitKey).setScale(0.6);
        this.add.image(screenCenterX, screenCenterY - 70, this.characterData.nameImageKey).setScale(0.7);

        const loreTextStyle = {
            fontSize: '26px',
            fill: '#ffffff',
            align: 'center',
            wordWrap: { width: 800, useAdvancedWrap: true }
        };
        this.add.text(screenCenterX, screenCenterY + 90, this.characterData.lore, loreTextStyle).setOrigin(0.5);

        const backButton = this.add.image(screenCenterX, this.cameras.main.height - 80, 'backButton')
            .setScale(0.1)
            .setInteractive({ useHandCursor: true });

        backButton.on('pointerdown', () => {
            SoundManager.playSfx('clickSfx');
            this.scene.start('SelectCharacterScene');
        });

        backButton.on('pointerover', () => backButton.setScale(0.11));
        backButton.on('pointerout', () => backButton.setScale(0.1));
    }

    return {
        key: 'LoreScene',
        init,
        preload,
        create
    };
}

const loreScene = createLoreScene();