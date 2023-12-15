// Descending Snowflake - made by Dan Emmerson

class Day17 extends Day {

    constructor () {

        super();
        this.loop = true; // Set to true or false
        //Descending Snowflakes <-- name
        this.controls = "CLICK a snowflake to spawn descendants. SPACEBAR to start again"; // Write any controls for interactivity if needed or leave blank
        this.credits = "Made by Dan Emmerson"; // Replace with your name

        this.backgroundLayer = createGraphics(width,height);

        // Define variables here. Runs once during the sketch holder setup

    }

    prerun() {

        // Initialise/reset variables here. Runs once, every time your day is viewed


        this.snowflakeColour = '#8da9c4'
        this.snowflakeColourParent = '#eef4ed'

        this.bgColourLight = '#134074'
        this.bgColourDark = '#13315c'
        this.bgColourDarker = '#0b2545'


        this.armLengthMin = 20;
        this.armStepVariance = 5;
        this.armLengthMax = (width/3) -50;

        this.numberOfSpokesMin = 1;
        this.numberOfSpokesMax = 4;
        this.numberOfSpokesStepVariance = 1;

        this.coreSizeMin = 20;
        this.coreSizeMax = 60;
        this.coreSizeStepVaraiance = 2;
        //snowflake DNA
        this.snowflakeDNA = {};
        this.GenerateBlankSnowflakeDNA(this.snowflakeDNA);

        this.snowflake0DNA = {};
        this.GenerateBlankSnowflakeDNA(this.snowflake0DNA);
        this.snowflake1DNA = {};
        this.GenerateBlankSnowflakeDNA(this.snowflake1DNA);
        this.snowflake2DNA = {};
        this.GenerateBlankSnowflakeDNA(this.snowflake2DNA);

        this.snowflake3DNA = {};
        this.GenerateBlankSnowflakeDNA(this.snowflake3DNA);
        //middle
        this.snowflake5DNA = {};
        this.GenerateBlankSnowflakeDNA(this.snowflake5DNA);

        this.snowflake6DNA = {};
        this.GenerateBlankSnowflakeDNA(this.snowflake6DNA);
        this.snowflake7DNA = {};
        this.GenerateBlankSnowflakeDNA(this.snowflake7DNA);
        this.snowflake8DNA = {};
        this.GenerateBlankSnowflakeDNA(this.snowflake8DNA);

        this.snowflakeGridSide = (width/3,height/3);

        this.parentHighlightScaleMax = 30;
        this.parentHighlightScaleAddition = 0;

        this.GenerateChildSnowflakes();

        this.hexagonSize = 20;
        this.backgroundLayer.clear()
        this.drawHexagonalBG();
    }



    update() {


        fill(this.bgColourDark);
        rect(0,0,width,height)
        image(this.backgroundLayer,0,0)

        //grid
        fill(this.bgColourLight);
        strokeWeight(10);
        noStroke()
        circle(width/2,height/2,width/4 + this.parentHighlightScaleAddition + (dist(width/2,height/2,mouseX,mouseY))/10 + 10);


        this.DrawSnowflake(0,0, this.snowflake0DNA,this.snowflakeColour,true);

        this.DrawSnowflake(width/3,0, this.snowflake1DNA,this.snowflakeColour,true);
        this.DrawSnowflake(width/3 * 2,0, this.snowflake2DNA,this.snowflakeColour,true);

        this.DrawSnowflake(0,height/3, this.snowflake3DNA,this.snowflakeColour,true);
        //[parent]
        this.DrawSnowflake(width/3,height/3, this.snowflakeDNA,this.snowflakeColourParent,false);

        this.DrawSnowflake(width/3*2,height/3, this.snowflake5DNA,this.snowflakeColour,true);

        this.DrawSnowflake(0,height/3*2, this.snowflake6DNA,this.snowflakeColour,true);
        this.DrawSnowflake(width/3,height/3*2, this.snowflake7DNA,this.snowflakeColour,true);
        this.DrawSnowflake(width/3*2,height/3*2, this.snowflake8DNA,this.snowflakeColour,true);

        if(this.parentHighlightScaleAddition > 0){
            this.parentHighlightScaleAddition -= deltaTime * 0.1;
        }
    }

