let song, fft, amp; // variables pour p5.sound

let cell_size = 10; // taille des cellules en pixel, MODIFIABLE

// dimensions de la grille : 
let column_nb; 
let row_nb;

// tableaux des cellules courantes et de la génération suivante : 
let current_cells = [];
let next_cells = [];

let min_neighbours = 2; // nb minimum de voisins que doit avoir une cellule pour vivre
let max_neighbours = 3; // nb maximum de voisins que doit avoir une cellule pour vivre
let birth = 3; // nb de voisins nécessaires à une case pour qu'elle naisse
let birth_chance = 1.0; // probabilité qu'une naissance arrive

let canvas; // utile pour le mask circulaire en HTML

function preload() 
{
    /* précharge la musique avant que setup() se lance */

    song = loadSound('musics/Saint Levant - EXILE.mp3'); // changer la musique ICI
}

function setup()
{
    /* prépare le terrain : récupère les informations sur la musique et initialise les tableaux et les valeurs de column_nb et row_nb */

    frameRate(20); // vitesse de draw() en fps (frames per second), attention à ne pas trop l'augmenter

    canvas = createCanvas(400, 400);
    canvas.parent("canvas"); // réfère à la div qui sert de mask pour l'affichage circulaire en HTML

    colorMode(HSB, 360, 100, 100, 100);

    // pour la musique :
    fft = new p5.FFT(); // ftt contient des informations sur les fréquences : basses, moyennes et hautes (bass, mid, treble) qui pourront être récupérées avec des méthodes spécifiques
    amp = new p5.Amplitude(); // amp contient des informations sur l'amplitude

    // calcul du nb de colonne et de lignes en fonction de la taille choisie pour les cellules
    column_nb = floor(width/cell_size); // floor() : arrondi à la valeur entière du dessous
    row_nb = floor(height/cell_size);

    // initialisation des tableaux :
    for (let column = 0; column < column_nb; column++)
    {
        current_cells[column] = [];
    }

    for (let column = 0; column < column_nb; column++)
    {
        next_cells[column] = [];
    }

    noLoop();
}

function draw()
{
    /* dessine le visuel (couleurs et forme des cellules) et fait le lien entre le visuel et le son en modifiant les valeurs globales qui servent dans les règles suivies par l'automate et décrites dans generate() */

    background(250, 250, 250, 5); // fond blanc très transparent

    // pour la musique : 
    let level = amp.getLevel(); // volume global du son
    let bass = fft.getEnergy("bass"); // basses fréquences
    let mid  = fft.getEnergy("mid"); // moyennes fréquences : la voix, plutot (si voix dans la musique)
    // let treble  = fft.getEnergy("treble"); // hautes fréquences

    min_neighbours = floor(map(bass, 0, 255, 1, 3)); // bass & mid prenent des valeurs entre 0 et 255 et ici elles sont converties en un nombre de voisins pour avoir une représentation visuelle de l'évolution de la musique
    // si bass est nulle, le minimum de voisins pour rester en vie est 1 et si bass est forte (255) c'est 3 etc pour les valeurs intermédiaires  
    max_neighbours = floor(map(mid, 0, 255, 3, 8)); 
    // idem mais avec max. 8 pour le nombre maximum dans le cas de fortes fréquences moyennes car on prend en compte 8 voisins en tout pour une cellule : les 8 cases autour d'elle
    birth = floor(map(level, 0, 0.3, 2, 4)); // level prend des valeurs entre 0 et 0.3, idem pour la conversion. ici, elle détermine la naissance
    birth_chance = map(level, 0, 0.3, 0.2, 1.0); 

    generate(); // génération des cellules

    // pour chaque cellule : 
    for (let column = 0; column < column_nb; column++)
    {
        for (let row = 0; row < row_nb; row++)
        {
            let cell = current_cells[column][row];

            // coloration de la cellule : 
            let hue = map(mid, 0, 255, 180, 360); // selon l'intensité des fréquences mid, la hue va aller des tons plutot bleu à des tons plutot rouge
            fill(hue, 100, 100, cell * 40); // saturation & luminosité maximale
            // pour alpha, si cell = 0 ie cellule morte, la cellule est invisible et si cell = 1 ie cellule vivante, elle est visible avec une certaine transparence
            // remarque : en fonction du choix de la variable de map() dans hue, mid ou bien bass ou bien treble ou highMid.. on obtient des résultats visuels différents car on se concentre sur différents aspects de la musique
            // les autres paramètres de fill et l'intervalle choisi de couleur dans hue sont bien sûr aussi modifiables pour obtenir d'autres rendus
            noStroke(); // pas de bordure ie grille invisible

           
            // forme de la cellule : 
            if (cell === 1)  // seulement si la cellule est vivante
            {
                let x = column * cell_size // position x de la cellule
                let y = row * cell_size // position y de la cellule
                let r = cell_size * random(0.5, 1.5);  // rayon choisie pour le cercle : random permet d'avoir de l'aléatoire sur le rayon pour un effet plus vivant/organique et moins répétitif
                
                circle(x, y, r); // cellule circulaire
            }
        }
    }
}

