let max_depth = 5; // niveau de détails des fractales
let cnv;

function setup() 
{
    cnv = createCanvas(800, windowHeight - 100); 
    cnv.parent("canvas");
    angleMode(DEGREES);
    colorMode(HSB);
    noLoop();
}

function draw() 
{
  background(220, 46.15, 78); // bleu clair

  // dimensions de la grille
  let cols = 4;
  let rows = 4;

  // dimension d'un carreau de la grille
  let cell_width = width / cols;
  let cell_height = height / rows;

  // rayon
  let r = min(cell_width, cell_height) * 0.5;

  // dessin des fractales dans chaque carreau :
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {

      // coordonnées du centre du carreau :
      let cx = i * cell_width + cell_width / 2;
      let cy = j * cell_height + cell_height / 2;

      // direction (en degré) de la fractale :
      let dir = 150 + (i + j) * 120;
      // le facteur augmente l'inclinaison

      // dessin de la fractale :
      pentaflake(
        cx,
        cy,
        r,
        dir,
        max_depth,
        color(0, 68, 100)
      );
    }
  }
}

function pentagon(x, y, r, direction, penColor) 
{
  /* dessine la forme du pentagon, le motif de la fractale 
  pré-conditions : 
    - (x, y) : centre du pentagon
    - r : distance du centre à un sommet
    - direction : orientation du pentagon
  */

  fill(penColor);
  noStroke();
  beginShape();

  let angle = direction + 80;
  let side = 2 * r * sin(30);

  let px = x + r * cos(direction);
  let py = y + r * sin(direction);

  for (let i = 0; i < 5; i++) 
  {
    vertex(px, py);
    px += side * cos(angle);
    py += side * sin(angle);
    angle += 80; // modifie la "densité" des élements jaunes, + c'est petit, + c'est dense
  }

  endShape(CLOSE);
}

function pentaflake(x, y, r, direction, n, penColor = color(57, 50, 100)) 
{
  // dessine la fractale en fonction du niveau de détail n

    if (n === 0) // aucun niveau de détail : forme seule & aussi cas de base de cette fonction récursive
    {
        pentagon(x, y, r, direction, penColor);
        return;
    }

    let r2 = r / (1 + 2 * cos(45));
    let d = 2 * r2 * cos(50);

    for (let i = 0; i < 5; i++) 
    {
        let x2 = x + d * cos(direction);
        let y2 = y + d * sin(direction);

        pentaflake(x2, y2, r2, direction, n - 1);
        direction += 300; // modifie la forme globale
    }

    pentaflake(x, y, r2, direction + 300, n - 1, color(0, 68, 100));
}

function windowResized() 
{
  // gère la "responsivité" du site au niveau de la taille du canvas

  resizeCanvas(800, windowHeight - 100);
  redraw();
}