function createBorders(mainScene) {
    const graphics = mainScene.add.graphics();
    // graphics.fillStyle(0xffffff, 1); // White, fully opaque

    // // Top barrier (left segment)
    mainScene.matter.add.rectangle(
        408, // center x
        149, // center y
        468, // width
        40, // height
        { isStatic: true, restitution: 1, label: "barrier" }
    );
    // graphics.fillRect(408 - 468 / 2, 149 - 40 / 2, 468, 40);

    // Top barrier (right segment)
    mainScene.matter.add.rectangle(
        952, // center x
        149, // center y
        468, // width
        40, // height
        { isStatic: true, restitution: 1, label: "barrier" }
    );
    // graphics.fillRect(952 - 468 / 2, 149 - 40 / 2, 468, 40);

    // Bottom barrier (right segment)
    mainScene.matter.add.rectangle(
        951.5, // center x
        669, // center y
        468,
        40,
        { isStatic: true, restitution: 1, label: "barrier" }
    );
    // graphics.fillRect(951.5 - 468 / 2, 669 - 40 / 2, 468, 40);

    // Bottom barrier (left segment)
    mainScene.matter.add.rectangle(
        407.5, // center x
        669, // center y
        468,
        40,
        { isStatic: true, restitution: 1, label: "barrier" }
    );
    // graphics.fillRect(407.5 - 468 / 2, 669 - 40 / 2, 468, 40);

    // Left barrier
    mainScene.matter.add.rectangle(
        116, 
        409, 
        40, 
        404, 
        { isStatic: true, restitution: 1, label: "barrier" }
    );
    // graphics.fillRect(116 - 40 / 2, 409 - 404 / 2, 40, 404);

    // Right barrier
    mainScene.matter.add.rectangle(
        1244, // + 60
        409, // + 93
        40,
        404,
        { isStatic: true, restitution: 1, label: "barrier" }
    );
    // graphics.fillRect(1244 - 40 / 2, 409 - 404 / 2, 40, 404);
}