    mouseReleased() {
        if (mouseButton === LEFT) {
            //topleft
            if(mouseX < width/3 && mouseY < height/3){
                // console.log(this.snowflake0DNA.coreSize);
                this.snowflakeDNA = this.snowflake0DNA;
                this.GenerateChildSnowflakes();
                // console.log("picking snowflake 0 as parent : " + this.snowflakeDNA.coreSize);
            }
            //top middle
            else if(mouseX > width/3 && mouseX < width/3 *2 && mouseY < height/3){
                this.snowflakeDNA = this.snowflake1DNA;
                this.GenerateChildSnowflakes();
                // console.log("picking snowflake 1 as parent" + this.snowflakeDNA.coreSize);
            }
            //top right
            else if(mouseX > width/3 *2 && mouseY < height/3){
                this.snowflakeDNA = this.snowflake2DNA;
                this.GenerateChildSnowflakes();
                // console.log("picking snowflake 2 as parent" + this.snowflakeDNA.coreSize);
            }
            //left middle
            else if(mouseX < width/3 && mouseY > height/3 && mouseY < height/3 * 2){
                this.snowflakeDNA = this.snowflake3DNA;
                this.GenerateChildSnowflakes();
                // console.log("picking snowflake 3 as parent" + this.snowflakeDNA.coreSize);
            }
            //right middle
            else if(mouseX > width/3 * 2 && mouseY > height/3 && mouseY < height/3 * 2){
                this.snowflakeDNA = this.snowflake5DNA;
                this.GenerateChildSnowflakes();
                // console.log("picking snowflake 4 as parent" + this.snowflakeDNA.coreSize);
            }
            //bottomleft
            else if(mouseX < width/3 && mouseY > height/3){
                this.snowflakeDNA = this.snowflake6DNA;
                this.GenerateChildSnowflakes();
                // console.log("picking snowflake 6 as parent" + this.snowflakeDNA.coreSize);
            }
            //bottom middle
            else if(mouseX > width/3 && mouseX < width/3 *2 && mouseY > height/3*2){
                this.snowflakeDNA = this.snowflake7DNA;
                this.GenerateChildSnowflakes();
                // console.log("picking snowflake 7 as parent" + this.snowflakeDNA.coreSize);
            }
            //bottom right
            else if(mouseX > width/3 *2 && mouseY > height/3*2){
                this.snowflakeDNA = this.snowflake8DNA;
                this.GenerateChildSnowflakes();
                // console.log("picking snowflake 8 as parent" + this.snowflakeDNA.coreSize);
            }else{

                // console.log("cannot pick center as parent");
            }
        }else if(mouseButton === RIGHT){

        }


    }

    keyReleased() {
        if (keyCode === 32) {
            this.prerun();
        }
    }

    GenerateBlankSnowflakeDNA(DNAinput){
        DNAinput.armLength = 60;
        DNAinput.numberOfSpokes = 2;
        DNAinput.coreSize = 50;
        DNAinput.outerCoreSize = 30;
    }

    GenerateChildSnowflakes(){
        this.parentHighlightScaleAddition = this.parentHighlightScaleMax;
        this.snowflake0DNA = this.RandomiseSnowflake(this.snowflakeDNA);
        this.snowflake1DNA = this.RandomiseSnowflake(this.snowflakeDNA);
        this.snowflake2DNA = this.RandomiseSnowflake(this.snowflakeDNA);
        this.snowflake3DNA = this.RandomiseSnowflake(this.snowflakeDNA);

        this.snowflake5DNA =  this.RandomiseSnowflake(this.snowflakeDNA);
        this.snowflake6DNA = this.RandomiseSnowflake(this.snowflakeDNA);
        this.snowflake7DNA = this.RandomiseSnowflake(this.snowflakeDNA);
        this.snowflake8DNA = this.RandomiseSnowflake(this.snowflakeDNA);
    }

    DrawSnowflake(centerX,centerY, DNA,colour,drawHighlight){
        if(drawHighlight){
        noStroke()
        this.drawHighlightCircles(centerX + this.snowflakeGridSide/2, centerY + this.snowflakeGridSide/2)
        }

        stroke(colour);
        fill(colour)
        let rad = radians(60);

        for (let i = 0; i<6; i++){
            this.DrawSnowflakeArm(centerX + this.snowflakeGridSide/2,centerY+ this.snowflakeGridSide/2,DNA,i,rad);
        }
        noFill();

        this.polygon(centerX + this.snowflakeGridSide/2,centerY+ this.snowflakeGridSide/2,DNA.coreSize,6,1);
        //stroke('#ff0000')
        this.polygon(centerX + this.snowflakeGridSide/2,centerY+ this.snowflakeGridSide/2,DNA.outerCoreSize,6,1);
        //if arms are really long, add another core
        /*
        if(DNA.armLength > (this.armLengthMax/3)){
            //stroke('#ff0000')
            this.polygon(centerX + this.snowflakeGridSide/2,centerY+ this.snowflakeGridSide/2,DNA.armLength/3*2,6,1);
        }
        */

    }

