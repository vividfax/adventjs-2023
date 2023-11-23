class Door {

    constructor(x, y, num, date, values) {

        this.x = x;
        this.y = y;
        this.num = num;
        this.date = date;

        this.values = values;
        this.palette = values.palette;

        this.numberOffset = int(random(4));
        this.flashOffset = random(360);

        this.xPos = (x-2) * this.values.doorSpacingX;
        this.yPos = (y-2) * this.values.doorSpacingY - 15;
        if (y == 4) this.yPos += 19;
        if (y == 4 && x == 2) this.yPos += 14+8.5;

        this.hovering = false;
        this.clicked = false;
        this.opened = getItem(date);

        this.ready = this.date <= daysToReveal;
        // this.ready = true; // delete this later
    }

    update() {

        this.ready = this.date <= daysToReveal; // debug

        if (!this.ready) return;

        if (!this.clicked) this.checkHover();
    }

    checkHover() {

        this.hovering = false;

        let xPos = this.xPos;
        let yPos = this.yPos;
        let w = this.values.doorSize/2;
        let h = this.values.doorSize/2;
        if (this.y == 4 && this.x == 2) {
            yPos -= 8;
            w += 5;
            h += 12;
        }

        // debugCanvas.push();
        // debugCanvas.translate(width/2, height/2);
        // debugCanvas.rectMode(CORNERS);
        // debugCanvas.fill(0, 20);
        // debugCanvas.rect(xPos-w, yPos-h, xPos+w, yPos+h);
        // debugCanvas.ellipse(xPos, yPos-h, w*2);
        // debugCanvas.pop();

        if ((mouseX-width/2 > xPos-w && mouseX-width/2 < xPos+w) && (mouseY-height/2 > yPos-h && mouseY-height/2 < yPos+h)) this.hovering = true;

        if (this.y == 4) {

            let distance = dist(mouseX-width/2, mouseY-height/2, xPos, yPos-h);

            if (distance < w) this.hovering = true;
        }
    }

    checkClick() {

        if (!this.hovering) return;

        if (!this.clicked) {

            this.hovering = false;
            this.clicked = true;
            homepage.enteringDoor = true;
            homepage.currentDoor = this;
            if (!this.opened) {
                this.opened = true;
                storeItem(this.date.toString(), true);
            }
        }
    }

    display() {

        push();

        angleMode(DEGREES);

        translate(this.xPos*homepage.zoom, this.yPos*homepage.zoom);

        let lightColour = this.palette.black;

        if (!this.opened && this.ready) {
            let amount = sin((frameCount+this.flashOffset)*5);
            amount = map(amount, -1, 1, 0, 1);
            lightColour = lerpColor(color("#FFFFFF"), color("#FFE2AD"), amount);
        }
        else if (this.ready) lightColour = this.palette.light;

        this.displayDetail(lightColour);

        rectMode(CORNERS);
        noStroke();

        if (this.y == 4 && this.x == 2) {

            this.displayFrontDoor(lightColour);

        } else {

            let quarter = this.values.doorSize*homepage.zoom/2;
            let weight = homepage.windowFrameStrokeWeight*homepage.zoom;
            let quarterish = quarter-weight/2;
            strokeWeight(weight);
            stroke(this.palette.gold);
            fill(lightColour);
            rect(-quarterish, -quarterish, quarterish, quarterish);
            line(-quarterish, 0, quarterish, 0);
            line(0, -quarterish, 0, quarterish);
            noStroke();
        }

        this.displayNumber();

        pop();
    }

    displayFrontDoor(lightColour) {

        let zoom = homepage.zoom;

        let frameWeight = this.values.frameWeight*zoom;
        let w = 80*zoom-frameWeight;
        let h = 100*zoom-frameWeight;

        push();
        translate(0, -8.5*zoom);
        rectMode(CENTER);
        strokeWeight(frameWeight);
        fill(lightColour);
        stroke(this.palette.gold);
        ellipse(0, -w/2-7*zoom-frameWeight/2, w);
        line(-w/2, -w/2-7*zoom-frameWeight*1.5, w/2, -w/2-7*zoom-frameWeight*1.5);
        fill(this.palette.gold);
        stroke(this.palette.black);
        rect(-w/4, 0, w/2, h);
        rect(w/4, 0, w/2, h);
        line(-7*zoom, 4*zoom, -7*zoom, 13*zoom);
        line(7*zoom, 4*zoom, 7*zoom, 13*zoom);
        pop();
    }

    displayDetail(lightColour) {

        let zoom = homepage.zoom;
        let doorSize = this.values.doorSize;
        let doorSizeZoom = doorSize*zoom;
        let halfDoorZoom = doorSizeZoom/2;
        let frameWeight = this.values.frameWeight*zoom;

        if (this.y == 4 && this.x == 2) {

            // do nothing

        } else if (this.y == 0) {

            push();
            noStroke();
            fill(this.palette.dark);
            ellipse(0, -halfDoorZoom+frameWeight/2, doorSizeZoom);
            pop();

        } else if (this.y >= 1 && this.y <= 3) {

            push();
            noStroke();
            fill(this.palette.black);
            rectMode(CENTER);
            rect(0, (doorSize/2+5)*zoom, 76*zoom, 10*zoom);
            let h = 16 * zoom;
            let w = 6 * zoom;
            translate(0, -halfDoorZoom);
            quad(-halfDoorZoom, 0, halfDoorZoom, 0, halfDoorZoom+w, -h, -halfDoorZoom-w, -h);
            pop();

        } else if (this.y == 4) {

            push();
            stroke(this.palette.gold);
            strokeWeight(frameWeight);
            fill(lightColour);
            ellipse(0, -halfDoorZoom+frameWeight/2, doorSizeZoom-frameWeight);
            line(0, -halfDoorZoom, 0, -doorSizeZoom+frameWeight);
            noStroke();
            fill(this.palette.black);
            rectMode(CENTER);
            rect(0, (doorSize/2+5)*zoom, 76*zoom, 10*zoom);
            pop();
        }
    }

    displayNumber() {

        if (!this.ready) return;

        let textColour = color(0);
        textColour.setRed(red(this.palette.black));
        textColour.setGreen(green(this.palette.black));
        textColour.setBlue(blue(this.palette.black));
        textColour.setAlpha(homepage.doorDateAlpha*255);

        let zoom = homepage.zoom;
        let quarter = this.values.doorSize*zoom/4 - 1.5;

        push();

        if (this.y == 4 && this.x == 2) translate(0, -74*zoom);
        else if (this.numberOffset == 0) translate(quarter, quarter);
        else if (this.numberOffset == 1) translate(-quarter, quarter);
        else if (this.numberOffset == 2) translate(quarter, -quarter);
        else if (this.numberOffset == 3) translate(-quarter, -quarter);

        if (this.hovering) {
            angleMode(DEGREES);
            rotate(sin(frameCount*6)*10);
            textSize(25);
        } else {
            textSize(22);
        }

        translate(0, -2);

        stroke(textColour);
        strokeWeight(1);
        textAlign(CENTER, CENTER);
        textFont(fonts.redressed);
        fill(textColour);
        text(this.date, 0, 0);

        pop();
    }
}