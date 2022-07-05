export default class PauseScene extends Phaser.Scene {
    constructor() {
        super('Pause')
    }
    create() {
        this.createButtons()
        this.onHover()
        this.onButtons()
    }
    createButtons() {
        this.pause = this.add.sprite(this.game.config.width - 62 - 32, 18, "ui_spritesheet", 'pause').setOrigin(0).setInteractive()
        this.continue = this.add.sprite(this.game.config.width / 2, 342, "ui_spritesheet", 'btn1Pause').setInteractive()
        this.restart = this.add.sprite(this.game.config.width / 2, 458,"ui_spritesheet", 'btn2Pause').setInteractive()
    }
    onButtons() {
        this.continue.on('pointerdown', () => {
            this.scene.sleep('Pause');
            this.scene.resume('Game')
        })
        this.pause.on('pointerdown', () => {
            this.scene.sleep('Pause');
            this.scene.resume('Game')
        })
        this.restart.on('pointerdown', () => {
            this.scene.start('Game', {
                status: 'first'
            })
        })
    }
    onHover() {
        this.continue.on('pointerover', () => {
            this.continue.setFrame('btn1PauseHover')
        })
        this.continue.on('pointerout', () => {
            this.continue.setFrame('btn1Pause')
        })
        this.restart.on('pointerover', () => {
            this.restart.setFrame('btn2PauseHover')
        })
        this.restart.on('pointerout', () => {
            this.restart.setFrame('btn2Pause')
        })
    }
}