const token = sessionStorage.getItem("token");

// +++++++++++++++++++++++++++++++++++++//
// 		BARRE DE NAVIGATION			//
// +++++++++++++++++++++++++++++++++++++//


const navLinks = document.querySelectorAll("nav a");
const currentPath = window.location.pathname;
const currentHash = window.location.hash;

// STYLE GRAS DES MENUS SI LIEN ACTIF // 

// pour chaque lien du menu
navLinks.forEach(link => {
	// récupère l'attribut href
	const href = link.getAttribute("href");
	if(token){
		if ((href === currentPath || href === currentHash || href.endsWith(currentHash)) && !(currentPath === "/index.html" && !currentHash)) {
			// alors mettre la classe active sur le lien
			link.classList.add("active");
		}
	}
	// si l'attribut href contient pathname ou hash ou le has de la page actuelle et si le path de la page actuelle n'est pas index.htm et n'a pas de hash de la page actuelle
	// au clic du lien
	link.addEventListener("click", (e) => {
		// supprime la classe active de tous les liens pour ne garder qu'un seul actif
		navLinks.forEach(l => l.classList.remove("active"));
		// ajoute une classe active sur le lien que l'utilisateur a cliqué
		link.classList.add("active");
		// si l'attribut href contient une ancre et que le Pathname de la page courante est également à la page index.html
		if (href.startsWith("#") && currentPath === "/index.html") {
			alors
			// quitte la fonction
			return; 
		}
	});
});

