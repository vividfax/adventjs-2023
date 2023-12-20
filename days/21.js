// Made by Anne Sullivan

class Day21 extends Day {

    constructor() {

        super();
        this.loop = true; // Set to true or false

        this.controls = "Press SPACE to generate a new snowflake"; // Write any controls for interactivity if needed or leave blank
        this.credits = "Made by Anne Sullivan"; // Replace with your name

        // Define variables here. Runs once during the sketch holder setup
        // Symmetry corresponding to the number of reflections. Change the number for different number of reflections
        this.symmetry = 6;
        this.branches = [];

        this.angle = 360 / this.symmetry;
        this.armLength = 0;
        this.curFrame = 1;
        this.armWidth = 5;
        this.branchFactor = 0.05;
        this.drawing = true;
    }

    prerun() {

        // Initialise/reset variables here. Runs once, every time your day is viewed
        this.symmetry = 6;
        this.branches = [];
        this.angle = 360 / this.symmetry;
        this.curFrame = 1;
        this.armWidth = 5;
        this.branchFactor = 0.05;
        this.drawing = true;

        // createCanvas(700, 700);
        angleMode(DEGREES);
        background("#2a8494");
        this.createSnowflake();
    }

    update() {
        if (this.drawing === true) {
            this.drawing = false;
            angleMode(DEGREES);
            // Update and draw stuff here. Runs continuously (or only once if this.loop = false), while your day is being viewed
            blendMode(BLEND);
            let c1 = color(120, 220, 230);
            let c2 = color("#2a8494");

            // draw the background gradient
                for (let y = 0; y <= height; y++) {
                    let n = map(y, 0, height, 0, 1);
                    let newc = lerpColor(c1, c2, n);
                    stroke(newc);
                    line(0, y, width, y);
                }

            // blendMode(OVERLAY);
            translate(width / 2, height / 2);

            for (let i = 0; i < this.symmetry; i++) {

                rotate(this.angle);
                strokeWeight(min(this.armWidth, this.curFrame / 25));
                stroke("rgba(255, 255, 255, 0.25)");
                line(0, 0, 0, this.curFrame);
                strokeWeight(0.5);
                stroke("white");
                line(0, 0, 0, this.curFrame);

                for (let j = 0; j < this.branches.length; j++) {
                    this.branches[j].drawBranch();
                }

            }
            if (this.curFrame < this.armLength) {
                this.drawing = true;
                this.curFrame++;
                if (this.curFrame < this.armLength / 2) {
                    if (random() < this.branchFactor * 2) this.addBranch(this, this.curFrame, this.armLength);
                } else {
                    if (random() < this.branchFactor) {
                        // make a new branch along the main branch
                        this.addBranch(this, this.curFrame, this.armLength);
                    }
                }
            }
        }
    }

    // Below are optional functions for interactivity. They can be deleted from this file if you want

    keyPressed() {
        if (keyCode === 32) // SPACE
            this.reset();

    }
    // Below is the basic setup for a nested class. This can be deleted or renamed

    Branch = class {
        constructor(arm, initX, armLength) {
            this.arm = arm;
            this.x = initX;
            this.y = initX;
            this.branchFrame = 0;
            this.branchSpeed = random(0.03, 0.05);
            // random value but can't be more than the amount of space available
            this.branchLength = 0;
            this.branchWidth = parseInt(random(2, 5 + (armLength - this.x) / 2));
            this.curWidth = 1;

            // if (curFrame > armLength / 4) {
            this.branchLength = parseInt(random(2, 25 + (armLength - this.x) / 10));
            /* } else {
               this.branchLength = parseInt(random(5, 25));
             } */

            this.drawBranch = function () {
                strokeWeight(min(this.branchWidth, this.branchFrame / 2));
                stroke("rgba(255,255,255,0.25)");
                line(0, this.y, this.branchFrame, this.y + this.branchFrame);
                line(0, this.y, -this.branchFrame, this.y + this.branchFrame);
                stroke("white");
                strokeWeight(0.5);
                line(0, this.y, this.branchFrame, this.y + this.branchFrame);
                line(0, this.y, -this.branchFrame, this.y + this.branchFrame);
                if (this.branchFrame < this.branchLength)
                {
                    this.branchFrame += this.branchSpeed;
                    this.arm.drawing = true;
                }
            };
        }
    }

    // Helper functions
    reset() {
        this.branches = [];
        this.branchFactor = random(0.03, 0.07);
        this.curFrame = 0;
        this.drawing = true;
    }

    createSnowflake() {
        this.armLength = parseInt(random(250, 300));
        this.armWidth = parseInt(random(10, 25));
    }

    addBranch(arm, x, armLength) {
        let newBranch = new this.Branch(arm, x, armLength);
        this.branches.push(newBranch);
    }
}