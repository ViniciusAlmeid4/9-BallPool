const config = {
    type: Phaser.AUTO,
    width: 1360,
    height: 768,
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
