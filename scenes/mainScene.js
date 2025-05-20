const mainScene = {
    preload,
    create,
    update,
};

const collisionCooldown = new Map();

let ball1, ball2, ball3, ball4;
let balls = [];
let pockets = [];

function preload() {
    this.load.image("ball", "assets/ball.png");
    this.load.image("ball", "assets/pocket.png");
}

function create() {
    // Cria colisões entre todas as combinações de bolas
    for (let i = 0; i < 9; i++) {
        balls[i] = createBall(this, 100 + i * 100, 100 + i * 50, i);
    }
    // Set some initial velocities
    balls[0].setVelocity(15, 2);
    balls[2].setVelocity(2, -1);
    balls[3].setVelocity(10, -0.5);
    balls[5].setVelocity(0.6, 0.3);
    balls[1].setVelocity(0.3, -1.5);

    pockets = createPockets(this);
    this.matter.world.on("collisionstart", (event) => {
        event.pairs.forEach(({ bodyA, bodyB }) => {
            const labels = [bodyA.label, bodyB.label];
            if (labels.some((l) => l?.startsWith("pocket")) && labels.some((l) => l?.startsWith("ball"))) {
                console.log("Ball entered pocket");
                const ballBody = labels[0].startsWith("ball") ? bodyA : bodyB;
                const ballGameObject = ballBody.gameObject;
                ballGameObject?.destroy();
            }
        });
    });

    // Add bouncy walls
    const width = this.sys.game.config.width;
    const height = this.sys.game.config.height;
    const thickness = 30; // Wall thickness

    const wallOptions = { isStatic: true, restitution: 1 };

    // Top wall
    this.matter.add.rectangle(width / 2, 0, width, 10, wallOptions);
    // Bottom wall
    this.matter.add.rectangle(width / 2, height, width, 10, wallOptions);
    // Left wall
    this.matter.add.rectangle(0, height / 2, 10, height, wallOptions);
    // Right wall
    this.matter.add.rectangle(width, height / 2, 10, height, wallOptions);
}

function update() {}
