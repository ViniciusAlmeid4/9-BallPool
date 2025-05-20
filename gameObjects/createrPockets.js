function createPockets(scene) {
    const width = scene.sys.game.config.width;
    const height = scene.sys.game.config.height;

    const pocketRadius = 27;
    const pocketOffset = pocketRadius * 1.2; // ensures they're inside the play area
    const pockets = [];

    const positions = [
        { x: pocketOffset, y: pocketOffset },                             // top-left
        { x: width / 2, y: pocketOffset },                                // top-middle
        { x: width - pocketOffset, y: pocketOffset },                     // top-right
        { x: pocketOffset, y: height - pocketOffset },                    // bottom-left
        { x: width / 2, y: height - pocketOffset },                       // bottom-middle
        { x: width - pocketOffset, y: height - pocketOffset }            // bottom-right
    ];

    positions.forEach((pos, index) => {
        const pocket = scene.matter.add.image(pos.x, pos.y, "pocket", null, {
            isSensor: true,
            isStatic: true,
            label: `pocket${index}`,
            collisionFilter: {
                category: 0x0002,
                mask: 0x0000 // collide with nothing
            }
        });

        pocket.setCircle(pocketRadius);
        pocket.setOrigin(0.5);
        pocket.setDepth(1);
        pockets.push(pocket);
    });

    return pockets;
}
