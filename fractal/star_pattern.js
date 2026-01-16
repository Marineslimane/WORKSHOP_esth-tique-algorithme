let zoom = 1;
let centerX = 0;
let centerY = 0;
let outer_points = 8; // modifiable pour augmenter le nombre de sommets extérieurs de l'étoile
let factor = 10;

function setup() {
    createCanvas(windowWidth, windowHeight); // plein écran
    noLoop();
}

function windowResized()
{
    /* fait en sorte que quand la fenêtre change de taille, on reste en plein écran*/

    resizeCanvas(windowWidth, windowHeight);
    redraw();
}

function draw() 
{
    background(15, 20, 40);
    stroke(220, 180, 90);
    strokeWeight(2/zoom); // épaisseur du trait diminue avec le zoom
    noFill();

    translate(width / 2, height / 2); // change l'origine au milieu de l'écran
    scale(zoom); // multiplie les coordonnées par zoom
    translate(-width / 2, -height / 2); // revient à l'origine de base

    // niveau de détail du visuel : 
    let detail_level = floor(log(zoom + 1) / log(2));  // transforme le zoom en niveau de détail : plus on zoom, plus il y a de détail
    detail_level = constrain(detail_level, 0, 20); // force le niveau à rester dans l'intervalle donné

    let size_block  = 300/zoom; // plus on zoom, plus la taille d'un "bloc" devient plus petite

    for (let y = -size_block; y < height + size_block; y += size_block) // rempli de haut en bas l'écran
    {
        for (let x = -size_block; x < width + size_block; x += size_block) // rempli de gauche à droite l'écran
        {
            // dessine le symbole autour du point (x, y) :
            drawRadialStar(
            x,
            y,
            size_block * 0.4,
            size_block * 0.18,
            outer_points,
            detail_level
            );
        }
    }
}

// version précédente (je la laisse pour de futures améliorations) : 
/* function drawRadialStar(center_x, center_y, outer_radius, inner_radius, outer_points, level)
{
    /*
        dessine un symbol étoile
        pré-conditions : 
            - 
     */

 /*    push(); // sauvegarde l'état du canvas
    translate(center_x, center_y); // change l'origine au point (x,y)
    beginShape(); // pour dessiner la forme à l'aide de sommets

    for (let i = 0; i < outer_points * 2; i++) // pour chaque arete de la forme ou chaque sommets en comptant les "sommets internes" de l'étoile
    {
        let angle = i*factor*PI /(2*outer_points); // la formule de base est i * 2*PI /(2*outer_points); où 2*PI /(2*outer_points) permet de diviser le cercle en autant de portions que de sommets internes et externes, mais on peut simplifier par 2

        let r; // rayon du centre de la forme au sommet i
        if (i % 2 == 0)
        {
            r = outer_radius;
        }
        else
        {
            r = inner_radius;
        } 

        // formules trigo pour retrouver x,y à partir de r et de cos et sin de l'angle : 
        let x = cos(angle) * r;
        let y = sin(angle) * r;

        vertex(x, y); // ajoute le sommet (x,y) au tracé de la forme
    }


    for (let i = 1; i <= level; i++) 
    {
        push();
        rotate(i * factor*PI / (2*outer_points));
        scale(1 / (i + 1));
        beginShape();

        // même logique :
        for (let j = 0; j < outer_points * 2; j++)
        {
            let angle = j * factor * PI / (2*outer_points);

            let r;
            if (i % 2 == 0)
            {
                r = outer_radius;
            }
            else
            {
                r = inner_radius;
            } 

            vertex(cos(angle) * r, sin(angle) * r);
        }

        endShape(CLOSE);
        pop();
    }

    endShape(CLOSE); // referme la forme
    pop();
} */ 

function drawRadialStar(center_x, center_y, outer_radius, inner_radius, outer_points, level)
{
    /*
        ajoute des détails dans le symbole étoile
        pré-conditions : 
            - center_x, center_y, outer_points, level : int
            - outer_radius, inner_radius : float
    */

    push();
    translate(center_x, center_y); // nouveau centre

    stroke(220, 180, 90);
    noFill();

    drawStar(outer_radius, inner_radius, outer_points);

    if (level > 0)
    {
        for (let i = 0; i < outer_points; i++)
        {
            let angle = i * TWO_PI / outer_points; // la formule de base est i * 2*PI /(2*outer_points); où 2*PI /(2*outer_points) permet de diviser le cercle en autant de portions que de sommets internes et externes, mais on peut simplifier par 2
            let r = outer_radius * 0.5;

            push(); // sauvegarde l'état du canvas

            translate(cos(angle) * r, sin(angle) * r); // change l'origine
            scale(0.5);
            drawRadialStar(0, 0, outer_radius, inner_radius, outer_points, level - 1);
            pop();
        }
    }

    pop();
}

function drawStar(outer_radius, inner_radius, outer_points)
{
    /*
        dessine un symbol étoile
        pré-conditions : 
            - outer_points: int
            - outer_radius, inner_radius : float
    */

    beginShape();

    for (let i = 0; i < outer_points * 2; i++)
    {
        let angle = i * TWO_PI / (outer_points * 2);

        let r;
        if (i % 2 == 0)
        {
            r = outer_radius;
        }
        else
        {
            r = inner_radius;
        } 

        vertex(cos(angle) * r, sin(angle) * r);
    }

    endShape(CLOSE); // referme la forme
}

function mouseWheel(event) 
{
    let zoom_factor = 1.1; // vitesse du zoom

    if (event.delta > 0) // si molette va vers le bas
    {
        zoom /= zoom_factor; // dézoom
    } 
    else // si molette va vers le haut
    {
        zoom *= zoom_factor; // zoom
    }

    zoom = constrain(zoom, 0.01, 50); // empêche le zoom de sortir des limites : on ne peut pas dézoomer à l'infini
    redraw(); // nouveau dessin avec le nouveau zoom

    return false;
}