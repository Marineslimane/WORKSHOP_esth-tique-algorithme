let song, fft, amp; // variables pour p5.sound

let cell_size = 10; // taille des cellules en pixel, modifiable
let column_nb; 
let row_nb;
let current_cells = [];
let next_cells = [];

let min_neighbours = 2; // nb minimum de voisins que doit avoir une cellule pour vivre
let max_neighbours = 3; // nb maximum de voisins que doit avoir une cellule pour vivre
let birth = 3; // nb de voisins nécessaires à une case pour qu'elle naisse
let birthChance = 1.0; // probabilité qu'une naissance arrive

function preload() 
{
    /* précharge la musique avant que setup() se lance */

    song = loadSound('musics/TKS 2G - Whine (Clip officiel).mp3'); // changer la musique ICI
}

function setup()
{
    /* prépare le terrain : récupère les informations sur la musique et intialise les tableaux et les valeurs de column_nb et row_nb */

    frameRate(20); // vitesse de draw() en fps (frames per second), attention à ne pas trop l'augmenter
    createCanvas(400, 400);
    colorMode(HSB, 360, 100, 100, 100);

    // pour la musique :
    fft = new p5.FFT(); // ftt contient des informations sont les fréquences : basses, moyennes et hautes (bass, mid, treble) qui pourront être récupérées avec des méthodes spécifiques
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
    /**/

    background(0, 0, 0, 20);

    // pour la musique : 
    let level = amp.getLevel(); // volume global du son
    let bass = fft.getEnergy("bass"); // basses fréquences
    let mid  = fft.getEnergy("mid"); // hautes fréquences

    min_neighbours = floor(map(bass, 0, 255, 1, 3)); // bass & mid prenent des valeurs entre 0 et 255 et ici elles sont converties en un nombre de voisins pour avoir une représentation visuelle de l'évolution de la musique
    // si bass est nulle, le minimum de voisins pour rester en vie est 1 et si bass est forte (255) c'est 3 etc pour les valeurs intermédiaires  
    max_neighbours = floor(map(mid, 0, 255, 3, 8)); 
    // idem mais avec max. 8 pour le nombre maximum dans le cas de fortes fréquences moyennes car on prend en compte 8 voisins en tout pour une cellule : les 8 cases autour d'elle
    birth = floor(map(level, 0, 0.3, 2, 4)); // level prend des valeurs entre 0 et 0.3, idem pour la conversion. ici, elle détermine la naissance
    birthChance = map(level, 0, 0.3, 0.2, 1.0); 

    generate();

    // pour chaque cellule : 
    for (let column = 0; column < column_nb; column++)
    {
        for (let row = 0; row < row_nb; row++)
        {
            let cell = current_cells[column][row];

            // coloration de la cellule : 
            let c = map(cell, 0, 1, 0, 255); // conversion de la valeur de la cellule (0 ou 1) en couleur (noir ou blanc)
            let hue = map(bass, 0, 255, 180, 360);
            fill(hue, 80, 100, cell * 30);
            noStroke(); // pas de bordure

            // forme de la cellule : 
            rect(column * cell_size, row * cell_size, cell_size, cell_size);
        }
    }
}

function mousePressed()
{
    /* lance la musique et la génération seulement une fois la souris pressée et randomise le visuel à chaque fois que l'on clique sur l'écran */

    userStartAudio(); // la musique joue

    if (!song.isPlaying()) 
    {
        song.loop();
    }

    randomizeBoard();
    loop();
}

function randomizeBoard()
{
    /* randomise le visuel */

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
            let left = (column - 1 + column_nb) % column_nb;

            let right = (column + 1) % column_nb;

            let above = (row - 1 + row_nb) % row_nb;

            let below = (row + 1) % row_nb;

            let neighbours =
                current_cells[left][above] +
                current_cells[column][above] +
                current_cells[right][above] +
                current_cells[left][row] +
                current_cells[right][row] +
                current_cells[left][below] +
                current_cells[column][below] +
                current_cells[right][below];

            // règles : 
            let alive = current_cells[column][row] === 1;

            if (alive && (neighbours < min_neighbours || neighbours > max_neighbours)) // si la cellule est vivante et si elle a trop peu ou trop de voisins
            {
                next_cells[column][row] = 0; // elle meurt 
            }
            else if (!alive && neighbours === birth && random() < birthChance) // si la cellule est morte et elle a exactement birth voisins et une probabilité non nulle de naissance
            {
                next_cells[column][row] = 1;
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