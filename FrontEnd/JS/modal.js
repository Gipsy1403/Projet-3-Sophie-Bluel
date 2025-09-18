const token =localStorage.getItem("token");

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


// ? QUESTION: lors de la suppression, la photo reste dans la modale sauf après être intervenue en la fermant ou actualiser la page
		// SUPPRIMER UN WORK
		trash.addEventListener("click",async(e)=>{
			e.preventDefault();
			try{
			const deleteWork=await fetch(`http://localhost:5678/api/works/${img.id}`,{
				method:"DELETE",
				headers:{
					"Authorization": `Bearer ${token}`
				}
			});
			// console.log(localStorage.getItem("token"));

			if(deleteWork.ok){
				// creation d'un autre tableau(works) gardant toutes les images, sauf celle dont l'id correspond à l'image à supprimer
				works = works.filter(work => work.id !== img.id);
				alert("La suppression est un succés");
				// suppression de la div contenant le work supprimé précédemment
				divPictures.remove();
				generateWorks(works);

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

const sndModal=document.querySelector("#modal2")
const form = document.querySelector(".form-work");
const inputImage=document.querySelector("#imageUrl");
const photoInsert=document.querySelector(".photo-insert");
const validateBtn=document.querySelector(".validate-btn");


function checkForm() {
  const image = inputImage.files[0];
  const title = document.querySelector("#title").value.trim();
  const category = document.querySelector("#categoryId").value;

  if (image && title && category) {
    validateBtn.classList.add("enabled"); // CSS : vert
  } else {
    validateBtn.classList.remove("enabled"); // CSS : gris
  }
}
// écoute en temps réel
inputImage.addEventListener("change", checkForm);
document.querySelector("#title").addEventListener("input", checkForm);
document.querySelector("#categoryId").addEventListener("change", checkForm);

validateBtn.addEventListener("click", function(e){
  if(!validateBtn.classList.contains("enabled")){
    e.preventDefault();
    alert("Veuillez remplir tous les champs");
  }else{
	form.requestSubmit();
  }
});


inputImage.addEventListener("change",()=>{
	const file=inputImage.files[0];
	if(file){
		const reader=new FileReader();
		reader.onload=(e)=>{
			photoInsert.querySelector("i").style.display = "none";
      photoInsert.querySelector("label").style.display = "none";
      photoInsert.querySelector("span").style.display = "none";
      let preview = photoInsert.querySelector("img");
      if (!preview) {
        preview = document.createElement("img");
        preview.style.width = "auto";
        preview.style.maxHeight = "100%";
        photoInsert.appendChild(preview);
      }
      preview.src = e.target.result;
	};
		reader.readAsDataURL(file);
	}
});

form.addEventListener("submit", async function (e) {
	e.preventDefault();
	const image = document.querySelector("#imageUrl").files[0];
	const title = document.querySelector("#title").value;
	const category = document.querySelector("#categoryId").value;
	console.log(image, title, category); 

	const formData=new FormData();
	formData.append("image",image);
	formData.append("title",title);
	formData.append("category",category);

	try{
		const sendWork= await fetch("http://localhost:5678/api/works",{
			method:"POST",
			headers:{
				Authorization: `Bearer ${token}`
			},
			body:formData,
		});
		if (!sendWork.ok){
			throw new Error(`Erreur HTTP : ${sendWork.status}`)
		}
		const data=await sendWork.json();
		console.log ("Photo ajouté : ", data);
		sndModal.style.display="none";
		alert("La photo a été ajoutée avec succés.")
	}catch(error){
	console.error("Erreur : ", error);
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
		// choiceCategory.addEventListener("change", formValidation);
	}catch (error){
		console.error("Erreur de l'API catégories : ", error);
	}

}


console.log();
