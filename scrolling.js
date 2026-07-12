function smoothScroll(target, duration) {
  const targetElement = document.querySelector(target);
  const start = window.pageYOffset;
  const end = targetElement.offsetTop;
  const distance = end - start;

  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;

    const run = ease(timeElapsed, start, distance, duration);
    window.scrollTo(0, run);

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }

  function ease(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }

  requestAnimationFrame(animation);
}

// use it
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    smoothScroll(this.getAttribute('href'), 800);
  });
});