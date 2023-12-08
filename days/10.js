// Made by Gillian Smith

class Day10 extends Day {

    constructor () {

        super();
        this.loop = true; // Set to true or false

        this.controls = "CLICK to regenerate, MOUSE OVER to see constellations"; // Write any controls for interactivity if needed or leave blank
        this.credits = "Made by Gillian Smith"; // Replace with your name

        // Define variables here. Runs once during the sketch holder setup
        this.constellations = [];
        this.shootingStars = [];
        this.timeOverStar = -1;
        this.currentConstellation = -1;
        this.arthur = {}
        this.molly = {};

        this.landscape = createGraphics(width, height/2);
    }

    prerun() {
        // Initialise/reset variables here. Runs once, every time your day is viewed
        //this.generateConstellations();

        this.regenerate();
        this.timeOverStar = -1;
        this.currentConstellation = -1;

        this.shootingStars = [];
        for (let i = 0; i < 20; i++) {
           this.shootingStars.push(-1);
        }
    }

    update() {
        // Update and draw stuff here. Runs continuously (or only once if this.loop = false), while your day is being viewed
        background(0); // You can delete this line if you want

        if (this.checkMouseInLandscape()) {
            this.timeOverStar = 0;
        }

        this.renderSky();
        this.renderStarfield();
        this.renderAndUpdateShootingStars();
        this.renderConstellations();
        this.renderLandscape();
        this.renderConstellationDescription();

        this.drawFakeCursor();
        if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
            cursor();
        }
        else {
            noCursor();
        }
    }

    renderConstellationDescription() {
        textFont(assets.day10boldFont);
        if (this.currentConstellation != -1 && this.timeOverStar > 0 && !this.checkMouseInLandscape()) {
            let constellation = this.constellations[this.currentConstellation];
            textSize(16);
            fill(255);
            text(constellation.stars.name, 0, height - 8);
        }
    }

    drawFakeCursor() {
        noFill();
        if (this.checkMouseInLandscape()) {
            stroke(200);
            line(mouseX - 5, mouseY, mouseX + 5, mouseY);
            line(mouseX, mouseY - 5, mouseX, mouseY + 5);
        }
        else {
            if (this.timeOverStar > 0) {
                let t = (this.timeOverStar/1000 > 1) ? 1 : this.timeOverStar/1000;
                stroke(200, 200, 200, lerp(100, 0, t));
            }
            else {
                stroke(100);
            }
            circle(mouseX, mouseY, 10);
        }
    }

    checkMouseInLandscape() {
        if (mouseY < height - this.landscape.height) {
            return false;
        }

        let x = mouseX;
        let y = mouseY - height + this.landscape.height;
        let d = this.landscape.pixelDensity();

        let checkIndex = 4 * (y * d * width * d + x * d) + 3;

        if (this.landscape.pixels[checkIndex] > 0) {
            return true;
        }
        else {
            return false;
        }
    }

    regenerate() {
        this.makeArthurAndMolly();
        this.generateStarfield();
        this.generateConstellations();
        this.generateLandscape();
        noiseSeed(millis());
    }

    renderAndUpdateShootingStars() {

        for (let i = 0; i < this.shootingStars.length; i++) {
            //first update positions for any active stars
            if (this.shootingStars[i] != -1) {
                this.shootingStars[i].x += this.shootingStars[i].vx;
                this.shootingStars[i].y += this.shootingStars[i].vy;
                this.shootingStars[i].vy += 0.01;
                this.shootingStars[i].decay -= 0.1;
            }

            //then detect whether any active stars should become inactive
            if (this.shootingStars[i].x > width || this.shootingStars[i].x < 0 ||
                this.shootingStars[i].y > height || this.shootingStars[i].y < 0 ||
                this.shootingStars[i].decay <= 0) {
                    this.shootingStars[i] = -1;
            }

            //then decide whether to set any inactive stars back to active
            if (random(1) < 0.0001 && this.shootingStars[i] === -1) {
                this.shootingStars[i] = {};
                this.shootingStars[i].x = random(width);
                this.shootingStars[i].y = 0;
                this.shootingStars[i].vx = random(10, 20);
                this.shootingStars[i].vy = random(2, 40);
                this.shootingStars[i].decay = random(2, 4);
            }

            //finally, render the stars
            fill(255);
            noStroke();
            circle(this.shootingStars[i].x, this.shootingStars[i].y, this.shootingStars[i].decay);
        }
    }

    renderLandscape() {
        let landTop = height - this.landscape.height;
        image(this.landscape, 0, landTop);

        //draw the fire
        colorMode(HSB, 255, 100, 100, 100);

        let fireX = this.clearingX + this.clearingRadius/8;
        let fireY = landTop + this.clearingY - this.clearingRadius/8;
        let fireW = 25;

        let nFlames = 200;
        for (let i = 0; i < nFlames; i++) {
            let h = map(cos(i), -1, 1, 10, 35) + map(noise(i*0.2), 0, 1, -5, 5);
            let x = map(i, 0, nFlames, -fireW/2, fireW/2);
            let y = 5*sin(map(i, 0, nFlames, 0, PI));
            let w = fireW/3;
            fill(h, 100, 100, 3);
            beginShape();
            curveVertex(fireX + x + w/2, fireY + y);
            curveVertex(fireX + x - w/2, fireY + y);
            curveVertex(fireX + x, fireY + y - noise(frameCount*0.02 + i)*40);
            endShape(CLOSE);
        }
        colorMode(RGB);

        //and finally the fire pit stones
        fill(20, 5, 10);
        for (let i = 0; i < 20; i++) {
            let theta = map(i, 0, 20, -PI/4, PI + PI/4);
            let x = fireW*cos(theta);
            let y = 5*sin(theta);
            circle(fireX + x, fireY + y, 5);
        }
    }

    renderSky() {
        noStroke();
        let darkestSky = color(0, 0, 20);
        let lightestSky = color(0, 0, 100);
        for (let i = 0; i < height; i+=10) {
            fill(lerpColor(darkestSky, lightestSky, map(i, 0, height, 0, 1)))
            rect(0, i, width, 10);
        }


    }

    //render methods
    renderStarfield() {
        for (let i = 0; i < this.stars.length; i++) {
            if (this.stars[i].twinkle) {
                let twinkleMod = noise((i+1)*millis()/5000)
                fill(this.stars[i].brightness * map(twinkleMod, 0, 1, 0.6, 1.2))
                circle(this.stars[i].x, this.stars[i].y, map(twinkleMod, 0, 1, -2, 2) + this.stars[i].size)
            }
            else {
                fill(this.stars[i].brightness);
            }
            circle(this.stars[i].x, this.stars[i].y, this.stars[i].size);
        }
    }

    renderConstellations() {
        //calculate intersections
        let intersecting = [];
        let closest = -1;
        let closestDist = 1000000;
        for (let i = 0; i < this.constellations.length; i++) {
            let c = this.constellations[i];
            let d = dist(mouseX, mouseY, c.x, c.y);
            if (d < c.stars.radius) {
                intersecting.push(i);
                if (d < closestDist) {
                    closestDist = d;
                    closest = i;
                }
            }
        }

        //figure out if the mouse is hovering over a star or not
        let overStar = false;
        if (closest != -1) {
            for (let i = 0; i < this.constellations[closest].stars.numStars; i++) {
                let star = this.constellations[closest].stars.starPoints[i];
                let starX = this.constellations[closest].x + star[0];
                let starY = this.constellations[closest].y + star[1];
                let d = dist(mouseX, mouseY, starX, starY);
                if (d < 2*this.constellations[closest].stars.stars[i].size) {
                    overStar = true;
                    this.timeOverStar += deltaTime;
                }
            }
        }

        if (overStar && this.timeOverStar > 0) {
            let r = this.constellations[closest].stars.radius;
            let x = this.constellations[closest].x;
            let y = this.constellations[closest].y;

            let t = this.timeOverStar / 1000;
            if (t > 1) t = 1;
            fill(0, 0, 20, lerp(0, 180, t));
            circle(x, y, r*2);

            fill(0, 0, 10, lerp(0, 240, t));

            beginShape();
            vertex(0, 0);
            vertex(width, 0);
            vertex(width, height);
            vertex(0, height);
            beginContour();
            // vertex(mouseX + 50, mouseY + 50);
            // vertex(mouseX + 50, mouseY - 50);
            // vertex(mouseX - 50, mouseY - 50);
            // vertex(mouseX - 50, mouseY + 50);
            for (let theta = TWO_PI; theta > 0; theta -= 0.5) {
                 vertex(x + r * cos(theta), y + r * sin(theta));
            }
            endContour();
            endShape(CLOSE);

            push();
            translate(this.constellations[closest].x, this.constellations[closest].y);
            this.constellations[closest].stars.render(true, true, false);
            pop();
        }
        else if (!overStar) {
            this.timeOverStar = 0;
        }

        this.currentConstellation = closest;
    }

    // Below are optional functions for interactivity. They can be deleted from this file if you want

    mousePressed() {
        this.regenerate();
    }

    mouseReleased() {

    }

    keyPressed() {

    }

    keyReleased() {

    }

    generateStarfield() {
        this.stars = []
        for (let i = 0; i < this.arthur.stars.starPoints.length; i++) {
            let a = this.arthur.stars;
            this.stars.push({x: this.arthur.x + a.starPoints[i][0], y: this.arthur.y + a.starPoints[i][1], size: a.stars[i].size, brightness: a.stars[i].brightness, twinkle: true});
        }
        for (let i = 0; i < this.molly.stars.starPoints.length; i++) {
            let m = this.molly.stars;
            this.stars.push({x: this.molly.x + m.starPoints[i][0], y: this.molly.y + m.starPoints[i][1], size: m.stars[i].size, brightness: m.stars[i].brightness, twinkle: true});
        }
        for (let i = 0; i < 1000; i++) {
            this.stars.push({x: random(width), y: random(height), size: random(0.5, 5), brightness: random(250, 255)});
        }
    }

    makeArthurAndMolly() {
        //canis major, for Arthur
        //stars have r, theta, size, brightness, and index
        let arthurStars = [{r: 91.87914767659622, theta: 4.603334321941452, size: 1.7999999999999998, brightness: 244},{r: 66.48642300834393, theta: 4.244257096509068, size: 1.7999999999999998, brightness: 244},{r: 49.360352961100716, theta: 4.424813149604242, size: 1.7999999999999998, brightness: 244},{r: 52.174919474995086, theta: -1.3909428270024184, size: 10, brightness: 244},{r: 68.05226749426583, theta: -0.6043055068662296, size: 3.700000000000021, brightness: 244},{r: 38.666666666666664, theta: -0.8097835725701669, size: 1.400000000000019, brightness: 244},{r: 20.055478608655093, theta: 4.338055364377106, size: 0.9000000000000187, brightness: 244},{r: 28.92134928464515, theta: 2.6882539577352302, size: 2.60000000000002, brightness: 244},{r: 17.613126418163873, theta: 2.0852476398539244, size: 1.9000000000000195, brightness: 244},{r: 59.06681715556451, theta: 1.8568477685122147, size: 4.40000000000002, brightness: 253},{r: 53.08274463305168, theta: 2.0119758072098772, size: 2.50000000000002, brightness: 253},{r: 50.92041721047549, theta: 2.374710892260354, size: 5.400000000000016, brightness: 255},{r: 20.055478608655093, theta: 4.338055364377106, size: 2.2000000000000197, brightness: 241},{r: 71.67829363048327, theta: 2.382504207445267, size: 2.30000000000002, brightness: 248},{r: 90.55385138137416, theta: 2.387434323622613, size: 3.600000000000021, brightness: 248}] ;
        //manually set the following properties: starPoints, lines, name
        this.arthur = {x: random(width/4, 3*width/4), y: random(height/8, height/3), stars: new this.Constellation(100, arthurStars, true)};
        this.arthur.stars.starPoints = []
        for (let i = 0; i < this.arthur.stars.numStars; i++) {
            let r = this.arthur.stars.stars[i].r;
            let theta = this.arthur.stars.stars[i].theta;
            this.arthur.stars.starPoints.push([r*cos(theta), r*sin(theta)])
        }
        this.arthur.stars.lines = [[0, 1], [1, 2], [0, 2], [2, 3], [3, 4], [4, 5], [3, 12], [6, 7], [5, 8], [8, 9], [9, 10], [10, 11], [12, 6], [6, 11], [11, 13], [13, 14]]
        this.arthur.stars.name = "Canis Major"

        //lyra, for Molly
        let mollyStars = [{r: 61.38041671050756, theta: -1.4181469983996315, size: 2, brightness: 249},{r: 58.643934989998, theta: -0.8658691746629092, size: 8.399999999999986, brightness: 255},{r: 21.54065922853802, theta: -1.1902899496825317, size: 6.299999999999994, brightness: 249},{r: 27.8408173570948, theta: 3.4330494480676603, size: 3.4000000000000012, brightness: 240},{r: 30.594117081556714, theta: 3.338988213439674, size: 4.799999999999999, brightness: 240},{r: 90.04936917540782, theta: 2.150585562675693, size: 5.4999999999999964, brightness: 249},{r: 82.11103593441152, theta: 2.0889353920364337, size: 4.000000000000002, brightness: 246},{r: 64.06940680924781, theta: 1.7804361726691091, size: 4.5, brightness: 255}];
        this.molly = {x: random(width/4, 3*width/4), y: random(height/8, height/3), stars: new this.Constellation(100, mollyStars, true)};
        this.molly.stars.starPoints = []
        for (let i = 0; i < this.molly.stars.numStars; i++) {
            let r = this.molly.stars.stars[i].r;
            let theta = this.molly.stars.stars[i].theta;
            this.molly.stars.starPoints.push([r*cos(theta), r*sin(theta)])
        }
        this.molly.stars.lines = [[0,1], [1, 2], [2, 0], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 2]];
        this.molly.stars.name = "Lyra"
    }

    generateConstellations() {
        this.constellations = [];

        //add Arthur and Molly constellations
        this.constellations.push(this.arthur);
        this.constellations.push(this.molly);

        for (let _x = 0; _x < width; _x += 30) {
            for (let _y = 0; _y < height; _y += 30) {
                if (random(1) < 0.5) {
                    let x = _x + map(noise(0.2*_x), 0, 1, -10, 10);
                    let y = _y + map(noise(0.2*_y), 0, 1, -10, 10);

                    let radius = random(15, 40);
                    let foundStars = []
                    for (let j = 0; j < this.stars.length; j++) {
                        let star = this.stars[j];
                        if (star.twinkle != true) {
                            let r = dist(star.x, star.y, x, y);
                            let theta = -1;
                            if (r < radius) {
                                let xx = x - star.x;
                                let yy = y - star.y;

                                if (xx >= 0) {
                                    theta = atan(yy/xx) + PI
                                }
                                else {
                                    theta = atan(yy/xx)
                                }

                                foundStars.push({r: r, theta: theta, size: star.size, brightness: star.brightness, index: j})
                            }
                        }
                    }


                    if (foundStars.length > 4) {
                        this.constellations.push({x: x, y: y, stars: new this.Constellation(radius, foundStars)})
                    }
                }
            }
        }
    }


        // for (let i = 0; i < 150; i++) {
        //     let x = random(0, width);
        //     let y = random(0, height);
        //     let radius = random(30, 70);
        //     this.constellations.push({x: x, y: y, stars: new this.Constellation(radius)});
        // }

    generateLandscape() {
        noiseSeed(millis());

        this.landscape.noStroke();
        let start = random(-25, -5);
        let mid = random(this.landscape.width/2, 2*this.landscape.width/3);
        let end = random(width+5, width+20);
        let maxHeight = this.landscape.height;
        let minHeight = this.landscape.height/2;
        this.landscape.fill(255);
        this.makeMountainShape(start, mid, maxHeight, minHeight, 50, 0.02, 0.2, 0.5);
        this.makeMountainShape(mid-10, end, minHeight, maxHeight, 50, 0.02, 0.2, 0.4);
        this.landscape.fill(20, 10, 30);
        this.makeMountainShape(start, mid, maxHeight - 10, minHeight - 10, 30, 0.03, 0.1, 0.5);
        this.makeMountainShape(mid-10, end, minHeight, maxHeight, 30, 0.04, 0.1, 0.5);

        this.landscape.noStroke();
        let campsiteColor = color(10, 25, 30);
        let horizonColor = color(20, 10, 30);
        let horizonY = 3*this.landscape.height/4;
        let foregroundY = 5*this.landscape.height/6;
        for (let i = horizonY; i < foregroundY; i += 2) {
            this.landscape.fill(lerpColor(horizonColor, campsiteColor, map(i, horizonY, foregroundY, 0, 1)));
            this.landscape.rect(0, i, width, 2);
        }
        this.landscape.fill(campsiteColor);
        this.landscape.rect(0, foregroundY, width, this.landscape.height-foregroundY);

        this.clearingX = random(width/4, 3*width/4);
        this.clearingY = this.landscape.height;
        this.clearingRadius = width/6;

        this.landscape.colorMode(HSB)

        this.drawTreeLine(this.landscape, foregroundY, -1, 0.01);

        //draw the tent
        let tentHue = random(80, 360);
        let tentLight = this.landscape.color(tentHue, random(10, 20), random(20, 25));
        let tentDark = this.landscape.color(tentHue, random(10, 20), random(15, 20));
        let tentFire = this.landscape.color(random(20, 30), random(85, 100), random(85, 100), 0.5);

        let tentTheta = random(PI + PI/8, PI + PI/6);
        let tentX = this.clearingX + 3*this.clearingRadius/4 * cos(tentTheta);
        let tentY = this.clearingY + 3*this.clearingRadius/4 * sin(tentTheta);

        //main shape of the tent
        this.landscape.noStroke();
        this.landscape.fill(tentLight);
        this.landscape.beginShape();
        this.landscape.vertex(tentX - 20, tentY - 15);
        this.landscape.vertex(tentX - 10, tentY - 40);
        this.landscape.vertex(tentX + 40, tentY - 30);
        this.landscape.vertex(tentX + 30, tentY);
        this.landscape.endShape();

        //accent highlight on the tent
        //this.landscape.fill(lerpColor(tentLight, tentDark, 0.2));
        this.landscape.fill(tentDark);
        this.landscape.beginShape();
        this.landscape.vertex(tentX - 10, tentY - 40);
        this.landscape.vertex(tentX + 40, tentY - 30);
        this.landscape.vertex(tentX - 20, tentY - 15);
        this.landscape.endShape();

        //tent door
        this.landscape.fill(tentLight);
        this.landscape.beginShape();
        this.landscape.vertex(tentX + 30, tentY);
        this.landscape.vertex(tentX + 40, tentY - 30);
        this.landscape.vertex(tentX + 50, tentY - 10);
        this.landscape.endShape();

        this.landscape.blendMode(SOFT_LIGHT);
        this.landscape.fill(tentFire);
        this.landscape.beginShape();
        this.landscape.vertex(tentX + 30, tentY);
        this.landscape.vertex(tentX + 40, tentY - 30);
        this.landscape.vertex(tentX + 50, tentY - 10);
        this.landscape.endShape();
        this.landscape.blendMode(BLEND);

        //line for the tent door
        this.landscape.stroke(5);
        this.landscape.noFill();
        this.landscape.line(tentX + 40, tentY - 30, tentX + 40, tentY - 5);
        this.landscape.noStroke();

        //once the tent is in place, time to draw the rest of the trees
        for (let k = foregroundY + 10; k <= this.landscape.height; k += 10) {
            this.drawTreeLine(this.landscape, k, [this.clearingX, this.clearingY, this.clearingRadius], 0.5);
        }



        this.landscape.colorMode(RGB);

        this.landscape.loadPixels();

    }

    drawTreeLine(target, horizon, clearing, p) {
        for (let i = 0; i < 200; i++) {
            let treeCol = this.landscape.color(random(150, 180), random(70, 90), random(5, 10), 30);
            let trunkCol = this.landscape.color(random(240, 270), random(30, 50), random(2, 10), 90);
            let tx = noise(0.05*i) + random(0, width);
            let ty = map(noise(0.52*i), 0, 1, 0, 10) + horizon;
            let th = random(80, 100);
            let tw = random(50, 70);
            if (clearing === -1 || dist(tx, ty, clearing[0], clearing[1]) > clearing[2]) {
                if (noise(0.25*i, 0.1*horizon) > p) {
                    this.drawTree(target, tx, ty-th, tw, th, treeCol, trunkCol);
                }
            }
        }
    }

    drawTree(target, x, y, w, h, treeCol, trunkCol) {
        //trunk
        target.fill(trunkCol);
        target.triangle(x, y, x + w/10, y + h, x - w/10, y + h);
        target.fill(treeCol);
        //rest of tree
        target.triangle(x, y + h/2, x + w/2, y + 5*h/6, x - w/2, y + 5*h/6);
        target.triangle(x, y + h/3, x + w/3, y + 2*h/3, x - w/3, y + 2*h/3);
        target.triangle(x, y + h/4, x + w/4, y + h/2, x - w/4, y + h/2);
        target.triangle(x, y + h/8, x + w/5, y + 2*h/5, x - w/5, y + 2*h/5);
        target.triangle(x, y, x + w/6, y + h/4, x - w/6, y + h/4);
    }

    makeMountainShape(start, end, maxHeight, minHeight, craggy, noiseScale, noiseMin, noiseMax) {
        this.landscape.beginShape();
        this.landscape.vertex(start, this.landscape.height);
        this.landscape.vertex(start, this.landscape.height - maxHeight);
        for (let i = start; i < end; i += 5) {
            let noisyHeight = map(noise(noiseScale*i + frameCount%1000), 0, 1, noiseMin, noiseMax);
            let currHeight = map(i, start, end, maxHeight, minHeight)
            let heightAdjust = map(noisyHeight, noiseMin, noiseMax, currHeight - craggy, currHeight + craggy);
            this.landscape.vertex(i, this.landscape.height - heightAdjust);
        }
        this.landscape.vertex(end, this.landscape.height);
        this.landscape.endShape();
    }

    // Below is the basic setup for a nested class. This can be deleted or renamed
    Constellation = class {

        constructor(radius, _stars, set_manually = false) {
            this.DELAUNAY_EPSILON = 1.0 / 1048576.0
            this.stars = _stars
            this.numStars = _stars.length
            this.radius = radius
            if (!set_manually) {
                this.starPoints = []
                this.lines = []
                this.grammar = setupGrammar(assets.day10constellationGrammar)
                this.name = getText(this.grammar)


                this.finalizeStarsAndLines();
            }

        }

        render(showStars, showLines, showBounds) {
            if (showStars) {
                for (let i = 0; i < this.numStars; i++) {
                    let star = this.stars[i]
                    noStroke();
                    fill(star.brightness*255);
                    let x = star.r * cos(star.theta);
                    let y = star.r * sin(star.theta);
                    circle(x, y, star.size);
                }
            }

            if (showLines) {
                for (let i = 0; i < this.lines.length; i++) {
                    stroke(200);
                    strokeWeight(0.5)
                    noFill();
                    let s1 = this.starPoints[this.lines[i][0]];
                    let s2 = this.starPoints[this.lines[i][1]];
                    line(s1[0], s1[1], s2[0], s2[1]);
                }
            }

            if (showBounds) {
                stroke(0, 255, 0);
                strokeWeight(0.25);
                noFill();
                circle(0, 0, this.radius*2);
            }

        }

        //generate functions
        finalizeStarsAndLines() {
            for (let i = 0; i < this.numStars; i++) {
                let star = this.stars[i];
                this.starPoints.push([star.r * cos(star.theta), star.r * sin(star.theta)]);
            }

            this.triangles = this.delaunayTriangulate(this.starPoints);
            this.calculateMST(this.triangles); //stores MST in this.lines

            //pick a small number of remaining edges to add to the constellation
            let nExtra = int(random(0, 5));
            let found = 0;
            let nAttempts = 0;
            while (found < nExtra && nAttempts < 10) {
                let startEdge = int(random(this.numStars));
                let endEdge = this.edges[startEdge][int(random(this.edges[startEdge].length))].vertex;
                if (!(this.lines.includes([startEdge, endEdge]) || this.lines.includes([endEdge, startEdge]))) {
                    this.lines.push([startEdge, endEdge]);
                    found++;
                }
                nAttempts++;
            }
        }


        //bad implementation of Prim's
        calculateMST() {
            this.edges = {};
            for (let i = 0; i < this.starPoints.length; i++) {
                this.edges[i] = [];
            }
            for (let i = 0; i < this.triangles.length; i += 3) {
                let vi1 = this.triangles[i];
                let vi2 = this.triangles[i+1];
                let vi3 = this.triangles[i+2];

                let v1 = this.starPoints[vi1];
                let v2 = this.starPoints[vi2];
                let v3 = this.starPoints[vi3];

                this.edges[vi1].push({vertex: vi2,
                            weight: dist(v1[0], v1[1], v2[0], v2[1])});
                this.edges[vi2].push({vertex: vi3,
                            weight: dist(v2[0], v2[1], v3[0], v3[1])});
                this.edges[vi3].push({vertex: vi1,
                            weight: dist(v3[0], v3[1], v1[0], v1[1])});

                this.edges[vi2].push({vertex: vi1,
                                weight: dist(v1[0], v1[1], v2[0], v2[1])});
                this.edges[vi3].push({vertex: vi2,
                                weight: dist(v2[0], v2[1], v3[0], v3[1])});
                this.edges[vi1].push({vertex: vi3,
                                weight: dist(v3[0], v3[1], v1[0], v1[1])});
            }

            this.lines = []
            let reached = []
            let unreached = []
            for (let i = 0; i < this.starPoints.length; i++) {
                unreached.push(i);
            }
            let v = int(random(0, this.starPoints.length));
            reached.push(v);
            let v_i = unreached.indexOf(v);
            if (v_i > -1) {
                unreached.splice(v_i, 1);
            }
            while (reached.length < this.numStars) {
                let minweight = 100000;
                let connector = -1;
                let connected = -1;
                for (let j = 0; j < reached.length; j++) {
                    let cv = reached[j];
                    for (let k = 0; k < this.edges[cv].length; k++) {
                        if (!reached.includes(this.edges[cv][k].vertex)) {
                            if (this.edges[cv][k].weight < minweight) {
                                connector = this.edges[cv][k].vertex;
                                connected = cv;
                                minweight = this.edges[cv][k].weight;
                            }
                        }
                    }
                }
                if (connector != -1 && connected != -1) {
                    this.lines.push([connected, connector])
                    reached.push(connector);
                    let cv_i = unreached.indexOf(connected);
                    unreached.splice(cv_i, 1);
                }
                else {
                    console.log("WARNING: Could not connect.", this.edges, reached, unreached);
                    break;
                }
            }
        }




        //oh god there is so much math past this point
        //thanks to Allison Parrish and Golan Levin for this code, which I shamelessly stole
        //credit: https://editor.p5js.org/golan/sketches/kZHQrL5aK
        delaunayTriangulate (vertices, key) {
            var n = vertices.length;
            var i, j;
            var dx, dy;
            var a, b, c;
            var indices, st, open, closed, edges;
            if (n < 3) return [];
            vertices = vertices.slice(0);

            if (key) {
              for (i = n; i--; ) {
                vertices[i] = vertices[i][key];
              }
            }
            indices = new Array(n);
            for (i = n; i--; ) {
              indices[i] = i;
            }
            indices.sort(function (i, j) {
              var diff = vertices[j][0] - vertices[i][0];
              return diff !== 0 ? diff : i - j;
            });
            st = this.supertriangle(vertices);
            vertices.push(st[0], st[1], st[2]);
            open = [this.circumcircle(vertices, n + 0, n + 1, n + 2)];
            closed = [];

            edges = [];
            for (i = indices.length; i--; edges.length = 0) {
              c = indices[i];
              for (j = open.length; j--; ) {
                dx = vertices[c][0] - open[j].x;
                if (dx > 0.0 && dx * dx > open[j].r) {
                  closed.push(open[j]);
                  open.splice(j, 1);
                  continue;
                }
                dy = vertices[c][1] - open[j].y;
                if (dx * dx + dy * dy - open[j].r > this.DELAUNAY_EPSILON) continue;

                edges.push(
                  open[j].i, open[j].j,
                  open[j].j, open[j].k,
                  open[j].k, open[j].i
                );
                open.splice(j, 1);
              }

              this.dedup(edges);

              /* Add a new triangle for each edge. */
              for (j = edges.length; j; ) {
                b = edges[--j];
                a = edges[--j];
                open.push(this.circumcircle(vertices, a, b, c));
              }
            }

            for (i = open.length; i--; ) {
              closed.push(open[i]);
            }
            open.length = 0;
            for (i = closed.length; i--; ) {
              if (closed[i].i < n && closed[i].j < n && closed[i].k < n) {
                open.push(closed[i].i, closed[i].j, closed[i].k);
              }
            }

             //print(" " + open.length + ": " + open);
            return open;
          }

          //---------------------------------------------------
          dedup(edges) {
            for (var j = edges.length; j; ) {
              var b = edges[--j];
              var a = edges[--j];
              for (var i = j; i; ) {
                var n = edges[--i];
                var m = edges[--i];
                if ((a === m && b === n) || (a === n && b === m)) {
                  edges.splice(j, 2);
                  edges.splice(i, 2);
                  break;
                }
              }
            }
          }

          //---------------------------------------------------
          circumcircle(vertices, i, j, k) {
            var x1 = vertices[i][0];
            var y1 = vertices[i][1];
            var x2 = vertices[j][0];
            var y2 = vertices[j][1];
            var x3 = vertices[k][0];
            var y3 = vertices[k][1];
            var fabsy1y2 = Math.abs(y1 - y2);
            var fabsy2y3 = Math.abs(y2 - y3);
            var xc, yc, m1, m2;
            var mx1, mx2, my1, my2;
            if (fabsy1y2 < this.DELAUNAY_EPSILON && fabsy2y3 < this.DELAUNAY_EPSILON) {
              return; // throw new Error("Eek! Coincident points!");
            }
            if (fabsy1y2 < this.DELAUNAY_EPSILON) {
              m2 = -((x3 - x2) / (y3 - y2));
              mx2 = (x2 + x3) / 2.0;
              my2 = (y2 + y3) / 2.0;
              xc = (x2 + x1) / 2.0;
              yc = m2 * (xc - mx2) + my2;
            } else if (fabsy2y3 < this.DELAUNAY_EPSILON) {
              m1 = -((x2 - x1) / (y2 - y1));
              mx1 = (x1 + x2) / 2.0;
              my1 = (y1 + y2) / 2.0;
              xc = (x3 + x2) / 2.0;
              yc = m1 * (xc - mx1) + my1;
            } else {
              m1 = -((x2 - x1) / (y2 - y1));
              m2 = -((x3 - x2) / (y3 - y2));
              mx1 = (x1 + x2) / 2.0;
              mx2 = (x2 + x3) / 2.0;
              my1 = (y1 + y2) / 2.0;
              my2 = (y2 + y3) / 2.0;
              xc = (m1 * mx1 - m2 * mx2 + my2 - my1) / (m1 - m2);
              yc = fabsy1y2 > fabsy2y3 ? m1 * (xc - mx1) + my1 : m2 * (xc - mx2) + my2;
            }
            var dx = x2 - xc;
            var dy = y2 - yc;
            return { i: i, j: j, k: k, x: xc, y: yc, r: dx * dx + dy * dy };
          }

          //---------------------------------------------------
         supertriangle(vertices) {
            var xmin = Number.POSITIVE_INFINITY;
            var ymin = Number.POSITIVE_INFINITY;
            var xmax = Number.NEGATIVE_INFINITY;
            var ymax = Number.NEGATIVE_INFINITY;
            for (var i = vertices.length; i--; ) {
              if (vertices[i][0] < xmin) xmin = vertices[i][0];
              if (vertices[i][0] > xmax) xmax = vertices[i][0];
              if (vertices[i][1] < ymin) ymin = vertices[i][1];
              if (vertices[i][1] > ymax) ymax = vertices[i][1];
            }
            var dx = xmax - xmin;
            var dy = ymax - ymin;
            var dmax = Math.max(dx, dy);
            var xmid = xmin + dx * 0.5;
            var ymid = ymin + dy * 0.5;
            return [
              [xmid - 20 * dmax, ymid - dmax],
              [xmid, ymid + 20 * dmax],
              [xmid + 20 * dmax, ymid - dmax],
            ];
          }
    }
}