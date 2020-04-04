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

// Création de classes pour chaque type d'objet 
class NeuroT {
    // Constructeur
    constructor(x, y, velY, color, size) {
        this.x = x;
        this.y = y;
        this.velY = velY;
        this.color = color;
        this.size = size;
    }
    // Fonction chargée de dessiner sur le canvas
    dessiner() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    }
    // Fonction chargée de mettre à jour l'affichage du canvas
    afficher() {
        this.y += this.velY;
    }
    // Fonction qui empêche les neurotransmetteurs de se superposer
    desuperposer() {
        for (let i = 0; i < neuro_transmetteurs.length; i++) {
            if (!(this === neuro_transmetteurs[i])){
                if (this.x === neuro_transmetteurs[i].x && this.y === neuro_transmetteurs[i].y) {
                    //console.log(i, "// ",this.y, neuro_transmetteurs[i].y);
                    this.y -= 40;
                    //console.log(i, "// ",this.y);
                }
            }
        }
    }
}

class Recepteur {
    // Constructeur
    constructor(x, y, velY, color, size) {
        this.x = x;
        this.y = y;
        this.velY = velY;
        this.color = color;
        this.size_l = size;
        this.size_L = size;
    }
    // Fonction chargée de dessiner sur le canvas
    dessiner() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size_l, this.size_L);
        ctx.fill();
    }
    // Fonction chargée de mettre à jour l'affichage du canvas
    afficher() {
        this.y += this.velY;
    }

    // Fonction chargée de détecter l'arrivée d'un neurotransmetteur au niveau d'un récepteur fermé
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

// Fonction qui rafraichit la page
function reset() {
    window.location.reload();
}

// Fonction qui affiche les résultats de la simulation puis rafraichit la page
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

// Fonction qui lance le timer pour que la simulation dure 2 minutes maximum 
function timer() {
    setTimeout(resultats, 120000);
}

// Fonction chargée de générer des nombres aléatoires
function random(min, max) {
    const num = Math.floor(Math.random() * (max - min)) + min;
    return num;
}

// Fonction qui liste les 18 positions possibles pour les récepteurs 
function positionner() {
    let pos = 40;
    positions.push(pos);
    for (let i = 1; i <= 17; i++) {
        pos += 70;
        positions.push(pos);
    }
}

// Fonction qui mélange les positions possibles afin de placer les récepteurs aléatoirement sur ces positions
function random_x(positions_possibles) {
    let x = positions_possibles;
    for (let i = x.length - 1; i >= 1; i--) {
        let hasard = Math.floor(Math.random() * (i + 1));
        let temp = x[i];
        x[i] = x[hasard];
        x[hasard] = temp;
    }
    return x;
}

// Fonction permettant l'initialisation de l'affichage des objets
function initialiser() {
    // Dessine le canevas
    ctx.fillStyle = 'rgba(255, 245, 245, 0.25)';
    ctx.fillRect(0, 0, width, height);
    // Dessine la limite pré synaptique
    ctx.beginPath();
    ctx.lineWidth = '3';
    ctx.moveTo(30, height * 0.40);
    ctx.lineTo(width - 30, height * 0.40);
    ctx.stroke();
    // Dessine la limite post synaptique
    ctx.lineWidth = '3';
    ctx.moveTo(30, height * 0.83);
    ctx.lineTo(width - 30, height * 0.83);
    ctx.stroke();
    // Dessine les neurotransmetteurs
    for (let i = 0; i < neuro_transmetteurs.length; i++) {
        neuro_transmetteurs[i].dessiner();
    }
    // Dessine les récepteurs
    for (let i = 0; i < recepteurs.length; i++) {
        recepteurs[i].dessiner();
    }
}

// Fonction permettant l'animation en actualisant l'affichage du canvas et des objets
function simuler() {
    initialiser()
    let interval = 5000;
    for (let i = 0; i < neuro_transmetteurs.length; i++) {
        setInterval(function () { neuro_transmetteurs[i].velY = 1; }, interval);
        neuro_transmetteurs[i].dessiner();
        neuro_transmetteurs[i].afficher();
        interval += 5000;
    }
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

// Création du canvas en prenant en compte la taille de la fenêtre
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const width = canvas.width = window.innerWidth * 0.70;
const height = canvas.height = window.innerHeight * 0.70;

// Création des objets : récepteurs
let recepteurs = [];
let nombre_Rec = random(12, 19);
let positions = [];
positionner();
let x_recepteur = random_x(positions);
for (let i = 0; i < nombre_Rec; i++) {
    const size = 40;
    let carre = new Recepteur(
        x_recepteur[i],
        height * 0.80,
        0,
        'rgb(' + 30 + ',' + 144 + ',' + 255 + ')',
        size
    );
    recepteurs.push(carre);
}

// Création des objets : neuro transmetteurs 
let neuro_transmetteurs = [];
let nombre_NT = random(20, 31);
while (neuro_transmetteurs.length < nombre_NT) {
    let x_NT = x_recepteur[Math.floor(Math.random() * nombre_Rec)] + 20;
    const size = 15;
    let cercle = new NeuroT(
        x_NT,
        height * 0.35,
        0,
        'rgb(' + 255 + ',' + 165 + ',' + 0 + ')',
        size
    );
    neuro_transmetteurs.push(cercle);
}
for (let i = 0; i < neuro_transmetteurs.length; i++) {
    neuro_transmetteurs[i].desuperposer();
}

// Appels de fonctions
initialiser();
