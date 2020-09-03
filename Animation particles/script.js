// Little Canvas things
var canvas = document.querySelector("#canvas"),
    ctx = canvas.getContext('2d');

// Set Canvas to be window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Configuration, Play with these
var config = {
    particleNumber: 10,
    maxParticleSize: 10,
    maxSpeed: 40,
    colorVariation: 50
};

// Colors
var colorPalette = {
    bg: {r:12,g:9,b:29},
    matter: [
        //{r:36,g:18,b:42}, // darkPRPL
        {r:41,g:137,b:216}, // darkPRPL
        {r:32,g:124,b:202}, // darkPRPL
        //{r:125,g:185,b:232}, // darkPRPL
        //{r:78,g:36,b:42}, // rockDust
        //{r:255,g:48,b:48}, // rockDust
        //{r:252,g:178,b:96}, // solorFlare
        //{r:253,g:238,b:152} // totesASun
    ]
};

// Some Variables hanging out
var particles = [],
    centerX = canvas.width / 2,
    centerY = canvas.height / 2,
    drawBg,
    rad = (Math.PI / 180),

// Draws the background for the canvas, because space
    drawBg = function (ctx, color) {
        ctx.fillStyle = "rgb(" + color.r + "," + color.g + "," + color.b + ")";
        ctx.fillRect(0,0,canvas.width,canvas.height);
    };

// Particle Constructor
var Particle = function (x, y) {
    // X Coordinate
    //this.x = x || Math.round(Math.random() * canvas.width);
    this.x = x || canvas.width/2 - (Math.round(Math.random() * 160) + 10);
    // Y Coordinate
    //this.y = y || Math.round(Math.random() * canvas.height);
    this.y = y || canvas.height/2;
    // Radius of the space dust
    this.r = Math.ceil(Math.random() * config.maxParticleSize);
    // Color of the rock, given some randomness
    this.c = colorVariation(colorPalette.matter[Math.floor(Math.random() * colorPalette.matter.length)],true );
    // Speed of which the rock travels
    this.s = Math.pow(Math.ceil(Math.random() * config.maxSpeed), .7);
    // Direction the Rock flies
    this.d = Math.round(120);
    //this.d = Math.floor(Math.random() * 10) + 1;
    //this.d = 10;
};

// Provides some nice color variation
// Accepts an rgba object
// returns a modified rgba object or a rgba string if true is passed in for argument 2
var colorVariation = function (color, returnString) {
    var r,g,b,a, variation;
    r = Math.round(((Math.random() * config.colorVariation) - (config.colorVariation/2)) + color.r);
    g = Math.round(((Math.random() * config.colorVariation) - (config.colorVariation/2)) + color.g);
    b = Math.round(((Math.random() * config.colorVariation) - (config.colorVariation/2)) + color.b);
    a = Math.random() + .5;
    if (returnString) {
        return "rgba(" + r + "," + g + "," + b + "," + a + ")";
    } else {
        return {r,g,b,a};
    }
};

// Used to find the rocks next point in space, accounting for speed and direction
var updateParticleModel = function (p) {
    var a = 180 - (p.d + 90); // find the 3rd angle
    //p.d > 0 && p.d < 180 ? p.x += p.s * Math.sin(p.d) / Math.sin(p.s) : p.x -= p.s * Math.sin(p.d) / Math.sin(p.s);
    //p.d > 90 && p.d < 270 ? p.y += p.s * Math.sin(a) / Math.sin(p.s) : p.y -= p.s * Math.sin(a) / Math.sin(p.s);

    p.d > 0 && p.d < 180 ? p.x += Math.random() * 3 : p.x -= Math.random() * 3;
    //p.d > 90 && p.d < 270 ? p.y += p.s * Math.sin(a) / Math.sin(p.s) : p.y -= p.s * Math.sin(a) / Math.sin(p.s);

    // p.x += Math.random() * 3;
    p.y -= Math.random() * 12;

    return p;
};

// Just the function that physically draws the particles
// Physically? sure why not, physically.
var drawParticle = function (x, y, r, c) {
    // ctx.beginPath();
    // ctx.fillStyle = c;
    // ctx.arc(x, y, r, 0, 2*Math.PI, false);
    // ctx.fill();
    // ctx.closePath();
    var vy = Math.floor(Math.random() * 5) + 2;
    var life = Math.random() * 30;


    ctx.beginPath();
    ctx.fillStyle = c;
    var x1 = x + r * Math.cos(-90 * rad);
    var y1 = y + r * Math.sin(-90 * rad);
    var cx1 = x + r * Math.cos((-90 + 22.5) * rad);
    var cy1 = y + r * Math.sin((-90 + 22.5) * rad);
    var cx2 = x + r * Math.cos((-90 - 22.5) * rad);
    var cy2 = y + r * Math.sin((-90 - 22.5) * rad);
    var chord = 2 * r * Math.sin(22.5 * rad / 2);

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.arc(cx1, cy1, chord, (270 + -90) * rad, (270 + -90 + 225) * rad);
    ctx.lineTo(x, y);
    ctx.moveTo(x1, y1);
    ctx.arc(cx2, cy2, chord, (90 + -90) * rad, (90 + -90 + 135) * rad, true);
    ctx.lineTo(x, y);
    ctx.fill();

    y-=vy;

    life*=0.8;
};

// Remove particles that aren't on the canvas
var cleanUpArray = function () {
    particles = particles.filter((p) => {
        return (p.x > -100 && p.y > -100);
    });
};


var initParticles = function (numParticles, x, y) {
    for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle(x, y));
    }
    particles.forEach((p) => {
        drawParticle(p.x, p.y, p.r, p.c);
    });
};

// That thing
window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();


// Our Frame function
var frame = function () {
    // Draw background first
    drawBg(ctx, colorPalette.bg);
    // Update Particle models to new position
    particles.map((p) => {
        return updateParticleModel(p);
    });
    // Draw em'
    particles.forEach((p) => {
        drawParticle(p.x, p.y, p.r, p.c);
    });
    // Play the same song? Ok!
    window.requestAnimFrame(frame);
};

// Click listener
document.body.addEventListener("click", function (event) {
    var x = event.clientX,
        y = event.clientY;
    cleanUpArray();
    initParticles(config.particleNumber, x, y);

    setTimeout(function(){
        initParticles(config.particleNumber, x - 20, y);
    }, 200);

    setTimeout(function(){
        initParticles(config.particleNumber, x - 40, y);
    }, 400);

});

// First Frame
frame();

// First particle explosion
initParticles(config.particleNumber);

setTimeout(function(){
    initParticles(config.particleNumber);
}, 400);

setTimeout(function(){
    initParticles(config.particleNumber);
}, 800);
