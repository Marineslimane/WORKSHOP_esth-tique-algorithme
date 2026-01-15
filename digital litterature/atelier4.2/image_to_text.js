// global variables : 
let img;
let canvas; // utile pour le style (CSS)

// thésaurus :
let determiners = ["The", "This", "Our", "Your", "That"]

let color_nouns = {
  red: [
    "ember",
    "flare",
    "rose",
    "poppy",
    "lantern",
    "signal light"
  ],

  orange: [
    "sunset",
    "torch",
    "horizon fire",
    "autumn leaf",
    "paper lantern",
    "dust light"
  ],

  yellow: [
    "sunlight",
    "wheat field",
    "dune",
    "lamp glow",
    "pollen",
    "morning haze"
  ],

  green: [
    "leaf",
    "fern",
    "moss",
    "meadow",
    "canopy",
    "reed"
  ],

  "light blue": [
    "mist",
    "breath",
    "foam",
    "shallow water",
    "morning air",
    "glass reflection"
  ],

  "sky blue": [
    "sky",
    "horizon",
    "clear distance",
    "open air",
    "blue light",
    "afternoon calm"
  ],

  "dark blue": [
    "night sea",
    "deep water",
    "ink sky",
    "low tide",
    "outer space",
    "midnight air"
  ],

  purple: [
    "twilight",
    "violet shadow",
    "evening bloom",
    "bruise light",
    "fig leaf",
    "amethyst glow"
  ],

  pink: [
    "dawn cloud",
    "petal",
    "blossom",
    "salt starfish",
    "rose light",
    "flamingo wing"
  ]
};


let light_adjs = {
  "dark": ["dark", "shadowed", "low"],
  "neutral": ["dim", "quiet", "soft"],
  "light": ["bright", "open", "exposed"]
};

let sat_adjs = {
  "grey": ["faded", "washed", "distant"],
  "soft": ["muted", "gentle", "restrained"],
  "alive": ["vivid", "alive", "intense"]
};

let verbs = [
  "rests",
  "drifts",
  "waits",
  "lingers",
  "fades",
  "holds",
  "opens",
  "slips",
  "stays"
];

function preload() 
{
    /*
        précharge l'image
    */

   img = loadImage("images/sky.jpg"); // modifier le choix d'image ICI
}

function setup()
{
    // utile pour le style : 
    canvas = createCanvas(500, 500);
    canvas.parent("canvas")

    colorMode(HSB, 360, 100, 100); 

    image(img, 0, 0, 500, 500); // (0,0) pour la position de l'image mais comme elle est centrée avec CSS ça n'a pas d'importance

    img.loadPixels(); // charge le tableau pixels des pixels de l'image

    poem(); // fonction qui génère le poème
}

function getMood()
{
    // calcul des moyennes de chaque couleurs RGB des pixels :
    // rem: dans pixels, pour chaque pixel, 4 valeurs sont associées, celles de RGBA
    
    let hue_counts = {
    "red": 0,
    "orange": 0,
    "yellow": 0,
    "green": 0,
    "light blue": 0,
    "sky blue": 0,
    "dark blue": 0,
    "purple": 0,
    "pink": 0
    };

    let avg_sat = 0;
    let avg_br = 0;
 
    for (let i = 0 ; i < img.pixels.length ; i += 4)
    {
        let red  = img.pixels[i];
        let green = img.pixels[i+1];
        let blue = img.pixels[i+2];

        let c = color(red, green, blue);
        let h = hue(c);
        avg_br += brightness(c);
        avg_sat += saturation(c);

        // correspondance de hue à la couleur : 
        if (h < 30 || h >= 330) hue_counts["red"]++;
        else if (h < 60) hue_counts["orange"]++;
        else if (h < 90) hue_counts["yellow"]++;
        else if (h < 150) hue_counts["green"]++;
        else if (h < 180) hue_counts["light blue"]++;
        else if (h < 210) hue_counts["sky blue"]++;
        else if (h < 240) hue_counts["dark blue"]++;
        else if (h < 270) hue_counts["purple"]++;
        else hue_counts["pink"]++;
    }

    // moyennes :
    total = img.pixels.length/4;

    avg_br/=total;
    avg_sat/=total;

    // récupération des couleurs dominantes de l'image : 
    let sorted_colors = Object.entries(hue_counts).sort((a, b) => b[1] - a[1]);
    // Object.entries transforme le dictionnaire en tableau de tableau pour pouvoir le trier

    let dominant_color = sorted_colors[0][0];
    let scnd_dominant_color = sorted_colors[1][0];

    // association aux catégories : 
    let light, life;

    // pour brightness :
    if (avg_br < 30)
    {
        light = "dark";
    }
    else if (avg_br < 60)
    {
        light = "neutral";
    }
    else 
    {
        light = "light";
    }

    // pour saturation : 
    if (avg_sat < 20)
    {
        life = "grey";
    }
    else if (avg_sat < 60)
    {
        life = "soft";
    }
    else 
    {
        life = "alive";
    }


    return [dominant_color, scnd_dominant_color, light, life];
}

function randomDifferent(array, forbidden) 
{
  let choice;
  do 
  {
    choice = random(array);
  } 
  while (choice === forbidden);

  return choice;
}

function poem()
{
    // construit la poème 

    // récupération des "données" de l'image pour le choix des mots suivant l'ambiance
    let mood = getMood();
    let color1 = mood[0]; // couleur dominante
    let color2 = mood[1]; // seconde couleur dominante
    let light = mood[2]; // brightness
    let life = mood[3]; // saturation

    // choix des mots pour la première ligne: 
    let det1 = random(determiners);
    let sat1 = random(sat_adjs[life]);
    let light1 = random(light_adjs[light]);
    let noun1 = random(color_nouns[color1]);
    let verb1 = random(verbs);

    // construction de la ligne 1 du poème :
    let line1 = `${det1} ${sat1} ${light1} ${noun1} ${verb1}`;

    // choix des mots pour la deuxième ligne: 
    let det2 = randomDifferent(determiners, det1);
    let sat2 = randomDifferent(sat_adjs[life], sat1);
    let light2 = randomDifferent(light_adjs[light], light1);
    let noun2 = randomDifferent(color_nouns[color2], noun1);
    let verb2 = randomDifferent(verbs, verb1);

    // construction de la ligne 2 du poème :
    let line2 = `${det2} ${sat2} ${light2} ${noun2} ${verb2}`;

    // affichage :
    document.getElementById("poem").innerText = `${line1}. \n ${line2}. `;
}

function mousePressed() 
{
    /*
        regénère un poème à chaque clique
    */

    poem();
}