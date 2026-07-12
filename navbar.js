

//Preloader//

window.addEventListener("load", function(){
  const preloader = document.getElementById("preloader");
  if(preloader){
    preloader.style.display = "none";
  }
});






const hamburger = document.querySelector(".hamburger");
const nav_links = document.querySelector(".nav_links");

console.log("hamburger:", hamburger);
console.log("nav_links:", nav_links);

hamburger.addEventListener("click", () => {
    console.log("clicked");
    hamburger.classList.toggle("active");
    nav_links.classList.toggle("active");
});




window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".navbar");
  const navContainer = document.querySelector(".nav-container");

  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
    navContainer.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
    navContainer.classList.remove("scrolled");
  }
});




const cards = document.querySelectorAll(".fade-in");

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      observer.unobserve(entry.target);
    }

  });
});

cards.forEach((card) => {
  observer.observe(card);
});






