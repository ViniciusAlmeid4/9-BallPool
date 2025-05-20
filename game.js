const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    backgroundColor: "#1d1d1d",
    physics: {
        default: "matter",
        matter: {
            debug: true,
            gravity: { y: 0 }
        }
    },
    scene: mainScene,
};

const game = new Phaser.Game(config);