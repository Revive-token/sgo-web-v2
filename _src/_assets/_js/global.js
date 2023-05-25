let scrollPosition = window.scrollY;
const navbar = document.getElementsByClassName("navbar")[0];
const navMenu = document.getElementsByClassName("navbar__wrapper")[0];
const menuToggle = document.getElementsByClassName("navbar__toggle-menu")[0];


window.addEventListener("scroll", function () {
    scrollPosition = window.scrollY;
  
    if (scrollPosition >= 100) {
        navbar.classList.add("navbar--fixed");
    } else {
        navbar.classList.remove("navbar--fixed");
    }
});

function openMenu() {
    navMenu.classList.toggle('navbar__wrapper--show')
    menuToggle.classList.toggle('navbar__toggle-menu--open')
}
