function preload() {
    this.load.image("logo", "assets/images/gameLogo.png");
}

function create() {
    const screenCenterX = this.cameras.main.width / 2;
    const screenCenterY = this.cameras.main.height / 2;

    this.add.image(screenCenterX, screenCenterY - 50, "logo").setScale(0.45);

    const progressBarWidth = 320;
    const progressBarHeight = 50;
    const progressBarX = screenCenterX - progressBarWidth / 2;
    const progressBarY = screenCenterY + 90;

    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(
        progressBarX,
        progressBarY,
        progressBarWidth,
        progressBarHeight
    );

    const progressBar = this.add.graphics();

    const loadingText = this.add
        .text(screenCenterX, screenCenterY + 150, "Carregando... 0%", {
            fontSize: "20px",
            fill: "#ffffff",
        })
        .setOrigin(0.5, 0.5);

    this.load.on("progress", (value) => {
        progressBar.clear();
        progressBar.fillStyle(0xffffff, 1);
        progressBar.fillRect(
            progressBarX + 5,
            progressBarY + 5,
            (progressBarWidth - 10) * value,
            progressBarHeight - 10
        );

        const percent = Math.round(value * 100);
        loadingText.setText(`Carregando... ${percent}%`);
    });

    this.load.on("complete", () => {
        progressBar.destroy();
        progressBox.destroy();
        loadingText.destroy();

        this.scene.start("MenuScene");
    });

    // Áudios
    this.load.audio("menuMusic", "assets/audio/menuMusic.mp3");
    this.load.audio("clickSfx", "assets/soundEffects/click.wav");
    this.load.audio("shot", "assets/soundEffects/shot.mp3");
    this.load.audio("ballHit", "assets/soundEffects/ballHit.mp3");
    this.load.audio("pocketSound", "assets/soundEffects/pocket.mp3");
    this.load.audio("jukebox1", "assets/audio/jukebox1.mp3");
    this.load.audio("jukebox2", "assets/audio/jukebox2.mp3");
    this.load.audio("jukebox3", "assets/audio/jukebox3.mp3");
    this.load.audio("jukebox4", "assets/audio/jukebox4.mp3");
    this.load.audio("jukebox5", "assets/audio/jukebox5.mp3");

    // Imagens
    this.load.image("playBtn", "assets/images/playButton.png");
    this.load.image("musicOn", "assets/images/musicOn.png");
    this.load.image("musicOff", "assets/images/musicOff.png");
    this.load.image("sfxOn", "assets/images/sfxOn.png");
    this.load.image("sfxOff", "assets/images/sfxOff.png");
    this.load.image("table", "assets/arts/table.png");
    this.load.image("ballRed", "assets/arts/ballRed.png");
    this.load.image("ballRedUI", "assets/arts/ballRed-UI.png");
    this.load.image("ballBlue", "assets/arts/ballBlue.png");
    this.load.image("ballBlueUI", "assets/arts/ballBlue-UI.png");
    this.load.image("ballYellow", "assets/arts/ballYellow.png");
    this.load.image("ballYellowUI", "assets/arts/ballYellow-UI.png");
    this.load.image("ballWhite", "assets/arts/ballWhite.png");
    this.load.image("ballDefaultUI", "assets/arts/ballDefault-UI.png");
    this.load.image("pocket", "assets/arts/pocket.png");
    this.load.image("stick", "assets/arts/stick.png");
    this.load.image("powerBar", "assets/arts/powerBar.png");
    this.load.image("powerSlider", "assets/arts/powerSlider.png");
    this.load.image("shadowBall", "assets/arts/shadowBall.png");
    this.load.image("baianinho", "assets/arts/baianinho-portrait.png");
    this.load.image("baianinho-text", "assets/arts/baianinho-text.png");
    this.load.image("donaLurdes", "assets/arts/dona-lurdes-portrait.png");
    this.load.image("donaLurdes-text", "assets/arts/dona-lurdes-text.png");
    this.load.image("zeMadruga", "assets/arts/ze-madruga-portrait.png");
    this.load.image("zeMadruga-text", "assets/arts/ze-madruga-text.png");
    this.load.image("huguinho", "assets/arts/huguinho-portrait.png");
    this.load.image("huguinho-text", "assets/arts/huguinho-text.png");
    this.load.image("blueFrame", "assets/arts/blueFrame.png");
    this.load.image("redFrame", "assets/arts/redFrame.png");
    this.load.image("defaultFrame", "assets/arts/defaultFrame.png");
    this.load.image("player1", "assets/arts/player1.png");
    this.load.image("player1-select", "assets/arts/player1-select.png");
    this.load.image("player2", "assets/arts/player2.png");
    this.load.image("player2-select", "assets/arts/player2-select.png");
    this.load.image("abilityUseBtn", "assets/arts/ability-use-button.png");
    this.load.image("abilityUsedBtn", "assets/arts/ability-used-button.png");

    this.load.start();
}

const preloaderScene = {
    key: "PreloaderScene",
    preload,
    create,
};
