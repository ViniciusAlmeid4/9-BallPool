const config = {
    type: Phaser.AUTO,
    width: 1360,
    height: 768,
    backgroundColor: "#011f1a",
    fps: {
        target: 60,
        forceSetTimeOut: true, // Helps ensure consistent timing in some environments
    },
    // fixedStep: true, // Ensures consistent simulation
    backgroundColor: "#1d1d1d",
    physics: {
        default: "matter",
        matter: {
            debug: false,
            gravity: { y: 0, x:0 },
        },
    },
    scene: [preloaderScene, menuScene, mainScene],
};

const game = new Phaser.Game(config);

SoundManager.init(game);