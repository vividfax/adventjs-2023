// Made by bleeptrack

class Day7 extends Day {

    constructor () {

        super();
        this.loop = true; // Set to true or false

        this.controls = "Candles burn down over time until Christmas. Hope you come back and see each advent candle light up :)"; // Write any controls for interactivity if needed or leave blank
        this.credits = "Made by bleeptrack"; // Replace with your name

        // Define variables here. Runs once during the sketch holder setup
    }

    prerun() {

        // Initialise/reset variables here. Runs once, every time your day is viewed
    }

    update() {

        // Update and draw stuff here. Runs continuously (or only once if this.loop = false), while your day is being viewed

        colorMode(HSB);
        background(231, 73, 100-Math.abs( (12-hour()) * 4));
        colorMode(RGB);


        let wid = 130
        let docht = 60
        let flameR = 30
        let shineR = 350
        let currentday = day() > 24 ? 24 : day()
        // currentday = 24; // make sure to comment out before uploading

        strokeWeight(10);
        stroke(0);

        function candle(pos, startday){


            let timediff = 0
            if(currentday >= startday){
            timediff = (currentday-startday) * 24 + hour()
            }

            let maxHeight = 700 * 1/3 + timediff*0.8
            let flameX = pos + (wid/2)
            let flameY = maxHeight-docht

            fill(148, 43, 37)
            rect(pos, maxHeight, wid, 700-maxHeight-10);
            line(pos + (wid/2), maxHeight, pos + (wid/2), maxHeight-docht)

            let frameOffset = frameCount + pos;
            let speedN = 20
            let n1 = noise(frameOffset/50 + pos)
            let n2 = noise(frameOffset/pos/2)
            let offsetSin = 15 * sin(frameOffset/speedN) * n1 + 15
            let offsetCos = 15 * cos(frameOffset/speedN/2) * n2 + 15

            if(currentday >= startday){
            fill(255, 204, 0);
            beginShape();
            vertex(flameX - flameR, flameY)
            bezierVertex(flameX - flameR,flameY + flameR, flameX, flameY + flameR, flameX, flameY + flameR)
            bezierVertex(flameX, flameY + flameR, flameX + flameR, flameY + flameR,flameX + flameR,flameY)
            bezierVertex( flameX + flameR,flameY-(docht/3),flameX+offsetCos, flameY - docht + offsetSin, flameX, flameY - docht)
            bezierVertex( flameX-offsetSin, flameY - docht + offsetCos, flameX - flameR,flameY-(docht/3), flameX - flameR, flameY)
            endShape(CLOSE);
            }

        }

        function shines(pos, startday, hasfill){

            if(hasfill){
            fill(255, 251, 201, 140);
            }else{
            noFill()
            }

            let timediff = 0
            if(currentday >= startday){
            timediff = (currentday-startday) * 24 + hour()
            }

            let maxHeight = 700 * 1/3 + timediff*0.8
            let flameX = pos + (wid/2)
            let flameY = maxHeight-docht
            let n = noise(frameCount/300 + pos)

            if(currentday >= startday){
            circle(flameX, flameY, shineR + n*50)
            }
        }

        for(let i = 0; i<4; i++){
            shines(50 + 150*i, 3+i*7, true)
        }
        for(let i = 0; i<4; i++){
            shines(50 + 150*i, 3+i*7, false)
        }
        for(let i = 0; i<4; i++){
            candle(50 + 150*i, 3+i*7)
        }
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
