function createPockets(scene) {
    const width = scene.sys.game.config.width;
    const height = scene.sys.game.config.height;

    const pocketRadius = 27;
    const pocketOffset = pocketRadius * 2.6;
    const pockets = [],
        entryPoints = [];

    const positions = [
        { x: pocketOffset, y: pocketOffset },
        { x: width / 2, y: pocketOffset - 28 },
        { x: width - pocketOffset, y: pocketOffset },
        { x: pocketOffset, y: height - pocketOffset },
        { x: width / 2, y: height - pocketOffset + 28 },
        { x: width - pocketOffset, y: height - pocketOffset },
    ];

    positions.forEach((pos, index) => {
        const pocket = scene.matter.add.image(pos.x, pos.y, "pocket", null, {
            label: `pocket${index}`,
        });

        const entryPoint = scene.matter.add.image(pos.x, pos.y, "pocket", null, {
            label: `pocket${index}Entry`,
        });

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
