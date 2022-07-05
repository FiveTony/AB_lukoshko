export default class LoadingBar {
  constructor(scene, x, y, width, height) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.style = {
      boxColor: 0x595dcc,
      box2Color: 0xe6e6e6,
      barColor: 0x035929,
      boxX: 0,
      boxY: 0,
      boxWidth: this.width,
      boxHeight: this.height,
    };
    this.progressBox = this.scene.add.graphics();
    this.progressBox2 = this.scene.add.graphics();
    this.progressBar = this.scene.add.graphics();
    this.showProgressBox();
    this.setEvents();
    this.createText();
  }
  setEvents() {
    this.scene.load.on("progress", this.showProgressBar, this);
    this.scene.load.on("complete", this.onLoadComplete, this);
  }
  showProgressBox() {
    this.progressBox2
      .fillStyle(0x124F2E)
      .fillRoundedRect(84, 408, 325, 36, 10);
  }
  showProgressBar(value) {
    this.progressBar 
      .clear() 
      .fillStyle(0x39B84E, 1)
      .fillRoundedRect(90, 413, 314 * value, 26, 10);
  }
  onLoadComplete() {
    this.progressBar.destroy();
    this.progressBox.destroy();
    this.progressBox2.destroy();
  }
  createText() {
    this.playText = this.scene.add.text(this.scene.game.config.width / 2, 342, 'Подождите...', {
      font: '32px AzbokaFont'
  }).setOrigin(0.5).setTint(0x124F2E)
  }
}
