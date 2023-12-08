// Made by Finn Carney

class Day11 extends Day {

    constructor () {

        super();
        this.loop = true; // Set to true or false

        this.controls = "CLICK to Blink || SHIFT to Lock || UP ARROW for Clock"; // Write any controls for interactivity if needed or leave blank
        this.credits = "Made by Finn Carney"; // Replace with your name

        // Define variables here. Runs once during the sketch holder setup
        this.frameCount = 0;

        this.upperDowner - 0;
        this.eyeShake = 0;
        this.eyeSpeed = 0;

        this.hangOut = false;
        this.lockOpacity = 0;

        this.showClock = false;
        this.clockFont = null;
        this.clockOpacity = 0;

        //eye variables
        this.eyeWidth = 1;
        this.eyeHeight = 1;

        this.eyeBoundsX = 1;
        this.eyeBoundsY = 1;

        //iris + pupil variables
        this.irisColour = color(1, 1, 1);

        //should iris size / pupil size change at runtime?
        this.irisSize = 0;
        this.pupilSize = 0;

        this.eyeWhite = color(1,1,1);

        this.pupilX = width/2;
        this.pupilY = height/2;

        this.wanderFrame = 0;
        this.wanderX = width/2;
        this.wanderY = height/2;

        this.blinkFrame = 0;
        this.blinkLength = 0;

        this.hiddenImageNum = 0;

        this.snowObjs = [];
        this.snowNum = 0;
        this.snowDirY = 0;
        this.snowDirX = 0;

        this.clockFont = assets.day11clockFont;
        this.hiddenImages = assets.day11hiddenImages;
    }

    prerun() {

        // Initialise/reset variables here. Runs once, every time your day is viewed
        this.frameCount = 0;

        this.hangOut = false;
        this.lockOpacity = 0;

        this.showClock = false;

        this.clockOpacity = 0;

        this.generateEye();

        this.generateSnow();

        this.setBlinkFrame();
    }

    update() {

        // Update and draw stuff here. Runs continuously (or only once if this.loop = false), while your day is being viewed

        this.eyeCenter();

        this.backgroundImage();

        this.InnerEye();

        this.OuterEye();

        this.displayClock();
        this.displayLock();

        this.frameCount++;
    }

    //RANDOM GENERATiON

    generateEye()
    {
        if(this.hangOut === true)
        {
            return;
        }

        this.upperDowner = random(-1, 1);
        this.eyeShake = random(-1, 1);
        this.eyeSpeed = random(-1, 1);

        this.eyeWidth = width * 1.55 * random(0.9, 1.1);
        this.eyeHeight = height * 1.1 * random(0.9, 1.1);

        this.pupilSize = random(0.125, 0.275)

        this.irisColor = color(random(50,200), random(50,200), random(50,200));
        this.irisSize = this.pupilSize + 35 - (30 * this.upperDowner);

        this.eyeWhite = color(random(235, 255), random(235, 255), random(235, 255));

        this.blinkLength = 30 - (15 * this.upperDowner);

        this.hiddenImageNum = int(random(0, this.hiddenImages.length));

        this.setWanderFrame();
    }

    generateSnow()
    {
        if(this.hangOut)
        {
            return;
        }

        this.snowObjs = [];

        this.snowNum = int(random(50, 200));
        this.snowDirX = random(-2, 2);
        this.snowDirY = random(2, 5);

        for (let i = 0; i < this.snowNum; i++)
        {
            this.snowObjs[i] = createVector(random(width/8 , width/8 * 7), random(height/2 - (this.eyeHeight / 5), height/2 + (this.eyeHeight / 5)), random(5, 10));
        }
    }

    //LOOK FUNCTION

    eyeCenter()
    {
        let x = width/2;
        let y = height/2;

        if(mouseX > -1 && mouseX < width + 1 && mouseY > -1 && mouseY < height + 1)
        {
            x = mouseX;
            y = mouseY;

            x = constrain(x, width/2 - (this.eyeWidth / 5), width/2 + (this.eyeWidth / 5));
            y = constrain(y, height/2 - (this.eyeHeight / 12), height/2 + (this.eyeHeight / 12));

            this.wanderX = x;
            this.wanderY = y;

            this.wanderFrame = this.frameCount + 100;
        }

        else
        {
            x = this.wanderX;
            y = this.wanderY;
        }

        if(this.frameCount > this.wanderFrame)
        {
            this.setWanderTarget();
        }

        if(this.eyeShake > 0)
        {
            x = x + (random(-10, 10) * this.eyeShake);
            y = y + (random(-10, 10) * this.eyeShake);
        }

        this.pupilX = lerp(this.pupilX, x, 0.075 + (0.065 * this.eyeSpeed));
        this.pupilY = lerp(this.pupilY, y, 0.075 + (0.065 * this.eyeSpeed));
    }

    //GRAPHICS DRAWING

