function createBorders(mainScene){
    const graphics = mainScene.add.graphics();
    // graphics.fillStyle(0xffffff, 1); // White, fully opaque

    // // Top barrier (left segment)
    mainScene.matter.add.rectangle(
        347.5, // center x
        55,    // center y
        468,   // width
        40,    // height
        { isStatic: true, restitution: 1, label: "barrier" }
    );
    // graphics.fillRect(
    //     347.5 - 468 / 2,
    //     55 - 40 / 2,
    //     468,
    //     40
    // );

    // Top barrier (right segment)
    mainScene.matter.add.rectangle(
        891.5, // center x
        55,    // center y
        468,   // width
        40,    // height
        { isStatic: true, restitution: 1, label: "barrier" }
    );
    // graphics.fillRect(
    //     891.5 - 468 / 2,
    //     55 - 40 / 2,
    //     468,
    //     40
    // );

    // Bottom barrier (right segment)
    mainScene.matter.add.rectangle(
        891.5, // center x
        577,   // center y
        468,
        40,
        { isStatic: true, restitution: 1, label: "barrier" }
    );
    // graphics.fillRect(
    //     891.5 - 468 / 2,
    //     577 - 40 / 2,
    //     468,
    //     40
    // );

    // Bottom barrier (left segment)
    mainScene.matter.add.rectangle(
        347.5, // center x
        577,   // center y
        468,
        40,
        { isStatic: true, restitution: 1, label: "barrier" }
    );
    // graphics.fillRect(
    //     347.5 - 468 / 2,
    //     577 - 40 / 2,
    //     468,
    //     40
    // );

    // Left barrier
    mainScene.matter.add.rectangle(
        56,
        316,
        40,
        404,
        { isStatic: true, restitution: 1, label: "barrier" }
    );
    // graphics.fillRect(
    //     56 - 40 / 2,
    //     316 - 404 / 2,
    //     40,
    //     404
    // );

    // Right barrier
    mainScene.matter.add.rectangle(
        1184,
        316,
        40,
        404,
        { isStatic: true, restitution: 1, label: "barrier" }
    );
    // graphics.fillRect(
    //     1184 - 40 / 2,
    //     316 - 404 / 2,
    //     40,
    //     404
    // );
}