// Made by Rianna Suen

class Day28 extends Day {

    constructor () {

        super();
        this.loop = true;

        this.controls = "Press and hold LEFT and RIGHT ARROW KEYS to interact";
        this.credits = "Made by Rianna Suen";

        this.colours = {
            white: "#D1C6AD",
            light: "#BBADA0",
            mid: "#A1869E",
            dark: "#797596",
            black: "#0B1D51",
            mote: "#C6BAA7",
        };

        this.crackerW = 300;
        this.crackerH = 70;

        this.patternLayer = createGraphics(300, 70);
        this.smallCrackerMask = createGraphics(300, 70);
        this.bigCrackerMask = createGraphics(300, 70);
        this.wholeCrackerMask = createGraphics(300, 70);
    }

    prerun() {

        this.freshCracker = false;
        this.crackerReadyToPull = false;
        this.crackerWonBy = -1;

        this.leftHand = new this.Hand(-1, this.colours);
        this.rightHand = new this.Hand(1, this.colours);

        this.paws = [];
        for (let i = 0; i < 6; i++) {
            if (i == 0 || i == 3) continue;
            this.paws.push(new this.Paw(360/6*i, this.colours));
        }

        this.motes = [];
        for (let i = 0; i < 15; i++) this.motes.push(new this.Mote(this.colours.mote));

        let endWidth = this.crackerW/6;
        let triWidth = this.crackerW/12;
        let centreWidth = this.crackerW - endWidth*2 - triWidth*3;

        this.drawSmallCracker(endWidth, triWidth, centreWidth);
        this.drawBigCracker(endWidth, triWidth, centreWidth);
        this.drawWholeCracker(endWidth, triWidth, centreWidth);

        this.lastInteraction = frameCount-1000;

        this.screenshakeStrength = 0;
        this.confetti = [];
    }

    drawSmallCracker(endWidth, triWidth, centreWidth) {

        this.smallCrackerMask.clear();
        this.smallCrackerMask.push();
        this.smallCrackerMask.rectMode(CENTER);

        this.smallCrackerMask.translate(0, this.crackerH/2);
        this.smallCrackerMask.translate(endWidth/2, 0);
        this.smallCrackerMask.rect(0, 0, endWidth, this.crackerH);
        this.smallCrackerMask.translate(endWidth/2, 0);
        this.smallCrackerMask.translate(0, -this.crackerH/2);

        for (let i = 1 ; i < 5; i++) {
            this.smallCrackerMask.translate(0, this.crackerH/5);
            this.smallCrackerMask.triangle(0, -this.crackerH/5, 0, this.crackerH/5, triWidth*1.3, 0);
        }

        this.smallCrackerMask.pop();
    }

    drawBigCracker(endWidth, triWidth, centreWidth) {

        this.bigCrackerMask.clear();
        this.bigCrackerMask.rectMode(CENTER);
        this.bigCrackerMask.push();
        this.bigCrackerMask.translate(this.crackerW, this.crackerH/2);
        this.bigCrackerMask.translate(-endWidth/2, 0);
        this.bigCrackerMask.rect(0, 0, endWidth, this.crackerH);
        this.bigCrackerMask.translate(-endWidth/2, 0);
        this.bigCrackerMask.triangle(0, -this.crackerH/2, 0, this.crackerH/2, -triWidth, 0);
        this.bigCrackerMask.translate(-triWidth*1.5, 0);
        this.bigCrackerMask.triangle(0, -this.crackerH/2, 0, this.crackerH/2, triWidth, 0);
        this.bigCrackerMask.pop();

        this.bigCrackerMask.push();
        this.bigCrackerMask.translate(this.crackerW/2, this.crackerH/2);
        this.bigCrackerMask.rect(0, 0, centreWidth, this.crackerH);
        this.bigCrackerMask.pop();

        this.bigCrackerMask.push();
        this.bigCrackerMask.translate(this.crackerW/2, this.crackerH/2);
        this.bigCrackerMask.translate(-endWidth/2, 0);
        this.bigCrackerMask.translate(-triWidth*1.5, 0);
        this.bigCrackerMask.translate(0, -this.crackerH/2);

        for (let i = 1 ; i < 5; i++) {
            this.bigCrackerMask.translate(0, this.crackerH/5);
            this.bigCrackerMask.triangle(0, -this.crackerH/5, 0, this.crackerH/5, -triWidth*1.3, 0);
        }
        this.bigCrackerMask.pop();
    }

