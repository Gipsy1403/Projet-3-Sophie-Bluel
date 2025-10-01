// import des fonctions WORKS ET GENERAWORKS du fichier gallery.js
import { works, generateWorks } from "./gallery.js";


const token = sessionStorage.getItem("token");


// ******************************************** //
// 			   FENETRES MODALES 	        //
// ******************************************** //

// ****** MESSAGES DES MODALES ******* //

const modal1Message=document.querySelector(".modal1-message");
const modal2Message=document.querySelector(".modal2-message");
// permet de faire apparaitre des messages pendant 3 secondes
function showModalMessage(modalMessage,msg, duration = 3000) {
	modalMessage.innerText = msg;
	modalMessage.style.display = "block";
	setTimeout(() => {
	modalMessage.style.display = "none";
	}, duration);
}

// ****** RECUPERATION DES IMAGES DANS LA 1ere MODALE ******* //

// fonction pour récupérer les images de l'API dans la fenêtre modale
export function modalPhotos(){
	// vérifie que work existe bien sinon stoppe la function
	if (!works || works.length === 0) return;
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
		// au clic sur une corbeille
		trash.addEventListener("click",async(e)=>{
			// la page ne se recharge pas
			e.preventDefault();
			// récupération dans l'API du Work par son identifiant afin de le supprimer
			try{
				const deleteWork=await fetch(`http://localhost:5678/api/works/${img.id}`,{
					method:"DELETE",
					headers:{
						"Authorization": `Bearer ${token}`
					}
				});
				// si la suppression est coorecte
				if(deleteWork.ok){
					// récupère chaque élément du tableau works afin de vérifier si id de l'élément est égal à img.id
					const index = works.findIndex(work => work.id === img.id);
					// si l'index est supérieur ou également à 0 alors on supprime un seul élément correspondant à l'index trouvé 
					if (index > -1) works.splice(index, 1);
					// message si succès
					showModalMessage(modal1Message,"La suppression est un succés");
					// suppression de la div contenant le work supprimé précédemment
					divPictures.remove();
					// rafraichit les travaux dans la gallerie
					generateWorks(works);
					// rafraichit les travaux dans la modale 1
					modalPhotos();

				}else{
					showModalMessage(modal1Message,"la suppression n'a pas pu se faire.");
					console.error("Erreur lors de la suppression : ", deleteWork.status)
				}
			}catch(error){
				console.error("Erreur réseau: ", error);
			}
		});
	}
}
modalPhotos();


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
	// permet aux lecteurs d'écran de lire seulement la fenêtre modale
	target.setAttribute("aria-modal", "true");
	// permet de savoir que la modale est actuellement ouverte, ainsi permettant de la manipuler (fermer,écouteurs...)
	modal=target;
	// évite de refermer la fenêtre si je clique sur le contenu
	modal.querySelector(".modal-wrapper").addEventListener("click", e => e.stopPropagation());
	// ajoute un écouteur sur le clic (sur l'arrière plan) pour fermer la modal 
	modal.addEventListener("click",closeModal);
	// ajoute un écouteur sur le clic de la balise i (X)
	modal.querySelector(".modal-close").addEventListener("click", closeModal);
	// rafraichit les works de la modale 1
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
	// remets l'attribut aria hidden à true pour éviter d'être vu par les lecteurs d'écran
	modal.setAttribute("aria-hidden", "true");
	// supprime l'attribut aria modal de façon que les lecteurs d'écran ne puissent plus lire la modale
	modal.removeAttribute("aria-modal");
	// supprime l'écouteur sur toute la modale (clic en arrière plan)
	modal.removeEventListener("click",closeModal);
	// supprime l'écouteur sur la balise i avec la classe .modal-close correspondant au X de la modale
	modal.querySelector(".modal-close").removeEventListener("click", closeModal);
	// la fenêtre modale revient à null donc fermée
	modal=null;
}
 
const modalModify=document.querySelector(".modify-modal a");
if (!token) {
	modalModify.addEventListener("click", (e) => {
	e.preventDefault();
	alert("Veuillez vous connecter pour accéder à cette fonctionnalité.");
	});
} else {
	modalModify.addEventListener("click",openModal);
}


// ******************************************** //
// 		  AJOUTER UN WORK A L'API 		   //
// ******************************************** //


// ****** OUVRIR LA 2eme MODALE ******* //

