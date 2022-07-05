import NegativeObject from '../classes/NegativeObject'
import MovableObject from './MovableObject'

export default class Negative extends Phaser.Physics.Arcade.Group {
    constructor(scene, config) {
        super(scene.physics.world, scene)
        this.scene = scene

        this.config = config

        this.countMax = this.config.maxNegativeOnLevel
        this.countCreated = 0

        this.timer = this.scene.time.addEvent({
            delay: Phaser.Math.Between(this.config.frequencyNegative[0], this.config.frequencyNegative[1]),
            loop: true,
            callback: this.tick,
            callbackScope: this
        })

    }
    createNegativeObject() {
        let negativeObject = this.getFirstDead()
        if (!negativeObject) {
            negativeObject = NegativeObject.generate(this.scene, this.config.negativeScale)
            MovableObject.lastX_N = negativeObject.x
            negativeObject.positive = false
            this.add(negativeObject)
        } else {
            negativeObject.reset()
        }

        negativeObject.move(this.config.velocity, this.config.isHorizontal, this.scene.countScorePositive)
        if (this.config.isRotation) negativeObject.setRotation()
        this.countCreated++
    }
    tick() {
        if (this.countCreated < this.countMax) {
            this.createNegativeObject()
            this.timer.delay -= this.scene.countScorePositive * this.config.accelerationFrequency
        } else {
            this.timer.remove()
        }
    }
}