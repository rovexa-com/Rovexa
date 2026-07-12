const counters = document.querySelectorAll(".counter");
const statsSections = document.querySelectorAll(".stats");

function animateCounter(counter) {
  const target = Number(counter.dataset.target);
  const suffix = counter.dataset.suffix || "";

  let current = 0;
  const increment = target / 100;

  function updateCounter() {
    current += increment;

    if (current < target) {
      counter.textContent = Math.ceil(current) + suffix;
      requestAnimationFrame(updateCounter);
    } else {
      counter.textContent = target + suffix;
    }
  }

  updateCounter();
}

statsSections.forEach(section => {
  let hasAnimated = false;

  window.addEventListener("scroll", () => {
    if (hasAnimated) return;

    const rect = section.getBoundingClientRect();

    if (rect.top < window.innerHeight * 0.8) {
      hasAnimated = true;

      section.querySelectorAll(".counter").forEach(counter => {
        animateCounter(counter);
      });
    }
  });

  // If the section is already visible when the page loads
  const rect = section.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.8 && !hasAnimated) {
    hasAnimated = true;

    section.querySelectorAll(".counter").forEach(counter => {
      animateCounter(counter);
    });
  }
});