import MovableObject from '../classes/MovableObject'

export default class NegativeObject extends MovableObject {

    static generateAttributes() {
        let x = super.generateСoordinates()
        const y = -100
        return { x, y, texture: `negative_0${Phaser.Math.Between(1, 4)}` }
    }
    static generate(scene) {
        const data = NegativeObject.generateAttributes()
        return new NegativeObject({
            scene,
            x: data.x,
            y: data.y,
            texture: data.texture,

        })
    }
    init(data) {
        super.init(data)
    }
    reset() {
        const data = NegativeObject.generateAttributes()
        super.reset(data.x, data.y)
        this.setTexture(data.texture)
    }
    isDead() {
        return this.y > this.scene.game.config.height
    }
}