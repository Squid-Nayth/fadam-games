const formulaire = document.querySelector("#form-inscription");
const choixEpreuve = document.querySelector("#choix-epreuve");
const recapitulatif = document.querySelector("#recapitulatif");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function formaterDate(date) {
	const mois = [
		"janvier", "février", "mars", "avril", "mai", "juin",
		"juillet", "août", "septembre", "octobre", "novembre", "décembre"
	];
	const morceaux = date.split("-");
	const jour = parseInt(morceaux[2], 10);
	const numeroMois = parseInt(morceaux[1], 10) - 1;
	return jour + " " + mois[numeroMois] + " " + morceaux[0];
}

function remplirListeEpreuves() {
	epreuves.forEach((epreuve) => {
		const option = document.createElement("option");
		option.value = epreuve.id;
		option.textContent = `${epreuve.nom} - ${formaterDate(epreuve.date)}`;
		choixEpreuve.append(option);
	});
}

function supprimerErreurs() {
	const champsEnErreur = formulaire.querySelectorAll(".erreur");
	const messagesErreur = formulaire.querySelectorAll(".message-erreur");

	for (let i = 0; i < champsEnErreur.length; i++) {
		champsEnErreur[i].classList.remove("erreur");
	}
	for (let i = 0; i < messagesErreur.length; i++) {
		messagesErreur[i].remove();
	}
}

function afficherErreur(champ, message) {
	champ.classList.add("erreur");
	const messageErreur = document.createElement("p");
	messageErreur.className = "message-erreur";
	messageErreur.textContent = message;
	champ.parentElement.appendChild(messageErreur);
}

function dateValide(date) {
	const dateNaissance = new Date(`${date}T00:00:00`);
	// Une naissance au plus tard le 3 juillet 2011 garantit 16 ans ce jour-là.
	const dateLimite = new Date(2011, 6, 3);
	return !isNaN(dateNaissance.getTime()) && dateNaissance <= dateLimite;
}

function enregistrerInscription(inscription) {
	try {
		const inscriptions = JSON.parse(localStorage.getItem("fadam-inscriptions") || "[]");
		inscriptions.push(inscription);
		localStorage.setItem("fadam-inscriptions", JSON.stringify(inscriptions));
	} catch (erreur) {
		console.error("Erreur lors de l'enregistrement de l'inscription :", erreur);
	}
}

function afficherRecapitulatif(inscription, epreuve) {
	while (recapitulatif.firstChild) {
		recapitulatif.removeChild(recapitulatif.firstChild);
	}

	const confirmation = document.createElement("p");
	confirmation.textContent = `Inscription confirmée pour ${inscription.prenom} ${inscription.nom}.`;

	const details = document.createElement("p");
	details.textContent = `${inscription.role} - ${epreuve.nom}, ${formaterDate(epreuve.date)}, ${epreuve.lieu}.`;

	recapitulatif.appendChild(confirmation);
	recapitulatif.appendChild(details);
}

formulaire.addEventListener("submit", function (evenement) {
	evenement.preventDefault();
	supprimerErreurs();
	while (recapitulatif.firstChild) {
		recapitulatif.removeChild(recapitulatif.firstChild);
	}

	const nom = formulaire.elements.nom;
	const prenom = formulaire.elements.prenom;
	const email = formulaire.elements.email;
	const dateNaissance = formulaire.elements["date-naissance"];
	const role = formulaire.elements.role;
	let epreuve = null;
	let premierChampErreur = null;

	for (let i = 0; i < epreuves.length; i++) {
		if (epreuves[i].id === Number(choixEpreuve.value)) {
			epreuve = epreuves[i];
		}
	}

	if (nom.value.trim().length < 2) {
		afficherErreur(nom, "Le nom doit contenir au moins 2 caractères.");
		premierChampErreur = premierChampErreur || nom;
	}

	if (prenom.value.trim().length < 2) {
		afficherErreur(prenom, "Le prénom doit contenir au moins 2 caractères.");
		premierChampErreur = premierChampErreur || prenom;
	}

	if (!emailRegex.test(email.value.trim())) {
		afficherErreur(email, "Veuillez saisir une adresse e-mail valide.");
		premierChampErreur = premierChampErreur || email;
	}

	if (!dateValide(dateNaissance.value)) {
		afficherErreur(dateNaissance, "Vous devez avoir au moins 16 ans le 3 juillet 2027.");
		premierChampErreur = premierChampErreur || dateNaissance;
	}

	if (!epreuve) {
		afficherErreur(choixEpreuve, "Choisissez une épreuve.");
		premierChampErreur = premierChampErreur || choixEpreuve;
	}

	const roleSelectionne = formulaire.querySelector("input[name='role']:checked");
	if (!roleSelectionne) {
		for (let i = 0; i < role.length; i++) {
			role[i].classList.add("erreur");
		}
		afficherErreur(role[role.length - 1], "Choisissez un rôle.");
		premierChampErreur = premierChampErreur || role[0];
	}

	const reglement = formulaire.elements.reglement;
	if (!reglement.checked) {
		afficherErreur(reglement, "Vous devez accepter le règlement.");
		premierChampErreur = premierChampErreur || reglement;
	}

	if (premierChampErreur) {
		premierChampErreur.focus();
		return;
	}

	const inscription = {
		nom: nom.value.trim(),
		prenom: prenom.value.trim(),
		email: email.value.trim(),
		dateNaissance: dateNaissance.value,
		role: roleSelectionne.value === "participant" ? "Participant" : "Bénévole",
		epreuveId: epreuve.id
	};

	afficherRecapitulatif(inscription, epreuve);
	enregistrerInscription(inscription);
	formulaire.reset();
});

remplirListeEpreuves();
