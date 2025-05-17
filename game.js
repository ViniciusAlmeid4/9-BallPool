const config = {
    type: Phaser.AUTO,
    // width: 1600,
    // height: 900,
    width: 1280,
    height: 720,
    backgroundColor: "#1d1d1d",
    physics: {
        default: "arcade",
        arcade: {
            debug: true,
        },
    },
    scene: mainScene,
};

const game = new Phaser.Game(config);