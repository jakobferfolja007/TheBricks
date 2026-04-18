function drawIt() {

var x = 150;
var y = 150;
var dx = 3;     // stalna hitrost
var dy = -5;    // stalna hitrost
var ctx;
var WIDTH;
var HEIGHT;
var r = 10;

var paddlex;
var paddleh;
var paddlew = 140; // stalna širina

var rightDown = false;
var leftDown = false;

var bricks;
var NROWS;
var NCOLS;
var BRICKWIDTH;
var BRICKHEIGHT;
var PADDING;

var sekunde;
var sekundeI;
var minuteI;
var intTimer;
var izpisTimer;

var tocke;
var start = true;
var intervalId;

var launch = false;


var paddlecolor = "#00f0ff";
var ballcolor = "#ffffff";

function init() {
ctx = $('#canvas')[0].getContext("2d");
WIDTH = $("#canvas").width();
HEIGHT = $("#canvas").height();

init_paddle();
initbricks();


sekunde = 0;
izpisTimer = "00:00";
intTimer = setInterval(timer, 1000);

tocke = 0;
$("#tocke").html(tocke);

intervalId = setInterval(draw, 10);

prikaziRezultate();
}

function vseOpekeRazbite() {
    for (var i = 0; i < NROWS; i++) {
        for (var j = 0; j < NCOLS; j++) {
            if (bricks[i][j] > 0) {
                return false;
            }
        }
    }
    return true;
}


function circle(x, y, r) {
let gradient = ctx.createRadialGradient(x, y, 2, x, y, r);
gradient.addColorStop(0, "#ffffff");
gradient.addColorStop(1, ballcolor);

ctx.shadowBlur = 15;
ctx.shadowColor = ballcolor;

ctx.fillStyle = gradient;
ctx.beginPath();
ctx.arc(x, y, r, 0, Math.PI * 2, true);
ctx.closePath();
ctx.fill();

ctx.shadowBlur = 0;
}

function rect(x, y, w, h) {
ctx.beginPath();
ctx.rect(x, y, w, h);
ctx.closePath();
ctx.fill();
}

function clear() {
ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

function init_paddle() {
paddlex = WIDTH / 2;
paddleh = 10;
}

function initbricks() {
NROWS = 5;
NCOLS = 6;
BRICKWIDTH = (WIDTH / NCOLS) - 1;
BRICKHEIGHT = 18;
PADDING = 1;

bricks = [];
for (var i = 0; i < NROWS; i++) {
bricks[i] = [];
for (var j = 0; j < NCOLS; j++) {
bricks[i][j] = Math.floor(Math.random() * 5) + 1;
}
}
}

function draw() {
clear();

if (!launch) {
x = paddlex + paddlew / 2;
y = HEIGHT - paddleh - r;
}

ctx.fillStyle = ballcolor;
circle(x, y, r);

if (rightDown) {
if ((paddlex + paddlew) < WIDTH) paddlex += 5;
else paddlex = WIDTH - paddlew;
} else if (leftDown) {
if (paddlex > 0) paddlex -= 5;
else paddlex = 0;
}

ctx.fillStyle = paddlecolor;
rect(paddlex, HEIGHT - paddleh, paddlew, paddleh);

for (var i = 0; i < NROWS; i++) {
for (var j = 0; j < NCOLS; j++) {
if (bricks[i][j] > 0) {


let color1, color2;

if (bricks[i][j] == 5) {
    color1 = "#ff5fa2";
    color2 = "#ff2d75";
}
else if (bricks[i][j] == 4) {
    color1 = "#c77dff";
    color2 = "#a100ff";
}
else if (bricks[i][j] == 3) {
    color1 = "#66e0ff";
    color2 = "#00c3ff";
}
else if (bricks[i][j] == 2) {
    color1 = "#66ff66";
    color2 = "#00cc44";
}
else {
    color1 = "#ffff99";
    color2 = "#ffcc00";
}

let grad = ctx.createLinearGradient(0, 0, 0, BRICKHEIGHT);
grad.addColorStop(0, color1);
grad.addColorStop(1, color2);

ctx.shadowBlur = 15;
ctx.shadowColor = color2;

ctx.fillStyle = grad;

rect(
    (j * (BRICKWIDTH + PADDING)) + PADDING,
    (i * (BRICKHEIGHT + PADDING)) + PADDING,
    BRICKWIDTH,
    BRICKHEIGHT
);

ctx.shadowBlur = 0;


}
}
}

var rowheight = BRICKHEIGHT + PADDING;
var colwidth = BRICKWIDTH + PADDING;
var row = Math.floor(y / rowheight);
var col = Math.floor(x / colwidth);

if (y < NROWS * rowheight && row >= 0 && col >= 0) {
if (bricks[row][col] > 0) {
dy = -dy;


if (bricks[row][col] == 5) tocke += 20;
else if (bricks[row][col] == 4) tocke += 15;
else if (bricks[row][col] == 3) tocke += 10;
else if (bricks[row][col] == 2) tocke += 5;
else tocke += 1;

bricks[row][col]--;

if (vseOpekeRazbite()) {
        clearInterval(intervalId);
         clearInterval(intTimer);   
        start = false;    

        Swal.fire({
            title: "Zmagal si! ",
            backdrop: false,
            html:
                "Točke: <b>" + tocke + "</b><br>" +
                "Čas: <b>" + izpisTimer + "</b><br><br>" +
                "Vnesi svoje ime:",
            input: "text",
            inputPlaceholder: "Tvoje ime",
            showCancelButton: true,
            confirmButtonText: "Shrani",
            cancelButtonText: "Brez imena"
        }).then((result) => {

            let ime = result.value;
            if (!ime) ime = "Zmagovalec ";

            shraniRezultat(ime, izpisTimer, tocke);
            prikaziRezultate();
        });

        return;
    }

}


}
$("#tocke").html(tocke);




if (x + dx > WIDTH - r || x + dx < r) dx = -dx;

if (y + dy < r) dy = -dy;
else if (y + dy > HEIGHT - r) {


start = false;

if (x > paddlex && x < paddlex + paddlew) {
    dx = 8* ((x - (paddlex + paddlew / 2)) / paddlew);
    dy = -dy;
    start = true;
} else {

    clearInterval(intervalId);

    Swal.fire({
        title: "Game Over 🎮",
        backdrop:false,
        html:
            "Točke: <b>" + tocke + "</b><br>" +
            // "Nivo: <b>" + nivo + "</b><br>" +
            "Čas: <b>" + izpisTimer + "</b><br><br>" +
            "Vnesi svoje ime:",
        input: "text",
        inputPlaceholder: "Tvoje ime",
        showCancelButton: true,
        confirmButtonText: "Shrani",
        cancelButtonText: "Brez imena"
    }).then((result) => {

        let ime = result.value;
        if (!ime) ime = "Anonimen";

        //  shraniRezultat(ime, nivo, izpisTimer, tocke);
        shraniRezultat(ime, izpisTimer, tocke);

        prikaziRezultate();
    });
}


}

if (launch) {
x += dx;
y += dy;
}
}

function timer() {
if (start == true) {
sekunde++;

sekundeI = ((sekunde % 60) > 9) ? (sekunde % 60) : "0" + (sekunde % 60);
minuteI = (Math.floor(sekunde / 60) > 9) ? Math.floor(sekunde / 60) : "0" + Math.floor(sekunde / 60);

izpisTimer = minuteI + ":" + sekundeI;
$("#cas").html(izpisTimer);
}
}

function onKeyDown(evt) {
if (evt.keyCode == 39) rightDown = true;
else if (evt.keyCode == 37) leftDown = true;

if (evt.keyCode == 32 && !launch) {
launch = true;
}
}

function onKeyUp(evt) {
if (evt.keyCode == 39) rightDown = false;
else if (evt.keyCode == 37) leftDown = false;
}

$(document).keydown(onKeyDown);
$(document).keyup(onKeyUp);

init();
}

// NAVODILA
function prikaziNavodila() {
Swal.fire({
title: "Navodila",
backdrop:false,
html:
"Premik: puščice<br>" +
"SPACE za začetek<br>" +
" Razbij vse opeke!",
icon: "info"
});
}

// LOCAL STORAGE (brez nivoja)
function shraniRezultat(ime, cas, tocke) {
let podatki = localStorage.getItem("rezultati");
let seznam = [];


if (podatki) seznam = podatki.split("|");

seznam.push(ime + ";" + cas + ";" + tocke);

if (seznam.length > 5) seznam.shift();

localStorage.setItem("rezultati", seznam.join("|"));


}

function prikaziRezultate() {
let podatki = localStorage.getItem("rezultati");
let seznam = $("#rezultati");


seznam.empty();
if (!podatki) return;

let vnosi = podatki.split("|");

vnosi.forEach(vnos => {
    let deli = vnos.split(";");

    seznam.append(
        "<li><strong>" + deli[0] + "</strong><br>" +
        //  "Nivo: " + deli[1] + "<br>" +
        "Čas: " + deli[1] + "<br>" +
        "Točke: " + deli[2] + "</li>"
    );
});


}

// RESET
function resetRezultate() {
Swal.fire({
title: "Si prepričan?",
backdrop:false,
text: "Vsi rezultati bodo izbrisani!",
icon: "warning",
showCancelButton: true,
confirmButtonText: "Da, izbriši",
cancelButtonText: "Prekliči"
}).then((result) => {
if (result.isConfirmed) {
localStorage.removeItem("rezultati");
prikaziRezultate();


        Swal.fire({   
            title:"Izbrisano!",
             backdrop:false,
              icon:"success"});
    }
});


}
