// Made by Firstname Lastname (keep this line and replace with your name)

function day3Preload() {

    // Load any assets here (with assets.dayX at the front of the variable name)
}

class Day3 extends Day {

    constructor () {

        super();
        this.loop = true; // Set to true or false
        this.autoPlayP5Play = true;

        this.controls = ""; // Write any controls for interactivity if needed or leave blank
        this.credits = "Made by Firstname Lastname"; // Replace with your name

        // Define variables here. Runs once during the sketch holder setup
    }

    prerun() {

        // Initialise/reset variables here. Runs once, every time your day is viewed

        // world.gravity.y = 10;

        // let ball = new Sprite();
        // ball.diameter = 50;
        // ball.y = 30;

        // let floor = new Sprite();
        // floor.y = 190;
        // floor.w = 238;
        // floor.h = 5;
        // floor.collider = 'static';
    }

    update() {

        // Update and draw stuff here. Runs continuously (or only once if this.loop = false), while your day is being viewed

        background(200); // You can delete this line if you want
    }

    // Below are optional functions for interactivity. They can be deleted from this file if you want

    mousePressed() {

    }

    mouseReleased() {

    }

    keyPressed() {

    }

    keyReleased() {

    }

    // Below is the basic setup for a nested class. This can be deleted or renamed

    HelperClass = class {

        constructor() {

        }
    }
}