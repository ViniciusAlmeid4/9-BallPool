function createBorders(mainScene) {
    const graphics = mainScene.add.graphics();
    // graphics.fillStyle(0xffffff, 1); // White, fully opaque

    // // Top barrier (left segment)
    mainScene.matter.add.rectangle(408, 149, 458, 40, {
        isStatic: true,
        restitution: 1,
        label: "barrier",
    });
    // graphics.fillRect(408 - 458 / 2, 149 - 40 / 2, 458, 40);

    // Top barrier (right segment)
    mainScene.matter.add.rectangle(952, 149, 458, 40, {
        isStatic: true,
        restitution: 1,
        label: "barrier",
    });
    // graphics.fillRect(952 - 458 / 2, 149 - 40 / 2, 458, 40);

    // Bottom barrier (right segment)
    mainScene.matter.add.rectangle(952, 669, 458, 40, {
        isStatic: true,
        restitution: 1,
        label: "barrier",
    });
    // graphics.fillRect(952 - 458 / 2, 669 - 40 / 2, 458, 40);

    // Bottom barrier (left segment)
    mainScene.matter.add.rectangle(408, 669, 458, 40, {
        isStatic: true,
        restitution: 1,
        label: "barrier",
    });
    // graphics.fillRect(408 - 458 / 2, 669 - 40 / 2, 458, 40);

    // Left barrier
    mainScene.matter.add.rectangle(116, 409, 40, 394, {
        isStatic: true,
        restitution: 1,
        label: "barrier",
    });
    // graphics.fillRect(116 - 40 / 2, 409 - 394 / 2, 40, 394);

    // Right barrier
    mainScene.matter.add.rectangle(
        1244, // + 60
        409, // + 93
        40,
        394,
        { isStatic: true, restitution: 1, label: "barrier" }
    );
    // graphics.fillRect(1244 - 40 / 2, 409 - 394 / 2, 40, 394);

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
    mainScene.matter.add.rectangle(170, 138, funnelLength, funnelThickness, {
        ...funnelOptions,
        angle: Phaser.Math.DegToRad(55),
    });
    drawRotatedRect(
        graphics,
        170,
        138,
        funnelLength,
        funnelThickness,
        Phaser.Math.DegToRad(55)
    );

    mainScene.matter.add.rectangle(106, 205, funnelLength, funnelThickness, {
        ...funnelOptions,
        angle: Phaser.Math.DegToRad(35),
    });
    drawRotatedRect(
        graphics,
        106,
        205,
        funnelLength,
        funnelThickness,
        Phaser.Math.DegToRad(35)
    );

    // === TOP-RIGHT corner funnel
    mainScene.matter.add.rectangle(1190, 138, funnelLength, funnelThickness, {
        ...funnelOptions,
        angle: Phaser.Math.DegToRad(125),
    });
    drawRotatedRect(
        graphics,
        1190,
        138,
        funnelLength,
        funnelThickness,
        Phaser.Math.DegToRad(125)
    );

    mainScene.matter.add.rectangle(1255, 204, funnelLength, funnelThickness, {
        ...funnelOptions,
        angle: Phaser.Math.DegToRad(145),
    });
    drawRotatedRect(
        graphics,
        1255,
        204,
        funnelLength,
        funnelThickness,
        Phaser.Math.DegToRad(145)
    );

    // === BOTTOM-LEFT corner funnel
    mainScene.matter.add.rectangle(170, 680, funnelLength, funnelThickness, {
        ...funnelOptions,
        angle: Phaser.Math.DegToRad(-55),
    });
    drawRotatedRect(
        graphics,
        170,
        680,
        funnelLength,
        funnelThickness,
        Phaser.Math.DegToRad(-55)
    );

    mainScene.matter.add.rectangle(105, 615, funnelLength, funnelThickness, {
        ...funnelOptions,
        angle: Phaser.Math.DegToRad(-35),
    });
    drawRotatedRect(
        graphics,
        105,
        615,
        funnelLength,
        funnelThickness,
        Phaser.Math.DegToRad(-35)
    );

    // === BOTTOM-RIGHT corner funnel
    mainScene.matter.add.rectangle(1190, 680, funnelLength, funnelThickness, {
        ...funnelOptions,
        angle: Phaser.Math.DegToRad(-125),
    });
    drawRotatedRect(
        graphics,
        1190,
        680,
        funnelLength,
        funnelThickness,
        Phaser.Math.DegToRad(-125)
    );

    mainScene.matter.add.rectangle(1255, 615, funnelLength, funnelThickness, {
        ...funnelOptions,
        angle: Phaser.Math.DegToRad(-145),
    });
    drawRotatedRect(
        graphics,
        1255,
        615,
        funnelLength,
        funnelThickness,
        Phaser.Math.DegToRad(-145)
    );

    // === BOTTOM-MIDDLE funnel
    mainScene.matter.add.rectangle(620, 676, funnelLength, funnelThickness, {
        ...funnelOptions,
        angle: Phaser.Math.DegToRad(140),
    });
    drawRotatedRect(
        graphics,
        620,
        676,
        funnelLength,
        funnelThickness,
        Phaser.Math.DegToRad(140)
    );

    mainScene.matter.add.rectangle(741, 676, funnelLength, funnelThickness, {
        ...funnelOptions,
        angle: Phaser.Math.DegToRad(-140),
    });
    drawRotatedRect(
        graphics,
        741,
        676,
        funnelLength,
        funnelThickness,
        Phaser.Math.DegToRad(-140)
    );

    // === TOP-MIDDLE funnel
    mainScene.matter.add.rectangle(620, 142, funnelLength, funnelThickness, {
        ...funnelOptions,
        angle: Phaser.Math.DegToRad(40),
    });
    drawRotatedRect(
        graphics,
        620,
        142,
        funnelLength,
        funnelThickness,
        Phaser.Math.DegToRad(40)
    );

    mainScene.matter.add.rectangle(741, 142, funnelLength, funnelThickness, {
        ...funnelOptions,
        angle: Phaser.Math.DegToRad(-40),
    });
    drawRotatedRect(
        graphics,
        741,
        142,
        funnelLength,
        funnelThickness,
        Phaser.Math.DegToRad(-40)
    );
}
