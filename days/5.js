// Made by andothergames

class Day5 extends Day {

    constructor () {

        super();
        this.loop = true; // Set to true or false

        this.controls = ""; // Write any controls for interactivity if needed or leave blank
        this.credits = "Made by andothergames"; // Replace with your name

        // Define variables here. Runs once during the sketch holder setup

        this.bufferLayer = createGraphics(width, height);
        this.startFrame;
    }

    prerun() {

        // Initialise/reset variables here. Runs once, every time your day is viewed

        this.startFrame = frameCount+1;
    }

    update() {

        if ((frameCount-this.startFrame) % 30 === 0) {


            //BULB VARIABLES

            let bulb = {
              color1: color(random(0, 255), 0, 255),
              color2: color(255, random(0, 255), random(0, 255)),
              color3: color(random(0, 255), 255, random(0, 255)),
              color4: color(255, random(0, 255), 0),
              color5: color(0, 255, random(0, 255)),
              w: 60,
              h: 140
            }


            //GRADIENT BACKGROUND

            linearGradient(
              350, -100,
              350, 600,
              color(0, 120, 140, 255),
              color(7, 93, 102, 255))
            rect(0, 0, 700, 700);

            noStroke();

            // FIRST LINE OF FLASHING LIGHTS

            let angle = radians(random(-30, 30));
            push();
            translate(160, 140);
            rotate(angle);
            drawBulb(0, 0, bulb.w, bulb.h, bulb.color4);
            pop();

            angle = radians(random(-30, 30));
            push();
            translate(350, 140);
            rotate(angle);
            drawBulb(0, 0, bulb.w, bulb.h, bulb.color1);
            pop();

            angle = radians(random(-30, 30));
            push();
            translate(560, 140);
            rotate(angle);
            drawBulb(0, 0, bulb.w, bulb.h, bulb.color3);
            pop();


            // SECOND LINE OF FLASHING LIGHTS

            angle = radians(random(-30, 30));
            push();
            translate(160, 340);
            rotate(angle);
            drawBulb(0, 0, bulb.w, bulb.h, bulb.color1);
            pop();

            angle = radians(random(-30, 30));
            push();
            translate(350, 340);
            rotate(angle);
            drawBulb(0, 0, bulb.w, bulb.h, bulb.color5);
            pop();

            angle = radians(random(-30, 30));
            push();
            translate(560, 340);
            rotate(angle);
            drawBulb(0, 0, bulb.w, bulb.h, bulb.color2);
            pop();

            //THIRD LINE OF FLASHING LIGHTS

            angle = radians(random(-30, 30));
            push();
            translate(160, 540);
            rotate(angle);
            drawBulb(0, 0, bulb.w, bulb.h, bulb.color5);
            pop();

            angle = radians(random(-30, 30));
            push();
            translate(350, 540);
            rotate(angle);
            drawBulb(0, 0, bulb.w, bulb.h, bulb.color4);
            pop();


            //WIRES

            push();
            for (let i = 0; i < 14; i++) {
              translate(60, 0)
              drawWire(-70, 80);
            }
            pop();


            //FIRE BULB

            push();
            translate(560, 540);
            rotate(radians(20));
            drawFireBulb(0, 0, bulb.w, bulb.h);
            pop();

            this.bufferLayer.image(canvas, 0, 0, width, height);

          } else {

            image(this.bufferLayer, 0, 0);
          }



          //-------------------functions

          function drawBulb(x, y, w, h, c) {
            noStroke();
            // fill(c);

            fill(c);

            ellipse(x, y, w, h);
            linearGradient(
              x, y - 80,
              x, y + 100,
              c,
              color(255, 255, 255, 255))
            ellipse(x, y, w, h);
            fill(0, 0, 0);
            stroke(0, 0, 0);
            strokeWeight(4);
            arc(x, y, 60, 140, radians(230), radians(310), CHORD);
            rect(x - 10, y - h / 2, 20, 20);
            noStroke();
            fill(0, 0, 0);
            ellipse(x - 14, y + 30, 6, 6);
            ellipse(x + 14, y + 30, 6, 6);
            noFill();
            stroke(0, 0, 0);
            strokeWeight(3);
            arc(x, y + 36, 12, 12, radians(20), radians(160), OPEN);
          }

          function drawFireBulb(x, y, w, h) {
            noStroke();
            fill('#dadee6');
            ellipse(x, y, w, h);
            fill('#000000');
            arc(x, y, 60, 140, radians(230), radians(310), CHORD);
            rect(x - 10, y - h / 2, 20, 20);
            ellipse(x - 14, y + 30, 6, 6);
            ellipse(x + 14, y + 30, 6, 6);
            noFill();
            stroke(0, 0, 0);
            strokeWeight(3);
            arc(x, y + 36, 12, 12, radians(180), radians(0), OPEN);
          }


          function drawWire(x, y) {
            noFill();
            stroke('#000000');
            strokeWeight(3);
            ellipse(x, y, 60, 7)
            ellipse(x, y + 200, 60, 7)
            ellipse(x, y + 400, 60, 7)

          }


          function linearGradient(nx, ny, sx, sy, colorN, colorS) {
            let gradient = drawingContext.createLinearGradient(nx, ny, sx, sy)

            gradient.addColorStop(0, colorN)
            gradient.addColorStop(1, colorS)

            drawingContext.fillStyle = gradient

          }
    }
}