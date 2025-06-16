function createPowerBar(scene) {
    const powerBar = scene.add.image(50, 360, "powerBar").setOrigin(0.5);
    const powerSlider = scene.add.image(50, 325, "powerSlider").setOrigin(0.5);
    
    powerBar.setVisible(false);
    powerSlider.setVisible(false);
    powerSlider.setInteractive();

    scene.input.setDraggable(powerSlider);

    scene.input.on("dragstart", (pointer, gameObject) => {
        // A funcionalidade de drag só inicia se o slider é o objeto, o stick está travado
        // E SE TODAS AS BOLAS ESTIVEREM PARADAS
        
        if (gameObject === powerSlider && scene.stickLocked && allBallsStopped) {
            scene.isDragging = true;
        }
    });

    scene.input.on("drag", (pointer, gameObject, dragX, dragY) => {
        // A funcionalidade de drag só ocorre se o slider é o objeto e o stick está travado
        if (gameObject === powerSlider && scene.stickLocked) {
            const minY = 325
            const maxY = powerBar.height + minY - 25;

            gameObject.y = Phaser.Math.Clamp(dragY, minY, maxY);

            const sliderPosition = (gameObject.y - minY) / powerBar.height;
            scene.powerValue = sliderPosition;
            scene.stickDistance = 20 + scene.powerValue * 200;

            updateStickPosition(scene, pointer);
        }
    });

    scene.input.on("dragend", (pointer, gameObject) => {
        // A funcionalidade de drag end só ocorre se o slider é o objeto e o stick está travado
        if (gameObject === powerSlider && scene.stickLocked) {
            scene.isDragging = false;
            shootCueBall(scene);
            scene.stickDistance = 20;
        }
    });

    return { powerBar, powerSlider };
}
