class Homepage {

    constructor() {

        this.palette = {
            white: color("#FFFFFF"),
            light: color("#FFEFD2"),
            gold: color("#C9A156"),
            mid: color("#81C3AF"),
            dark: color("#578C7C"),
            black: color("#315358"),
        };

        this.windowFrameStrokeWeight = 4;

        this.doorSize = 70;
        this.doorSpacingX = 37 + this.doorSize;
        this.doorSpacingY = 47 + this.doorSize;

        this.values = {
            palette: this.palette,
            doorSize: this.doorSize,
            doorSpacingX: this.doorSpacingX,
            doorSpacingY: this.doorSpacingY,
            frameWeight: this.windowFrameStrokeWeight,
        };

        this.doorOrder = [
            12, 9, 20, 15, 4,
            16, 3, 22, 8, 19,
            21, 7, 2, 13, 23,
            24, 6, 17, 11, 14,
            18, 10, 25, 1, 5
        ];
        this.doors = [];

        for (let i = 0; i < this.doorOrder.length; i++) {

            this.doors.push(new Door(i%5, int(i/5), i, this.doorOrder[i], this.values));
        }

        this.originX = 0;
        this.originY = 0;
        this.cameraX = 0;
        this.cameraY = 0;
        this.zoom = 1;
        this.minZoom = 1;
        this.maxZoom = width/this.doorSize;

        this.visible = true;
        this.currentDoor = -1;
        this.enteringDoor = false;
        this.exitingDoor = false;
        this.doorOpen = false;

        this.doorDateAlpha = 1;

        // this.defaultOpenOnX();

        this.openAmount = 0;

        this.threeD = createGraphics(width, height, WEBGL);
        this.twoDWindow = this.create2DWindow();
        this.twoDFrontDoor = this.create2DFrontDoor();
    }

    defaultOpenOnX() {

        this.visible = false;
        this.doorDateAlpha = 0;
        this.zoom = this.maxZoom;
        this.doorOpen = true;

        this.currentDoor = this.doors[this.doorOrder.findIndex((e) => e == today)];
        this.currentDoor.hovering = 1;
        this.currentDoor.openAmount = 1;
        this.cameraX = this.currentDoor.xPos;
        this.cameraY = this.currentDoor.yPos;

        updateInfo(days[today]);
    }

    create2DWindow() {

        let twoD = createGraphics(width, height);
        let weight = this.windowFrameStrokeWeight*this.maxZoom;

        twoD.strokeWeight(weight);
        twoD.stroke(this.palette.gold);
        twoD.fill(this.palette.light);
        twoD.rectMode(CENTER);
        twoD.rect(width/4*3+weight/4, height/2, width/2-weight/2, height-weight);
        twoD.line(width/2, height/2, width, height/2);

        return twoD;
    }

    create2DFrontDoor() {

        let h = height*2;
        let twoD = createGraphics(width, h);
        let weight = this.windowFrameStrokeWeight*this.maxZoom;

        twoD.noStroke();
        twoD.background(this.palette.gold);
        twoD.strokeWeight(weight);
        twoD.stroke(this.palette.black);
        twoD.line(width, 0, width, h);
        twoD.line(width-7*this.maxZoom, h/2-4.5*this.maxZoom, width-7*this.maxZoom, h/2+4.5*this.maxZoom);

        return twoD;
    }

    update() {

        if (this.enteringDoor) this.enterDoor();
        else if (this.exitingDoor) this.exitDoor();

        if (this.enteringDoor || this.exitingDoor) return;

        for (let i = 0; i < this.doors.length; i++) {
            this.doors[i].update();
        }
    }

    checkDoorClick() {

        if (this.enteringDoor || this.exitingDoor) return;

        for (let i = 0; i < this.doors.length; i++) {
            this.doors[i].checkClick();
        }
    }

    enterDoor() {

        let door = this.currentDoor;

        if (this.doorDateAlpha > 0) {

            this.cameraX = lerp(this.cameraX, door.xPos, 0.1);
            this.cameraY = lerp(this.cameraY, door.yPos, 0.1);
            this.doorDateAlpha = lerp(this.doorDateAlpha, 0, 0.1);

            if (this.doorDateAlpha < 0.01) {
                this.cameraX = door.xPos;
                this.cameraY = door.yPos;
                this.doorDateAlpha = 0;
            }

        } else if (this.doorDateAlpha == 0 && this.maxZoom - this.zoom > 0) {

            this.zoom = lerp(this.zoom, this.maxZoom, 0.1);
            if (this.maxZoom - this.zoom < 0.01) {

                this.zoom = this.maxZoom;

                changeDay(door.date-1);
                this.doorOpen = true;
                updateInfo(days[door.date-1]);
            }

        } else if (this.maxZoom == this.zoom) {

            this.openAmount = lerp(this.openAmount, 1, 0.1);
            if (this.openAmount > 0.99) {
                this.openAmount = 1;
                this.enteringDoor = false;
                this.visible = false;
            }
        }
    }

