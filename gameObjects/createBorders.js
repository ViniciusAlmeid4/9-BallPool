function createBorders(mainScene) {
    const graphics = mainScene.add.graphics();
    // graphics.fillStyle(0xffffff, 1); // White, fully opaque

    // // Top barrier (left segment)
    mainScene.matter.add.rectangle(408, 164, 458, 40, {
        isStatic: true,
        restitution: 1,
        label: "barrier",
    });
    // graphics.fillRect(408 - 458 / 2, 164 - 40 / 2, 458, 40);

    // Top barrier (right segment)
    mainScene.matter.add.rectangle(952, 164, 458, 40, {
        isStatic: true,
        restitution: 1,
        label: "barrier",
    });
    // graphics.fillRect(952 - 458 / 2, 164 - 40 / 2, 458, 40);

    // Bottom barrier (right segment)
    mainScene.matter.add.rectangle(952, 684, 458, 40, {
        isStatic: true,
        restitution: 1,
        label: "barrier",
    });
    // graphics.fillRect(952 - 458 / 2, 684 - 40 / 2, 458, 40);

    // Bottom barrier (left segment)
    mainScene.matter.add.rectangle(408, 684, 458, 40, {
        isStatic: true,
        restitution: 1,
        label: "barrier",
    });
    // graphics.fillRect(408 - 458 / 2, 684 - 40 / 2, 458, 40);

    // Left barrier
    mainScene.matter.add.rectangle(116, 424, 40, 394, {
        isStatic: true,
        restitution: 1,
        label: "barrier",
    });
    // graphics.fillRect(116 - 40 / 2, 424 - 394 / 2, 40, 394);

    // Right barrier
    mainScene.matter.add.rectangle(
        1244, // + 60
        424, // + 93
        40,
        394,
        { isStatic: true, restitution: 1, label: "barrier" }
    );
    // graphics.fillRect(1244 - 40 / 2, 424 - 394 / 2, 40, 394);

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
    mainScene.matter.add.rectangle(170, 153, funnelLength, funnelThickness, {
        ...funnelOptions,
        angle: Phaser.Math.DegToRad(55),
    });
    // drawRotatedRect(
    //     graphics,
    //     170,
    //     153,
    //     funnelLength,
    //     funnelThickness,
    //     Phaser.Math.DegToRad(55)
    // );

    mainScene.matter.add.rectangle(106, 220, funnelLength, funnelThickness, {
        ...funnelOptions,
        angle: Phaser.Math.DegToRad(35),
    });
    // drawRotatedRect(
    //     graphics,
    //     106,
    //     220,
    //     funnelLength,
    //     funnelThickness,
    //     Phaser.Math.DegToRad(35)
    // );

    // === TOP-RIGHT corner funnel
    mainScene.matter.add.rectangle(1190, 153, funnelLength, funnelThickness, {
        ...funnelOptions,
        angle: Phaser.Math.DegToRad(125),
    });
    // drawRotatedRect(
    //     graphics,
    //     1190,
    //     153,
    //     funnelLength,
    //     funnelThickness,
    //     Phaser.Math.DegToRad(125)
    // );

    mainScene.matter.add.rectangle(1255, 220, funnelLength, funnelThickness, {
        ...funnelOptions,
        angle: Phaser.Math.DegToRad(145),
    });
    // drawRotatedRect(
    //     graphics,
    //     1255,
    //     220,
    //     funnelLength,
    //     funnelThickness,
    //     Phaser.Math.DegToRad(145)
    // );

    // === BOTTOM-LEFT corner funnel
    mainScene.matter.add.rectangle(170, 695, funnelLength, funnelThickness, {
        ...funnelOptions,
        angle: Phaser.Math.DegToRad(-55),
    });
    // drawRotatedRect(
    //     graphics,
    //     170,
    //     695,
    //     funnelLength,
    //     funnelThickness,
    //     Phaser.Math.DegToRad(-55)
    // );

    mainScene.matter.add.rectangle(105, 630, funnelLength, funnelThickness, {
        ...funnelOptions,
        angle: Phaser.Math.DegToRad(-35),
    });
    // drawRotatedRect(
    //     graphics,
    //     105,
    //     630,
    //     funnelLength,
    //     funnelThickness,
    //     Phaser.Math.DegToRad(-35)
    // );

    // === BOTTOM-RIGHT corner funnel
    mainScene.matter.add.rectangle(1190, 695, funnelLength, funnelThickness, {
        ...funnelOptions,
        angle: Phaser.Math.DegToRad(-125),
    });
    // drawRotatedRect(
    //     graphics,
    //     1190,
    //     695,
    //     funnelLength,
    //     funnelThickness,
    //     Phaser.Math.DegToRad(-125)
    // );

    mainScene.matter.add.rectangle(1255, 630, funnelLength, funnelThickness, {
        ...funnelOptions,
        angle: Phaser.Math.DegToRad(-145),
    });
    // drawRotatedRect(
    //     graphics,
    //     1255,
    //     630,
    //     funnelLength,
    //     funnelThickness,
    //     Phaser.Math.DegToRad(-145)
    // );

    // === BOTTOM-MIDDLE funnel
    mainScene.matter.add.rectangle(616, 688, funnelLength, funnelThickness, {
        ...funnelOptions,
        angle: Phaser.Math.DegToRad(150),
    });
    // drawRotatedRect(
    //     graphics,
    //     616,
    //     688,
    //     funnelLength,
    //     funnelThickness,
    //     Phaser.Math.DegToRad(150)
    // );

    mainScene.matter.add.rectangle(744, 688, funnelLength, funnelThickness, {
        ...funnelOptions,
        angle: Phaser.Math.DegToRad(-150),
    });
    // drawRotatedRect(
    //     graphics,
    //     744,
    //     688,
    //     funnelLength,
    //     funnelThickness,
    //     Phaser.Math.DegToRad(-150)
    // );

    // === TOP-MIDDLE funnel
    mainScene.matter.add.rectangle(616, 160, funnelLength, funnelThickness, {
        ...funnelOptions,
        angle: Phaser.Math.DegToRad(30),
    });
    // drawRotatedRect(
    //     graphics,
    //     616,
    //     160,
    //     funnelLength,
    //     funnelThickness,
    //     Phaser.Math.DegToRad(30)
    // );

    mainScene.matter.add.rectangle(744, 160, funnelLength, funnelThickness, {
        ...funnelOptions,
        angle: Phaser.Math.DegToRad(-30),
    });
    // drawRotatedRect(
    //     graphics,
    //     744,
    //     160,
    //     funnelLength,
    //     funnelThickness,
    //     Phaser.Math.DegToRad(-30)
    // );
}
