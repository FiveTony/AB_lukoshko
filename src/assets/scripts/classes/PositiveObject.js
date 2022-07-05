import MovableObject from './MovableObject'

export default class PositiveObject extends MovableObject {

    static generateAttributes() {
        let x = super.generateСoordinates()
        const y = -100
        // return { x, y, texture: 'icecream' }
        return { x, y, texture: `positive_0${Phaser.Math.Between(1, 3)}` }
    }
    static generate(scene) {
        const data = PositiveObject.generateAttributes()
        return new PositiveObject({
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
        const data = PositiveObject.generateAttributes()
        super.reset(data.x, data.y)
        this.setTexture(data.texture) // вместо setFrame, который только для фреймов
    }
    isDead() { // проверка на выход за пределы экрана
        return this.y > this.scene.game.config.height
    }
}