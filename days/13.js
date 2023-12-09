// Made by Nick Murray

class Day13 extends Day {

    constructor () {

        super();
        this.loop = true; // Set to true or false

        this.controls = "CLICK!"; // Write any controls for interactivity if needed or leave blank
        this.credits = "Made by Nick Murray"; // Replace with your name

        // Define variables here. Runs once during the sketch holder setup
        this.mustacheWidth = 100;
        this.mustacheHeight = 40;
        this.mustacheOffset = 20;
        this.beardsize = 40
        this.eyebrows = 70
        this.bauble = 10

        this.grammar = setupGrammar(assets.day13GrammarSource);
        this.randomText;
    }

    prerun() {

        // Initialise/reset variables here. Runs once, every time your day is viewed
    }

    update() {

        // Update and draw stuff here. Runs continuously (or only once if this.loop = false), while your day is being viewed

        textFont('Courier New');

        background(173, 216, 230);

        translate(0, -80)

        //snowflakes
        fill(255);
        noStroke();
        for (let i = 0; i < 10; i++) { //Snow amount
            let x = random(width); // Random x position
            let y = random(height); // Random y position
            let size = random(2, 15); // Random size for each snowflake
            ellipse(x, y, size, size); // Draw snowflake
        }
        noStroke(); // Removes the black border around shapes

        // Santa's face
        fill(255, 218, 185); // Pale Peach
        ellipse(width / 2, height / 1.5, 300, 300);
        ellipse(width / 2, height / 2, 275, 300);

        // Santa's hat
        fill(255, 0, 0);
        rect(width / 2 - 80, height / 2 - 200, 170, 80, 20, 20, 0, 0);
        fill(255)
        ellipse(width / 2 - this.bauble, height / 2 - 200, 40, 40);
        ellipse(width / 2 - 10, height / 2 - 130, 20, 20);
        ellipse(width / 2 - 20, height / 2 - 130, 20, 20);
        ellipse(width / 2 - 30, height / 2 - 130, 20, 20);
        ellipse(width / 2 - 40, height / 2 - 130, 20, 20);
        ellipse(width / 2 - 50, height / 2 - 130, 20, 20);
        ellipse(width / 2 - 60, height / 2 - 130, 20, 20);
        ellipse(width / 2 - 70, height / 2 - 130, 20, 20);
        ellipse(width / 2 - 80, height / 2 - 130, 20, 20);
        ellipse(width / 2 + 0, height / 2 - 130, 20, 20);
        ellipse(width / 2 + 10, height / 2 - 130, 20, 20);
        ellipse(width / 2 + 20, height / 2 - 130, 20, 20);
        ellipse(width / 2 + 30, height / 2 - 130, 20, 20);
        ellipse(width / 2 + 40, height / 2 - 130, 20, 20);
        ellipse(width / 2 + 50, height / 2 - 130, 20, 20);
        ellipse(width / 2 + 60, height / 2 - 130, 20, 20);
        ellipse(width / 2 + 70, height / 2 - 130, 20, 20);
        ellipse(width / 2 + 80, height / 2 - 130, 20, 20);
        ellipse(width / 2 + 90, height / 2 - 130, 20, 20);

        // Santa's jaaaaacket??? How? is it circles? I only know how to do circles!

        fill(255, 0, 0);
        arc(width / 2, height / 1.45, 290, 290, TWO_PI, PI, PIE);
        fill(255, 218, 185); // Pale Peach
        ellipse(width / 1.45, height / 1.4, 60, 60);
        ellipse(width / 3.2, height / 1.4, 60, 60);
        fill(255, 0, 0);
        rect(width / 1.55, height / 1.8, 60, 120, 20, 40, 10, 10);
        rect(width / 3.7, height / 1.8, 60, 120, 40, 20, 10, 10);



        fill(255)
        ellipse(width / 2 + 5, height / 1 - 130, 20, 20);
        ellipse(width / 2 + 5, height / 1 - 90, 20, 20);
        ellipse(width / 2 + 5, height / 1 - 175, 20, 20);
        ellipse(width / 2 + 155, height / 1 - 200, 20, 20);
        ellipse(width / 2 + 145, height / 1 - 200, 20, 20);
        ellipse(width / 2 + 135, height / 1 - 200, 20, 20);
        ellipse(width / 2 + 125, height / 1 - 200, 20, 20);
        ellipse(width / 2 + 115, height / 1 - 200, 20, 20);
        ellipse(width / 2 + 105, height / 1 - 200, 20, 20);

        ellipse(width / 2 - 155, height / 1 - 200, 20, 20);
        ellipse(width / 2 - 145, height / 1 - 200, 20, 20);
        ellipse(width / 2 - 135, height / 1 - 200, 20, 20);
        ellipse(width / 2 - 125, height / 1 - 200, 20, 20);
        ellipse(width / 2 - 115, height / 1 - 200, 20, 20);
        ellipse(width / 2 - 105, height / 1 - 200, 20, 20);


        // Santa's eyes
        fill(0);
        ellipse(width / 2 - 40, height / 2 - 70, 20, 20);
        ellipse(width / 2 + 40, height / 2 - 70, 20, 20);

        // Santa's nose
        fill(255, 200, 185);
        rect(width / 2 - 25, height / 2 - 70, 50, 70, 20, 20, 20, 20);
        ellipse(width / 2 - 20, height / 2 - 15, 20, 20);
        ellipse(width / 2 + 20, height / 2 - 15, 20, 20);

        // Santa's eyebrows
        fill(169);
        ellipse(width / 2 - 40, height / 2.2 - this.eyebrows, 30, 15);
        ellipse(width / 2 + 40, height / 2.2 - this.eyebrows, 30, 15);

        // Santa's mustache
        fill(169); // Grey
        let center = width / 2;
        let y = height / 2 + this.mustacheOffset;
        let sizes = [25, 35, 40, 40, 35, 25]; // Sizes for the six circles
        let distances = [-45, -25, -10, 10, 25, 45]; // Distances from the center
        for (let i = 0; i < 6; i++) {
            ellipse(center + distances[i], y, sizes[i], sizes[i]);

            // Santa's beard
            fill(169); // Grey
            ellipse(width / 2 - 30, height / 2 + this.beardsize, 40, 40, 40);
            ellipse(width / 2 + 30, height / 2 + this.beardsize, 40, 40, 40);
            ellipse(width / 2 - 35, height / 1.9 + this.beardsize, 30, 30, 30);
            ellipse(width / 2 + 35, height / 1.9 + this.beardsize, 30, 30, 30);
            ellipse(width / 2 - 37, height / 1.95 + this.beardsize, 30, 30, 30);
            ellipse(width / 2 + 37, height / 1.95 + this.beardsize, 30, 30, 30);
            ellipse(width / 2 - 10, height / 1.8 + this.beardsize, 40, 40, 40);
            ellipse(width / 2 + 10, height / 1.8 + this.beardsize, 40, 40, 40);
            ellipse(width / 2 - 10, height / 1.85 + this.beardsize, 50, 30, 30);
            ellipse(width / 2 + 10, height / 1.85 + this.beardsize, 50, 30, 30);
        }

        textAlign(CENTER)

        fill(255);
        stroke(100);
        strokeWeight(3)
        textSize(30)
        textStyle(BOLD)
        rectMode(CENTER)

        text(this.randomText, width/2, height-50, width);
    }

    // Below are optional functions for interactivity. They can be deleted from this file if you want

    mousePressed() {
        // Change mustache size and shape on left mouse click
        this.mustacheWidth = random(50, 150);
        this.mustacheHeight = random(20, 60);
        this.mustacheOffset = random(10, 40);
        this.distances = random(10, 40);
        this.eyebrows = random(55, 90);
        this.bauble = random(-70, 60);
        this.beardsize = random(50, 60);


        this.randomText = getText(this.grammar);
        // print(this.randomText)
    }

}