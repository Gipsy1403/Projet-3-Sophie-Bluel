// *******************************************//
// *				CONNEXION				*//
// *******************************************//

// récupération du formulaire
const formulaireLogIn=document.querySelector(".frm-login");
// évènement à la soumission du formulaire
formulaireLogIn.addEventListener("submit",(e)=>{
	e.preventDefault
	// récupération des valeurs des champs
	const email=document.getElementById("email").value;
	const password=document.getElementById("mdp").value;
	try{
		const response=fetch("http://localhost:5678/api/users/login",{
			method:"POST",
			headers:"content-type":"application/json",
			body:JSON.stringify({email, password})
		});

		if(!response.ok){
			throw new Error("Vos identifiants sont incorrects")
		};

		const data=await response.json();
		console.log("Token : ", data.token);
		
		localStorage.setItem("token", data.token);
		window.location.href="/index.html";
	}catch (error){
		error.textContent="erreur"
	}

})

console.log();
