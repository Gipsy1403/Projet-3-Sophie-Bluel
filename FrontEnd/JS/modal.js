// *******************************************//
// *				FENETRE MODALE			*//
// *******************************************//

const response=await fetch("http://localhost:5678/api/works");
const works=await response.json();

function modalPhotos(works){
	const photos=document.querySelector("#container-images");
	photos.innerHTML="";
	console.log(photos)
	for(let i=0; i<works.length; i++){
		const img=works[i];
		const divPictures=document.createElement("div");
		divPictures.classList.add("pictures");
		const picture=document.createElement("img");
		picture.src=img.imageUrl;
		picture.alt=img.title;
		const trash=document.createElement("i");
		trash.classList.add("fa-solid","fa-trash-can");
		photos.appendChild(divPictures)
		divPictures.appendChild(picture);
		divPictures.appendChild(trash);
	}
}
modalPhotos(works);

let modal=null;

const openModal = function(e){
	e.preventDefault();
	const target=document.querySelector(e.currentTarget.getAttribute("href"));
	target.style.display= null;
	target.removeAttribute("aria-hidden");
	target.setAttribute("aria-modal", "true");
	modal=target;
	modal.addEventListener("click",closeModal);
	modal.querySelector(".modal-close").addEventListener("click", closeModal);
	modalPhotos(works);

}
console.log();

const closeModal=function(e){
	if(modal === null) return
	e.preventDefault();
	modal.style.display= "none";
	modal.setAttribute("aria-hidden", "true");
	modal.removeAttribute("aria-modal");
	modal.removeEventListener("click",closeModal);
	modal=null;
	modal.querySelector(".modal-close").removeEventListener("click", closeModal);
}
 
const modalModify=document.querySelector(".modify-modal a");
modalModify.addEventListener("click",openModal);


