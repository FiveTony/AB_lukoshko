const SPRITE_WIDTH = 73
const KOEF_VELOCITY = 0.1

export default class MovableObject extends Phaser.GameObjects.Sprite {
    constructor(data) {
        super(data.scene, data.x, data.y, data.texture)
        this.init(data)
    }
    init(data) {
        this.scene.add.existing(this)
        this.scene.physics.add.existing(this)
        this.body.enable = true
        this.setScale(Phaser.Math.FloatBetween(0.65, 0.75))
        this.scene.events.on('update', this.update, this)

        this.velocityX = 0
    }
    update(timestep, dt) {
        if (this.active && this.isDead()) {
            this.setAlive(false)
        }
        this.y += this.velocityY
        this.x += this.velocityX
    }
    setAlive(status) {
        this.body.enable = status
        this.setVisible(status)
        this.setActive(status)
    }
    reset(x, y) {
        this.x = x
        this.y = y
        this.setAlive(true)
    }
    isDead() {
        return false
    }
    move(velocity, horizontal, score) {
        let diff = score * score * KOEF_VELOCITY
        let randY = Phaser.Math.Between(velocity[0] + diff, velocity[1] + diff)
        this.velocityY = this.scene.game.loop.delta * randY / 1000
        if (horizontal) {
            let randX = Phaser.Math.Between(-10, 10)
            this.velocityX = this.scene.game.loop.delta * randX / 1000
        }
    }
    setRotation() {
        this.randRotation = ((Math.random() < 0.5) ? -1 : 1) * 2 * Math.PI
        this.scene.tweens.add({
            targets: this,
            duration: 20000,
            rotation: this.randRotation,
            repeat: -1,
            loop: -1,
            callback: () => { }
        });
    }
    static generateСoordinates() {
        this.lastX = [this.lastX_N, this.lastX_P]
        let x = Phaser.Math.Between(50, 450)
        for (let i in this.lastX) {
            if (x - SPRITE_WIDTH < this.lastX[i] && x + SPRITE_WIDTH > this.lastX[i]) x = Phaser.Math.Between(50, 450)
        }
        return x
    }
}