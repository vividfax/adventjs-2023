// Made by Chris Allen

class Day29 extends Day {

    constructor () {

        super();
        this.loop = true; // Set to true or false

        this.controls = ""; // Write any controls for interactivity if needed or leave blank
        this.credits = "Made by Chris Allen"; // Replace with your name

        // Define variables here. Runs once during the sketch holder setup
        this.presents = [];
    }

    prerun() {

        // Initialise/reset variables here. Runs once, every time your day is viewed

        this.presents.push(new this.Present (-100,assets.day29bowImage));

        // frameRate(30);
    }

    update() {

        // Update and draw stuff here. Runs continuously (or only once if this.loop = false), while your day is being viewed
        background(200); // You can delete this line if you want
        image(assets.day29bgImage, 0, 0);
        image(assets.day29elfImage, 200, 150);

        stroke(0, 200);
        strokeWeight(4);
        fill(40);
        rect(-10, this.presents[0].conveyorHeight, width + 20, 40);

        for (let i = this.presents.length - 1; i >= 0; i--)
        {
            this.presents[i].draw();
            this.presents[i].move();
        }

        if ((this.presents[0].presentXPos - this.presents[0].leftWidth) > width + 10)
        {
            let culledList = this.presents.slice(1);
            this.presents = culledList;
        }

        if ((this.presents[this.presents.length-1].presentXPos > 0))
        {
            this.presents.push(new this.Present (-100 - random(80),assets.day29bowImage));
        }
    }

    Present = class {
        constructor(xPos, bowImage) {
            colorMode(HSB, 100);

            this.mainHue = random(100);
            this.presentColor = color(this.mainHue, 70, 75);
            this.ribbonColor = color((this.mainHue+50)%100, 70, 85);
            this.presentShadow = color (this.mainHue, 65, 50);
            this.ribbonShadow = color((this.mainHue+50)%100, 65, 60);

            this.leftWidth = random(65) + 35;
            this.rightWidth = random(65) + 35;
            this.height = random(150) + 30;

            this.presentXPos = xPos;
            assets.day29bowImage = bowImage;

            this.presentSpeed = 0.05/2;
            this.conveyorHeight = 550;
        }

        draw() {
            tint(this.ribbonColor);
            image(assets.day29bowImage, this.presentXPos - (this.leftWidth * 0.5) + (this.rightWidth * 0.5) - (assets.day29bowImage.width * 0.5), this.conveyorHeight - this.height - 20 - assets.day29bowImage.height);

            stroke(0, 200);
            strokeWeight(4);
            fill(this.presentColor);
            rect(this.presentXPos, this.conveyorHeight - this.height, -this.leftWidth, this.height);
            rect(this.presentXPos, this.conveyorHeight - this.height, -this.leftWidth - 5, -20);

            fill(this.presentShadow);
            rect(this.presentXPos, this.conveyorHeight - this.height, this.rightWidth, this.height);
            rect(this.presentXPos, this.conveyorHeight - this.height, this.rightWidth + 5, -20);

            fill(this.ribbonColor);
            rect(this.presentXPos - (this.leftWidth * 0.5) - this.leftWidth * 0.1, this.conveyorHeight - this.height, this.leftWidth * 0.2, this.height);
            rect(this.presentXPos - (this.leftWidth * 0.5) - this.leftWidth * 0.1 - 2, this.conveyorHeight - this.height, this.leftWidth * 0.2, -20);

            fill(this.ribbonShadow);
            rect(this.presentXPos + (this.rightWidth * 0.5) - this.rightWidth * 0.1, this.conveyorHeight - this.height, this.rightWidth * 0.2, this.height);
            rect(this.presentXPos + (this.rightWidth * 0.5) - this.rightWidth * 0.1 + 2, this.conveyorHeight - this.height, this.rightWidth * 0.2, -20);

            noStroke();
            fill(color(0,0,0,50));
            rect(this.presentXPos - this.leftWidth, this.conveyorHeight - this.height, this.leftWidth + this.rightWidth, 7);
        }

        move() {
            this.presentXPos = this.presentXPos + deltaTime * this.presentSpeed;
        }
    }
}