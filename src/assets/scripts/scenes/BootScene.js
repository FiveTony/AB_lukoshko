export default class BootScene extends Phaser.Scene {
  constructor() {
    super("Boot", {});
  }
  preload() {
    this.load.setBaseURL(document.location.origin + document.location.pathname);
    this.load.image("stars", "src/assets/sprites/stars2.png");
    this.load.bitmapFont('azbokaFont', 'src/assets/fonts/azbokaFont.png', 'src/assets/fonts/azbokaFont.xml');
    this.load.audio("main_theme", "src/assets/sounds/main_theme.mp3");
  }
  create() {
    this.createBackground();
    this.scene.start("Preload");
  }
  createBackground() {
    var bg = this.add.graphics()
      .fillStyle(0x9ED081, 1)
      .fillRect(0, 0, 500, 800);
  }
}
