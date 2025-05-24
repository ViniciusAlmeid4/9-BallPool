function createPockets(scene) {
    const width = scene.sys.game.config.width;
    const height = scene.sys.game.config.height;

    const pocketRadius = 27;
    const pocketOffset = pocketRadius * 1.2;
    const pockets = [],
        entryPoints = [];

    const positions = [
        { x: pocketOffset, y: pocketOffset },
        { x: width / 2, y: pocketOffset },
        { x: width - pocketOffset, y: pocketOffset },
        { x: pocketOffset, y: height - pocketOffset },
        { x: width / 2, y: height - pocketOffset },
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
        entryPoint.setDepth(1);
        entryPoint.setSensor(true);

        entryPoints.push(entryPoint);

        pocket.setCircle(pocketRadius);
        pocket.setOrigin(0.5);
        pocket.setDepth(1);
        pocket.setSensor(true);

        pockets.push(pocket);
    });

    return { entryPoints, pockets };
}