    drawWholeCracker(endWidth, triWidth, centreWidth) {

        this.wholeCrackerMask.clear();
        this.wholeCrackerMask.rectMode(CENTER);
        this.wholeCrackerMask.push();
        this.wholeCrackerMask.translate(this.crackerW/2, this.crackerH/2);

        for (let i = -1; i <= 1; i+=2) {
            this.wholeCrackerMask.push();
            this.wholeCrackerMask.translate(-this.crackerW/2*i, 0);
            this.wholeCrackerMask.translate(endWidth/2*i, 0);
            this.wholeCrackerMask.rect(0, 0, endWidth, this.crackerH);
            this.wholeCrackerMask.translate(endWidth/2*i, 0);
            this.wholeCrackerMask.triangle(0, -this.crackerH/2, 0, this.crackerH/2, triWidth*i, 0);
            this.wholeCrackerMask.translate(triWidth*1.5*i, 0);
            this.wholeCrackerMask.triangle(0, -this.crackerH/2, 0, this.crackerH/2, -triWidth*i, 0);
            this.wholeCrackerMask.pop();
        }
        this.wholeCrackerMask.rect(0, 0, centreWidth, this.crackerH);
        this.wholeCrackerMask.pop();
    }

    update() {

        this.leftHand.update();
        this.rightHand.update();
        for (let i = 0; i < this.paws.length; i++) this.paws[i].update(this.lastInteraction);
        for (let i = 0; i < this.motes.length; i++) this.motes[i].update();

        this.crackerReadyToPull = false;

        if (this.leftHand.distToCentre == 1 && this.rightHand.distToCentre == 1) {
            this.crackerReadyToPull = true;
        } else if (this.leftHand.distToCentre == 0 && this.rightHand.distToCentre == 0) {
            this.leftHand.cracker = 0;
            this.rightHand.cracker = 0;
            this.freshCracker = true;
        }

        for (let i = 0; i < this.confetti.length; i++) this.confetti[i].update();

        this.display();
    }

    display() {

        noStroke();
        angleMode(DEGREES);

        push();

        this.applyScreenshake();

        background(this.colours.light);

        for (let i = 0; i < this.motes.length; i++) this.motes[i].display();

        this.applyScreenshake();

        for (let i = 0; i < this.confetti.length/2; i++) this.confetti[i].display();

        for (let i = 0; i < this.paws.length; i++) this.paws[i].display();

        this.leftHand.display();
        this.rightHand.display();
        this.leftHand.displayCracker();
        this.rightHand.displayCracker();

        for (let i = int(this.confetti.length/2); i < this.confetti.length; i++) this.confetti[i].display();

        pop();
    }

    applyScreenshake() {

        if (this.crackerReadyToPull && this.freshCracker) {
            if (this.screenshakeStrength < 8) this.screenshakeStrength += 0.02;
        }

        if (this.decreasingAfterPull) {
            if (this.screenshakeStrength > 0) {
                this.screenshakeStrength -= 2;
            } else {
                this.screenshakeStrength = 0;
                this.decreasingAfterPull = false;
            }
        }

        if (this.screenshakeStrength <= 0) return;

        let strength = this.screenshakeStrength;
        let perlinX = noise(frameCount*0.1, 0);
        perlinX = map(perlinX, 0, 1, -1, 1);
        let perlinY = noise(0, frameCount*0.1);
        perlinY = map(perlinY, 0, 1, -1, 1);
        let perlinR = noise(0, (frameCount+10000)*0.05);
        perlinR = map(perlinR, 0, 1, -1, 1);
        translate(width/2, height/2);
        translate(strength*perlinX*2, strength*perlinY/2);
        rotate(perlinR/2*strength/5);
        translate(-width/2, -height/2);
    }

