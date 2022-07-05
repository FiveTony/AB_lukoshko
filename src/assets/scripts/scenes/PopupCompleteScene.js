const POPUP_WIN_WIDTH = 350
const POPUP_WIN_HEIGHT = 450

export default class PopupCompleteScene extends Phaser.Scene {
    constructor() {
        super('PopupComplete')
    }
    create(data) {
        const text_score = document.querySelectorAll(".score");
        text_score.forEach((score)=>{
            score.innerHTML = `Ваш результат&nbsp;&mdash; ${data.score}`
        })
        const btn_reboot = document.querySelectorAll(".reboot");
        btn_reboot.forEach(btn => {
            btn.addEventListener( "click",
            function (e) {
                document.location.reload()
            })
        })

        this.createBackground()
        if (data.status == 'win')
            this.popupWinShow(data.score)
        else if (data.status == 'lose')
            this.popupLoseShow(data.score)
    }
    createBackground() {
        var bg = this.add.graphics()
        bg.fillStyle(0x0B081A, 0.8)
        bg.fillRect(0, 0, this.game.config.width, this.game.config.height)
        this.stars = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, 'stars').setOrigin(0)
    }
    popupWinShow(score) {
      const popupWin = document.querySelector(".popup-you_win");

      document.body.style.overflow = "hidden";
      popupWin.style.display = "flex"; 

      const btnPrise = document.getElementById("prise");
      const btnPrise2 = document.getElementById("prise_2");
      const btnAgain_1 = document.getElementById("play_again_1");
      
    btnPrise.addEventListener(
        "click",
        function (e) {
            
            document.location.href = 'results'
        })
    btnPrise2.addEventListener(
        "click",
        function (e) {
            document.location.href = 'results'
        })
    btnAgain_1.addEventListener(
        "click",
        function (e) {
            popupWin.style.display = "none";
            this.scene.start('Game', {status: 'first'})
        }.bind(this))
    }
    popupLoseShow(score) {
      const popupLose = document.querySelector(".popup-try_again");

      document.body.style.overflow = "hidden";
      popupLose.style.display = "flex"; 

      const btnAgain_2 = document.getElementById("play_again_2");
      const go_av = document.getElementById("go_av");
      btnAgain_2.addEventListener(
        "click",
        function (e) {
            popupLose.style.display = "none"; 
            this.scene.start('Game', {status: 'first'})
        }.bind(this))

      go_av.addEventListener(
        "click",
        function (e) {
            document.location.href = 'https://av.ru/' 
        })
  }

}