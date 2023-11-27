// Made by Dan Emmerson

class Day1 extends Day {

    constructor () {

        super();
        this.loop = true; // Set to true or false

        this.controls = ""; // Write any controls for interactivity if needed or leave blank
        this.credits = "Made by Dan Emmerson"; // Replace with your name

        // Define variables here. Runs once during the sketch holder setup
        this.numPoints = 50;

        this.zScaleMultiplier = 0.2;

        this.yOffsetMax = 15;

        //palette
        this.colReindeer = '#604F3B';
        this.colReindeerDark = '#3C3225';
        this.colReindeerAntler = '#CAAA8A';
        this.colReindeerNose = '#FF0000';

        this.colSleighRed = '#b93d3d';
        this.colSleighDark = '#7b3b3b';
        this.colSleighSled = '#CAAA8A';
        this.colSleighWhite = '#ECDFD4';

        this.colBackgroundDark = '#0A0807';
        this.colBackgroundHills = '#18262C';
        this.colBackgroundMid = '#1D333C';
        this.colBackgroundLight = '#345E6D';

        this.easeX = 1;
        this.easeY =  1;
        this.easing = 1;

        this.stars = [];
        this.numStars = 300;

        this.mousePointerMultiplier = createVector(0,0)
    }

    prerun() {
        this.points = [];
        // Initialise/reset variables here. Runs once, every time your day is viewed

        for (let i = 0; i<this.numPoints; i++){
            let point = createVector (width/2,height/2);
            this.points.push(point);
        }

        this.currentYOffset;
        while(this.stars.length < this.numStars) {
            this.stars.push(new this.Star());
        }
    }



    update() {
        if(mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height){
            noCursor();
        }else{
            cursor();
        }

        // Update and draw stuff here. Runs continuously (or only once if this.loop = false), while your day is being viewed

        //sky
        noStroke();
        fill(this.colBackgroundMid);
        rect(0,0,width,height)
        //left hill
        fill('#1B2D35')
        circle(-100 - mouseX/50, height*2.3 - mouseY/50,height*4 )
        //right hill
        fill(this.colBackgroundHills)
        circle(width + 400 - mouseX/5, height*2.1 - mouseY/10,height*4)

        //ground
        fill(this.colBackgroundDark)
        circle(width/2 + 200 - mouseX/3, height*2.5 - mouseY /7,height*4)


        let numberToMake = this.drawSnowfall();

        for (let i = 0; i<numberToMake; i++){
            this.stars.push(new this.Star());
        }


        this.points.shift();

        let dx = mouseX-this.easeX
        this.easeX += dx * this.easing;

        let dy = mouseY-this.easeY
        this.easeY += dy * this.easing;

        let point = createVector(this.easeX,this.easeY + (this.yOffsetMax * cos (frameCount/5)));
        this.points.push(point)

        /*
        //guide dots
        for (let i = 0; i<numPoints; i++){
            let p = points[i]
            circle(p.x, p.y, 2);
        }
        */

        this.currentYOffset = this.yOffsetMax * cos(frameCount / 10);
        this.drawSleigh(this.points, 10);

        this.drawReindeer(50,0,this.points,20,false);
        this.drawReindeer(-50,0,this.points,20,false);
        this.drawReindeer(50,0,this.points,30,false);
        this.drawReindeer(-50,0,this.points,30,false);

        this.drawReindeer(0,0,this.points,40,true);



    }

    // Below are optional functions for interactivity. They can be deleted from this file if you want

    mousePressed() {
        //make the whole chain bounce
    }

    mouseReleased() {

    }

    keyPressed() {

    }

    keyReleased() {

    }

    // Below is the basic setup for a nested class. This can be deleted or renamed

    Star = class {

        constructor() {
            this.x = 0;
            this.y = 0;
            this.spawn();
            let x = this.x;
            let y = this.y;
            this.pos = createVector(x, y);
            this.prevPos = createVector(x, y);

            this.vel = createVector(0, 0);

            this.ang = atan2(y - (height/2), x - (width/2));

            this.size = 10;

            this.colourA = (255,255,255,255);
            this.colourB = (0,0,0,0);
            this.colourLerp = 0;
          }

        draw(){
            fill ('#ECDFD4');
            circle(this.pos.x,this.pos.y,this.size)

            this.vel.x = cos(this.ang) * -10;
            this.vel.y = sin(this.ang) * -10;

            this.prevPos.x = this.pos.x;
            this.prevPos.y = this.pos.y;

            this.pos.x += this.vel.x;
            this.pos.y += this.vel.y;

            if(this.size > 0){
                this.size = (dist(this.pos.x, this.pos.y, width/2,height/2)/25);
                this.size -= 0.02;
            }

            if(this.colourLerp < 1){
                this.colourLerp += 0.02;
            }

        }
        isActive(){
            if(dist(this.pos.x, this.pos.y, width/2,height/2)<10){

                return false;
            }else{
                return true;
            }
        }

        spawn(){
            let margin = 2000;
            this.y = random(-margin,width+margin);
            this.x = random(-margin,height+margin);
            while(this.y >0 && this.y <width && this.x >0 && this.x <height){
                this.y = random(-margin,width+margin);
                this.x = random(-margin,height+margin);
            }

        }
    }