    keyPressed() {

        if (keyCode == LEFT_ARROW) {
            if (this.leftHand.extend(this.rightHand)) this.newPattern();
            this.lastInteraction = frameCount;
        }

        if (keyCode == RIGHT_ARROW) {
            if (this.rightHand.extend(this.leftHand)) this.newPattern();
            this.lastInteraction = frameCount;
        }
    }

    keyReleased() {

        if (keyCode == LEFT_ARROW) {

            this.pullCracker(this.leftHand, this.rightHand);
            this.leftHand.retract();
        }

        if (keyCode == RIGHT_ARROW) {
            this.pullCracker(this.rightHand, this.leftHand);
            this.rightHand.retract();
        }
    }

    pullCracker(first, second) {

        if (!this.crackerReadyToPull || !this.freshCracker) return;

        if (second.retracting) {
            first.cracker = 2;
            second.cracker = 1;
        } else {
            first.cracker = 1;
            second.cracker = 2;
        }

        first.pulling = true;
        second.pulling = true;

        this.crackerReadyToPull = false;
        this.freshCracker = false;

        this.confetti = [];
        for (let i = 0; i < 50; i++) this.confetti.push(new this.Confetti(width/2+80*first.side, height/2, this.colours));

        this.lastInteraction = frameCount;
        this.screenshakeStrength = 40 + this.screenshakeStrength*this.screenshakeStrength*1.5;
        this.decreasingAfterPull = true;
    }

    newPattern() {

        let colours = this.colours;
        let bg = random([colours.black]);
        let colour = random([colours.white, colours.mid, colours.dark]);

        this.patternLayer.clear();
        this.patternLayer.angleMode(DEGREES);
        this.patternLayer.rectMode(CENTER);
        this.patternLayer.background(bg);

        this.patternLayer.noFill();
        this.patternLayer.stroke(colour);
        this.patternLayer.strokeWeight(random(2, 5));

        this.patternLayer.push();
        this.patternLayer.translate(this.patternLayer.width/2, this.patternLayer.height/2);
        this.patternLayer.rotate(random(360));

        let functions = [this.drawStripes, this.drawCircles, this.drawDots];
        random(functions)(this.patternLayer);

        this.patternLayer.pop();

        this.applyPattern();
    }

    drawCircles(ctx) {

        let r = random(20, 60);
        let r2 = random([0, 10, 1000]);

        for (let i = 0; i < 16; i++) {
            ctx.rect(0, 0, r*i+r/2, r*i+r/2, r2);
        }
    }

    drawStripes(ctx) {

        let r = random(30, 60);

        for (let i = 0; i < 10; i++) {
            ctx.rect(0, 0, r*i+r/2, ctx.height*10);
        }

        if (random() < 0.5) return;

        ctx.rotate(90);

        for (let i = 0; i < 10; i++) {
            ctx.rect(0, 0, r*i+r/2, ctx.height*10);
        }
    }

    drawDots(ctx) {

        let r = random(20, 40);
        let chain = random() < 0.5 ? true : false;

        for (let i = -10; i < 10; i++) {
            for (let j = -10; j < 10; j++) {
                ctx.ellipse(i*(r+10), j*(r+10), r);
                if (chain) ctx.ellipse(i*(r+10)+(r+10)/2, j*(r+10)+(r+10)/2, r-10);
            }
        }
    }

    applyPattern() {

        this.leftHand.smallCracker = this.patternLayer.get();
        this.leftHand.smallCracker.mask(this.smallCrackerMask);
        this.leftHand.bigCracker = this.patternLayer.get();
        this.leftHand.bigCracker.mask(this.bigCrackerMask);
        this.leftHand.wholeCracker = this.patternLayer.get();
        this.leftHand.wholeCracker.mask(this.wholeCrackerMask);

        this.rightHand.smallCracker = this.patternLayer.get();
        this.rightHand.smallCracker.mask(this.smallCrackerMask);
        this.rightHand.bigCracker = this.patternLayer.get();
        this.rightHand.bigCracker.mask(this.bigCrackerMask);
        this.rightHand.wholeCracker = this.patternLayer.get();
        this.rightHand.wholeCracker.mask(this.wholeCrackerMask);
    }

