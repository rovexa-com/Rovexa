window.addEventListener("scroll", function () {
  let scrollY = window.scrollY;

  document.querySelector(".back").style.transform =
    `translateY(${scrollY * 0.4}px)`;

  document.querySelector(".mid").style.transform =
    `translateY(${scrollY * 0.4}px)`;

  document.querySelector(".front").style.transform =
    `translateY(${scrollY * 0.7}px)`;

});