    drawReindeer (xOffset,yOffset,reindeerPoints,offset,isRudolph){

        noStroke();
        fill (this.colReindeer);
        //TAIL
        circle(reindeerPoints[-1 + offset].x + xOffset, reindeerPoints[-1 + offset].y+10, 20);
        //BODY
        //legs back
        stroke(this.colReindeer)
        strokeWeight(8);
        line(reindeerPoints[0 + offset].x-10 + xOffset, reindeerPoints[0 + offset].y+30,reindeerPoints[0 + offset].x-10 + xOffset,reindeerPoints[0 + offset].y + 70);
        line(reindeerPoints[0 + offset].x+10 + xOffset, reindeerPoints[0 + offset].y+30,reindeerPoints[0 + offset].x+10 + xOffset,reindeerPoints[0 + offset].y + 70);
        stroke(this.colReindeerDark)
        line(reindeerPoints[0 + offset].x-10 + xOffset, reindeerPoints[0 + offset].y+69,reindeerPoints[0 + offset].x-10 + xOffset,reindeerPoints[0 + offset].y + 70);
        line(reindeerPoints[0 + offset].x+10 + xOffset, reindeerPoints[0 + offset].y+69,reindeerPoints[0 + offset].x+10 + xOffset,reindeerPoints[0 + offset].y + 70);
        noStroke();

        circle(reindeerPoints[0 + offset].x + xOffset, reindeerPoints[0 + offset].y+30, 60);
        circle(reindeerPoints[1 + offset].x + xOffset, reindeerPoints[1 + offset].y+30, 60);
        //legs front
        stroke(this.colReindeer)
        strokeWeight(8);
        line(reindeerPoints[2 + offset].x-10 + xOffset, reindeerPoints[2 + offset].y+30,reindeerPoints[2 + offset].x-10 + xOffset,reindeerPoints[2 + offset].y + 70);
        line(reindeerPoints[2 + offset].x+10 + xOffset, reindeerPoints[2 + offset].y+30,reindeerPoints[2 + offset].x+10 + xOffset,reindeerPoints[2 + offset].y + 70);
        stroke(this.colReindeerDark)
        line(reindeerPoints[2 + offset].x-10 + xOffset, reindeerPoints[2 + offset].y+69,reindeerPoints[2 + offset].x-10 + xOffset,reindeerPoints[2 + offset].y + 70);
        line(reindeerPoints[2 + offset].x+10 + xOffset, reindeerPoints[2 + offset].y+69,reindeerPoints[2 + offset].x+10 + xOffset,reindeerPoints[2 + offset].y + 70);
        noStroke();

        circle(reindeerPoints[2 + offset].x + xOffset, reindeerPoints[2 + offset].y+10, 30);
        //HEAD
        //antler
        stroke(this.colReindeerAntler)
        strokeWeight(8);
        //L
        line(reindeerPoints[3 + offset].x + xOffset, reindeerPoints[3 + offset].y,reindeerPoints[3 + offset].x-40 + xOffset,reindeerPoints[3 + offset].y-40);
        line(reindeerPoints[3 + offset].x-10 + xOffset, reindeerPoints[3 + offset].y,reindeerPoints[3 + offset].x-10 + xOffset,reindeerPoints[3 + offset].y-40);

        line(reindeerPoints[3 + offset].x + xOffset, reindeerPoints[3 + offset].y,reindeerPoints[3 + offset].x+40 + xOffset,reindeerPoints[3 + offset].y-40);
        line(reindeerPoints[3 + offset].x+10 + xOffset, reindeerPoints[3 + offset].y,reindeerPoints[3 + offset].x+10 + xOffset,reindeerPoints[3 + offset].y-40);
        //face
        noStroke()
        fill (this.colReindeer);
        circle(reindeerPoints[3 + offset].x + xOffset, reindeerPoints[3 + offset].y, 40);
        fill (this.colReindeerDark);
        circle(reindeerPoints[4 + offset].x-20 + xOffset, reindeerPoints[4 + offset].y, 10);
        circle(reindeerPoints[4 + offset].x+20 + xOffset, reindeerPoints[4 + offset].y, 10);
        fill (this.colReindeer);
        circle(reindeerPoints[4 + offset].x + xOffset, reindeerPoints[4 + offset].y, 40);
        if(isRudolph){
            fill (this.colReindeerNose);
        }else{
            fill (this.colReindeerDark);
        }
        circle(reindeerPoints[5 + offset].x + xOffset, reindeerPoints[5 + offset].y, 20);

    }

