function createPowerBar(scene) {
    const powerBar = scene.add.image(50, 360, "powerBar").setOrigin(0.5);
    const powerSlider = scene.add.image(50, 210, "powerSlider").setOrigin(0.5);

    powerBar.setVisible(false);
    powerSlider.setVisible(false);
    powerSlider.setInteractive();

    scene.input.setDraggable(powerSlider);

    scene.input.on("dragstart", (pointer, gameObject) => {
        if (gameObject === powerSlider && scene.stickLocked) {
            scene.isDragging = true;
        }
    });

    scene.input.on("drag", (pointer, gameObject, dragX, dragY) => {
        if (gameObject === powerSlider && scene.stickLocked) {
            const minY = powerBar.y - powerBar.height / 2;
            const maxY = powerBar.y + powerBar.height / 2;

            gameObject.y = Phaser.Math.Clamp(dragY, minY, maxY);

            const sliderPosition = (gameObject.y - minY) / powerBar.height;
            scene.powerValue = sliderPosition;
            scene.stickDistance = 20 + scene.powerValue * 200;

            updateStickPosition(scene, pointer);
        }
    });

    scene.input.on("dragend", (pointer, gameObject) => {
        if (gameObject === powerSlider && scene.stickLocked) {
            scene.isDragging = false;
            shootCueBall(scene);
            scene.stickDistance = 20;
        }
    });

    return { powerBar, powerSlider };
}
