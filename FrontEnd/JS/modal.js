// *******************************************//
// *			   FENETRES MODALES			*//
// *******************************************//

// récupération de l'API
const response=await fetch("http://localhost:5678/api/works");
const works=await response.json();


// ****** RECUPERATION DES IMAGES DANS LA 1ere MODALE ******* //

// fonction pour récupérer les images de l'API dans la fenêtre modale
function modalPhotos(works){
	// sélectionner la section de la fenêtre modale
	const photos=document.querySelector("#container-images");
	// vide le cache pour rafraichir l'apparition des images dans la fenêtre
	photos.innerHTML="";
	// boucle permettant d'itérer chaque ligne de l'API
	for(let i=0; i<works.length; i++){
		const img=works[i];
		// création d'une balise div
		const divPictures=document.createElement("div");
		// ajout d'une classe pictures à la balise div
		divPictures.classList.add("pictures");
		// Création d'une balise img
		const picture=document.createElement("img");
		// récupération de l'image dans l'API grace à l'attribut src et ajout de l'attribut alt avec le titre de l'image
		picture.src=img.imageUrl;
		picture.alt=img.title;
		// création d'une balise i pour la corbeille
		const trash=document.createElement("i");
		// ajout d'une classe contenant les noms de la corbeille
		trash.classList.add("fa-solid","fa-trash-can");
		// héritage des éléments créés
		photos.appendChild(divPictures)
		divPictures.appendChild(picture);
		divPictures.appendChild(trash);

		// SUPPRIMER UN WORK
		trash.addEventListener("click",async(e)=>{
			e.preventDefault();
			try{
			const deleteWork=await fetch(`http://localhost:5678/api/works/${img.id}`,{
				method:"DELETE",
				headers:{
					"Content-type":"*/*",
					"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY1MTg3NDkzOSwiZXhwIjoxNjUxOTYxMzM5fQ.JGN1p8YIfR-M-5eQ-Ypy6Ima5cKA4VbfL2xMr2MgHm4"
				}
			});
			if(deleteWork.ok){
				works.splice(i,1);
				alert("La suppression est un succés")
				modalPhotos(works);

			}else{
				console.error("Erreur lors de la suppression : ", deleteWork.status)
			}
		}catch(error){
			console.error("Erreur réseau: ", error);
		}
			
		});
	}

}
modalPhotos(works);


// ****** OUVRIR LA 1ere MODALE ******* //

// par défaut la modal n'est pas ouverte
let modal=null;

function openModal(e){
	// à l'ouverture de la fenêtre modale, le navigateur ne se recharge pas
	e.preventDefault();
	// récupération de l'attribut href de balise a. Cette dernière contient également une balise i, de fait il vaut mieux mettre currentTarget plutôt que Target,permettant ainsi de cliquer soit sur le a ou le i, la fenêtre s'ouvrira quand bien même
	const target=document.querySelector(e.currentTarget.getAttribute("href"));
	// suppression du style display:none
	target.style.removeProperty("display");
	// suppression de l'aria-hidden de la balise permettant ainsi d'être vu par les lecteurs d'écran
	target.removeAttribute("aria-hidden");
	// permet aux lecteurs d'écran de lire la fenêtre modale
	target.setAttribute("aria-modal", "true");
	// évite de rappeler à chaque fois document.querySelector
	modal=target;
	// ajoute un écouteur sur le clic (sur l'arrière plan) pour fermer la modal 
	modal.addEventListener("click",closeModal);
	// ajoute un écouteur sur le clic de la balise i (X)
	modal.querySelector(".modal-close").addEventListener("click", closeModal);
	modalPhotos(works);

}

// ****** FERMER LA 1ere MODALE ******* //

function closeModal(e){
	// vérifie avant d'exécuter la function si la fenêtre modale est fermée. Si tel est le cas alors l'exécution de la function s'arrête 
	if(modal === null) return
	// permet que la page ne se recharge pas
	e.preventDefault();
	// la fenêtre modale disparait de l'écran
	modal.style.display= "none";
	// remets l'attribut aria hidden à true pour éviter aux les lecteurs d'écran de la lire
	modal.setAttribute("aria-hidden", "true");
	// remets l'attribut aria hidden à true à la balise de façon qu'elle reste bloquée
	modal.removeAttribute("aria-modal");
	// supprime l'écouteur sur toute la modal (clic en arrière plan)
	modal.removeEventListener("click",closeModal);
	// supprime l'écouteur sur la balise i avec la classe .modal-close correspondant au X de la modal
	modal.querySelector(".modal-close").removeEventListener("click", closeModal);
	// la fenêtre modale revient à null donc fermée
	modal=null;
}
 
