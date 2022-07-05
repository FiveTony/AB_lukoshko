import Negative from "../classes/Negative";
import Player from "../classes/Player";
import Positive from "../classes/Positive";
import UI_elements from "../classes/UI_elements";
import App from "../lib/app"

const app = new App()
const LEFT_LIMIT = 55;
const RIGHT_LIMIT = 500 - 55;
const HEARTS_MIN = 0;

const IS_BACKGROUND_DYNAMIC = true
const BACKGROUND_VELOCITY = 0.15
const ACCELERATION_BACKGROUND = 0.001

const MAX_SCORE = 50
const SCORE_STEP = 1
const HEARTS = 3
const IS_LEVEL_ANIMATION = true

// const ACCELERATION_STEP = 1

const PLAYER_DATA = {
  "playerScale": 0.7
}
const NEGATIVE_DATA = {
  "frequencyNegative": [1000, 1100],
  "maxNegativeOnLevel": 200,
  "isHorizontal": true,
  "velocity": [250, 300],
  "isRotation": true,
  "negativeScale": 0.5,
  "accelerationFrequency": 0.2
}
const POSITIVE_DATA = {
  "frequencyPositive": [1100, 1200],
  "maxPositiveOnLevel": 200,
  "isHorizontal": false,
  "velocity": [250, 300],
  "isRotation": true,
  "accelerationFrequency": 0.2
}

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("Game");
  }
  init() {
    this.width = this.game.config.width
    this.height = this.game.config.height
  }
  create() {
    this.createBackground();

    this.backgroundVelocity = BACKGROUND_VELOCITY;

    this.score = 0;
    this.hearts = HEARTS;
    this.level = 1;
    this.countScorePositive = 0;

    this.cursors = this.input.keyboard.createCursorKeys();
    this.player = new Player(
      this,
      this.width / 2,
      this.height - 100,
      "rocket",
      PLAYER_DATA
    )
      .setInteractive()
      .setVisible(false);

    this.isStart = false;
    this.afterStart();

    this.ui = new UI_elements(this, this.score, this.hearts);
    this.mute = false;
    this.createMusic();
    this.createSounds()
    this.onMusic();
    this.onPause();
  }
  update(timestep, dt) {
    this.stars.tilePositionY += -this.backgroundVelocity * dt;
    this.player.move(this.cursors);
  }
  afterStart() {
    let num = 3
    let text1 = this.add.text(this.game.config.width / 2,this.game.config.height / 2,`${num}`,{
      font: '50px AzbokaFont'
    }).setOrigin(0.5).setTint(0x124F2E);
    this.tweens.add({
      targets: text1,
      alpha: {
        from: 0.5,
        to: 1
      },
      ease: "Cubic",
      duration: 1200,
      yoyo: true,
      repeat: 1,
      onYoyo: ()=>{
        num--
        text1.setText(`${num}`)
      },
      onComplete: () => {
        text1.destroy()
        this.start();
      },
    });
  }
  start() {
    this.isStart = true;
    this.player.setVisible(true);
    this.object1 = new Negative(this, NEGATIVE_DATA);
    this.object2 = new Positive(this, POSITIVE_DATA);
    this.setDrag();
    this.addOverlap();
    try {gtag("event", "level_start", {});} catch (error) {}
    try {app.push('game', 'start')} catch (error) { console.log(error)}
  }
  createBackground() {
    var bg = this.add.graphics()
    .fillStyle(0x9ED081, 1)
    .fillRect(0, 0, this.width, this.height);
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
  setDrag() {
    this.input.setDraggable(this.player);
    this.input.dragDistanceThreshold = 15;
    this.input.on("drag", function (pointer, gameObject, dragX) {
      if (dragX > RIGHT_LIMIT) gameObject.x = RIGHT_LIMIT;
      else if (dragX < LEFT_LIMIT) gameObject.x = LEFT_LIMIT;
      else gameObject.x = dragX;
    });
  }
  addOverlap() {
    this.physics.add.overlap(
      this.object1,
      this.player,
      this.onOverlap,
      undefined,
      this
    );
    this.physics.add.overlap(
      this.object2,
      this.player,
      this.onOverlap,
      undefined,
      this
    );
  }
  onOverlap(source, target) {
    if ([source, target].find((item) => item.positive == true)) {
      this.score += SCORE_STEP;
      this.countScorePositive++;
      this.ui.rect2.setText(`${this.score}`);
      this.tweens.add({
        targets: this.ui.rect2,
        scale: {
          from: 1,
          to: 1.6
        },
        yoyo: true,
        repeat: 0,
        ease: "Power2",
        duration: 250
      });
      this.backgroundVelocity += ACCELERATION_BACKGROUND;
      this.tileVelocity += ACCELERATION_BACKGROUND;
      if (!this.mute) this.positive_sound.play()
    }
    if ([source, target].find((item) => item.positive == false)) {
      this.tweens.add({
        targets: source,
        alpha: 0.1,
        repeat: 1,
        ease: "Power2",
        yoyo: true,
        duration: 250,
        onComplete: function () {
          source.alpha = 1;
        },
      });
      this.cameras.main.shake(500, 0.01)
      this.hearts--;
      this.ui.rect4.setText(`${this.hearts}`);


      if (!this.mute) {
        switch (target.texture.key) {
          case "negative_01":
            this.negative_sound_4.play()
            break;
          case "negative_02":
            this.negative_sound_2.play()
            break;
          case "negative_03":
            this.negative_sound_1.play()
            break;
          case "negative_04":
            this.negative_sound_3.play()
            break;
        
          default:
            this.negative_sound_1.play()
            break;
        }
      }
    }
    if (this.hearts == HEARTS_MIN) {
      this.ui.heartsImg.setTexture("hearts_0");
      if (!this.mute) this.lose_game_sound.play()
      this.onDefeat();
    }
    if (this.score >= MAX_SCORE) {
      if (!this.mute) this.win_game_sound.play()
      this.onVictory();
    }
    target.setAlive(false);
  }
  onPause() {
    this.ui.play.on("pointerdown", () => {
      this.scene.pause();
      this.scene.launch("Pause");
    });
  }
  createMusic() { 
    if (this.mute) this.scene.get("Preload").main_theme.pause();
    else this.scene.get("Preload").main_theme.resume();
  }
  createSounds() {
    this.positive_sound = this.sound.add("positive", {
      mute: false,
      volume: 0.2,
      rate: 1,
      detune: 0,
      seek: 0,
      // loop: true,
      delay: 0,
    });
    this.negative_sound_1 = this.sound.add("negative1", {
      mute: false,
      volume: 0.4,
      rate: 1,
      detune: 0,
      seek: 0,
      // loop: true,
      delay: 0,
    });
    this.negative_sound_2 = this.sound.add("negative2", {
      mute: false,
      volume: 0.4,
      rate: 1,
      detune: 0,
      seek: 0,
      // loop: true,
      delay: 0,
    });
    this.negative_sound_3 = this.sound.add("negative3", {
      mute: false,
      volume: 0.4,
      rate: 1,
      detune: 0,
      seek: 0,
      // loop: true,
      delay: 0,
    });
    this.negative_sound_4 = this.sound.add("negative4", {
      mute: false,
      volume: 4,
      rate: 1,
      detune: 0,
      seek: 0,
      // loop: true,
      delay: 0,
    });
    this.lose_game_sound = this.sound.add("lose_game", {
      mute: false,
      volume: 0.2,
      rate: 1,
      detune: 0,
      seek: 0,
      // loop: true,
      delay: 0,
    });
    this.win_game_sound = this.sound.add("win_game", {
      mute: false,
      volume: 0.2,
      rate: 1,
      detune: 0,
      seek: 0,
      // loop: true,
      delay: 0,
    });
  }
  onMusic() {
    this.ui.sound.on("pointerdown", () => {
      if (this.mute == false) {
        this.ui.sound.setFrame("soundOff");
        this.mute = true;
        this.createMusic();
      } else {
        this.ui.sound.setFrame("soundOn");
        this.mute = false;
        this.createMusic();
      }
    });
  }
  onVictory() {
    this.scene.stop();

    // try {
    //   gtag("event", "level_end", {success: true});
    //   gtag("event", "post_score", { score: this.score });
    // } catch (error) {}
    // try {
    //   app.push("game", "end", {"score": this.score})
    // } catch (error) {}
    localStorage.setItem("complete", true)
    this.scene.start("PopupComplete", {
      score: this.score,
      hearts: this.hearts,
      status: "win",
    });
  }
  onDefeat() {
    // try {
    //   gtag("event", "level_end", {success: false});
    //   gtag("event", "post_score", { score: this.score });
    // } catch (error) {}
    // try {
    //   app.push("game", "end", {"score": this.score})
    // } catch (error) {}
    
    this.scene.stop();

    console.log(this.scene.manager.getScenes(), this.scene.get("Game"))

    this.scene.start("PopupComplete", {
      score: this.score,
      hearts: this.hearts,
      status: "lose",
    });
  }
}
