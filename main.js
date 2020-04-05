/*
 * Université de Bordeaux
 * Master 1 de Bio informatique
 * Lola Denet
 * 10 Avril 2020
 * Projet Web - Sujet 1
 */


/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// Fonctions ///////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////

// Création de classes pour chaque type d'objet.
class NeuroT {
    // Constructeur.
    constructor(x, y, velY, color, size, list) {
        this.x = x;
        if (list.includes(y)) {
            y -= 40
            if (list.includes(y)) {
                y -= 40
            }
        }
        list.push(y)
        this.y = y;
        this.velY = velY;
        this.color = color;
        this.size = size;
    }
    // Fonction chargée de dessiner sur le canevas.
    dessiner() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    }
    // Fonction chargée de mettre à jour l'affichage du canevas en adaptant la position de 
    /// l'objet à la vitesse.
    afficher() {
        this.y += this.velY;
    }
}

class Recepteur {
    // Constructeur.
    constructor(x, y, velY, color, size) {
        this.x = x;
        this.y = y;
        this.velY = velY;
        this.color = color;
        this.size_l = size;
        this.size_L = size;
    }
    // Fonction chargée de dessiner sur le canevas.
    dessiner() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size_l, this.size_L);
        ctx.fill();
    }
    // Fonction chargée de mettre à jour l'affichage du canevas en adaptant la position de 
    /// l'objet à la vitesse.
    afficher() {
        this.y += this.velY;
    }

    // Fonction chargée de détecter l'arrivée d'un neurotransmetteur au niveau d'un récepteur 
    /// fermé pour le transformer en récepteur ouvert mobile.
    detecter() {
        for (let i = 0; i < neuro_transmetteurs.length; i++) {
            let distance = neuro_transmetteurs[i].y + neuro_transmetteurs[i].size;
            if (this.y <= distance - 30 && neuro_transmetteurs[i].x > this.x - 30 && neuro_transmetteurs[i].x < this.x + 30) {
                this.color = 'rgb(' + 60 + ',' + 179 + ',' + 113 + ')';
                this.size_l = 60;
                this.velY = 1;
            }
        }
    }
}

// Fonction qui rafraichit la page.
function reset() {
    window.location.reload();
}

// Fonction qui affiche les résultats de la simulation puis rafraichit la page.
function resultats() {
    let nb_ouverts = 0;
    for (el of recepteurs) {
        if (el.size_l === 60) {
            nb_ouverts += 1;
        }
    }
    alert("Simulation terminée !" + "\n" + "Il y a " + nb_ouverts + " récepteurs ouverts sur " + recepteurs.length + " récepteurs.");
    reset();
}

// Fonction qui lance le timer pour que la simulation dure 2 minutes maximum.
function timer() {
    setTimeout(resultats, 120000);
}

// Fonction chargée de générer des nombres aléatoires.
function random(min, max) {
    const num = Math.floor(Math.random() * (max - min)) + min;
    return num;
}

// Fonction qui liste les 18 positions possibles pour les récepteurs.
function positionner() {
    let pos = 40;
    positions.push(pos);
    for (let i = 1; i <= 17; i++) {
        pos += 70;
        positions.push(pos);
    }
}

// Fonction qui mélange les positions possibles afin de placer les récepteurs aléatoirement sur ces positions.
function random_x(positions_possibles) {
    let x = positions_possibles;
    for (let i = x.length - 1; i >= 1; i--) {
        let hasard = Math.floor(Math.random() * (i + 1));
        let autres_lignes = x[i];
        x[i] = x[hasard];
        x[hasard] = autres_lignes;
    }
    console.log(x);
    return x;
}

// Fonction qui range les neuro-transmetteurs selon leurs positions dans chaque colonne 
/// afin que dans une même colonne ce soit toujours le plus proche de la limite présynaptique qui parte en premier.
function ordonner(neuro_transmetteurs) {
    let index = 0;
    for (let i = 1; i < neuro_transmetteurs.length; i++) {
        for (let k = i + 1; k < neuro_transmetteurs.length; k++) {
            index = i;
            let neuro = neuro_transmetteurs[k];
            if (neuro_transmetteurs[index].x === neuro.x) {
                if (neuro.y >= neuro_transmetteurs[index].y) {
                    index = k;
                }
            }
            autres_lignes = neuro_transmetteurs[index];
            neuro_transmetteurs[index] = neuro_transmetteurs[i];
            neuro_transmetteurs[i] = autres_lignes;
        }
    }
}

