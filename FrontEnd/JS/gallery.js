// récupération de l'API
const response=await fetch("http://localhost:5678/api/works");
const works=await response.json();

// fonction permettant de récupérer les travaux
function generateWorks(works){
	// déclaration de la section contenant les images
	const gallery=document.querySelector(".gallery");
	// permet de vider le cache avant de réafficher les images par rapport aux boutons des filtres par catégorie
	gallery.innerHTML=" ";

	for (let i=0; i<works.length; i++){
		const work=works[i];
		// création des éléments pour contruire la gallery
		const figureElement=document.createElement("figure");
		const imageElement=document.createElement("img");
		// récupération de l'image via l'API
		imageElement.src=work.imageUrl;
		imageElement.alt=work.title;
		const textElement=document.createElement("figcaption");
		// récupération du texte via l'API
		textElement.innerText=work.title;
		
		// rattachement de chacun des éléments à la galerie
		gallery.appendChild(figureElement);
		figureElement.appendChild(imageElement);
		figureElement.appendChild(textElement);

	}
};
// appel de la fonction afin que les travaux apparaissent à l'écran
generateWorks(works);


// *******************************************//
// *			FILTRES PAR CATEGORIE		*//
// *******************************************//

// CREATION DES BOUTONS//

const filter=document.querySelector(".filter");
// création d'un bouton Tous
const allCategories=document.createElement("button");
allCategories.innerText="Tous";
allCategories.dataset.categoryId="all";
allCategories.classList.add("filter-btn");
// met le bouton Tous avant les autres boutons
filter.prepend(allCategories);
// récupération via l'API de toutes les catégories
const categories=works.map(work=>work.category);
// suppression des doublons en créant un nouveau tableau
const uniqueCategory=[...new Map(categories.map(cat=>[cat.id,cat])).values()];
// création d'un bouton pour chaque catégorie
uniqueCategory.forEach(cat=>{
	const btnElement=document.createElement("button");
	btnElement.innerText=cat.name;
	btnElement.dataset.categoryId=cat.id;
	btnElement.classList.add("filter-btn")
	filter.appendChild(btnElement);
});

// ACTIVATION DE CHAQUE BOUTON AU CLIC //

document.querySelectorAll(".filter button").forEach(button=>{
	button.addEventListener("click", ()=>{
		document.querySelectorAll(".filter button").forEach(btn => btn.classList.remove("active"));
		button.classList.add("active");

		const categoryId=button.dataset.categoryId
		if(categoryId==="all"){
			generateWorks(works);
		}else{
			const filteredWorks=works.filter(work=>work.category.id==categoryId);
			generateWorks(filteredWorks);
		}
		
	});
});

