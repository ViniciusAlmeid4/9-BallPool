function preload() {}

function create() {
    const screenCenterX = this.cameras.main.width / 2;
    const screenCenterY = this.cameras.main.height / 2;

    this.add.text(screenCenterX, screenCenterY - 100, '9BallPool', {
        fontSize: '48px',
        fill: '#fff',
        fontFamily: 'Arial',
    }).setOrigin(0.5);

    const baseButtonStyle = {
        fontSize: '32px',
        fontFamily: 'Arial',
        backgroundColor: '#333',
        padding: { x: 20, y: 10 },
    }

    const startButton = this.add.text(screenCenterX, screenCenterY, 'Play Game', {
        ...baseButtonStyle,
        fill: '#0f0',
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true });

    startButton.on('pointerover', () => {
        startButton.setStyle({ 
            ...baseButtonStyle,
            fill: '#8f8'
        });
    })

    startButton.on('pointerout', () => {
        startButton.setStyle({ 
            ...baseButtonStyle,
            fill: '#0f0'
        });
    })

    startButton.on('pointerdown', () => {
        this.scene.start('MainScene');
    })

    const optionsButton = this.add.text(screenCenterX, screenCenterY + 80, 'Options', {
        ...baseButtonStyle,
        fill: '#00f',
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true });

    optionsButton.on('pointerover', () => {
        optionsButton.setStyle({ 
            ...baseButtonStyle,
            fill: '#89f'
        });
    })

    optionsButton.on('pointerout', () => {
        optionsButton.setStyle({ 
            ...baseButtonStyle,
            fill: '#00f'
        });
    })    

    const exitButton = this.add.text(screenCenterX, screenCenterY + 160, 'Exit', {
        ...baseButtonStyle,
        fill: '#f00',
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true });

    exitButton.on('pointerover', () => {
        exitButton.setStyle({ 
            ...baseButtonStyle,
            fill: '#f88'
        });
    })

    exitButton.on('pointerout', () => {
        exitButton.setStyle({ 
            ...baseButtonStyle,
            fill: '#f00'
        });
    })

    exitButton.on('pointerdown', () => {
        if (this.game) {
            this.game.destroy(true, false);
            
            startButton.disableInteractive();
            startButton.setAlpha(0.5);
            
            exitButton.disableInteractive();
            exitButton.setAlpha(0.5);
        }

    })

    // TODO: Implement sound and music system
    const soundButton = this.add.text(screenCenterX + 500, screenCenterY - 250, 'Sound', {
        ...baseButtonStyle,
        fill: '#fff',
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true });

    const musicButton = this.add.text(screenCenterX + 500, screenCenterY - 180, 'Music', {
        ...baseButtonStyle,
        fill: '#fff',
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true });
}

function update() {}

const menuScene = {
    key: 'MenuScene',
    preload,
    create,
    update,
};
