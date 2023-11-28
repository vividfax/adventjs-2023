// Made by V Buckenham

class Day4 extends Day {

    easeInOutSine(x) {
        return -(Math.cos(Math.PI * x) - 1) / 2;
    }

    constructor() {

        super();

        this.ctx = createGraphics(width * 2, height * 2, WEBGL);

        this.ctx.camera(0, 0, (height) / tan(PI / 6), 0, 0, 0);


        this.loop = true; // Set to true or false

        this.controls = ""; // Write any controls for interactivity if needed or leave blank
        this.credits = "Made by V Buckenham"; // Replace with your name

        // Define variables here. Runs once during the sketch holder setup


        this.calendar = new this.Calendar(this, width / 2, height / 2, 1, Math.random() * 360);
        this.newCalendar = null;
        this.newCalendarStartX = null;
        this.newCalendarStartY = null;
        this.newCalendarStartScale = null;
        this.newCalendarSetTime = null;

        this.font = assets.day4Font;
    }
    prerun() {


        this.ctx.textAlign(CENTER, CENTER)
        this.ctx.textFont(this.font);

        // Initialise/reset variables here. Runs once, every time your day is viewed
    }

    update() {



        this.ctx.background(this.calendar.background);
        // let scale = (Math.sin(millis() * 0.00001) + 2) / 2;

        // this.calendar.scale = scale;

        if (this.newCalendar != null) {

            if (this.newCalendarSetTime != null) {

                var timeInAnim = ((millis() - this.newCalendarSetTime) / 5000.0);

                for (const door of this.calendar.doors) {
                    if (door.day != 25) {
                        door.openedAmount = lerp(1, 0, Math.min(timeInAnim * 10, 1));
                    }
                }

                this.newCalendar.x = lerp(this.newCalendarStartX, width / 2, timeInAnim);
                this.newCalendar.y = lerp(this.newCalendarStartY, height / 2, timeInAnim);
                this.newCalendar.scale = (lerp(this.newCalendarStartScale, 1, this.easeInOutSine(timeInAnim)));

                this.calendar.scale = lerp(1, .7, timeInAnim);

                this.ctx.background(lerpColor(this.calendar.background, this.newCalendar.background, this.easeInOutSine(timeInAnim)));


                if (timeInAnim >= 1) {
                    this.newCalendarSetTime = null;
                    this.calendar = this.newCalendar;
                    this.calendar.z = 0;

                }

            }
            this.newCalendar.draw(this.ctx);
        }

        this.calendar.draw(this.ctx);


        image(this.ctx, -width, - height, width * 2, height * 2);

        // Update and draw stuff here. Runs continuously (or only once if this.loop = false), while your day is being viewed

    }


    // to set a new calendar:
    // on opening the door, create it
    // draw it as a child of the door until the door is fully opened
    // when that happens, set the current calendar as the old calendar
    // set the one in the door as the current calendar
    // start animating it into position


    // todo:
    // -- put shapes behind the doors
    // do the calendar behind day 25
    // ease the doors open
    // make the colors nice
    // add paper texture?
    // adjust sizing/general looks


    // Below are optional functions for interactivity. They can be deleted from this file if you want

    mousePressed() {
        for (const door of this.calendar.doors) {
            if (door.day == this.calendar.currentDay &&
                door.hitTest(mouseX, mouseY)) {

                this.calendar.currentDay++;


                door.openedAmount = 0.001;


                if (door.day == 25) {
                    let scale = 0.1
                    door.childCalendar = new this.Calendar(
                        this,
                        this.calendar.x - this.calendar.w / 2 + door.x + door.w / 2,
                        this.calendar.y - this.calendar.h / 2 + door.y + door.h / 2,
                        scale,
                        this.calendar.hue + random([33, 118, 181, 200]),
                    );

                    if (door.childCalendar.elementColorMode == this.calendar.elementColorMode) {
                        door.childCalendar.elementColorMode = "white";
                    }

                }

            }
        }
    }

    mouseReleased() {

    }

    keyPressed() {

    }

    keyReleased() {

    }

    setNewCalendar(calendar) {
        this.newCalendar = calendar;

        this.newCalendarStartX = calendar.x;
        this.newCalendarStartY = calendar.y;
        this.newCalendarStartScale = calendar.scale;
        this.newCalendar.z = 5;
        // this.calendar.z = -100;

        this.newCalendarSetTime = millis();
    }

    // Below is the basic setup for a nested class. This can be deleted or renamed

