// Made by Rianna Suen

class Day26 extends Day {

    constructor () {

        super();
        this.loop = true;
        this.controls = "WASD or ARROW KEYS to move, SPACEBAR to place snowball";
        this.credits = "Made by Rianna Suen";

        this.mapSize = width*3;

        this.trailCanvas = createGraphics(this.mapSize, this.mapSize);
        // this.grainCanvas = createGraphics(this.mapSize/5, this.mapSize/5);

        this.colours = {
            snow: "#fff",
            grass: "#87AF93",
            pavement: "#7B707E",
            stone: "#ECEAEC",
        };

        this.pavementWidth = 100;
        this.centralCircleRadius = 200;
    }

    prerun() {

        this.cameraX = 0;
        this.cameraY = 0;

        this.snowColliders = [];
        this.snowballs = [];

        this.setupSnowColliders();
        this.snowballs = [];
        this.player = new this.Player(this.mapSize);

        this.trailCanvas.clear();
        // this.createGrain();
    }

    setupSnowColliders() {

        let density = 80;
        let spacing = (this.mapSize-this.pavementWidth*2)/density;
        let margin = this.pavementWidth;

        for (let i = margin; i <= this.mapSize-margin; i+=spacing) {
            for (let j = margin; j <= this.mapSize-margin; j+=spacing) {

                let distance = dist(i, j, this.mapSize/2, this.mapSize/2);
                if (distance < this.centralCircleRadius - this.pavementWidth/2) {}
                else if (distance < this.centralCircleRadius+this.pavementWidth/2) continue;
                else if (abs(this.mapSize/2 - i) < this.pavementWidth/2) continue;
                else if (abs(this.mapSize/2 - j) < this.pavementWidth/2) continue;

                this.snowColliders.push(new this.SnowCollider(i, j, spacing));
            }
        }
    }

    createGrain() {

        for (let i = 0; i < this.grainCanvas.width; i++) {
            for (let j = 0; j < this.grainCanvas.height; j++) {
                // if (random() < 0.5) {
                    let colour = color(this.colours.snow);
                    let s = 0.04;
                    let a = noise(i*s, j*s)*105;
                    colour.setAlpha(a);
                    this.grainCanvas.set(i, j, colour);
                // }
            }
        }
        this.grainCanvas.updatePixels();
    }

    update() {

        angleMode(DEGREES);

        this.player.update();
        this.moveCamera();

        for (let i = 0; i < this.snowColliders.length; i++) {
            this.snowColliders[i].collide(this.player);
        }

        this.display();
    }

    display() {

        background(this.colours.snow);
        this.displayTrail();
        this.displayPavement();

        // push();
        // translate(width/2-this.player.x+this.cameraX, height/2-this.player.y+this.cameraY);
        // for (let i = 0; i < this.snowColliders.length; i++) this.snowColliders[i].display();
        // pop();

        let playerDisplayed = false;

        for (let i = 0; i < this.snowballs.length; i++) {

            if (!playerDisplayed && this.snowballs[i].y > this.player.y) {
                this.displayPlayer();
                playerDisplayed = true;
            }
            push();
            translate(width/2-this.player.x+this.cameraX, height/2-this.player.y+this.cameraY);
            this.snowballs[i].display();
            pop();
        }

        if (!playerDisplayed) this.displayPlayer();

        // image(this.grainCanvas, width/2-this.player.x+this.cameraX, height/2-this.player.y+this.cameraY, this.mapSize, this.mapSize);
    }

    displayTrail() {

        this.trailCanvas.noStroke();
        this.trailCanvas.fill(this.colours.grass);
        this.trailCanvas.ellipse(this.player.x, this.player.y, this.player.radius*2);

        image(this.trailCanvas, width/2-this.player.x+this.cameraX, height/2-this.player.y+this.cameraY, this.mapSize, this.mapSize);
    }

    displayPavement() {

        push();
        translate(this.mapSize/2+width/2-this.player.x+this.cameraX, this.mapSize/2+height/2-this.player.y+this.cameraY);
        stroke(this.colours.pavement);
        strokeWeight(this.pavementWidth*2);
        noFill();
        rectMode(CENTER);
        rect(0, 0, this.mapSize);
        strokeWeight(this.pavementWidth);
        let circleRadius = this.centralCircleRadius;
        ellipse(0, 0, circleRadius*2);
        line(0, circleRadius, 0, this.mapSize/2);
        line(0, -circleRadius, 0, -this.mapSize/2);
        line(circleRadius, 0, this.mapSize/2, 0);
        line(-circleRadius, 0, -this.mapSize/2, 0);
        pop();
    }

    displayPlayer() {

        noStroke();
        let colour = this.player.radius < 10 ? this.colours.stone : this.colours.snow;
        fill(colour);
        ellipse(width/2+this.cameraX, height/2+this.cameraY, this.player.radius*2);
    }

    moveCamera() {

        if (this.player.x < width/2) {
            this.cameraX = this.player.x-width/2;
        }
        if (this.player.x > this.mapSize-width/2) {
            this.cameraX = width/2-this.mapSize+this.player.x;
        }
        if (this.player.y < height/2) {
            this.cameraY = this.player.y-height/2;
        }
        if (this.player.y > this.mapSize-height/2) {
            this.cameraY = height/2-this.mapSize+this.player.y;
        }
    }