function mousePressed()
{
    /* arrête la musique et la génération quand la souris est cliquée puis relance tout quand elle est recliquée */

    userStartAudio(); // au départ, la musique joue seulement quand l'écran est cliqué

    if (song.isPlaying())
    {
        song.pause(); // quand l'écran est recliqué, la musique se met en pause
        noLoop(); // et l'animation aussi
    }
    else
    {
        song.loop(); // sinon la musique joue en boucle
        randomizeBoard(); // quand on relance ça randomise le visuel
        loop(); // et le visuel se relance
    }
}

function toggleMusic() 
{

  if (song.isPlaying()) {
    song.pause();
    noLoop(); // stop l'animation
  } else {
    song.loop();
    loop(); // relance l'animation
  }
}

function randomizeBoard()
{
    /* randomise le visuel pour avoir un autre 'pattern' */

    for (let column = 0; column < column_nb; column++) 
    {
        for (let row = 0; row < row_nb; row++)
        {
            // sélectionne de manière random 0 ou 1 pour mort ou vivant 
            current_cells[column][row] = random([0, 1]);
        }
  }
}

function generate()
{
    /* créé une nouvelle génération de cellules en se basant sur le principe du jeu de la vie */

    for (let column = 0; column < column_nb; column++) 
    {
        for (let row = 0; row < row_nb; row++) 
        {
            // récupération des indices de position des voisins :
            let left = (column - 1 + column_nb) % column_nb;

            let right = (column + 1) % column_nb;

            let above = (row - 1 + row_nb) % row_nb;

            let below = (row + 1) % row_nb;

            // nombre de voisins de la cellule :
            let neighbours =
                current_cells[left][above] +
                current_cells[column][above] +
                current_cells[right][above] +
                current_cells[left][row] +
                current_cells[right][row] +
                current_cells[left][below] +
                current_cells[column][below] +
                current_cells[right][below];

            // REGLES de l'automate : 
            let alive = current_cells[column][row] === 1; // booléen indiquant si la cellule est vivante ou non 

            if (alive && (neighbours < min_neighbours || neighbours > max_neighbours)) // si la cellule est vivante et si elle a trop peu ou trop de voisins
            {
                next_cells[column][row] = 0; // elle meurt 
            }
            else if (!alive && neighbours === birth && random() < birth_chance) // si la cellule est morte et elle a exactement birth voisins et une probabilité non nulle de naissance
            {
                next_cells[column][row] = 1; // elle vit
            }
            else // sinon
            {
                next_cells[column][row] = current_cells[column][row]; // rien ne change
            }
        }
    }

    // échange le tableau courant et ancien pour la prochaine génération :
    let temp = current_cells;
    current_cells = next_cells;
    next_cells = temp;
}