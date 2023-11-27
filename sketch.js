let debugOn = true; // make sure this is set to false before uploading

let today = 0;

let days = [];
let daysToReveal;

let assets = {};

let homepage;
let body, controlsText, creditsText;
let canvas;
let noLoopCanvas;
// let debugCanvas;

let fonts = {};

let seedGenerator;
let testSeed;

function setup() {

    canvas = createCanvas(700, 700);
    canvas.parent("canvas-wrapper");
    noLoopCanvas = createGraphics(width, height);
    // debugCanvas = createGraphics(width, height);

    seedGenerator = new Random(random(0, 100000));

    resetModes();

    // textCache(false);
    // allSprites.autoDraw = false;
    // allSprites.autoUpdate = false;
    // world.autoStep = false;

    body = select("body");
    controlsText = select("#controls");
    creditsText = select("#credits");

    bodyColours = {
        unhover: color("#111"),
        hover: color("#969696"),
        current: color("#111"),
        step: 0,
        duration: 20,
    };

    createDays();
    daysToReveal = getDaysToReveal();
    daysToReveal = 3;

    homepage = new Homepage();
}

function draw() {

    if (!homepage.visible || (homepage.visible && homepage.doorOpen)) {

        if (days[today].loop) {
            push();
            days[today].update();
            pop();
            autoPlayP5Play();
            resetModes();
        } else if (homepage.enteringDoor || homepage.exitingDoor) {
            image(noLoopCanvas, 0, 0, width, height);
        }
    }

    if (homepage.visible) {
        homepage.update();
        homepage.display();
        resetModes();
    }

    updatePageBackground();
    // image(debugCanvas, 0, 0);
    // debugCanvas.clear();
}

function getDaysToReveal() {

    let todayDate = new Date();
    let startDate = new Date("2023-12-01");
    if (debugOn) todayDate = startDate; // debug delete later
    let timeSinceStart = (todayDate.getTime()+1) - startDate.getTime();
    timeSinceStart /= 24 * 60 * 60 * 1000;
    timeSinceStart = ceil(timeSinceStart);

    return timeSinceStart;
}

function createDays() {

    for (let i = 0; i < 25; i++) {
        let n = i+1;
        eval("days.push(new Day"+ n +"())");
    }
}

function changeDay(date) {

    // if (today == date) return;

    today = date;

    // resetP5Play();

    clear();

    push();
    days[today].prerun();
    pop();
    resetModes();
    resetSeeds();

    if (!days[today].loop) {
        push();
        days[today].update();
        pop();
        noLoopCanvas.image(canvas, 0, 0, width, height);
    }
}

function resetModes() {

    colorMode(RGB, 255);
    ellipseMode(CENTER);
    rectMode(CORNER);
    blendMode(BLEND);
    imageMode(CORNER);
    angleMode(RADIANS);
    textureMode(IMAGE);
    // pixelDensity(displayDensity());
}

function resetSeeds(){
    testSeed = seedGenerator.next();
    randomSeed(testSeed);
    noiseSeed(seedGenerator.next());
}

function autoPlayP5Play() {

    // if (days[today].autoPlayP5Play) {
    //     camera.on();
    //     allSprites.draw();
    //     world.step()
    //     allSprites.update();
    //     camera.off();
    // }
}

function resetP5Play() {

    // allSprites.removeAll();
    // world.gravity.x = 0;
    // world.gravity.y = 0;
    // world.allowSleeping = true;
}

function cleanupOnExit() {

    updateInfo(-1);
    cursor();
    pixelDensity(displayDensity());
}

function setupGrammar(grammarSource) {

    let grammar = tracery.createGrammar(grammarSource);
    grammar.addModifiers(tracery.baseEngModifiers);

    return grammar;
}

function getText(grammar) {

    return grammar.flatten("#origin#");
}

//RNG Correction
function Random(seed) {
    this._seed = seed % 2147483647;
    if (this._seed <= 0) this._seed += 2147483646;
  }

/**
 * Returns a pseudo-random value between 1 and 2^32 - 2.
 */
Random.prototype.next = function () {
    return this._seed = this._seed * 16807 % 2147483647;
};

/**
 * Returns a pseudo-random floating point number in range [0, 1).
 */
Random.prototype.nextFloat = function (opt_minOrMax, opt_max) {
    // We know that result of next() will be 1 to 2147483646 (inclusive).
    return (this.next() - 1) / 2147483646;
  };

function updateInfo(day) {

    if (day == -1) {
        controlsText.html("");
        creditsText.html("");
    } else {
        controlsText.html(day.controls);
        creditsText.html(day.credits);
    }
}

function updatePageBackground() {

    bodyColours.current = lerpColor(bodyColours.unhover, bodyColours.hover, bodyColours.step/bodyColours.duration);

    if (!homepage.visible && (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height)) {
        if (bodyColours.step < bodyColours.duration) bodyColours.step++;
    } else {
        if (bodyColours.step > 0) bodyColours.step--;
    }

    body.style("background-color", bodyColours.current);
}

function mousePressed() {

    if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {

        if (!homepage.visible) {
            homepage.visible = true;
            homepage.exitingDoor = true;
            bodyColours.step = bodyColours.duration + 20;
        }
        return;
    }

    if (homepage.visible) homepage.checkDoorClick();
    else days[today].mousePressed();
}

function mouseReleased() {

    if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;
    if (!homepage.visible) days[today].mouseReleased();
}

function keyPressed() {

    if (!homepage.visible || (homepage.visible && homepage.doorOpen)) days[today].keyPressed();
    else if (debugOn) {
        if (keyCode == 187) { // debug delete later
            daysToReveal++;
            console.log(daysToReveal);
            homepage.treeTinselA = homepage.createTreeTinsel();
            homepage.treeTinselB = homepage.createTreeTinsel();
        } else if (keyCode == 189) { // debug delete later
            daysToReveal--;
            console.log(daysToReveal);
            homepage.treeTinselA = homepage.createTreeTinsel();
            homepage.treeTinselB = homepage.createTreeTinsel();
        } else if (keyCode == 8) { // debug delete later
            clearStorage();
        }
    }
}

function keyReleased() {

    if (!homepage.visible || (homepage.visible && homepage.doorOpen)) days[today].keyReleased();
}