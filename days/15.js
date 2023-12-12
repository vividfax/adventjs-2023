// Made by Sam Wong

class Day15 extends Day {

    constructor () {

        super();
        this.loop = false; // Set to true or false

        this.controls = "CLICK for a new candle"; // Write any controls for interactivity if needed or leave blank
        this.credits = "Made by Sam Wong"; // Replace with your name
        this.label = "candle";
        // Define variables here. Runs once during the sketch holder setup
        this.candleWidth = 100;
        this.candleHeight = 500;
        this.candleX = 0;
        this.candleY = 0;
    }

    prerun() {
        this.makeBackground();
        this.makeCandle(width/2,height+600);
    }

    update() {
        // Update and draw stuff here. Runs continuously (or only once if this.loop = false), while your day is being viewed
    }

    // Below are optional functions for interactivity. They can be deleted from this file if you want

    mousePressed() {
        this.makeBackground();
        this.makeCandle(width/2,height+600);
       // for(let i = 0; i < 20; i++){
        //    this.makeCandle(random(0,width),random(0,height*2.5));
        //}

        noLoopCanvas.image(canvas, 0, 0, width, height);
    }

    makeCandle(x,y){
        this.candleWidth = random(100,200);
        this.candleHeight = random(400,700);
        // redraw();
        noStroke();

        let botc = color(random(0,255),random(0,255),random(0,255));
        let topc = color(random(0,255),random(0,255),random(0,255));
        let v =  this.candleHeight/2*random(1.5, 1.75);
        let c = color(random(0,255),random(0,255),random(0,255),255/3)
        fill(c);
        background(c);
        ellipse(x, y/2 - this.candleHeight/2 - 50,v*3, v*3);
        ellipse(x, y/2 - this.candleHeight/2 - 50,v*1.25, v*1.25);
        let v2 = random(1.25, 1.75);
        ellipse(x, y/2 - this.candleHeight/2 - 50,v/v2, v/v2);



        for (let i = 0; i < this.candleHeight - 1; i+=5) {
            fill(lerpColor( botc, topc, map(i, 0, this.candleHeight, 0, 1)));
            ellipse(x, y/2 - i/2, this.candleWidth, this.candleWidth/3);
        }
        fill(lerpColor( botc, topc, map(this.candleHeight/2, 0, this.candleHeight, 0, 1)));
        ellipse(x, y/2 - this.candleHeight/2, this.candleWidth, this.candleWidth/3);

        let flameStart = y/2 - (this.candleHeight+50)/2;
        let flameHeight = random(80,100);
        let flameBotOffset = random(10,20);
        let flameTopOffset = flameHeight - flameBotOffset;
        let flameXStartControl = random(200,400);
        let flameXEndControl = random(40,80);
        let flameYStartControl = random(40,60);
        let flameYEndControl = random(70,90);
        let flamec1 = color(247,random(80,200),27);
        fill(flamec1);
        stroke(flamec1);
        curve(x-flameXStartControl, flameStart-flameYStartControl, x, flameStart+flameBotOffset, x, flameStart-flameTopOffset, x-flameXEndControl, flameStart-flameTopOffset+flameYEndControl);
        curve(x+flameXStartControl, flameStart-flameYStartControl, x, flameStart+flameBotOffset, x, flameStart-flameTopOffset, x+flameXEndControl, flameStart-flameTopOffset+flameYEndControl);

        let flameXStartControl2 = random(90,110);
        let flameYStartControl2 = random(10,30);
        let flameYOffset = random(20,40);
        let flameYEndControl2 = random(70,90);
        //color(252,241,212);
        let flamec3 = color(252,241,212);
        fill(flamec3);
        stroke(flamec3);
        curve(x-flameXStartControl+flameXStartControl2, flameStart-flameYStartControl2, x, flameStart+flameBotOffset, x, flameStart-flameTopOffset+flameYOffset, x-flameXEndControl, flameStart-flameTopOffset+flameYEndControl2);
        curve(x+flameXStartControl-flameXStartControl2, flameStart-flameYStartControl2, x, flameStart+flameBotOffset, x, flameStart-flameTopOffset+flameYOffset, x+flameXEndControl, flameStart-flameTopOffset+flameYEndControl2);


    }
    makeBackground(){
        noStroke();
        let bg = color(0, 0, 0);
        let fg = color(random(20,50), random(20,50), random(20,50));
        for (let i = 0; i < height; i+=10) {
            fill(lerpColor(bg, fg, map(i, 0, height, 0, 1)))
            rect(0, i, width, 10);
        }
    }
}