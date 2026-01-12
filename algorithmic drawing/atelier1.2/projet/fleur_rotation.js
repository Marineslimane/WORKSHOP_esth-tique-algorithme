function setup() {
  createCanvas(640, 400);
  colorMode(HSB);
  angleMode(DEGREES);
}

function draw() {
  /* gère le fonctionnement général du dessin avec le choix des paramètres pour chaque étage de pétales */

  background(0); // background noir
  translate(width / 2, height / 2); // change l'origine au centre

  // étages de la fleur
  drawLayer(
    20,
    map(mouseX, 0, width, 0, 360), // la rotation des étages se fait par rapport au mouvement de la souris sur l'axe x (x entre 0 et width) et ici ce mouvement est transformé en mouvement circulaire des étages (entre 0 et 360 degrés)
    0,
    140,
    45,
    210,
    25,
    70
  );

  drawLayer(
    15,
    map(mouseX, 0, width, 360, 0),
    150,
    110,
    30,
    210,
    20,
    80
  );

  drawLayer(
    15,
    map(mouseX, 0, width, 0, 360),
    0,
    80,
    20,
    190,
    20,
    90
  );

  drawLayer(
    10,
    map(mouseX, 0, width, 360, 0),
    150,
    50,
    10,
    170,
    70,
    50
  );
}

function drawLayer(petals_nb, mouse_rot, offset, length, width, hue, sat, bright) 
{
    /* 
        dessine et gère la rotation d'un étage
        pré-conditions : 
            - petals_nb : int
            - mouse_rot : float (degré)
            - offset, length, width, hue, sat, bright : float
     */

  push(); // sauvegarde l'état actuel du canvas
  rotate(mouse_rot); // rotation liée à la souris

  for (let i = 0; i < petals_nb ; i++) {
    push();
    rotate((360 / petals_nb) * i + offset); // le cercle est divisé en autant de partie que de pétales et à chaque fois on tourne de cette valeur fois celle de i, l'offset sert à décaler la rotation en fonction des étages
    drawPetal(length, width, hue, sat, bright);
    pop();
  }

  pop(); // restaure à l'état du dernier push
}

function drawPetal(length, width, hue, sat, bright) 
{
    /* 
        dessine un pétale
        pré-conditions : 
            - length, width, hue, sat, bright : float
    */

  noStroke(); // pas de contour pour la pétale
  fill(hue, sat, bright); // coloration

  beginShape();
  vertex(0, 0); // origine 

  // dessin du pétale avec des courbes de Bézier : 
  bezierVertex(
    width, -length * 0.3, // point de controle 1
    width, -length * 0.7, // point de controle 2
    0, -length // point d'arrivée
  );

  bezierVertex(
    -width, -length * 0.7,
    -width, -length * 0.3,
    0, 0
  );

  endShape(CLOSE); // finit la forme
}
