// Made by Younès Rabii
// Original poem by Refat Alareer
// Music by daniel.mp3

class Day23 extends Day {

    constructor () {

        super();
        this.loop = true; // Set to true or false

        this.controls = "Original poem by Refat Alareer, 6 days before he was murdered."; // Write any controls for interactivity if needed or leave blank
        this.credits = "Code by Younès Rabii. Music: 'dark snowy night' by daniel.mp3"; // Replace with your name

        this.poem =(`If I must die,
        you must live
        to tell my story
        to sell my things
        to buy a piece of cloth
        and some strings,
        (make it white with a long tail)
        so that a child, somewhere in Gaza
        while looking heaven in the eye
        awaiting his dad who left in a blaze–
        and bid no one farewell
        not even to his flesh
        not even to himself–
        sees the kite, my kite you made, flying up above
        and thinks for a moment an angel is there
        bringing back love
        If I must die
        let it bring hope
        let it be a tale`).split("\n").map(line=>line.trim());
    }

    cleanup () {

        assets.day23Song.pause();
        assets.day23Song.currentTime = 0;
    }

    prerun() {

        // Initialise/reset variables here. Runs once, every time your day is viewed

        this.texts = [];

        this.text_spacing = 500;
        this.poem.forEach((line, i)=>
            this.addText(line, 10, -30-i*this.text_spacing, i)
        );

        this.kite_intro_Y = 500;
        this.kite_start_X = 350;
        this.kite_start_Y = 350;

        this.kite_X = this.kite_start_X;
        this.kite_Y = this.kite_start_Y;
        this.kite_W = 35;

        this.kite_H1 = 60;
        this.kite_H2 = 80;

        /*

            A
            .       ^
           /|\      | = h1
        C /_|_\ D   V
          \ | /     ^
           \|/      V = h2
            B
        */

        this.num_bows = 25;
        this.bows_X = new Array(this.num_bows).fill(this.kite_X);
        this.bows_length = 200;

        randomSeed(1948);

        var num = 100;
        this.particles = [];
        for (let i=0; i<num; i++) {
            var loc = createVector(random(width*1.2), random(height), 2);
            var angle = 0; //any value to initialize
            var dir = createVector(cos(angle), sin(angle));
            var speed = random(0.5,2);
            this.particles[i]= new this.Particle(loc, dir, speed);
          }

        this.started = false;
        this.start_time = 0;
    }

    update() {

        // Update and draw stuff here. Runs continuously (or only once if this.loop = false), while your day is being viewed

        textFont("Verdana", 24)

        background("#0c1445"); //night sky
        this.drawStars();

        if(!this.started)
        {
            text('"If I must die"',200,350)
            text("a poem by Refat Alareer",200,350+24)
            text("Click to start",200,500+24*2)
            text("(contains audio)",200,500+24*3)
            return false;
        }
        this.drawTexts();
        this.drawKite();

    }

    addText(text, x, y, i)
    {
        this.texts.push(new this.Text(text,x,y,i));
    }

    drawTexts()
    {
        this.texts.forEach(line=>{
            line.update();
        });
    }

    drawStars()
    {
        noStroke();
        for (let i=0; i<this.particles.length; i++) {
            this.particles[i].run();
          }
    }

    drawKite()
    {
        angleMode(DEGREES);
        var time = (millis()-this.start_time)/20

        // Kite
        var X = this.kite_X, Y = this.kite_Y, W = this.kite_W, H1 = this.kite_H1, H2 = this.kite_H2;
        var Y0 = max(this.kite_intro_Y - time, 0);

        var kite_tilt = 10;
        var a1 = time;
        var dy = sin(a1*1.5)*kite_tilt;
        var dx = cos(a1+90)*kite_tilt;

        X += dx * 5;
        Y += dy * 5;

        var pO = [X,Y0+Y],
        pA = [X-dx,Y0+Y-H1],
        pB = [X+dx,Y0+Y+H2],
        pC = [X-W,Y0+Y+dy],
        pD = [X+W,Y0+Y-dy];


        // Holding rod

        var mid = (a,b, f=1/2) => a*f+b*(1-f);
        var mid2 = (A,B,f=1/2) => [mid(A[0], B[0], f), mid(A[1], B[1], f)];


        var triangles = [
            [pO, pC, pA, "white"], // top left
            [pO, pD, pA, "#C7CCCC"], // top right
            [pO, pC, pB, "#C7CCCC"], // bottom left
            [pO, pD, pB, "white"], // bottom right
            ]

        triangles.forEach(points =>
            {
                fill(points[3]);
                noStroke();
                beginShape();
                vertex(points[0][0], points[0][1]);
                vertex(points[1][0], points[1][1]);
                vertex(points[2][0], points[2][1]);
                endShape();
            });


        var bow_spacing = this.bows_length/this.num_bows;;
        fill("white");
        this.bows_X[-1] = pB[0];
        this.bows_X.forEach((bow_X, i)=>{
            var delta = this.bows_X[i-1] - bow_X;
            this.bows_X[i] += delta*0.2;
            var bowsize = 8;
            if((i+1)%3==0)
            {
                var x = this.bows_X[i], y = pB[1]+i*bow_spacing;
                circle(this.bows_X[i],  pB[1]+i*bow_spacing, bowsize);
            }
        });



   var pH = [500*3,700*3], // Hand holding the kite
        pH1 = mid2(pO, pH, 9/10);

   var rods = [
        [pO, pH],
        ]

    strokeWeight(2);
    rods.forEach(points =>
        {
            stroke("white")
            noFill();
            beginShape();
            vertex(points[0][0], points[0][1]);
            vertex(points[1][0], points[1][1]);
            endShape();
        });


    }


    // Below are optional functions for interactivity. They can be deleted from this file if you want

    mousePressed() {

        if(!this.started)
        {
            this.started = true;
            this.start_time = millis();
            assets.day23Song.play();

            // to stop the song:
            // assets.dayXSong.stop();
        }
    }

    Text = class{
        constructor(line,x,y,i)
        {
            this.text = line;
            this.x = x;
            this.y = y;
            this.i = i;
            this.fallSpeed = 1.5;
        }

        update()
        {
            switch(this.i)
            {
                case 18:
                    this.y = min(this.y + this.fallSpeed, 700-24);
                break;

                case 17:
                    this.y = min(this.y + this.fallSpeed, 700-24*2);
                break;

                case 16:
                    this.y = min(this.y + this.fallSpeed, 700-24*3);
                break;

                default:
                if(this.y < 800)this.y += this.fallSpeed; //
                break;
            }
            text(this.text, this.x, this.y);
        }
    }

    Particle = class {
        constructor(_loc,_dir,_speed){
          this.loc = _loc;
          this.dir = _dir;
          this.speed = _speed;

          this.noiseScale=5000;
          this.noiseStrength=5;
        }
        run() {
          this.move();
          this.checkEdges();
          this.update();
        }
        move(){
          let angle=90+ noise(this.loc.x/this.noiseScale, this.loc.y/this.noiseScale, frameCount/this.noiseScale)*TWO_PI*this.noiseStrength; //0-2PI
          this.dir.x = cos(angle);
          this.dir.y = sin(angle);
          var vel = this.dir.copy();
          var d =1;
          vel.mult(this.speed*d);
          this.loc.add(vel);
        }
        checkEdges(){
          if (this.loc.x<0 || this.loc.x>width || this.loc.y<0 || this.loc.y>height) {
            this.loc.x = random(width*1.2);
            this.loc.y = random(height);
          }
        }
        update(){
          fill("white");
          ellipse(this.loc.x, this.loc.y, this.loc.z);
        }
      }
}