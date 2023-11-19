// Made by Firstname Lastname (keep this line and replace with your name)

function day9Preload() {

    // Load any assets here (with assets.dayX at the front of the variable name)
}

class Day9 extends Day {

    constructor () {

        super();
        this.loop = true; // Set to true or false

        this.controls = ""; // Write any controls for interactivity if needed or leave blank
        this.credits = "Made by Firstname Lastname"; // Replace with your name

        // Define variables here. Runs once during the sketch holder setup
    }

    prerun() {

        // Initialise/reset variables here. Runs once, every time your day is viewed
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