// Made by Phoenix Perry

class Day19 extends Day {

    constructor () {

        super();
        this.loop = true; // Set to true or false

        this.controls = ""; // Write any controls for interactivity if needed or leave blank
        this.credits = "Made by Phoenix Perry"; // Replace with your name

        this.treeLevels = 5; // Number of levels in the tree
        this.treeWidth = 200; // Width of the base of the tree
        this.treeHeight = 300; // Total height of the tree
        this.treeColor;
        this.levelHeight;
        // Add more animation functions as needed
        this.snowflakes = []; // array to hold snowflakes
        this.colorIndex = 0; // Index to keep track of the current color
        this.lastChangeTime = 0; // Time since the last color change
        this.colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet']; // Rainbow colors array

    }

    prerun() {

        this.treeWidth = 100*.5 // Width of the base of the tree
        this.treeHeight = 100*.3; // Total height of the tree
        this.treeColor = color(25, 200, 25); // Green color for the tree
        this.levelHeight = this.treeHeight / this.treeLevels; // Height of each level of the tree
    }

    update() {

        fill(255);
        noStroke();
        background(25); // Set a dark background for contrast with the snowflakes

        if (frameCount % 30 === 0 && this.snowflakes.length < 50) { // Every 15 frames, add a new snowflake
            this.snowflakes.push(new this.Snowflake(random(width), -10));
        }

        for (let i = this.snowflakes.length - 1; i >= 0; i--) {
            this.snowflakes[i].update(); // update snowflake position
            this.snowflakes[i].display(); // draw snowflake

            // remove the snowflake if it's out of the canvas boundaries
            if (this.snowflakes[i].posY > height || this.snowflakes[i].posX < 0 || this.snowflakes[i].posX > width) {
              this.snowflakes.splice(i, 1);
            }
        }

        this.drawNetworkTree(width / 2, height / 2, 200, 300, 5);
    }

    Snowflake = class {

        constructor() {

            // initialize coordinates
            this.posX = random(0, width);
            this.posY = random(-50, 0);
            this.size = random(2, 8);
        }

        update() {
          // snowflakes fall at different y speeds
          this.posY += pow(this.size, 0.5)/2;

          // x position drifts slightly
          //this.posX += random(.7, -1)  ;
        }

        display() {
          noStroke();
          fill(255); // White color for the snowflake
          ellipse(this.posX, this.posY, this.size);
        }
    }

    drawNetworkTree(x, y, baseWidth, height, levels) {

        let points = [];
        stroke(255); // Set line color to white for contrast
        fill(this.colors[this.colorIndex]); // Set fill color to the current color in the array

        // Calculate the horizontal and vertical spacing between points
        let hSpacing = baseWidth / levels;
        let vSpacing = height / levels;

        // Generate the points for the tree
        for (let i = 0; i <= levels; i++) {
          for (let j = 0; j <= i; j++) {
            let curX = x - (i * hSpacing) / 2 + j * hSpacing;
            let curY = y - height / 2 + i * vSpacing;
            points.push({pos: createVector(curX, curY), color: this.colors[(this.colorIndex + i + j) % this.colors.length]});
            noStroke();
            fill(points[points.length - 1].color);
            ellipse(curX, curY, 8, 8); // Draw the point

          }
        }

        // Connect the points with lines
        for (let i = 0; i < points.length; i++) {
          for (let j = i + 1; j < points.length; j++) {
            let distance = dist(points[i].pos.x, points[i].pos.y, points[j].pos.x, points[j].pos.y);
            // Connect points that are close enough to each other
            if (distance < hSpacing * 1.5) {
              // stroke(150);
              // //line(points[i].pos.x, points[i].pos.y, points[j].pos.x, points[j].pos.y);

            }
          }
        }

        // Update the color index based on the time interval
        if (millis() - this.lastChangeTime > 500) { // 0.25 seconds has passed
            this.colorIndex = (this.colorIndex + 1) % this.colors.length;
          this.lastChangeTime = millis();
        }
    }
}