let secondModal= null;
function openSecondModal(e){
	// à l'ouverture de la fenêtre modale, le navigateur ne se recharge pas
	e.preventDefault();
	// fermeture de la 1ère modale
	const modal1 = document.querySelector("#modal1");
	modal1.style.display = "none";
	modal1.setAttribute("aria-hidden", "true");
	modal1.removeAttribute("aria-modal");
	// récupération de la 2ème fenêtre modale
	const modal2=document.querySelector("#modal2");
	// suppression du style display:none
	modal2.style.removeProperty("display");
	// suppression de l'aria-hidden de la balise permettant ainsi d'être vu par les lecteurs d'écran
	modal2.removeAttribute("aria-hidden");
	// permet aux lecteurs d'écran de lire seulement la fenêtre modale
	modal2.setAttribute("aria-modal", "true");
	// permet de savoir que la modale est actuellement ouverte, ainsi permettant de la manipuler (fermer,écouteurs...)
	secondModal=modal2;
	// empêche la propagation du clic dans le corps de la modale pour éviter que cela ne la ferme
	secondModal.querySelector(".modal-wrapper").addEventListener("click", e => e.stopPropagation());
	// ajoute un écouteur sur le clic de la balise i (X)
	secondModal.querySelector(".modal-close").addEventListener("click", closeSecondModal);
	// ferme la modale au clic de l'arrière plan
	secondModal.addEventListener("click", closeSecondModal);
	// appel de la fonction pour revenir à la 1ère modale en cliquant sur la flèche de gauche <-
	secondModal.querySelector(".return-previous-modal").addEventListener("click", returnFirstModal);
	// function permettant de récupérer les catégories via l'API
	loadCategories();

}

// ****** REVENIR A LA 1ere MODALE ******* //

function returnFirstModal(e){
	e.preventDefault();
	// la 2ème modale disparait de l'écran
	closeSecondModal(e);
	const modal1=document.querySelector("#modal1");
	modal1.style.removeProperty("display");
	// permet aux lecteurs d'écran de voir la modale
	modal1.removeAttribute("aria-hidden");
	// remets l'attribut aria modal à true de façon que le lecteur d'écran reste seulement dans la modale
	modal1.setAttribute("aria-modal", "true");
	modal=modal1;
	// permet de cliquer à l'intérieur de la modale sans qu'elle se ferme
	modal.querySelector(".modal-wrapper").addEventListener("click", e => e.stopPropagation());
	// ajoute un écouteur sur le clic (sur l'arrière plan) pour fermer la modal 
	modal.addEventListener("click", closeModal);
	// ajoute un écouteur sur le clic de la balise i (X)
	modal.querySelector(".modal-close").addEventListener("click", closeModal);
	// rafraichit la gallerie et la modale 1
	generateWorks();
	modalPhotos();
}

// ****** FERMER LA 2eme MODALE ******* //

function closeSecondModal(e){
	// vérifie avant d'exécuter la function si la fenêtre modale est fermée. Si tel est le cas alors l'exécution de la function s'arrête 
	if(secondModal === null) return
	// la page ne se recharge pas
	e.preventDefault();
	// réinitialisation du formulaire
	form.reset();
	// retrait de la classe enabled du bouton
	validateBtn.classList.remove("enabled");
	// récupère la balise img de la div
	const preview = photoInsert.querySelector("img");
	// si il y a une balise img
	if (preview) {
		// alors la supprimer 
		photoInsert.removeChild(preview);
	}
	// pour chaque élément i, label et span récupérés, les faire apparaitre dans la modale
  	photoInsert.querySelectorAll("i, label, span").forEach(el => el.style.display = "block");
	// la fenêtre modale disparait de l'écran
	secondModal.style.display= "none";
	// remets l'attribut aria hidden à true pour éviter aux lecteurs d'écran de la voir
	secondModal.setAttribute("aria-hidden", "true");
	// supprime l'attribut aria-modal afin que les lecteurs d'écran ne puissent plus lire la modale
	secondModal.removeAttribute("aria-modal");
	// supprime l'écouteur sur toute la modal (clic en arrière plan)
	secondModal.removeEventListener("click",closeSecondModal);
	// supprime l'écouteur sur la balise i avec la classe .modal-close correspondant au X de la modal
	secondModal.querySelector(".modal-close").removeEventListener("click", closeSecondModal);
	// la fenêtre modale revient à null donc fermée
	secondModal=null;
}


const openModal2=document.querySelector(".open-second-modal");
openModal2.addEventListener("click", openSecondModal);


// ****** GESTION DE FORMULAIRE ******* //

// récupération des éléments du formulaire 
const sndModal=document.querySelector("#modal2");
const form=document.querySelector(".form-work");
const inputImage=document.querySelector("#imageUrl");
const inputTitle=document.querySelector("#title");
const categoryId=document.querySelector("#categoryId");
const photoInsert=document.querySelector(".photo-insert");
const validateBtn=document.querySelector(".validate-btn");

// fontion permettant d'activer ou non le bouton valider
function checkForm() {
	// récupère le premier fichier que l'utilisateur a choisi. Files détient le nom, la taille et le type de l'image
	const image=inputImage.files[0];
	const title=inputTitle.value.trim();
	const category=categoryId.value;
	
	if (image && title && category) {
		validateBtn.classList.add("enabled");
		} else {
		validateBtn.classList.remove("enabled");
		}
}
// lorsqu'un des éléments change alors la fonction checkForm est appelée
inputImage.addEventListener("change", checkForm);
inputTitle.addEventListener("input", checkForm);
categoryId.addEventListener("change", checkForm);

