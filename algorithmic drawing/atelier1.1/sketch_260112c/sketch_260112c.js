function setup() {
  createCanvas(640, 400);
  stroke(255);
  strokeWeight(1);
  background(0);
  noFill();
  colorMode(HSB, 360, 100, 100);
}

function draw() {
  
  let A = width/2;
  let B = height/2;
  // (A, B) est le point central de la toile
  let R = height * 0.7;

  for (let w = PI / 4; w <= 3.6; w += 0.05) 
  {
    let x = R * cos(w);
    let y = R * sin(w);

    // coloration : 
    hue = (w * 900) % 360; // le dégradé est par défaut circulaire du coup quand on fait un tour complet ça se repète c'est pourquoi on prend le modulo
    stroke(hue, 50, 100); // couleur du trait avec mode HSB
    // stroke(hue, sat, bright)

    line(A + x, B - y, A - y, B - x);
    line(A - y, B - x, A - x, B + x);
    line(A - x, B + y, A + x, B - y);
    line(A - x, B + y, A + y, B + x);
    line(A + x, B + x, A + x, B - y);

    R *= 0.94;
  }

  noLoop();
}
