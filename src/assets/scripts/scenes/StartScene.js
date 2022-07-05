const HEARTS = 3

export default class StartScene extends Phaser.Scene {
  constructor() {
    super("Start");
  }
  init() {
    this.width = this.game.config.width
    this.height = this.game.config.height
  }
  create(data) {
    this.createBackground();
    this.createAnimation();
    this.setEvents();
  }
  createBackground() {
    this.bg = this.add
      .graphics()
      .fillStyle(0x9ED081, 1)
      .fillRect(0, 0, 500, 800);
    this.stars = this.add
      .tileSprite(
        0,
        0,
        this.width,
        this.height,
        "stars"
      )
      .setOrigin(0);
  }
  setEvents() {
    this.input.on("pointerdown", () => this.launchGame());
    this.input.keyboard.on("keydown", () => this.launchGame());
  }
  restartGame(data) {
    this.scene.stop();
    this.scene.start("PopupComplete", { status: "lose", data: data });
  }
  createAnimation() {
    let text = this.add
      .text(this.width / 2, this.height / 2, "НАЧАТЬ", {
        font: "bold 40px AzbokaFont",
        fill: "#124F2E",
      })
      .setOrigin(0.5)
      .setAlpha(0).setTint(0xF1A901, 0xF1A901, 0xFFE305, 0xFFE305);
    this.tweens.add({
      targets: text,
      alpha: 1,
      scale: { from: 0.2, to: 1 },
      ease: "Quart",
      rotation: 2 * Math.PI,
      duration: 3000,
    });
  }
  launchGame() {
    this.scene.start("Game", {
      score: 0,
      hearts: HEARTS,
      status: "first",
    });
  }
}
