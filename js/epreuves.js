const zoneFiltres = document.querySelector("#filtres");
const recherche = document.querySelector("#recherche");
const compteur = document.querySelector("#compteur");
const listeEpreuves = document.querySelector("#liste-epreuves");
const favorisStorage = "fadam-favoris";
let disciplineActive = "Toutes";
let favoris = chargerFavoris();

function chargerFavoris() {
	// Les favoris sont conservés sous forme de tableau 
	try {
		const favorisEnregistres = JSON.parse(localStorage.getItem(favorisStorage));
		if (Array.isArray(favorisEnregistres)) {
			return favorisEnregistres;
		}
	} catch (erreur) {
		return [];
	}
	return [];
}

function enregistrerFavoris() {
	localStorage.setItem(favorisStorage, JSON.stringify(favoris));
}

function formatDate(date) {
	const mois = [
		"janvier", "février", "mars", "avril", "mai", "juin",
		"juillet", "août", "septembre", "octobre", "novembre", "décembre"
	];
	const morceaux = date.split("-");
	const jour = parseInt(morceaux[2], 10);
	const numeroMois = parseInt(morceaux[1], 10) - 1;
	return jour + " " + mois[numeroMois] + " " + morceaux[0];
}

function estFavori(id) {
	return favoris.indexOf(id) !== -1;
}

function viderElement(element) {
	while (element.firstChild) {
		element.removeChild(element.firstChild);
	}
}

function afficherEpreuves(liste) {
	viderElement(listeEpreuves);

	const nombreEpreuves = liste.length;
	let texteCompteur = nombreEpreuves + " épreuve affichée";

	if (nombreEpreuves > 1) {
		texteCompteur = nombreEpreuves + " épreuves affichées";
	}
	compteur.textContent = texteCompteur;

	if (nombreEpreuves === 0) {
		listeEpreuves.textContent = "Aucune épreuve ne correspond à votre recherche.";
		return;
	}

	for (let i = 0; i < liste.length; i++) {
		const epreuve = liste[i];
		const carte = document.createElement("article");
		const badge = document.createElement("span");
		const titre = document.createElement("h3");
		const dateLieu = document.createElement("p");
		const details = document.createElement("p");
		const boutonFavori = document.createElement("button");

		carte.className = "carte";
		badge.className = "badge";
		badge.textContent = epreuve.discipline;
		titre.textContent = epreuve.nom;
		dateLieu.textContent = `${formatDate(epreuve.date)} · ${epreuve.lieu}`;
		details.textContent = `${epreuve.type} · ${epreuve.places} places`;
		boutonFavori.type = "button";
		boutonFavori.className = "bouton-favori";
		if (estFavori(epreuve.id)) {
			boutonFavori.textContent = "Retirer des favoris";
		} else {
			boutonFavori.textContent = "Ajouter aux favoris";
		}

		if (estFavori(epreuve.id)) {
			carte.classList.add("favori");
		}

		boutonFavori.addEventListener("click", function () {
			const position = favoris.indexOf(epreuve.id);

			if (position !== -1) {
				favoris.splice(position, 1);
			} else {
				favoris.push(epreuve.id);
			}

			enregistrerFavoris();
			afficherEpreuves(filtrerEpreuves());
		});

		carte.appendChild(badge);
		carte.appendChild(titre);
		carte.appendChild(dateLieu);
		carte.appendChild(details);
		carte.appendChild(boutonFavori);
		listeEpreuves.appendChild(carte);
	}
}

function filtrerEpreuves() {
	const rechercheNormalisee = recherche.value.trim().toLowerCase();
	const resultats = [];

	// Les deux conditions doivent être vraies pour garder une épreuve.
	for (let i = 0; i < epreuves.length; i++) {
		const epreuve = epreuves[i];
		const bonneDiscipline = disciplineActive === "Toutes" || epreuve.discipline === disciplineActive;
		const bonneRecherche = epreuve.nom.toLowerCase().includes(rechercheNormalisee);

		if (bonneDiscipline && bonneRecherche) {
			resultats.push(epreuve);
		}
	}

	return resultats;
}

function afficherFiltres() {
	const disciplines = ["Toutes"];
	const groupeBoutons = document.createElement("div");
	groupeBoutons.className = "filtres-disciplines";

	for (let i = 0; i < epreuves.length; i++) {
		const discipline = epreuves[i].discipline;
		if (disciplines.indexOf(discipline) === -1) {
			disciplines.push(discipline);
		}
	}

	for (let i = 0; i < disciplines.length; i++) {
		const discipline = disciplines[i];
		const bouton = document.createElement("button");
		bouton.type = "button";
		bouton.textContent = discipline;

		if (discipline === disciplineActive) {
			bouton.classList.add("actif");
		}

		bouton.addEventListener("click", function () {
			disciplineActive = discipline;
			for (let j = 0; j < groupeBoutons.children.length; j++) {
				groupeBoutons.children[j].classList.remove("actif");
			}
			bouton.classList.add("actif");
			afficherEpreuves(filtrerEpreuves());
		});

		groupeBoutons.appendChild(bouton);
	}

	zoneFiltres.appendChild(groupeBoutons);
}

recherche.addEventListener("input", function () {
	afficherEpreuves(filtrerEpreuves());
});

afficherFiltres();
afficherEpreuves(epreuves);