const modalModify=document.querySelector(".modify-modal a");
modalModify.addEventListener("click",openModal);


// ******************************************** //
// 		  AJOUTER UN WORK A L'API 		   //
// ******************************************** //


// ****** OUVRIR LA 2eme MODALE ******* //

let secondModal= null;
function openSecondModal(e){
	// à l'ouverture de la fenêtre modale, le navigateur ne se recharge pas
	e.preventDefault();
	// récupération de la 2ème fenêtre modale
	const modal2=document.querySelector("#modal2");
	// suppression du style display:none
	modal2.style.removeProperty("display");
	// suppression de l'aria-hidden de la balise permettant ainsi d'être vu par les lecteurs d'écran
	modal2.removeAttribute("aria-hidden");
	// permet aux lecteurs d'écran de lire la fenêtre modale
	modal2.setAttribute("aria-modal", "true");
	// évite de rappeler à chaque fois document.querySelector
	secondModal=modal2;
	// ajoute un écouteur sur le clic (sur l'arrière plan) pour fermer la modal 
// ? QUESTION: Demande de pouvoir fermer les modales aussi bien en 
	// secondModal.addEventListener("click",closeSecondModal);
	// ajoute un écouteur sur le clic de la balise i (X)
	secondModal.querySelector(".modal-close").addEventListener("click", closeSecondModal);
	// appel la function qui permet de revenir à la 1ère modale en cliquant sur la flèche de gauche <-
	secondModal.querySelector(".return-previous-modal").addEventListener("click", returnFirstModal);
	// function permettant de télécharges les catégories via l'API
	loadCategories();

}

// ****** REVENIR A LA 1ere MODALE ******* //

function returnFirstModal(e){
	e.preventDefault();
	// la fenêtre modale disparait de l'écran
	if(secondModal){
		secondModal.style.display= "none";
		// remets l'attribut aria hidden à true pour éviter aux les lecteurs d'écran de la lire
		secondModal.setAttribute("aria-hidden", "true");
		// remets l'attribut aria hidden à true à la balise de façon qu'elle reste bloquée
		secondModal.removeAttribute("aria-modal");
		secondModal=null;
	}
	const modal1=document.querySelector("#modal1");
	modal1.style.removeProperty("display");
	// remets l'attribut aria hidden à true pour éviter aux les lecteurs d'écran de la lire
	modal1.removeAttribute("aria-hidden");
	// remets l'attribut aria hidden à true à la balise de façon qu'elle reste bloquée
	modal1.setAttribute("aria-modal", "true");
	modal=modal1;
	// ajoute un écouteur sur le clic (sur l'arrière plan) pour fermer la modal 
	modal.addEventListener("click",closeModal);
	// ajoute un écouteur sur le clic de la balise i (X)
	modal.querySelector(".modal-close").addEventListener("click", closeModal);

}

// ****** FERMER LA 12eme MODALE ******* //

function closeSecondModal(e){
	// vérifie avant d'exécuter la function si la fenêtre modale est fermée. Si tel est le cas alors l'exécution de la function s'arrête 
	if(secondModal === null) return
	// permet que la page ne se recharge pas
	e.preventDefault();
	// la fenêtre modale disparait de l'écran
	secondModal.style.display= "none";
	// remets l'attribut aria hidden à true pour éviter aux les lecteurs d'écran de la lire
	secondModal.setAttribute("aria-hidden", "true");
	// remets l'attribut aria hidden à true à la balise de façon qu'elle reste bloquée
	secondModal.removeAttribute("aria-modal");
	// supprime l'écouteur sur toute la modal (clic en arrière plan)
	// secondModal.removeEventListener("click",closeSecondModal);
	// supprime l'écouteur sur la balise i avec la classe .modal-close correspondant au X de la modal
	secondModal.querySelector(".modal-close").removeEventListener("click", closeSecondModal);
	// la fenêtre modale revient à null donc fermée
	secondModal=null;
}


const openModal2=document.querySelector(".open-second-modal");
openModal2.addEventListener("click", openSecondModal);