    drawSleigh (sleighPoints,offset){
        noStroke()
        fill (this.colSleighRed);
        rectMode(CENTER);

        //main bit
        rect(sleighPoints[0 + offset].x,sleighPoints[0 + offset].y,150,70,0,0,50,50);
        this.drawSack(sleighPoints,1,offset);
        this.drawSleighSegment(sleighPoints,1,offset);

        this.drawSleighSegment(sleighPoints,2,offset);
        rect(sleighPoints[2 + offset].x - 50,sleighPoints[2 + offset].y + 50,30,50,0,0,10,10);
        rect(sleighPoints[2 + offset].x + 50,sleighPoints[2 + offset].y + 50,30,50,0,0,10,10);
        fill ('#fff');
        circle(sleighPoints[2 + offset].x, sleighPoints[2 + offset].y-110, 20);
        this.drawSanta(sleighPoints,3,offset);
        this.drawSleighSegment(sleighPoints,3,offset)

        //front
        fill (this.colSleighRed);
        rect(sleighPoints[4 + offset].x,sleighPoints[4 + offset].y,150,70,0,0,50,50);
        //sleds
        fill (this.colSleighSled);
        rect(sleighPoints[4 + offset].x - 50,sleighPoints[4 + offset].y + 60,30,20,0,0,10,10);
        rect(sleighPoints[4 + offset].x + 50,sleighPoints[4 + offset].y + 60,30,20,0,0,10,10);
        rect(sleighPoints[5 + offset].x - 50,sleighPoints[5 + offset].y + 50,30,50,0,0,10,10);
        rect(sleighPoints[5 + offset].x + 50,sleighPoints[5 + offset].y + 50,30,50,0,0,10,10);
    }

    drawSleighSegment(points,point,offset){
        //outer
        fill (this.colSleighRed);
        rect(points[point + offset].x,points[point + offset].y,150,70,0,0,50,50);
        //inner
        fill (this.colSleighDark);
        rect(points[point + offset].x,points[point + offset].y-20,100,30);
        //sleds
        fill (this.colSleighSled);
        rect(points[point + offset].x - 50,points[point + offset].y + 60,30,20,0,0,10,10);
        rect(points[point + offset].x + 50,points[point + offset].y + 60,30,20,0,0,10,10);
    }

    drawSanta(points,point,offset){
        fill (this.colSleighRed);
        //body
        circle(points[point + offset].x, points[point + offset].y-40, 80);
        //head
        fill (this.colSleighWhite);
        circle(points[point + offset].x, points[point + offset].y-70, 50);
        fill (this.colSleighSled);
        circle(points[point + offset].x, points[point + offset].y-80, 30);
        fill (this.colSleighWhite);
        circle(points[point + offset].x, points[point + offset].y-50, 40);
        //hat

        fill (this.colSleighRed);
        circle(points[point + offset].x, points[point + offset].y-100, 30);
        strokeWeight(15);
        stroke(this.colSleighWhite);
        line(points[point + offset].x-10, points[point + offset].y-90,points[point + offset].x+10, points[point + offset].y-90)
        noStroke();

    }

    drawSack(points,point,offset){
        fill (this.colReindeer);
        //main sack
        circle(points[point + offset].x, points[point + offset].y-50, 130);
        //knot
        circle(points[point + offset].x, points[point + offset].y-120, 30);
        circle(points[point + offset].x-20, points[point + offset].y-110, 30);
        circle(points[point + offset].x+20, points[point + offset].y-110, 30);
    }

    drawSnowfall(){
        let numberToMake = 0;
        this.stars = this.stars.filter(star => {
            star.draw();
            if(!star.isActive()){
                numberToMake++;

            }
            return star.isActive();
        });
        return numberToMake;
    }


}