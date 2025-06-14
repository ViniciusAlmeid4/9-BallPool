function preload() {
    SoundManager.preload(this);

    this.load.image('logo', 'assets/images/gameLogo.png');
    this.load.image('playBtn', 'assets/images/playButton.png');
    this.load.image('musicOn', 'assets/images/musicOn.png');
    this.load.image('musicOff', 'assets/images/musicOff.png');
    this.load.image('sfxOn', 'assets/images/sfxOn.png');
    this.load.image('sfxOff', 'assets/images/sfxOff.png');
}

function updateMusicButtons_UI() {
    if (!this.musicOnBtn || !this.musicOnBtn.active || !this.musicOffBtn || !this.musicOffBtn.active) return;

    const isMuted = SoundManager.isMusicMuted();
    this.musicOnBtn.setVisible(!isMuted);
    this.musicOffBtn.setVisible(isMuted);
}

function updateSfxButtons_UI() {
    if (!this.sfxOnBtn || !this.sfxOnBtn.active || !this.sfxOffBtn || !this.sfxOffBtn.active) return;

    const isMuted = SoundManager.isSfxMuted();
    this.sfxOnBtn.setVisible(!isMuted);    
    this.sfxOffBtn.setVisible(isMuted);
}

function create() {
    SoundManager.init(this.game);

    const screenCenterX = this.cameras.main.width / 2;
    const screenCenterY = this.cameras.main.height / 2;

    SoundManager.playMusic('menuMusic', {
        loop: true,
        volume: 0.5,
    });

    this.add.image(screenCenterX, screenCenterY - 50, 'logo')
        .setScale(0.45);

    const playButtonScale = 0.25;
    const hoverPlayButtonScale = playButtonScale * 1.1;

    const playButton = this.add.image(screenCenterX, screenCenterY + 125, 'playBtn')
        .setOrigin(0.5)
        .setScale(playButtonScale)
        .setInteractive({ useHandCursor: true });

    playButton.on('pointerover', () => {
        playButton.setScale(hoverPlayButtonScale);
    });

    playButton.on('pointerout', () => {
        playButton.setScale(playButtonScale);
    });

    playButton.on('pointerdown', () => {
        SoundManager.playSfx('clickSfx');
        SoundManager.stopMusic();
        this.scene.start('MainScene');
    });

    const soundButtonY = 40;
    const musicCtrlButtonX = this.cameras.main.width - 150;
    const sfxCtrlButtonX = this.cameras.main.width - 70;
    const buttonScale = 1.0;

    this.musicOnBtn = this.add.image(musicCtrlButtonX, soundButtonY, 'musicOn')
        .setOrigin(0.5, 0.5).setScale(buttonScale)
        .setInteractive({ useHandCursor: true });

    this.musicOnBtn.on('pointerdown', () => {
        SoundManager.playSfx('clickSfx');
        SoundManager.toggleMusicMute();
        updateMusicButtons_UI.call(this);
    });

    this.musicOffBtn = this.add.image(musicCtrlButtonX, soundButtonY, 'musicOff')
        .setOrigin(0.5, 0.5).setScale(buttonScale)
        .setInteractive({ useHandCursor: true });

    this.musicOffBtn.on('pointerdown', () => {
        SoundManager.playSfx('clickSfx');
        SoundManager.toggleMusicMute();
        updateMusicButtons_UI.call(this);
    });

    this.sfxOnBtn = this.add.image(sfxCtrlButtonX, soundButtonY, 'sfxOn')
        .setOrigin(0.5, 0.5).setScale(buttonScale)
        .setInteractive({ useHandCursor: true });

    this.sfxOnBtn.on('pointerdown', () => {
        const sfxIsNowMuted = SoundManager.toggleSfxMute();
        if (!sfxIsNowMuted) SoundManager.playSfx('clickSfx');
        updateSfxButtons_UI.call(this);
    });

    this.sfxOffBtn = this.add.image(sfxCtrlButtonX, soundButtonY, 'sfxOff')
        .setOrigin(0.5, 0.5).setScale(buttonScale)
        .setInteractive({ useHandCursor: true });

    this.sfxOffBtn.on('pointerdown', () => {
        const sfxIsNowMuted = SoundManager.toggleSfxMute();
        if (!sfxIsNowMuted) SoundManager.playSfx('clickSfx');
        updateSfxButtons_UI.call(this);
    });
        
    updateMusicButtons_UI.call(this);
    updateSfxButtons_UI.call(this);
}

const menuScene = {
    key: 'MenuScene',
    preload,
    create,
    updateMusicButtons: updateMusicButtons_UI,
    updateSfxButtons: updateSfxButtons_UI,
};