    RandomiseSnowflake(DNA){
        let newSnowflakeDNA = {};
        //arm length
        newSnowflakeDNA.armLength = DNA.armLength + (random(this.armStepVariance,-this.armStepVariance));
        if(newSnowflakeDNA.armLength<this.armLengthMin){
            newSnowflakeDNA.armLength = this.armLengthMin;
        }else if(newSnowflakeDNA.armLength > this.armLengthMax){
            newSnowflakeDNA.armLength = this.armLengthMax;
        }
        //no. of spokes
        newSnowflakeDNA.numberOfSpokes = (DNA.numberOfSpokes + (random(this.numberOfSpokesStepVariance,-this.numberOfSpokesStepVariance)));
        if(newSnowflakeDNA.numberOfSpokes < this.numberOfSpokesMin){
            newSnowflakeDNA.numberOfSpokes = this.numberOfSpokesMin;
        }else if(newSnowflakeDNA.numberOfSpokes > this.numberOfSpokesMax){
            newSnowflakeDNA.numberOfSpokes = this.numberOfSpokesMax;
        }
        //core
        newSnowflakeDNA.coreSize = DNA.coreSize + (random(this.coreSizeStepVaraiance,-this.coreSizeStepVaraiance));
        if(newSnowflakeDNA.coreSize < this.coreSizeMin){
            newSnowflakeDNA.coreSize = this.coreSizeMin;
        }else if(newSnowflakeDNA.coreSize > newSnowflakeDNA.armLength){
            newSnowflakeDNA.coreSize = newSnowflakeDNA.armLength;
        }else if(newSnowflakeDNA.coreSize > this.coreSizeMax){
            newSnowflakeDNA.coreSize = this.coreSizeMax;
        }
        //outer core
        newSnowflakeDNA.outerCoreSize = DNA.outerCoreSize + (random(this.coreSizeStepVaraiance,-this.coreSizeStepVaraiance));
        if(newSnowflakeDNA.outerCoreSize < this.coreSizeMin){
            newSnowflakeDNA.outerCoreSize = this.coreSizeMin;
        }else if(newSnowflakeDNA.outerCoreSize >= newSnowflakeDNA.armLength - 20){
            newSnowflakeDNA.outerCoreSize = newSnowflakeDNA.armLength - 20;
        }else if(newSnowflakeDNA.outerCoreSize < this.coreSizeMin){
            newSnowflakeDNA.outerCoreSize = this.coreSizeMin;
        }

        return newSnowflakeDNA;
    }

    DrawSnowflakeArm(centerX,centerY,snowflakeDNA,angle,rad){
        strokeWeight(10);
        let armCenter = createVector(centerX,centerY);
        let armEnd = createVector(centerX + (snowflakeDNA.armLength * cos(rad*angle + rad/2)), centerY + (snowflakeDNA.armLength * sin(rad*angle + rad/2)));

        line (armCenter.x,armCenter.y,armEnd.x, armEnd.y);

        let spokeStepSize = snowflakeDNA.armLength/snowflakeDNA.numberOfSpokes;

        for (let i = 0; i<ceil(snowflakeDNA.numberOfSpokes); i++){


            circle (lerp(armCenter.x,armEnd.x,spokeStepSize*i/snowflakeDNA.armLength),lerp(armCenter.y,armEnd.y,spokeStepSize*i/snowflakeDNA.armLength),10);
        }
        if(snowflakeDNA.numberOfSpokes < 3){
            circle (armEnd.x,armEnd.y,10);
        }
    }

    polygon(x, y, radius, npoints,offsetMultiplier) {

        let angle = TWO_PI / npoints;
        let offset = angle/2 * offsetMultiplier;
        beginShape();
        for (let a = offset; a < TWO_PI; a += angle) {
          let sx = x + cos(a) * radius;
          let sy = y + sin(a) * radius;
          vertex(sx, sy);
        }
        endShape(CLOSE);
    }

    polygonBG(x, y, radius, npoints,offsetMultiplier) {

        let angle = TWO_PI / npoints;
        let offset = angle/2 * offsetMultiplier;
        this.backgroundLayer.beginShape();
        for (let a = offset; a < TWO_PI; a += angle) {
          let sx = x + cos(a) * radius;
          let sy = y + sin(a) * radius;
          this.backgroundLayer.vertex(sx, sy);
        }
        this.backgroundLayer.endShape(CLOSE);
    }

    drawHighlightCircles(x,y){
        fill(this.bgColourDarker)
        let mouseDist = (dist(mouseX,mouseY,x,y));
        if (mouseDist < this.snowflakeGridSide/2)
        circle(x,y,(width/3 ) - mouseDist);
    }

    drawHexagonalBG(){
        this.backgroundLayer.noStroke()
        let c = color(this.bgColourLight)

        let count = 0;
        for(let y = 0; y < 700; y+=this.hexagonSize/2.3){
            for(let x = 0; x < 700; x+=this.hexagonSize*1.5){
                c.setAlpha(random(0,100));
                this.backgroundLayer.fill(c);
              this.polygonBG(x+this.hexagonSize*(count%2==0)*0.75, y, this.hexagonSize/2,6,0)
            }
            count ++
          }
    }




}