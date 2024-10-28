declare const $: any;
export function initilializeAudio(e: any,src:string) {
  var audio: HTMLAudioElement | any = new Audio();

  if (audio.canPlayType('audio/mpeg;')) {
    audio.type = 'audio/mpeg';
    audio.src = src;
  } else {
    audio.type = 'audio/ogg';
    audio.src = src;
  }

  // Preload Audio File so we can display the duration
  audio.preload = 'auto';

  var $this = $(e.target);

  // Toggle Button Icons
  console.log($this)
  $this.toggleClass('playing');

  if ($this.hasClass('playing')) {
    audio.play();
  } else {
    audio.pause();
  }
  
}