// ****** TELECHARGEMENT DE L'IMAGE ******* //

function uploadImg(e){
	e.preventDefault();
	// const addPicture=document.querySelector("label[for='imageUrl']");
	const inputUpload=document.querySelector("#imageUrl");
	const photoInsert=document.querySelector(".photo-insert");
	inputUpload.click();
	// addPicture.addEventListener("click", (e)=>{
	// 	e.preventDefault();
	// 	inputUpload.click();
		
	// });
	// écouteur dès l'instant où je choisis une image via mon ordinateur
	inputUpload.addEventListener("change", (e) => {
		// récupération du 1er élément ciblé du tableau dans le fichier
		const file = e.target.files[0]; 
		// Si il n'y a pas de fichier récupéré alors on sort
		if (!file) return;

		// file.type décrit le type MIME du fichier(extensions) et la méthode startsWith permet de vérifier que le fichier commence par "image"
		if (!file.type.startsWith("image/")) {
		alert("Merci de choisir une image valide (jpg ou png)");
		return;
		}

		// Crée un aperçu de l’image
		const imgPreview = document.createElement("img");
		// crée une URL provisoire dans le navigateur pour que l'image s'affiche dans la modal
		imgPreview.src = URL.createObjectURL(file);
		imgPreview.style.maxHeight = "100%";
		imgPreview.style.width = "auto";
		// Remplace le contenu du bloc par l’image
		photoInsert.innerHTML = "";
		photoInsert.appendChild(imgPreview);
	});
	formValidation();


}
const addPicture=document.querySelector("label[for='imageUrl']");
addPicture.addEventListener("click", uploadImg);


// ****** TELECHARGEMENT DES CATEGORIES ******* //

async function loadCategories(){
	try{
		// récupération des catégories de l'API
		const category=await fetch("http://localhost:5678/api/categories");
		const categories=await category.json();
		// sélection du select des catégories
		const choiceCategory=document.querySelector("#categoryId");
		choiceCategory.innerHTML="";
		// création d'une balise option (pour chq cat.)
		const addOption=document.createElement("option");
		// dont la valeur par défaut n'affichera rien
		addOption.value="";
		// précise que la balise option est l'enfant de la balise select
		choiceCategory.appendChild(addOption);
		// pour chq cat.
		categories.forEach(cat => {
			// création d'une balise option
			const option=document.createElement("option");
			// dont la valeur sera id de la catégorie (intéressant pour le POST au besoin)
			option.value=cat.id;
			// et le nom de la catégorie
			option.textContent=cat.name;
			// précise que la balise option est l'enfant de la balise select
			choiceCategory.appendChild(option);
		});
		choiceCategory.addEventListener("change", formValidation);
	}catch (error){
		console.error("Erreur de l'API catégories : ", error);
	}

}

// ****** VALIDATION DU FORMULAIRE ******* //

function formValidation(){
	const title=document.querySelector("#title").value.trim();
	const choiceCategory=document.querySelector("#categoryId").value;
	const validateBtn=document.querySelector(".validate-btn");
	if(uploadImg && title && choiceCategory){
	validateBtn.style.backgroundColor="#1D6154";
	}
}

// ****** ENVOI DU FORMULAIRE A L'API ******* //

function addWork(){
	const formWork=document.querySelector(".form-work");
	formWork.addEventListener("submit",async (e)=>{
		e.preventDefault();
		const formData=new FormData(formWork);
		try{
		const response=await fetch("http://localhost:5678/api/works",{
			method:"POST",
			headers: {
				"Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY1MTg3NDkzOSwiZXhwIjoxNjUxOTYxMzM5fQ.JGN1p8YIfR-M-5eQ-Ypy6Ima5cKA4VbfL2xMr2MgHm4"
			},
			body: formData
		});
			if(response.ok){
				alert("Photo ajoutée avec succès.");
				const payload=await response.json();
				works.push(payload);
				modalPhotos(works);
				formWork.reset();
				document.querySelector(".photo-insert").innerHTML="";
			}else{
				alert("Erreur lors de l'ajout");
				console.error(response.status);
			}
		}catch(error){
			console.error("Erreur réseau : ", error);
			alert("Erreur de réseau");
		}
	});
 
}

// const validateBtn=document.querySelector(".validate-btn");
// validateBtn.addEventListener("click",addWork);
addWork();

console.log();
