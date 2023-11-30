// Made by Chris Allen

class Day2 extends Day {

    constructor () {

        super();
        this.loop = false; // Set to true or false

        this.controls = "CLICK for a new, possibly even uglier, sweater"; // Write any controls for interactivity if needed or leave blank
        this.credits = "Made by Chris Allen"; // Replace with your name

        // Define variables here. Runs once during the sketch holder setup
        this.makePattern();
        this.knitPattern();
        this.threadA();
        this.threadB();

        this.threadWidth = 4;
        this.threadNoise = 2.5;
        this.threadCount = 15;
        this.threadLength = 4;
        this.threadSpacingY = 5.5;
        this.threadSpacingX = 6.5;
    }

    prerun() {
        // Initialise/reset variables here. Runs once, every time your day is viewed
    }

    update() {
        // Update and draw stuff here. Runs continuously (or only once if this.loop = false), while your day is being viewed
        this.backgroundThreadColor = random(['rgba(74,149,77,0.5)','rgba(149,74,77,0.5)','rgba(129,74,147,0.5)']);

        pixelDensity (1);
        this.makePattern ();
        loadPixels();

        //return;

        background(30);

        this.knitPattern();
    }

    makePattern() {
        let maxHeight = height/this.threadSpacingY;
        let maxWidth = width/this.threadSpacingX;
        let halfMaxHeight = floor(maxHeight/2) + 4;
        let imgY = halfMaxHeight;

        let pos = floor(random(assets.day2Tiles.length));
        let img = assets.day2Tiles[pos];
        let imgX = 0;
        while (imgX < maxWidth) {
            image(img, imgX, imgY - floor(img.height/2));
            imgX = imgX + img.width;
        }
        imgY = imgY + floor(img.height/2) + 3;

        pos = floor(random(assets.day2Banners.length));
        while (imgY < maxHeight) {
            pos = (pos + floor(random(assets.day2Banners.length - 1) + 1))%(assets.day2Banners.length);
            let img = assets.day2Banners[pos];

            let imgX = 0;
            while (imgX < maxWidth) {
                image(img, imgX, imgY);
                image(img, imgX, halfMaxHeight - (imgY - halfMaxHeight) - img.height);
                imgX = imgX + img.width;
            }
            imgY = imgY + img.height + 1;
        }
    }

    knitPattern() {
        for (let x = 0;
             x * this.threadSpacingX < width;
             x++)
        {
          for (let y = 0;
               y * this.threadSpacingY < height;
               y++)
          {

            let pixelIndex = (x + y * width) * 4;

            if (pixels[pixelIndex] > 100)
              {
                stroke (color(pixels[pixelIndex],pixels[pixelIndex+1],pixels[pixelIndex+2], 128));
              }
            else
              {
                stroke (this.backgroundThreadColor);
              }

            for (let i = 0; i < this.threadCount; i++) {
                this.threadA (2 * x * this.threadSpacingX, y * this.threadSpacingY);
                this.threadB ((2 * x + 1) * this.threadSpacingX, y * this.threadSpacingY);
            }
          }
        }
    }

    threadA (x, y) {
        let rand = random(this.threadWidth);

        line (x + random(this.threadNoise),
              y - rand + random(this.threadNoise),
              x + this.threadLength + random(this.threadNoise),
              y - rand + this.threadLength + random(this.threadNoise));
    }

    threadB (x, y) {
        let rand = random(this.threadWidth);

        line (x + random(this.threadNoise),
              y - rand + this.threadLength + random(this.threadNoise),
              x + this.threadLength + random(this.threadNoise),
              y - rand + random(this.threadNoise));
    }

    // Below are optional functions for interactivity. They can be deleted from this file if you want
    mousePressed() {
        this.update();
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