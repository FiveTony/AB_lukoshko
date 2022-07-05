import LoadingBar from "../classes/LoadingBar";
const WIDTH = 764;
const HEIGHT = 203;

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super("Preload");
  }
  preload() {
    this.createBackground();

    this.main_theme = this.sound.add("main_theme", {
      mute: false,
      volume: 0.2,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: true,
      delay: 0,
    });
    this.main_theme.play();

    // var loadingBar = new LoadingBar(this);
    var loadingBar = new LoadingBar(
      this,
      this.game.config.width / 2,
      408,
      320,
      30
    );
    this.preloadAssets();
  }
  create() {
    this.scene.start("Start");
  }
  createBackground() {
    var bg = this.add.graphics();
    bg.fillStyle(0x9ED081, 1)
    bg.fillRect(0, 0, 500, 800);

    this.stars = this.add
      .tileSprite(
        0,
        0,
        this.game.config.width,
        this.game.config.height,
        "stars"
      )
      .setOrigin(0);
  }
  preloadAssets() {
    this.load.setBaseURL(document.location.origin + document.location.pathname);
    this.load.image("rocket", "src/assets/sprites/player.png");

    this.load.audio("positive", "src/assets/sounds/positive.mp3");
    this.load.audio("negative1", "src/assets/sounds/negative_1.mp3");
    this.load.audio("negative2", "src/assets/sounds/negative_2.mp3");
    this.load.audio("negative3", "src/assets/sounds/negative_3.mp3");
    this.load.audio("negative4", "src/assets/sounds/negative_4.mp3");
    this.load.audio("lose_game", "src/assets/sounds/defeat.mp3");
    this.load.audio("win_game", "src/assets/sounds/win.mp3");

    this.load.image("positive_01", "src/assets/sprites/positive_01.png");
    this.load.image("positive_02", "src/assets/sprites/positive_02.png");
    this.load.image("positive_03", "src/assets/sprites/positive_03.png");

    this.load.image("negative_01", "src/assets/sprites/negative_01.png");
    this.load.image("negative_02", "src/assets/sprites/negative_02.png");
    this.load.image("negative_03", "src/assets/sprites/negative_03.png");
    this.load.image("negative_04", "src/assets/sprites/negative_04.png");

    this.load.image("hearts_0", "src/assets/sprites/hearts_0.png");

    this.load.atlas(
      "ui_spritesheet",
      "src/assets/sprites/ui_spritesheet.png",
      "src/assets/sprites/ui_spritesheet.json"
    );

  }
}
