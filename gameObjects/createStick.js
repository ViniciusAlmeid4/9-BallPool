function createStick(scene, x, y) {
    const stick = scene.add.image(x, y, "stick");
    stick.setOrigin(0.5, 0); // Pivot at tip of stick (top of vertical image)
    stick.setDisplaySize(15, 200);

    return stick;
}
