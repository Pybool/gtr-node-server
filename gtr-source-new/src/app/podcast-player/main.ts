import { WindowRef } from "../_service/windowRef.service";

declare const $: any;
let audioContext: AudioContext | null = null;
let currentAudio: HTMLAudioElement | null = WindowRef.prototype.nativeWindow.audioContext;
let activePlaying:boolean = false;

function createNewAudioContext(): AudioContext {
  // If an existing AudioContext exists, close it
  if (audioContext) {
    audioContext.close().then(() => {
      console.log('Previous AudioContext closed');
    }).catch((error) => {
      console.error('Error closing AudioContext:', error);
    });
  }

  // Create a new AudioContext
  audioContext = new AudioContext();
  return audioContext;
}

export function initilializeAudio(src: string) {
  // If there's currently playing audio, stop it and destroy the instance
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0; // Reset the audio to the beginning
    currentAudio = null;
  }

  // Create new audio instance
  const audio: HTMLAudioElement | any = WindowRef.prototype.nativeWindow.audioContext || new Audio();

  // Store the current audio instance
  currentAudio = audio;

  if (audio.canPlayType('audio/mpeg;')) {
    audio.type = 'audio/mpeg';
    audio.src = src;
  } else {
    audio.type = 'audio/ogg';
    audio.src = src;
  }

  const $playback = $('#playback');
  const $progressBar = $('.audio-player-progress-bar');
  const $volumeBar = $('.audio-volume-bar');

  // Preload Audio File so we can display the duration
  audio.preload = 'auto';

  // Show Total Duration
  audio.addEventListener('loadeddata', function () {
    if (audio.readyState >= 2) {
      $('.audio-time').text(showTime(audio.duration));
    }
  });

  $playback.on('click', function (e) {
    e.preventDefault();
    const pauseBtnIcon = document.querySelector('._pause') as any;
    const playBtnIcon = document.querySelector('._play') as any;    

    const $this = $(this);

    // Toggle Button Icons
    $this.toggleClass('playing');

    if ($this.hasClass('playing')) {
      audio.play()
      WindowRef.prototype.nativeWindow.activePlaying = true;
      WindowRef.prototype.nativeWindow.audioContext = currentAudio;
      activePlaying = true;
    } else {
      audio.pause();
      WindowRef.prototype.nativeWindow.activePlaying = false;
    }
    if (playBtnIcon && pauseBtnIcon) {
      if (WindowRef.prototype.nativeWindow.activePlaying) {
        pauseBtnIcon.style.display = 'block';
        playBtnIcon.style.display = 'none';
        
      } else {
        pauseBtnIcon.style.display = 'none';
        playBtnIcon.style.display = 'block';
      }
    }
  });

  // Convert number to Time
  function showTime(s: number) {
    const m = Math.floor(s / 60); //Get whole minutes
    s -= m * Math.floor(60);
    return (
      (m < 10 ? '0' + Math.floor(m) : Math.floor(m)) +
      ':' +
      (s < 10 ? '0' + Math.floor(s) : Math.floor(s))
    ); //zero padding on minutes and seconds
  }

  // Get Current Time of playback
  audio.ontimeupdate = function () {
    updateCurrentTime();
  };

  function updateCurrentTime() {
    if (audio.currentTime > 0) {
      let value = (100 / audio.duration) * audio.currentTime;

      $progressBar.css({
        width: value + '%',
      });
    }

    // Update Current Time
    $('.audio-time').text(showTime(audio.currentTime));
  }

  audio.addEventListener('timeupdate', updateProgress, false);

  function updateProgress() {
    // CHANGING TIME ON PROGRESS BAR
    $('.audio-player-progress.audio-player-progress').bind(
      'click',
      function (e) {
        const $div = $(e.target);
        const offset = $div.offset();
        const x = e.clientX - offset.left;

        const newtime =
          (x / $('.audio-player-progress').width()) * audio.duration;

        audio.currentTime = newtime;

        $progressBar.css({
          width: x + '%',
        });
      }
    );
  }

  // VOLUME CONTROL
  function setVolume() {
    audio.volume = 0.75;

    $volumeBar.css({
      width: audio.volume * 100 + '%',
    });
  }
  setVolume();

  audio.addEventListener('volumechange', changeVolume, false);

  function changeVolume() {
    // CHANGING VOLUME ON VOLUME BAR
    $('.audio-volume.audio-volume').bind('click', function (e) {
      const $div = $(e.target);
      const offset = $div.offset();
      const x = Math.floor(e.clientX - offset.left);

      const newVolume = x / $('.audio-volume').width();

      audio.volume = newVolume;

      $volumeBar.css({
        width: audio.volume * 100 + '%',
      });
    });
  }

  return activePlaying;
}

export function appearElems() {
  // Current Scroll Position
  let curPos = $(window).scrollTop();
  // Bottom of Window
  let windowBottom = $(window).height();
  // Within Viewport
  let bottomPos = curPos + windowBottom;
  // Element to affect
  const $appearElem = $('[data-appear]');

  // Animation Delays
  const $delay = $('[data-appear-delay]');
  if ($delay.length > 0) {
    $delay.each(function () {
      const $delayElem = $(this);

      $delayElem.css({
        'transition-delay': $delayElem.attr('data-appear-delay') + 'ms',
      });
    });
  }

  // Make the element appear when it enters the viewport or is already above
  // the viewport
  function makeAppear() {
    const elemPos = $(this).offset().top;
    const firePos = curPos - 60;

    if (elemPos < bottomPos && (elemPos >= firePos || elemPos < firePos)) {
      $(this).addClass('has-appeared');
    }
  }

  $appearElem.each(makeAppear);
  $(window).on('scroll', function () {
    // Current Scroll Position
    curPos = $(window).scrollTop();
    // Bottom of Window
    windowBottom = $(window).height();
    // Within Viewport
    bottomPos = curPos + windowBottom;
    $appearElem.each(makeAppear);
  });

  console.log("Player Boss");
}
