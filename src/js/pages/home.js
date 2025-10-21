import { HOME } from "../config.js";


/// Playing video
var tag = document.createElement('script');
tag.src = 'https://www.youtube.com/player_api';

var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var vid = HOME.vids;
var currVid = Math.floor(Math.random() * vid.length);
var tv;

window.onYouTubePlayerAPIReady = function () {
  tv = new YT.Player('tv', {
    events: {
      'onReady': onPlayerReady
    },
    playerVars: HOME.playerDefaults
  });
}

function onPlayerReady() {
  playCurrentVideo();

  tv.mute();

  startEndWatcher();
}

function playCurrentVideo() {
  tv.loadVideoById(vid[currVid]);
  tv.seekTo(vid[currVid].startSeconds);
}

function startEndWatcher() {
  setInterval(() => {
    if (!tv || typeof tv.getCurrentTime !== 'function') return;

    let time = tv.getCurrentTime();
    if (time >= vid[currVid].endSeconds - 0.5) {
      nextVideo();
    }
  }, 500);
}

function nextVideo() {
  currVid = (currVid + 1) % vid.length;
  playCurrentVideo();
}