    Calendar = class {
        WIDTH = 500;
        HEIGHT = 600;
        CORNER_RADIUS = 10;

        constructor(day, x, y, scale, hue) {
            this.day = day;

            this.w = this.WIDTH;
            this.h = this.HEIGHT;


            this.x = x;
            this.y = y;
            this.z = 0;
            this.scale = scale;

            this.currentDay = 1;

            this.doors = [];

            this.randomSeed = millis() * 987698 + Math.random() * 10000;
            randomSeed(this.randomSeed);


            this.hue = hue;

            this.background = color(chroma.oklch(.9765, 0.1008, this.hue + 10).hex());

            this.bgC = color(chroma.oklch(.5765, 0.1808, this.hue).hex());

            this.doorBgC = random([
                chroma.oklch(.5765, 0.1808, this.hue),
                chroma.oklch(.4654, 0.223, this.hue),
                chroma.oklch(.5765, 0.1808, this.hue + 180),
                chroma.oklch(.4654, 0.223, this.hue + 180),
            ]);

            this.elementColorMode = random(["bright_pastels", "bright_pastels", "bright_pastels", "bright_pastels2", "bright_pastels2", "many_pastels", "few_pastels", "many_pastels", "few_pastels", "white", "bw"])

            let days = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]);
            for (let i = 0; i < 5; i++) {
                for (let j = 0; j < 5; j++) {
                    let gaps = 6;

                    this.doors.push(new this.DoorV(
                        this,
                        // 25,
                        days[i * 5 + j],
                        this.w / (gaps * 5 * 2) + (this.w / 5) * i,
                        this.h / (gaps * 5 * 2) + (this.h / 5) * j,
                        this.w / gaps,
                        this.h / gaps,

                    ));
                }
            }
        }


        draw(ctx) {
            ctx.push();

            ctx.translate(0, 0, this.z);


            ctx.fill(this.bgC);
            ctx.noStroke();

            ctx.rect(this.x - this.w * .5 * this.scale, this.y - this.h * .5 * this.scale, this.w * this.scale, this.h * this.scale, this.CORNER_RADIUS * this.scale);

            for (const door of this.doors) {
                door.draw(ctx);
            }

            ctx.pop();

        }

        getElementColor() {
            if (this.elementColorMode == "bright_pastels") {
                return chroma.oklch(.9541, 0.3331, this.hue + random([0, 180]) + random(-1, 1));
            }
            else if (this.elementColorMode == "bright_pastels2") {
                return chroma.oklch(.9541, 0.3331, this.hue + random([0, 120, 240]) + random(-1, 1));
            }
            else if (this.elementColorMode == "many_pastels") {
                return chroma.oklch(.9541, 0.2331, this.hue + random([30, 60, 120, 150, 180, 210, 240, 270, 300, 330]) + random(-3, 3));
            }
            else if (this.elementColorMode == "few_pastels") {
                return chroma.oklch(.9541, 0.2331, this.hue + random([60, 120, 180, 240, 300]) + random(-1, 1));
            }
            else if (this.elementColorMode == "white") {
                return chroma.oklch(.9941, 0.0031, this.hue + random([60, 120, 180, 240, 300]) + random(-1, 1));
            }
            else if (this.elementColorMode == "bw") {
                return random([
                    chroma.oklch(.9941, 0.0031, this.hue + random([60, 120, 180, 240, 300]) + random(-1, 1)),
                    chroma.oklch(.2041, 0.0031, this.hue + random([60, 120, 180, 240, 300]) + random(-1, 1)),

                ]);
            }

        }

        getDoorBgC() {
            return this.doorBgC;
        }


        getDoorC() {
            return chroma.oklch(.7765, 0.1808, ((this.hue + random(-5, 5)) % 360));
        }

        DoorV = class {

            easeInOutSine(x) {
                return -(Math.cos(Math.PI * x) - 1) / 2;
            }

            constructor(calendar, day, x, y, w, h, scale) {
                this.calendar = calendar;
                this.day = day;
                this.x = x;
                this.y = y;
                this.w = w;
                this.h = h;

                var c = this.calendar.getDoorBgC();
                this.c = color(c.hex());

                this.doorC = color(this.calendar.getDoorC().hex());

                this.openedAmount = 0;

                this.childCalendar = null;
            }


            draw(ctx) {

                randomSeed(this.calendar.randomSeed * this.day);

                if (this.openedAmount > 0 && this.openedAmount < 1) {
                    this.openedAmount += 0.001 * deltaTime;
                }
                if (this.openedAmount >= 1 && this.childCalendar != null) {
                    this.calendar.day.setNewCalendar(this.childCalendar);
                    this.childCalendar = null;
                }



                // background
                ctx.fill(this.c);
                ctx.rect(
                    this.getX(),
                    this.getY(),
                    this.getW(),
                    this.getH()
                );

                //shape


                if (this.childCalendar != null) {
                    ctx.push();
                    this.childCalendar.draw(ctx);

                    ctx.pop();
                }



                ctx.push();
                ctx.translate(
                    this.getX(),
                    this.getY()
                );

                if (this.day != 25) {

                    this.drawShape(ctx);
                }

                ctx.rotateY(-this.easeInOutSine(this.openedAmount) * (this.day == 25 ? 0.495 : 0.3) * Math.PI * 2);

                //door

                ctx.fill(this.doorC);
                ctx.rect(
                    0,
                    0,
                    this.getW(),
                    this.getH()
                );

                //number
                ctx.fill(color(255, 255, 255));
                ctx.textSize(36 * this.calendar.scale);
                ctx.translate(0, 0, 0.1);
                ctx.text(this.day.toString(), this.getW() * 0.5, this.getH() * 0.5);

                ctx.pop();
            }

            drawShape(ctx) {

                let w = this.getW();
                let h = this.getH();



                ctx.push();
                var pattern = random(["overlaid", "2up", "4up", "offsetleft", "offsetright"]);
                // print(pattern);
                let size = 1;
                if (pattern == "overlaid") {
                    size = w * 0.8;
                    this.drawElement(ctx, w, h, size);


                    ctx.fill(this.c);
                    size = w * 0.4;
                    this.drawElement(ctx, w, h, size, true);
                }
                else if (pattern == "2up") {

                    size = w * 0.5;
                    ctx.translate(0, -size / 2);
                    this.drawElement(ctx, w, h, size);

                    ctx.translate(0, size);
                    this.drawElement(ctx, w, h, size);

                    ctx.translate(0, -size / 2);
                }
                else if (pattern == "4up") {

                    size = w * 0.45;

                    ctx.translate(-size / 2, 0);

                    ctx.translate(0, -size / 2);
                    this.drawElement(ctx, w, h, size);

                    ctx.translate(0, size);
                    this.drawElement(ctx, w, h, size);


                    ctx.translate(size, 0);

                    ctx.translate(0, -size);
                    this.drawElement(ctx, w, h, size);

                    ctx.translate(0, size);
                    this.drawElement(ctx, w, h, size);


                    ctx.translate(-size / 2, size / 2);
                }
                else if (pattern == "offsetleft") {

                    size = w * 0.5;
                    ctx.translate(-size / 4, -size / 2);
                    this.drawElement(ctx, w, h, size);

                    ctx.translate(size / 2, size);
                    this.drawElement(ctx, w, h, size);

                    ctx.translate(-size / 4, -size / 2);
                }
                else if (pattern == "offsetright") {

                    size = w * 0.5;
                    ctx.translate(size / 4, -size / 2);
                    this.drawElement(ctx, w, h, size);

                    ctx.translate(-size / 2, size);
                    this.drawElement(ctx, w, h, size);

                    ctx.translate(size / 4, -size / 2);
                }


                ctx.pop();
            }

            drawElement(ctx, w, h, size, inside = false) {
                //centers
                const x = w * 0.5;
                const y = h * 0.5;

                ctx.fill(color(this.calendar.getElementColor().hex()));

                var shape = random(["circle", "square", "triangle", "diamond"]);
                if (shape == "circle" && !inside) {
                    ctx.circle(x, y, size);
                }
                else if (shape == "square" && !inside) {

                    let sz = size;
                    ctx.square(x - sz * 0.5, y - sz * 0.5, sz);
                }
                else if (shape == "diamond") {

                    ctx.push();
                    ctx.translate(x, y);
                    ctx.rotateZ(random([0, .25, .5, .75]) * TAU);
                    ctx.translate(-x, -y);
                    let sz = size * 0.5;
                    ctx.quad(
                        x - sz,
                        y,
                        x,
                        y - sz * .75,
                        x + sz,
                        y,
                        x,
                        y + sz * .75,
                    );
                    ctx.pop();
                }
                else if (shape == "triangle" && !inside) {
                    ctx.push();
                    ctx.translate(x, y);
                    ctx.rotateZ(random([0, .25, .5, .75]) * TAU);
                    ctx.translate(-x, -y);

                    ctx.triangle(
                        x - size * 0.5,
                        y - size * 0.5,
                        x - size * 0.5,
                        y + size * 0.5,
                        x + size * 0.5,
                        y,
                    );

                    ctx.pop();
                }
                else if (shape == "triangle" && inside) {

                    let rot = random([0, .25, .5, .75]);
                    ctx.triangle(
                        size * .5 * cos(rot * TAU) + x,
                        size * .5 * sin(rot * TAU) + y,
                        size * .5 * cos((rot + 1. / 3) * TAU) + x,
                        size * .5 * sin((rot + 1. / 3) * TAU) + y,
                        size * .5 * cos((rot + 2. / 3) * TAU) + x,
                        size * .5 * sin((rot + 2. / 3) * TAU) + y,
                    );
                }
            }

            getX() {
                return this.calendar.x - this.calendar.w * .5 * this.calendar.scale + this.x * this.calendar.scale;
            }

            getY() {
                return this.calendar.y - this.calendar.h * .5 * this.calendar.scale + this.y * this.calendar.scale;
            }

            getW() {
                return this.w * this.calendar.scale;
            }

            getH() {
                return this.h * this.calendar.scale;
            }


            hitTest(x, y) {

                return x > this.getX() &&
                    x < this.getX() + this.getW() &&
                    y > this.getY() &&
                    y < this.getY() + this.getH();
            }

        }
    }

}