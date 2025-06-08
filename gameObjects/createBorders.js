function createBorders(mainScene) {
    const graphics = mainScene.add.graphics();
    // graphics.fillStyle(0xffffff, 1); // White, fully opaque

    // // Top barrier (left segment)
    mainScene.matter.add.rectangle(408, 149, 468, 40, { isStatic: true, restitution: 1, label: "barrier" });
    graphics.fillRect(408 - 468 / 2, 149 - 40 / 2, 468, 40);

    // Top barrier (right segment)
    mainScene.matter.add.rectangle(952, 149, 468, 40, { isStatic: true, restitution: 1, label: "barrier" });
    graphics.fillRect(952 - 468 / 2, 149 - 40 / 2, 468, 40);

    // Bottom barrier (right segment)
    mainScene.matter.add.rectangle(952, 669, 468, 40, { isStatic: true, restitution: 1, label: "barrier" });
    graphics.fillRect(952 - 468 / 2, 669 - 40 / 2, 468, 40);

    // Bottom barrier (left segment)
    mainScene.matter.add.rectangle(408, 669, 468, 40, { isStatic: true, restitution: 1, label: "barrier" });
    graphics.fillRect(408 - 468 / 2, 669 - 40 / 2, 468, 40);

    // Left barrier
    mainScene.matter.add.rectangle(116, 409, 40, 404, { isStatic: true, restitution: 1, label: "barrier" });
    graphics.fillRect(116 - 40 / 2, 409 - 404 / 2, 40, 404);

    // Right barrier
    mainScene.matter.add.rectangle(
        1244, // + 60
        409, // + 93
        40,
        404,
        { isStatic: true, restitution: 1, label: "barrier" }
    );
    graphics.fillRect(1244 - 40 / 2, 409 - 404 / 2, 40, 404);

    /* ---------- CORNERS ---------- */

    const funnelLength = 60;
    const funnelThickness = 20;
    const funnelOptions = { isStatic: true, restitution: 1, label: "funnel" };

    function drawRotatedRect(graphics, x, y, width, height, angleRad) {
        graphics.save();
        graphics.translate(x, y);
        graphics.rotate(angleRad);
        graphics.fillStyle(0xffffff, 1); // Optional
        graphics.fillRect(-width / 2, -height / 2, width, height);
        graphics.restore();
    }

    // === TOP-LEFT corner funnel
    mainScene.matter.add.rectangle(160, 140, funnelLength, funnelThickness, {
        ...funnelOptions,
        angle: Phaser.Math.DegToRad(45),
    });
    drawRotatedRect(graphics, 160, 140, funnelLength, funnelThickness, Phaser.Math.DegToRad(45));

    mainScene.matter.add.rectangle(104, 190, funnelLength, funnelThickness, {
        ...funnelOptions,
        angle: Phaser.Math.DegToRad(45),
    });
    drawRotatedRect(graphics, 107, 194, funnelLength, funnelThickness, Phaser.Math.DegToRad(45));

    // === TOP-RIGHT corner funnel
    mainScene.matter.add.rectangle(1178, 140, funnelLength, funnelThickness, {
        ...funnelOptions,
        angle: Phaser.Math.DegToRad(135),
    });
    drawRotatedRect(graphics, 1199, 140, funnelLength, funnelThickness, Phaser.Math.DegToRad(135));

    mainScene.matter.add.rectangle(1252, 194, funnelLength, funnelThickness, {
        ...funnelOptions,
        angle: Phaser.Math.DegToRad(135),
    });
    drawRotatedRect(graphics, 1253, 194, funnelLength, funnelThickness, Phaser.Math.DegToRad(135));

    // === BOTTOM-LEFT corner funnel
    mainScene.matter.add.rectangle(160, 678, funnelLength, funnelThickness, {
        ...funnelOptions,
        angle: Phaser.Math.DegToRad(-45),
    });
    drawRotatedRect(graphics, 160, 678, funnelLength, funnelThickness, Phaser.Math.DegToRad(-45));

    mainScene.matter.add.rectangle(140, 720, funnelLength, funnelThickness, {
        ...funnelOptions,
        angle: Phaser.Math.DegToRad(-45),
    });
    drawRotatedRect(graphics, 107, 624, funnelLength, funnelThickness, Phaser.Math.DegToRad(-45));

    // === BOTTOM-RIGHT corner funnel
    mainScene.matter.add.rectangle(1199, 678, funnelLength, funnelThickness, {
        ...funnelOptions,
        angle: Phaser.Math.DegToRad(-135),
    });
    drawRotatedRect(graphics, 1199, 678, funnelLength, funnelThickness, Phaser.Math.DegToRad(-135));

    mainScene.matter.add.rectangle(1253, 624, funnelLength, funnelThickness, {
        ...funnelOptions,
        angle: Phaser.Math.DegToRad(-135),
    });
    drawRotatedRect(graphics, 1253, 624, funnelLength, funnelThickness, Phaser.Math.DegToRad(-135));

    // === BOTTOM-MIDDLE funnel
    mainScene.matter.add.rectangle(626, 678, funnelLength, funnelThickness, {
        ...funnelOptions,
        angle: Phaser.Math.DegToRad(140),
    });
    // drawRotatedRect(graphics, 626, 678, funnelLength, funnelThickness, Phaser.Math.DegToRad(140));

    mainScene.matter.add.rectangle(1253, 624, funnelLength, funnelThickness, {
        ...funnelOptions,
        angle: Phaser.Math.DegToRad(-140),
    });
    // drawRotatedRect(graphics, 734, 678, funnelLength, funnelThickness, Phaser.Math.DegToRad(-140));

    // === TOP-MIDDLE funnel
    mainScene.matter.add.rectangle(626, 678, funnelLength, funnelThickness, {
        ...funnelOptions,
        angle: Phaser.Math.DegToRad(45),
    });
    drawRotatedRect(graphics, 627, 139, funnelLength, funnelThickness, Phaser.Math.DegToRad(45));

    mainScene.matter.add.rectangle(1253, 624, funnelLength, funnelThickness, {
        ...funnelOptions,
        angle: Phaser.Math.DegToRad(-45),
    });
    drawRotatedRect(graphics, 733, 139, funnelLength, funnelThickness, Phaser.Math.DegToRad(-45));
}
