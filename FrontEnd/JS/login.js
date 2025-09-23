//++++++++++++++++++++++++++++++++++++++++++++//
// *				CONNEXION				*//
//++++++++++++++++++++++++++++++++++++++++++++//

// récupération du formulaire
const formLogIn=document.querySelector(".frm-login");
// évènement à la soumission du formulaire
formLogIn.addEventListener("submit",async (e) => {
	e.preventDefault();
	// récupération des valeurs des champs
	const email=document.getElementById("email").value;
	const password=document.getElementById("mdp").value;
	// essaye
	try{
		// d'envoyer une requête à l'API et attend que l'API (ou serveur) réponde avant de poursuivre (await fetch)
		const response= await fetch("http://localhost:5678/api/users/login",{
			method:"POST",
			headers:{"content-type":"application/json"},
			body:JSON.stringify({email, password})
		});
		// Si la réponse n'est pas correct alors lance un message d'erreur
		if(!response.ok){
			throw new Error("Erreur dans l’identifiant ou le mot de passe")
		};
		// Attend que la réponse de l'API (ou serveur) arrive avant de poursuivre
		const data=await response.json();
		// token généré (propre à l'utilisateur) lors de la connexion de l'utilisateur, valable le temps de la session
		sessionStorage.setItem("token",data.token);
		// Si les identifiants de l'utilisateur sont corrects, il est redirigé à la page index.html
		window.location.href="/index.html";

	}catch (error){
    		alert("Erreur : " + error.message);
	}
});