    keyPressed() {

        if (keyCode == 32) { // spacebar

            if (this.player.radius < 10) return;

            for (let i = 0; i < this.snowballs.length; i++) {

                if (this.snowballs[i].collide(this.player)) {
                    return;
                }
            }

            let index = 0;

            for (let i = 0; i < this.snowballs.length; i++) {

                if (this.snowballs[i].y < this.player.y) {
                    index = i+1;
                } else {
                    break;
                }
            }

            let newSnowball = new this.Snowfolk(this.player.x, this.player.y, this.player.radius, this.colours);
            this.snowballs.splice(index, 0, newSnowball);
            this.player.radius = this.player.startRadius;
        }
    }

    Player = class {

        constructor(mapSize) {

            this.mapSize = mapSize;
            this.startRadius = 5;

            this.reset(mapSize);
        }

        reset() {

            this.x = this.mapSize/2;
            this.y = this.mapSize/2;
            this.velX = 0;
            this.velY = 0;
            this.radius = this.startRadius;
        }

        update() {

            this.move();
        }

        move() {

            let friction = 0.93;

            this.velX *= friction;
            this.velY *= friction;

            this.x += this.velX;
            this.y += this.velY;

            if (this.x > this.mapSize-this.radius) this.x = this.mapSize-this.radius;
            if (this.x < this.radius) this.x = this.radius;
            if (this.y > this.mapSize-this.radius) this.y = this.mapSize-this.radius;
            if (this.y < this.radius) this.y = this.radius;

            if (!keyIsPressed) return;

            let speed = 0.3;

            let pressingLeft = keyIsDown(LEFT_ARROW) || keyIsDown(65);
            let pressingRight = keyIsDown(RIGHT_ARROW) || keyIsDown(68);
            let pressingUp = keyIsDown(UP_ARROW) || keyIsDown(87);
            let pressingDown = keyIsDown(DOWN_ARROW) || keyIsDown(83);

            if (pressingLeft && pressingRight) {
                // do nothing
            } else if (pressingLeft) {
                this.velX -= speed;
            } else if (pressingRight) {
                this.velX += speed;
            }

            if (pressingUp && pressingDown) {
                // do nothing
            } else if (pressingUp) {
                this.velY -= speed;
            } else if (pressingDown) {
                this.velY += speed;
            }
        }
    }

    SnowCollider = class {

        constructor(x, y, radius) {

            this.x = x;
            this.y = y;
            this.radius = radius/2;

            this.reset();
        }

        reset() {

            this.collided = false;
        }

        collide(player) {

            if (this.collided) return;

            let distance = dist(this.x, this.y, player.x, player.y);
            let radii = this.radius + player.radius;

            if (distance < radii) {
                this.collided = true;
                player.radius += 0.2;
            }
        }

        display() {

            if (this.collided) return;

            fill(0);
            ellipse(this.x, this.y, this.radius*2);
        }
    }

    Snowfolk = class {

        constructor(x, y, radius, colours) {

            this.x = x;
            this.y = y;
            this.stack = [];
            this.stack.push({
                r: radius*2,
                y: 0,
            });
            this.radius = radius*2;
            this.colours = colours;

            this.armRotate = random(-30, 30);
            this.offset = random(360);
            this.speed = random(0.3, 1.3);

            this.leftArm = random(assets.day26SnowmanArms);
            this.rightArm = random(assets.day26SnowmanArms);

            this.leftArmFlip = random([-1, 1]);
            this.rightArmFlip = random([-1, 1]);
            this.faceDir = random([-1, 1]);
        }

        collide(player) {

            for (let i = 0; i < this.stack.length; i++) {
                let distance = dist(player.x, player.y, this.x, this.stack[i].y+this.y);

                if (distance-5 < player.radius+this.stack[i].r/2) {
                    if (this.stack.length < 3) {
                        this.addToStack(player.radius);
                        player.radius = player.startRadius;
                    }
                    return true;
                }
            }
            return false;
        }

        addToStack(radius) {

            let prevInStack = this.stack[this.stack.length-1];
            let y = prevInStack.y - radius;

            this.stack.push({
                r: radius*2,
                y: y,
            });
        }

        display() {

            push();
            translate(this.x, this.y);
            noStroke();
            fill(this.colours.snow);

            for (let i = 0; i < this.stack.length; i++) {
                if (this.stack.length == 3) rotate(sin((frameCount+this.offset)*3*this.speed)*2);
                ellipse(0, 0, this.stack[i].r);

                if (this.stack.length == 3 && i == 1) {

                    for (let j = -1; j <= 1; j+=2) {
                        let size = this.stack[i].r;
                        push();
                        imageMode(CENTER);
                        if (j == -1) rotate(180);
                        translate(size/2, 0);
                        rotate((this.armRotate+sin((frameCount+this.offset)*2.5*this.speed)*10)*j);
                        let arm = j == 1 ? this.rightArm : this.leftArm;
                        let armFlip = j == 1 ? this.rightArmFlip : this.leftArmFlip;
                        let s = 0.01;
                        size = size > 60 ? 60 : size;
                        scale(1, armFlip);
                        image(arm, 0, 0, 166*size*s, 24*size*s);
                        pop();
                    }

                } else if (i == 2) {

                    push();
                    let size = this.stack[i].r/2 > 40 ? 40 : this.stack[i].r/2;
                    translate(0, sin((frameCount+this.offset)*5*this.speed)*0.5);
                    rotate(sin((frameCount+this.offset)*3*this.speed)*5);
                    imageMode(CENTER);
                    scale(this.faceDir, 1);
                    image(assets.day26SnowmanFace, 0, 0, size, size);
                    pop();
                }
                translate(0, -this.stack[i].r/2);
            }
            pop();
        }
    }
}