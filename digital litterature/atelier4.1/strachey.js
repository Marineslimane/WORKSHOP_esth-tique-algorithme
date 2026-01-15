const CAPS = false;


//  thésaurus :
const first = ['Darling', 'Dear', 'Honey', 'Jewel']
const second = ['duck', 'love', 'moppet', 'sweetheart']
const adjectives = [
    'adorable',
    'affectionate',
    'amorous',
    'anxious',
    'ardent',
    'avid',
    'breathless',
    'burning',
    'covetous',
    'craving',
    'curious',
    'darling',
    'dear',
    'devoted',
    'eager',
    'erotic',
    'fervent',
    'fond',
    'impatient',
    'keen',
    'little',
    'loveable',
    'lovesick',
    'loving',
    'passionate',
    'precious',
    'sweet',
    'sympathetic',
    'tender',
    'unsatisfied',
    'wistful',
]
const nouns = [
    'adoration',
    'affection',
    'ambition',
    'appetite',
    'ardour',
    'charm',
    'desire',
    'devotion',
    'eagerness',
    'enchantment',
    'enthusiasm',
    'fancy',
    'fellow feeling',
    'fervour',
    'fondness',
    'heart',
    'hunger',
    'infatuation',
    'liking',
    'longing',
    'love',
    'lust',
    'passion',
    'rapture',
    'sympathy',
    'tenderness',
    'thirst',
    'wish',
    'yearning',
]
const adverbs = [
    'affectionately',
    'anxiously',
    'ardently',
    'avidly',
    'beautifully',
    'breathlessly',
    'burningly',
    'covetously',
    'curiously',
    'devotedly',
    'eagerly',
    'fervently',
    'fondly',
    'impatiently',
    'keenly',
    'lovingly',
    'passionately',
    'seductively',
    'tenderly',
    'winningly',
    'wistfully',
]
const verbs = [
    'adores',
    'attracts',
    'cares for',
    'cherishes',
    'clings to',
    'desires',
    'holds dear',
    'hopes for',
    'hungers for',
    'is wedded to',
    'likes',
    'longs for',
    'loves',
    'lusts after',
    'pants for',
    'pines for',
    'prizes',
    'sighs for',
    'tempts',
    'thirsts for',
    'treasures',
    'wants',
    'wishes',
    'woos',
    'yearns for',
]

// implémentation : 
function maybe(words)
{
    if (choice([false, true]))
    {
        return ' ' + choice(words);
    }

    return '';
}

function choice(array)
{
    return array[Math.floor(Math.random() * array.length)];
}

function longer()
{
    return (
        ' My'
        + maybe(adjectives)
        + ' '
        + choice(nouns)
        + maybe(adverbs)
        + ' '
        + choice(verbs)
        + ' your'
        + maybe(adjectives)
        + ' '
        + choice(nouns)
        + '.'
    );
}

function shorter()
{
    return ' ' + choice(adjectives) + ' ' + choice(nouns) + '.';
}

function body()
{
    let text = '';
    let you_are = false;

    for (let i = 0 ; i < 5 ; i++)
    {
        let type = choice(['longer', 'shorter']);
        if (type == 'longer')
        {
            text = text + longer();
            you_are = false;
        }
        else
        {
            if (you_are)
            {
                text = text.slice(0, -1) + ': my' + shorter(); // .slice(début, fin) : la méthode donne la portion du tableau/de la string entre l'indice de début et l'indice de fin (exclu)
                you_are = false;
            }
            else
            {
                text = text + ' You are my' + shorter();
                you_are = true;
            }
        }
    }
    return text;
}

function textwrapFill(text, width)
{
    /*
        reproduction de la fonction textwrap.fill(text, width=value) en python
        qui prend un texte long et insére des retours à la ligne pour que chaque 
        ligne fasse au plus width caractères, sans couper les mots
    */

    const words = text.split(" "); // découpe le texte en mots 
    let lines = []; // tableau des lignes
    let current_line = "";

    for(let word of words) // parcourt par variable du tableau words
    {
        if ((current_line + word).length <= width) // si on a la place de rajouter le mot word
        {
            current_line += word + " ";
        }
        else // si on n'a pas la place
        {
            lines.push(current_line); // on ajoute la ligne actuelle au tableau des lignes
            current_line = word + " "; // et on commence une nouvelle ligne commençant par word
        }
    }
    
    lines.push(current_line); // on ajoute la dernière ligne au tableau des lignes
    
    return lines.join("\n"); // lines.join("\n") converti le tableau en une string avec chaque élément du tableau séparé par un \n dans la string
}

function letter()
{
    // dans le code version python il y avait textwrap.fill() de la bibliothèque textwrap qui n'existe pas en js
    let text = ` ${choice(first)} ${choice(second)}\n\n` +
           `${textwrapFill(body(), 80)} \n\n` +
           `                           Yours  ${choice(adverbs)} \n\n` +
           `                                  M.U.C.\n`;

    return CAPS ? text.toUpperCase() : text;

    // en python, on avait la méthode intégrée upper() de la classe str qui converti toutes les lettres de la string en majuscules et renvoie une nouvelle string, ne modifie pas celle originale
    // en js, on a la méthode intégrée toUpperCase() qui fait exactement la même chose
}

document.getElementById("output").innerText = " ";

function sleep(ms) 
{
    // en python on avait la fonction sleep() de la librairie time qui bloque le programme pendant un certain temps en s, ceci est l'équivalent en js

    // new Promise() : une promesse qui vient plus tard
    // resolve : pour quand la promesse est terminée, dans Promesse quand on fait resolve => on définit le comportement de la fonction resolve ie ce que doit faire le programme quand la promesse est terminée
    // setTimeout(resolve, ms) : appelle resolve() après ms millisecondes
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() 
{
    while (true)
    {
        document.getElementById("output").innerText = letter();
        await sleep(1200); // attend que la promesse soit terminée avant de continuer
    }
}

window.onload = () => {
    run();
};