    Hand = class {

        constructor(side, colours) {

            this.side = side;
            this.colours = colours;

            this.cracker = -1;
            this.crackerW = 300;
            this.crackerH = 70;

            this.startX = width/2 + (width/2+this.crackerW)*side;
            this.x = 0;
            this.y = height/2;
            this.w = 600;
            this.h = 100;
            let colourChoices = [this.colours.dark, this.colours.white];
            this.colour = side == -1 ? colourChoices[0] : colourChoices[1];

            this.visible = false;
            this.first = false;
            this.pulling = false;
            this.extending = false;
            this.retracting = false;

            this.distToCentre = 0;
        }

        update() {

            if (this.pulling) {

                this.distToCentre -= 0.02;
                // this.distToCentre = lerp(this.distToCentre, 0, 0.05);
                if (this.distToCentre <= 0.8) {
                    this.distToCentre = 0.8;
                    this.pulling = false;
                }

            } else if (this.extending) {

                this.distToCentre += 0.04;
                // this.distToCentre = lerp(this.distToCentre, 1, 0.1);
                if (this.distToCentre >= 0.999) {
                    this.distToCentre = 1;
                    this.extending = false;
                }

            } else if (this.retracting) {

                this.distToCentre -= 0.03;
                // this.distToCentre = lerp(this.distToCentre, 0, 0.1);
                if (this.distToCentre <= 0.1) {
                    this.distToCentre = 0;
                    this.retracting = false;
                    this.visible = false;
                }
            }

            this.x = this.startX - (width/2+this.crackerW)*this.distToCentre*this.side;
            this.x = int(this.x);
        }

        extend(otherHand) {

            this.extending = true;
            this.retracting = false;
            this.visible = true;

            if (otherHand.visible) this.first = false;
            else if (this.cracker == 0 && this.distToCentre == 0) {
                this.first = true;
                this.cracker = 3;
                return true;
            }
        }

        retract() {

            this.retracting = true;
            this.extending = false;

            this.first = false;
        }

        display() {

            if (!this.visible) return;

            let gap = 96;

            push();
            translate(this.x, this.y);
            rectMode(CENTER);
            fill(this.colour);
            rect((this.w/2+gap)*this.side, 0, this.w, this.h, this.h);
            ellipse((this.w/2+gap)*this.side, 0, this.w, this.h*1.4);

            fill(this.colours.mid);
            ellipse((gap+53)*this.side, 0, 35, 42);
            translate((gap+37)*this.side, -this.h/2);

            for (let i = 0; i < 4; i++) {

                let offset = i == 1 || i == 2 ? 17 : 0;
                let y = i == 0 || i == 3 ? 5 : 0;
                if (i == 3) y *= -1;
                ellipse(-offset*this.side, this.h/4*i+this.h/8 + y, 20);
            }

            pop();
        }

        displayCracker() {

            if (this.cracker == 0) return;

            let endWidth = this.crackerW/6;
            let triWidth = this.crackerW/12;
            let centreWidth = this.crackerW - endWidth*2 - triWidth*3;

            push();
            translate(this.x, this.y);
            imageMode(CENTER);

            if (this.cracker == 1) {

                push();
                if (this.side == 1) rotate(180);
                image(this.smallCracker, 0, 0, 300, 70);
                pop();

            } else if (this.cracker == 2) {

                push();
                if (this.side == -1) rotate(180);
                image(this.bigCracker, 0, 0, 300, 70);
                pop();

            } else if (this.cracker == 3) {

                push();
                if (this.side == -1) rotate(180);
                image(this.wholeCracker, 0, 0, 300, 70);
                pop();
            }

            pop();
        }
    }