// lorsqu'il y a une intervention sur l'input de l'image
inputImage.addEventListener("change", () => {
	// récupération du 1er fichier choisit par l'utilisateur
	const file = inputImage.files[0];
	// s'il n'y a pas de sélection alors l'exécution s'arrête
	if (!file){
		return;
	}
	// format des images accepté
	const extensionImage=["image/jpeg", "image/png"]
	// 4Mo
	const sizeImage=4*1024*1024
	// si le type choisit par l'utilisateur n'est pas au format souhaité
	if (!extensionImage.includes(file.type)) {
		// message de format autorisé
		showModalMessage(modal2Message, "Format autorisé : jpg ou png");
		// réinitialise le champ inputImage
		inputImage.value = ""; 
		// suppression de la classe active du bouton valider
		validateBtn.classList.remove("enabled");
		return;
	}

	// Si la taille du fichier choisit est plus importante que la taille réglementée
	if (file.size > sizeImage) {
		// alors affiche un message
		showModalMessage(modal2Message, "Attention, fichier supérieur à 4 Mo");
		// réinitialise le champ inputImage
		inputImage.value = "";
		// suppression de la classe active du bouton valider
		validateBtn.classList.remove("enabled");
		return;
	}


	// ****** APERCU DE L'IMAGE DANS LE NAVIGATEUR ******* //

	// création d'un nouvel objet pour lire le contenu du fichier choisi par l'utilisateur
	const reader = new FileReader();
	// évènement se produisant une fois seulement l'image chargée
	reader.onload = (e) => {
		// Masque les éléments par défaut
		photoInsert.querySelectorAll("i, label, span").forEach(el => el.style.display = "none");
		// récupération de la balise img
		let preview = photoInsert.querySelector("img");
		if (!preview) {
			preview = document.createElement("img");
			preview.style.width = "auto";
			preview.style.maxHeight = "100%";
			photoInsert.appendChild(preview);
		}
		// affiche l'image choisie par l'utilisateur dans la balise img
		preview.src = e.target.result;
	};
	// met le contenu du fichier sous forme de Data URL(données encodées dans l'url, type du fichier,base64(transforme le fichier en texte), contenu du fichier transformé en texte)
	// affiche l'image directement dans le navigateur sans l'envoyer sur le serveur (aperçu)
	reader.readAsDataURL(file);
	// appel de la fonction pour la validation du formulaire ou non
	checkForm();
});


// ****** VALIDATION DU FORMULAIRE ******* //

//  au clic du bouton valider
validateBtn.addEventListener("click", function(e){
	// s'il ne contient pas la classe active
	if(!validateBtn.classList.contains("enabled")){
		// aucun rechargement de la page
		e.preventDefault();
		// message à l'utilisateur
		showModalMessage(modal2Message,"Veuillez remplir tous les champs");
		return
	}
	// le bouton est désactivé
	validateBtn.disabled=true;
	// soumet le formulaire si ok
	form.requestSubmit();
});


// ****** SOUMISSION DU FORMULAIRE ******* //

form.addEventListener("submit", async function (e) {
	e.preventDefault();
	// récupération des valeurs des champs du formulaires
	const image = inputImage.files[0];
	const title = inputTitle.value.trim();
	const category = categoryId.value;
	// Création d'un nouvel objet (FormData) pour envoyer les données à l'API
	const formData=new FormData();
	formData.append("image",image);
	formData.append("title",title);
	formData.append("category",category);
	// envoi des données pour sauvegarde dans l'API
	try{
		const sendWork= await fetch("http://localhost:5678/api/works",{
			method:"POST",
			headers:{
				Authorization: `Bearer ${token}`
			},
			body:formData,
		});
		// si la réponse de l'API n'est pas opérationnelle
		if (!sendWork.ok){
			throw new Error(`Erreur HTTP : ${sendWork.status}`)
		}
		// en attente de la réponse de l'API au format Json
		const data=await sendWork.json();
		console.log ("Photo ajouté : ", data);
		// message de succès
		showModalMessage(modal2Message,"La photo a été ajoutée avec succés.")
		// l'élément s'ajoute à la fin des travaux
		works.push(data);
		// rafraichit la gallerie
		generateWorks(works);
		// suppression de la classe active du bouton valider
		validateBtn.classList.remove("enabled");
		const preview = photoInsert.querySelector("img");
		// suppression de l'apercu dans le formulaire si il y une balise img
		if (preview) preview.remove();
		// réinitialisation des éléments par défaut pour l'image
		photoInsert.querySelectorAll("i, label, span").forEach(el => el.style.display = "");
		// réinitialisation du formulaire
		form.reset();
		
	}catch(error){
	console.error("Erreur : ", error);
	showModalMessage(modal2Message,"Erreur lors de l'ajout de la photo.")
	}finally{
		// le bouton valider est désactivé
		validateBtn.disabled=false;
	}
});

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
	}catch (error){
		console.error("Erreur de l'API catégories : ", error);
	}

}


