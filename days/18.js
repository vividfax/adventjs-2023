// Made by Holly Nielsen

class Day18 extends Day {

    constructor () {

        super();
        this.loop = true; // Set to true or false

        this.controls = "TYPE your name and press ENTER for a personalised holiday letter! CLICK for a new one."; // Write any controls for interactivity if needed or leave blank
        this.credits = "Made by Holly Nielsen"; // Replace with your name

        this.textInput = "";
        this.storedName = "";
        this.defaultName = "Holly";
        this.stockNames = ["Colin","Kevin","Albert","Wilfred","Arthur","Cecil","Edgar","Edwin","Clarence","Bernard","Archibald","Cornelius","Dennis","Frank","Nigel","Herbert","Hector","Norman","Milton","Roy","Marilyn","Mary","Jane","Edwina","Gertrude","Opal","Agnes","Betty","Bertha","Vivian","Doreen","Maude","Myrtle","Winifred","Sylvia"]
    }

    prerun() {
        this.grammar = setupGrammar(assets.day18GrammarSource);
        this.randomText;
    }

    update() {

        background(200); // You can delete this line if you want
        angleMode(DEGREES)

        noStroke()

        if(false){
            push()
            rotate(45)
            for(var i=-200; i<width+200; i+=20){
                fill(0,0,255)
                rect(i, -height, i+40, height*2)
                i += 20;
                fill(255)
                rect(i, -height, i+40, height*2)
                i += 20;
                fill(255,0,0)
                rect(i, -height, i+40, height*2)
                i += 20;
                fill(255)
                rect(i, -height, i+40, height*2)
                // i += 20;
            }
            pop();


            fill("#FAD6A5")
            rect(0, 0, 40, height);
            rect(width-40, 0, 40, height);
            rect(0, 0, width, 40);
            rect(0, height-60, width, 60);
            fill(255)
            rect(60, 60, width-120, height-140);
        }
        else{
            background(255)
            image(assets.day18Letter, 0, 0, width, height-40)
        }

        strokeWeight(1)

        fill(0)

        text("Type your name here and hit enter: "+this.textInput, 20, height-25);
        if(this.storedName.length > 0){
            text("Thanks, "+this.storedName+"! You can click to generate new examples, or type a new name.", 20, height-10);
        }

        textSize(20);
        textFont(assets.day18Font);
        textAlign(LEFT, CENTER);
        rectMode(CENTER);



        // fill(180);
        // text(this.randomText, width/2-2, height/2-2, width*0.8);
        fill("#36454F");
        if(false){
            text(this.randomText, width/2, height/2-20, width-160, );
        }
        else{
            textSize(16)
            text(this.randomText, width/4+120, height/2-55, width-250, height);
        }
    }

    mousePressed() {
        this.newText();
    }

    keyPressed() {
        if(keyCode > 64 && keyCode < 91){
            this.textInput += key;
        }
        if(keyCode == 13){
            //submit
            this.storedName = this.textInput;
            this.textInput = "";
            //potentially regenerate input here
            this.newText();
        }
        if(keyCode == 8){
            this.textInput = this.textInput.slice(0, -1);
        }
    }

    newText() {

        // get new text

        this.randomText = getText(this.grammar);

        if(this.storedName.length > 0){
            this.randomText = this.randomText.replace("((name))", this.storedName);
        }
        else{
            this.randomText = this.randomText.replace("((name))", this.stockNames[Math.floor(Math.random()*this.stockNames.length)]);
        }

        this.randomText = this.randomText.replaceAll("<p>", "\n\n");
    }
}