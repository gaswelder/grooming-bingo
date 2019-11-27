const sounds = {
  ding: new Audio(
    "https://freesound.org/data/previews/484/484344_5121236-lq.mp3"
  ),
  pop: new Audio(
    "https://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3"
  )
};

export const play = name => {
  sounds[name].currentTime = 0;
  sounds[name].play();
};
