// Made by Anne Sullivan

class Day14 extends Day {

    constructor() {

        super();
        this.loop = true; // Set to true or false

        this.controls = "Sit back and enjoy!"; // Write any controls for interactivity if needed or leave blank
        this.credits = "Made by Anne Sullivan"; // Replace with your name
        this.buildings = [];
        this.fireworks = [];
        this.maxBuildings = 10;
        this.minWidth = 50;
        this.maxWidth = 100;
        this.maxHeight = 350;
        this.maxLife = 100;
        this.maxParticles = 100;

        this.ctx = createGraphics(width, height);
    }

    prerun() {
        this.ctx.colorMode(HSB);
        this.ctx.background(250, 70, 25);
        this.buildings = [];
        this.fireworks = [];
        this.setupBuildings();
        this.setupFirework();
    }

    update() {
        this.ctx.colorMode(HSB, 360, 100, 100, 100);
        this.ctx.fill(250, 70, 25, 10);
        this.ctx.rect(0, 0, width, height);
        this.drawFireworks();
        if (random() < 0.02) {
            this.setupFirework();
        }
        this.drawBuildings();

        image(this.ctx, 0, 0);
    }

    cleanup() {
        // colorMode(RGB);
    }

    drawFireworks() {
        for (let i = 0; i < this.fireworks.length; i++) {
            let curFirework = this.fireworks[i];
            let fireworkDrawn = false;
            let strokeSize = parseFloat(curFirework.strokeSize);
            if (curFirework.stage == 1) {
            // draw trail
            this.ctx.stroke(color(curFirework.trailHue, 100, 100));
            this.ctx.strokeWeight(strokeSize);
            this.ctx.line(curFirework.initX, curFirework.curY, curFirework.initX, curFirework.prevY);
            curFirework.update();
            }
            else {
            // draw burst
            for (let j = 0; j < curFirework.particles.length; j++) {
                let curParticle = curFirework.particles[j];

                if (parseInt(curParticle.life) > 0) {
                fireworkDrawn = true;
                this.ctx.stroke(color(curParticle.pHue, curParticle.sat, curParticle.bright));
                this.ctx.strokeWeight(strokeSize);
                this.ctx.line(
                    curParticle.xPos,
                    curParticle.yPos,
                    curParticle.prevX,
                    curParticle.prevY
                );
                curParticle.update();

                }
            }
            if (!fireworkDrawn) {
                this.fireworks.splice(i, 1);
            }
            }
        }

        this.ctx.noStroke();
    }

    setupFirework() {
        let xPos = random(25, width - 25);
        let yPos = random(25, height - 350);
        let pHue = random(360);
        let trailHue = random(25, 60);
        let speed = random(2, 3);
        let numParticles = this.maxParticles + random(-25, 25);
        let stage = 1;

        // each firework is an array of particles
        let firework = new this.Firework(xPos, yPos, trailHue);
        for (let i = 0; i < numParticles; i++) {
            let newParticle = new this.Particle(
            xPos,
            yPos,
            random(-speed, speed),
            random(-speed, speed),
            pHue + random(-25, 25),
            this.maxLife
            );
            firework.particles.push(newParticle);
        }
        this.fireworks.push(firework);
    }

    drawBuildings() {
        for (let i = 0; i < this.buildings.length; i++) {
            this.ctx.fill(250,70,0);
            this.ctx.rect(
            this.buildings[i].xPos,
            height,
            this.buildings[i].buildingWidth,
            -this.buildings[i].buildingHeight
            );
            //    this.buildings[i].updateColor();
        }
    }

    setupBuildings() {
        // create taller buildings on either side of the frame
        // left side building
        this.buildings.push(new this.Building(
            0,
            parseInt(random(this.minWidth, this.maxWidth)),
            random(this.maxHeight + 25, this.maxHeight + 100),
            50));
        // right side building
        this.buildings.push(new this.Building(
            width-this.minWidth,
            parseInt(random(this.minWidth, this.maxWidth)),
            random(this.maxHeight + 25, this.maxHeight + 100),
            50));
        for (let i = 0; i < this.maxBuildings; i++) {
            var x = parseInt(random(-this.minWidth / 2, width + this.minWidth / 2));
            var bWidth = parseInt(random(this.minWidth, this.maxWidth));
            var bHeight = parseInt(random(50, this.maxHeight-50));
            let newBuilding = new this.Building(
            x, bWidth, bHeight
            );
            this.buildings.push(newBuilding);
        }
    }

    Building = class {
        constructor(xPos, buildingWidth, buildingHeight) {
            this.xPos = Math.round(xPos);
            this.buildingHeight = Math.round(buildingHeight);
            this.buildingWidth = Math.round(buildingWidth);
        }
    }

    Firework = class {
        constructor(initX, initY, trailHue) {
            this.strokeSize = random(1, 1.5);
            this.trailHue = trailHue;
            this.initX = initX;
            this.initY = initY;
            this.yVel = random(2, 10);
            this.curY = this.prevY = height;
            this.particles = [];
            this.stage = 1;

            this.update = function () {
            this.prevY = this.curY;
            this.curY -= this.yVel;

            if (this.curY < this.initY) {
                this.stage = 2;
                this.curY = this.initY;
            }
            }
        }
    }

    Particle = class {
        constructor(xPos, yPos, xVel, yVel, pHue, maxLife) {
            this.xPos = this.prevX = xPos;
            this.xVel = xVel;
            this.yPos = this.prevY = yPos;
            this.yVel = yVel;
            this.startHue = this.pHue = pHue;
            this.endHue = this.startHue + random(-10, 10);
            this.endSat = this.sat = random(80, 100);
            this.endBright = this.bright = random(85, 100);
            this.fullLife = this.life = maxLife + parseInt(random(-30, 30));

            this.update = function () {
            if (parseInt(this.life) > 0) {
                this.prevX = this.xPos;
                this.prevY = this.yPos;
                this.xPos += this.xVel;
                this.yPos += this.yVel;
                this.yPos += (this.fullLife - this.life) / 20;
                // this.hue = (this.hue++) % 360;
                this.life--;

                // lerp the start color to end color
                let lifePercent = (1 - this.life / (this.fullLife * 0.75));
                this.pHue = lerp(this.startHue, this.endHue, lifePercent);
                this.sat = lerp(80, this.endSat, lifePercent);
                this.bright = lerp(100, this.endBright, lifePercent);
            }
            };
        }
    }

}

