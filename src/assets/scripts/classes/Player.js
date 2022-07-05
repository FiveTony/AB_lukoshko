const VELOCITY = 500;
const LEFT_LIMIT = 35;
const RIGHT_LIMIT = 500 - 35;

export default class Player extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, frame, config) {
    super(scene, x, y, frame);
    this.config = config;
    this.init();
  }
  init() {
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.body.enable = true;

    // this.right_limit = 

    this.setScale(this.config.playerScale);
    this.scene.events.on("update", this.update, this);
  }
  move(cursors) {
    this.body.setVelocity(0);
    if (cursors.left.isDown) {
      this.body.setVelocityX(-VELOCITY);
      this.setScale(this.config.playerScale - 0.05);
      this.setRotation(-0.25);
    } else if (cursors.right.isDown) {
      this.body.setVelocityX(VELOCITY);
      this.setScale(this.config.playerScale - 0.05);
      this.setRotation(0.25);
    } else if (cursors.left.isUp) {
      this.setScale(this.config.playerScale);
      this.setRotation(0);
    } else if (cursors.right.isUp) {
      this.setScale(this.config.playerScale);
      this.setRotation(0);
    }
    if (this.x > RIGHT_LIMIT) this.x = RIGHT_LIMIT;
    else if (this.x < LEFT_LIMIT) this.x = LEFT_LIMIT;
  }
}
