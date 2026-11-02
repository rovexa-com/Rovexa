(() => {
  "use strict";
  const player = document.getElementById("demoPlayer");
  const video  = document.getElementById("demoVideo");
  const btn    = document.getElementById("demoPlay");
  if (!player || !video || !btn) return;

  btn.addEventListener("click", () => {
    video.controls = true;
    player.classList.add("is-playing");
    const p = video.play();
    if (p && p.catch) p.catch(() => { player.classList.remove("is-playing"); video.controls = false; });
  });

  video.addEventListener("ended", () => {
    video.controls = false;
    video.currentTime = 0;
    player.classList.remove("is-playing");
  });
})();