// Fonction permettant l'initialisation de l'affichage des objets.
function initialiser() {
    // Dessine le canevas
    ctx.fillStyle = 'rgba(255, 245, 245, 0.25)';
    ctx.fillRect(0, 0, width, height);
    // Dessine la limite pré synaptique.
    ctx.beginPath();
    ctx.lineWidth = '3';
    ctx.moveTo(30, height * 0.40);
    ctx.lineTo(width - 30, height * 0.40);
    ctx.stroke();
    // Dessine la limite post synaptique.
    ctx.lineWidth = '3';
    ctx.moveTo(30, height * 0.83);
    ctx.lineTo(width - 30, height * 0.83);
    ctx.stroke();
    // Dessine les neurotransmetteurs.
    for (let i = 0; i < neuro_transmetteurs.length; i++) {
        neuro_transmetteurs[i].dessiner();
    }
    // Dessine les récepteurs.
    for (let i = 0; i < recepteurs.length; i++) {
        recepteurs[i].dessiner();
    }
}

// Fonction permettant l'animation en actualisant l'affichage du canevas et des objets.
function simuler() {
    initialiser()
    let interval = 5000;
    // Actualise les neuro-transmetteurs en les faisant partir à intervalle régulier.
    for (let i = 0; i < neuro_transmetteurs.length; i++) {
        setInterval(function () { neuro_transmetteurs[i].velY = 1; }, interval);
        neuro_transmetteurs[i].dessiner();
        neuro_transmetteurs[i].afficher();
        interval += 5000;
    }
    // Actualise les récepteurs en vérifiant s'ils sont en contact avec un neuro-transmetteur.
    for (let i = 0; i < recepteurs.length; i++) {
        recepteurs[i].dessiner();
        recepteurs[i].afficher();
        recepteurs[i].detecter();
    }
    requestAnimationFrame(simuler);
}

/////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// Programme principal //////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////

// Création du canevas en prenant en compte la taille de la fenêtre.
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const width = canvas.width = window.innerWidth * 0.70;
const height = canvas.height = window.innerHeight * 0.70;

// Création des objets : récepteurs.
/* Positionnement des récepteurs aléatoire parmis une liste de possibilités pré-définie 
 * de sorte qu'ils ne se superposent pas.
 */
let recepteurs = [];
let nombre_Rec = random(12, 19);
let positions = [];
positionner();
let x_recepteur = random_x(positions);
let x_copie = []
for (let i = 0; i < nombre_Rec; i++) {
    const size = 40;
    let carre = new Recepteur(
        x_recepteur[i],
        height * 0.80,
        0,
        'rgb(' + 30 + ',' + 144 + ',' + 255 + ')',
        size
    );
    x_copie.push(x_recepteur[i])
    recepteurs.push(carre);
}

// Création des objets : neuro-transmetteurs.
/* Positionnement des neuro-transmetteurs aléatoire parmis les positions occupées par les récepteurs 
 * de sorte que chaque NT soit aligné avec un récepteur.
 * Le positionnement priorise la première ligne puis attribue une position en seconde et troisième ligne si nécessaire.
 * Chaque récepteur a au moins un NT aligné. Lorsqu'il y en a plus, ils sont placés au dessus du précédent sans chevauchement. 
 */
let neuro_transmetteurs = [];
let nombre_NT = random(20, 31);
let premiere_ligne = x_copie;
let autres_lignes = x_copie.concat(x_copie);
let nb = nombre_Rec;
let coord = {};
let n;
const size = 15;
while (neuro_transmetteurs.length < nombre_NT) {
    let x_NT;
    if (premiere_ligne.length != 0) {
        n = Math.floor(Math.random() * premiere_ligne.length);
        x_NT = premiere_ligne[n] + 20;
        premiere_ligne.splice(n, 1);
    }
    else {
        n = Math.floor(Math.random() * autres_lignes.length);
        x_NT = autres_lignes[n] + 20;
        autres_lignes.splice(n, 1);
    }
    nb -= 1;
    if (coord[x_NT] == undefined) {
        coord[x_NT] = [];
    }
    let cercle = new NeuroT(
        x_NT,
        height * 0.35,
        0,
        'rgb(' + 255 + ',' + 165 + ',' + 0 + ')',
        size,
        coord[x_NT]
    );
    neuro_transmetteurs.push(cercle);
}
ordonner(neuro_transmetteurs);

// Appels de fonctions
initialiser();