    Confetti = class {

        constructor(x, y, colours) {

            this.x = x;
            this.y = y;
            this.radius = random(30, 40);
            this.colour = random([colours.white, colours.mid, colours.dark, colours.black]);
            // this.colour = 255;

            let vec = createVector(1, 1);
            angleMode(DEGREES);
            vec.setHeading(random(360));
            vec.setMag(random(3, 15));

            this.velX = vec.x;
            this.velY = vec.y;
            this.speed = random(1, 1.5);
            this.rotation = random(360);
            this.rotationDir = random(-5, 5);

            this.dead = false;
        }

        update() {

            if (this.dead) return;

            this.x += this.velX*this.speed;
            this.y += this.velY*this.speed;
            this.radius -= 0.2*this.speed;
            this.rotation += this.rotationDir*this.speed;

            // if (this.velX > 0) this.velX -= 0.4;
            // else if (this.velX < 0) this.velX += 0.4;
            if (this.velY < 10) this.velY += 0.4;

            if (this.radius <= 0) this.dead = true;
        }

        display() {

            if (this.dead) return;

            push();
            translate(this.x, this.y);
            rotate(this.rotation);
            fill(this.colour);
            rect(0, 0, this.radius);
            pop();
        }
    }

    Paw = class {

        constructor(angle, colours) {

            this.angle = angle;
            this.colours = colours;

            this.startX = width*0.7;
            this.x = 0;
            this.y = height/2;
            this.w = 600;
            this.h = 100;
            let colourChoices = [this.colours.dark, this.colours.white];
            this.colour = angle == 60 || angle == 300 ? colourChoices[0] : colourChoices[1];

            this.distToCentre = 0;
            this.visible = false;

            this.extending = false;
            this.retracting = false;
        }

        update(lastInteraction) {

            if (!this.visible && frameCount-lastInteraction > 100 && random() < 0.002) {
                this.visible = true;
                this.extending = true;
            }

            if (this.extending) {

                this.distToCentre += 0.015;
                // this.distToCentre = lerp(this.distToCentre, 1, 0.1);
                if (this.distToCentre >= 0.999) {
                    this.distToCentre = 1;
                    this.extending = false;
                    this.retracting = true;
                }
            } else if (this.retracting) {

                this.distToCentre -= 0.04;
                // this.distToCentre = lerp(this.distToCentre, 0, 0.1);
                if (this.distToCentre <= 0.001) {
                    this.distToCentre = 0;
                    this.retracting = false;
                    this.visible = false;
                }
            }

            this.x = this.startX-width*0.45*this.distToCentre;
            this.x = int(this.x);
        }

        display() {

            if (!this.visible) return;

            let gap = 0;

            push();
            translate(width/2, height/2);
            rotate(this.angle);
            translate(this.x, 0);
            rectMode(CENTER);
            fill(this.colour);
            translate(this.w/2+gap, 0)
            rect(0, 0, this.w, this.h, this.h);
            ellipse(0, 0, this.w, this.h*1.4);

            fill(this.colours.mid);
            ellipse(-this.w/2+(gap+53), 0, 35, 42);
            translate(-this.w/2+gap*2+37, -this.h/2);

            for (let i = 0; i < 4; i++) {

                let offset = i == 1 || i == 2 ? 17 : 0;
                let y = i == 0 || i == 3 ? 5 : 0;
                if (i == 3) y *= -1;
                ellipse(-offset, this.h/4*i+this.h/8 + y, 20);
            }

            pop();
        }
    }

    Mote = class {

        constructor(colour) {

            this.colour = colour;

            this.x = random(width);
            this.y = random(height);
            this.size = random(10, 20);

            this.velX = random(-1, 1);
            this.velY = random(-1, 1);
        }

        update() {

            this.x += this.velX*0.2;
            this.y += this.velY*0.2;

            if (this.x > width+this.size) this.x = -this.size;
            else if (this.x < 0-this.size) this.x = width+this.size;

            if (this.y > height+this.size) this.y = -this.size;
            else if (this.y < 0-this.size) this.y = height+this.size;
        }

        display() {

            push();
            fill(this.colour);
            ellipse(this.x, this.y, this.size);
            pop();
        }
    }
}