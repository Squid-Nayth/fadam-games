console.log("main.js est bien chargé");

const annee = document.querySelector("#annee");

if (annee) {
	annee.textContent = `${new Date().getFullYear()} FADAM Games. Tous droits réservés.`;
}

const compteARebours = document.querySelector("#compte-a-rebours");

function ajouterZero(nombre) {
	if (nombre < 10) {
		return "0" + nombre;
	}
	return nombre;
}

function mettreAJourCompteARebours() {
	if (!compteARebours) {
		return;
	}

	const dateCeremonie = new Date(2027, 6, 3, 10, 0, 0);
	const maintenant = new Date();
	let difference = dateCeremonie.getTime() - maintenant.getTime();

	if (difference < 0) {
		difference = 0;
	}

	const totalSecondes = parseInt(difference / 1000, 10);
	const jours = parseInt(totalSecondes / 86400, 10);
	const heures = parseInt((totalSecondes % 86400) / 3600, 10);
	const minutes = parseInt((totalSecondes % 3600) / 60, 10);
	const secondes = totalSecondes % 60;

	document.querySelector("#jours").textContent = jours;
	document.querySelector("#heures").textContent = ajouterZero(heures);
	document.querySelector("#minutes").textContent = ajouterZero(minutes);
	document.querySelector("#secondes").textContent = ajouterZero(secondes);
}

mettreAJourCompteARebours();
setInterval(mettreAJourCompteARebours, 1000);
