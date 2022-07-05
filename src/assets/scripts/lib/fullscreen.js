  export default function openFullscreen(e) {
      if (e.requestFullscreen) {
          e.requestFullscreen();
      } else if (e.mozRequestFullScreen) { /* Firefox */
          e.mozRequestFullScreen();
      } else if (e.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
          e.webkitRequestFullscreen();
      } else if (e.msRequestFullscreen) { /* IE/Edge */
          e.msRequestFullscreen();
      }
  }