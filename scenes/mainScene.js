const mainScene = {
    preload,
    create,
    update,
};

const collisionCooldown = new Map();

let ball1, ball2, ball3, ball4;
let balls = [];

function preload() {
    this.load.image("ball", "assets/ball.png");
}

function create() {
    // Cria colisões entre todas as combinações de bolas
    for (let i = 0; i < 9; i++) {
        balls[i] = createBall(this, 100 + i * 100, 100 + i * 50, 1);
        for (let j = 0; j < balls.length - 1; j++) {
            this.physics.add.collider(balls[i], balls[j], handleBallCollision);
        }
    }
    balls[0].setVelocity(500, 205);
    balls[2].setVelocity(200, -105);
    balls[3].setVelocity(300, -55);
    balls[5].setVelocity(60, 30);
    balls[1].setVelocity(30, -150);
}

function handleBallCollision(b1, b2) {
    const now = Date.now();
    const key = [b1.name, b2.name].sort().join("-");
    if (collisionCooldown.has(key) && now - collisionCooldown.get(key) < 0) return;
    collisionCooldown.set(key, now);

    const pos1 = b1.body.position.clone();
    const pos2 = b2.body.position.clone();
    const v1 = b1.body.velocity.clone();
    const v2 = b2.body.velocity.clone();

    const normal = pos2.clone().subtract(pos1);
    const dist = normal.length();
    if (dist === 0) return;

    const minDist = b1.body.halfWidth + b2.body.halfWidth;
    const overlap = minDist - dist;
    if (overlap > 0) {
        const correction = normal.clone().normalize().scale(overlap / 2);
        b1.body.position.subtract(correction);
        b2.body.position.add(correction);
    }

    const unitNormal = normal.clone().normalize();
    const unitTangent = new Phaser.Math.Vector2(-unitNormal.y, unitNormal.x);

    // Decompose velocities
    const v1n = unitNormal.dot(v1);
    const v1t = unitTangent.dot(v1);
    const v2n = unitNormal.dot(v2);
    const v2t = unitTangent.dot(v2);

    const v1tFinal = v1t > v2t ? v1t-v2t : v2t-v1t;
    const v2tFinal = v2t > v1t ? v2t-v1t : v1t-v2t;

    const v1nFinal = v1n;
    const v2nFinal = v2n;

    // Recompose final velocities
    const v1Final = unitNormal.clone().scale(v1nFinal).add(unitTangent.clone().scale(v1tFinal));
    const v2Final = unitNormal.clone().scale(v2nFinal).add(unitTangent.clone().scale(v2tFinal));

    b1.body.setVelocity(v1Final.x, v1Final.y);
    b2.body.setVelocity(v2Final.x, v2Final.y);
}

function update() {
    balls.forEach(ball => {
        const velocity = ball.body.velocity.length();

        if (velocity > 0.1) {
            // Calcula um fator de desaceleração baseado na velocidade
            // Quanto menor a velocidade, menor o fator (mais desaceleração)
            const friction = Math.max(0.002, 1 - (1 / (velocity * 2 + 25)));

            ball.body.velocity.scale(friction);

            // Se ficar muito pequeno, zera
            if (ball.body.velocity.length() < 4) {
                ball.body.velocity.set(0, 0);
            }
        }
    });
}
