function createPockets(scene) {
    const width = scene.sys.game.config.width;
    const height = scene.sys.game.config.height;

    const pocketRadius = 27;
    const pocketOffset = pocketRadius * 2.6;
    const pockets = [],
        entryPoints = [];

    const positions = [
        { x: 128, y: 669 }, // bottom left
        { x: 679.5, y: 693 }, // bottom center
        { x: 1230, y: 177 }, // top right
        { x: 128, y: 177 }, // top left
        { x: 679.5, y: 155 },
        { x: 1230, y: 669 },
    ];

    positions.forEach((pos, index) => {
        const pocket = scene.matter.add.image(pos.x, pos.y, "pocket", null, {
            label: `pocket${index}`,
        });

        const entryPoint = scene.matter.add.image(
            pos.x,
            pos.y,
            "pocket",
            null,
            {
                label: `pocket${index}Entry`,
            }
        );

        entryPoint.setCircle(1);
        entryPoint.setOrigin(0.5);
        entryPoint.setDepth(-10);
        entryPoint.setSensor(true);

        entryPoints.push(entryPoint);

        pocket.setCircle(pocketRadius);
        pocket.setOrigin(0.5);
        pocket.setDepth(-10);
        pocket.setSensor(true);

        pockets.push(pocket);
    });

    return { entryPoints, pockets };
}
