
const navLinks = document.querySelectorAll("nav a");
const currentPath = window.location.pathname;  // /index.html ou /login.html
const currentHash = window.location.hash;      // #portfolio ou #contact

navLinks.forEach(link => {
  const href = link.getAttribute("href");

  // Gestion de l'active pour la page courante

  if ((href === currentPath || href === currentHash || href.endsWith(currentHash)) && !(currentPath === "/index.html" && !currentHash)) {
    link.classList.add("active");
  }
  // Au clic, redirection si nécessaire et ajout de .active
  link.addEventListener("click", (e) => {
    navLinks.forEach(l => l.classList.remove("active")); // retire l'ancien active
    link.classList.add("active");

    // Si c'est un lien ancre vers la même page, on laisse le scroll normal
    if (href.startsWith("#") && currentPath === "/index.html") {
      return; // scroll normal
    }

    // Sinon, laisse le lien faire sa redirection normale
  });
});