    backgroundImage()
    {

        //hidden image calcs
        image(this.hiddenImages[this.hiddenImageNum], -(this.pupilX * 0.5), -(this.pupilY * 0.5), width * 1.25, height * 1.25);

        //generateSnow
        noStroke();
        fill(200);
        for (let i = 0; i < this.snowObjs.length; i++) {
            this.snowObjs[i].x += this.snowDirX;
            this.snowObjs[i].y += this.snowDirY;

            //if snow goes out of bounds, reset it somewhere else
            if(this.snowObjs[i].x < width/8 || this.snowObjs[i].x > width/8 * 7 || this.snowObjs[i].y > height/2 + (this.eyeHeight / 5))
            {
                this.snowObjs[i] = createVector(random(width/8 , width/8 * 7), height/2 - (this.eyeHeight / 5), random(5, 10));
            }

            ellipse(this.snowObjs[i].x, this.snowObjs[i].y, this.snowObjs[i].z);
        }
    }

    InnerEye()
    {
        //pupil calcs
        noStroke();
        fill(20, 20, 20, 225);
        ellipse(this.pupilX, this.pupilY, this.eyeHeight * this.pupilSize, this.eyeHeight * this.pupilSize);

        //iris calcs
        noFill();
        stroke(this.irisColor);
        strokeWeight(this.irisSize);
        ellipse(this.pupilX, this.pupilY, this.eyeHeight * this.pupilSize, this.eyeHeight * this.pupilSize);

        //white calcs
        let eyeWhiteStroke = 600;
        let eyeWhiteSize = this.eyeHeight * this.pupilSize + (this.irisSize) + (eyeWhiteStroke) - 1;
        noFill();
        stroke(this.eyeWhite);
        strokeWeight(eyeWhiteStroke);
        ellipse(this.pupilX, this.pupilY, eyeWhiteSize, eyeWhiteSize);

    }

    OuterEye()
    {
        noFill();
        stroke(0);
        strokeWeight(500);

        let newEyeHeight = this.eyeHeight;

        if(this.frameCount < this.blinkFrame - (this.blinkLength / 2))
        {
            newEyeHeight = this.eyeHeight;
        }
        else
        {
            newEyeHeight = lerp(400, this.eyeHeight, abs(this.blinkFrame - this.frameCount) / (this.blinkLength / 2));

            if(this.frameCount === this.blinkFrame)
            {

                this.generateEye();
                this.generateSnow();
                this.setWanderTarget();
            }

            if(this.frameCount >= this.blinkFrame + (this.blinkLength / 2))
            {
                this.setBlinkFrame();
            }
        }

        ellipse(height/2, width/2, this.eyeWidth, newEyeHeight);
    }

    //HUD

    displayClock()
    {
        if(!this.showClock)
        {
            this.clockOpacity = 0;
            return;
        }

        else if(this.clockOpacity < 255)
        {
            this.clockOpacity = lerp(this.clockOpacity, 255, 0.05);
        }

        textFont(this.clockFont);
        textSize(44);
        textAlign(CENTER, CENTER);
        fill(255, 255, 255, this.clockOpacity);
        stroke(125, 125, 125, this.clockOpacity);
        strokeWeight(2.5);

        if(hour() < 10)
        {
            text("0" + str(hour()), width/5, 600);
        } else {
            text(str(hour()), width/5, 600);
        }

        text(":", (width/5) * 2, 600);

        if(minute() < 10)
        {
            text("0" + str(minute()), width/2, 600);
        } else {
            text(str(minute()), width/2, 600);
        }

        text(":", (width/5) * 3, 600);

        if(second() < 10)
        {
            text("0" + str(second()), (width/5) * 4, 600);
        } else {
            text(str(second()), (width/5) * 4, 600);
        }
    }

    displayLock()
    {
        if(!this.hangOut)
        {
            return;
        }

        fill(150);
        noStroke();
        rect(662.5, 25, 25, 25);

        noFill();
        stroke(150);
        strokeWeight(5);
        ellipse(675, 25, 20, 20);
    }

    //INPUTS

    mousePressed()
    {
        if(this.blinkFrame > int(this.frameCount + this.blinkLength / 2))
        {
        this.blinkFrame = int(this.frameCount + (this.blinkLength / 2));
        }
    }

    keyPressed()
    {
        if(keyIsDown(SHIFT))
        {
            this.hangOut = !this.hangOut;
        }

        if(keyIsDown(UP_ARROW))
        {
            this.showClock = !this.showClock;
        }
    }

    //SET FUNCTIONS
    setBlinkFrame()
    {
        this.blinkFrame = int(this.frameCount + this.blinkLength + random(225, 375) - (125 * this.upperDowner));
    }

    setWanderFrame()
    {
        this.wanderFrame = int(this.frameCount + 150 - (100 * this.upperDowner));
    }

    setWanderTarget()
    {

        this.wanderX = random(width/2 - (this.eyeWidth / 5), width/2 + (this.eyeWidth / 5));
        this.wanderY = random(height/2 - (this.eyeHeight / 12), height/2 + (this.eyeHeight / 12));
        this.setWanderFrame();
    }
}