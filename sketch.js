// Fourier Series
// Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/125-fourier-series.html
// https://youtu.be/Mm2eYfj0SgA


const USER = 0;
const FOURIER = 1;

let fourierY;
let time = 0;
let path = [];
let y = [];
let state = 0;

function setup() {
    // console.log("in sketch.js", drawing); 
    createCanvas(600,800);
}

function draw() { 
    
    if (state == USER){
        fileInput.addEventListener("change", handleFileSelection);
    } else if (state == FOURIER){

    background(0);
    // stroke("white");
    
    let x = width/2;
    let y = height/2;



    for (i = 0; i < fourierY.length; i++){

        prevx = x;
        prevy = y;

        let radius = fourierY[i].radius;
        let freq = fourierY[i].freq;
        let phase = fourierY[i].phase;

        x += radius*cos(freq * time + phase);
        y += radius*(sin(freq * time + phase));
        
        // noFill();
        // stroke("white");
        // ellipse(prevx,prevy, 2 * radius);
        
        // line(prevx,prevy, x, y);
        
        // ellipse(prevx, prevy,8);
};
    // ellipse(x, y,8);
    v = createVector(x,y)
    path.unshift(v);

    beginShape();
    noFill();
    stroke("red");
    for (let iter = 0; iter < path.length; iter++){
        vertex(path[iter].x, path[iter].y);
    }
    endShape();

    
    dt = TWO_PI / fourierY.length; //////????? WHat????
    time += dt;

    // Reset event flag
    if (time > TWO_PI){
        state = USER;
    }
}    
}
