const config = {
    type: Phaser.AUTO,
    width: 1240,
    height: 633,
    backgroundColor: "#1d1d1d",
    physics: {
        default: "matter",
        matter: {
            debug: false,
            gravity: { y: 0 },
        },
    },
    scene: mainScene,
};

const game = new Phaser.Game(config);