    exitDoor() {

        let door = this.currentDoor;

        if (this.openAmount != 0) {

            this.openAmount = lerp(this.openAmount, 0, 0.1);
            if (this.openAmount < 0.001) {
                this.openAmount = 0;
                this.doorOpen = false;
                updateInfo(-1);
            }

        } else if (this.openAmount == 0 && this.zoom-this.minZoom > 0) {

            this.zoom = lerp(this.zoom, this.minZoom, 0.1);
            if (this.zoom - this.minZoom < 0.01) this.zoom = this.minZoom;

        } else if (this.zoom == this.minZoom) {

            this.cameraX = lerp(this.cameraX, this.originX, 0.1);
            this.cameraY = lerp(this.cameraY, this.originY, 0.1);
            this.doorDateAlpha = lerp(this.doorDateAlpha, 1, 0.1);

            if (this.doorDateAlpha > 0.999) {

                this.cameraX = this.originX;
                this.cameraY = this.originY;
                this.doorDateAlpha = 1;

                door.clicked = false;
                this.exitingDoor = false;
                this.currentDoor = -1;
            }
        }
    }

    display() {

        push();

        translate(width/2, height/2);
        translate(-this.cameraX*homepage.zoom, -this.cameraY*homepage.zoom);
        if (this.zoom != this.maxZoom) this.displayHouse();

        if (this.openAmount == 0) {
            for (let i = 0; i < this.doors.length; i++) {
                this.doors[i].display();
            }
        }

        pop();

        // today = 24;
        if (this.openAmount > 0) this.display3DWindows(this.openAmount);
    }

    displayHouse() {

        let zoom = this.zoom;

        push();
        rectMode(CENTER);
        noStroke();

        background("#111")
        background(this.palette.gold);

        fill(this.palette.gold);
        rect(0, 0, width*zoom, height*zoom);

        fill(this.palette.white);
        rect(0, 316*zoom+450*zoom, width*zoom*2, 68*zoom+1000*zoom);

        let w1 = 442/2*zoom;
        let w2 = 590/2*zoom;
        let h1 = -214*zoom;
        let h2 = -114*zoom + h1;
        fill(this.palette.black);
        quad(-w2, h1, w2, h1, w1, h2, -w1, h2);
        rect(0, 304*zoom, 594*zoom, 12*zoom);
        w1 = 90/2*zoom;
        w2 = 110/2*zoom * 20;
        h1 = 308*zoom;
        h2 = 42*zoom + h1 * 10;
        quad(-w1, h1, w1, h1, w2, h2, -w2, h2);

        fill(this.palette.dark);
        rect(0, 48*this.zoom, 580*this.zoom, 500*this.zoom);

        fill(this.palette.mid);
        rect(0, -208*zoom, 602*zoom, 12*zoom);
        rect(0, -332*zoom, 442*zoom, 8*zoom);

        pop();

        this.displayTrees();
    }

    displayTrees() {

        let zoom = this.zoom;

        let w = 147*zoom;
        let h = 267*zoom;
        let x = 307*zoom;
        let y = 68*zoom;

        push();

        rectMode(CENTER);

        noStroke();
        fill(this.palette.black);

        translate(x, y);
        triangle(-w/2, h, 0, 0, w/2, h);
        rect(0, h, 24*zoom, 40*zoom);

        translate(-x*2, 0);
        triangle(-w/2, h, 0, 0, w/2, h);
        rect(0, h, 24*zoom, 40*zoom);

        pop();
    }

    display3DWindows(openAmount) {

        let source = today+1 == 25 ? this.twoDFrontDoor : this.twoDWindow;

        angleMode(DEGREES);
        imageMode(CENTER);

        this.threeD.push();
        this.threeD.angleMode(DEGREES);
        this.threeD.clear();
        this.threeD.noStroke();
        this.threeD.texture(source);
        this.threeD.rotateY(openAmount*90);
        if (today+1 == 25) this.threeD.plane(width, height*2);
        else this.threeD.plane(width, height);
        this.threeD.pop();

        push();
        translate(width/2, height/2);
        image(this.threeD, -width/2, 0);
        translate(width/2, 0);
        rotate(180);
        image(this.threeD, 0, 0);
        pop();
    }
}