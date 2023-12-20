// Made by Florence Smith Nicholls

class Day22 extends Day {

    constructor () {

        super();
        this.loop = true; // Set to true or false

        this.controls = "Pay sixpence for a Frost Fair keepsake!"; // Write any controls for interactivity if needed or leave blank
        this.credits = "Made by Florence Smith Nicholls"; // Replace with your name
    }

    newText(){
        this.mainText = getText(this.grammar);
        this.mainText = this.mainText.replaceAll("<p>", "\n")
        var bothParts = this.mainText.split("!BREAK!")
        // print(bothParts)

        this.lineUpper = bothParts[0];
        this.lineLower = bothParts[1];
    }

    prerun() {


        // Initialise/reset variables here. Runs once, every time your day is viewed
        this.currentcoin = assets.day22sixpence_head
        this.oldcoin = assets.day22sixpence_head
        this.changingCoin = false
        this.coinChangeTimer = 0

        this.oy = 0;
        this.ny = 0;
        this.coinChangeTimer = 0;

        this.grammar = setupGrammar(assets.day22GrammarSource);


        this.newText()
    }



    update() {

        // Update and draw stuff here. Runs continuously (or only once if this.loop = false), while your day is being viewed
        imageMode(CORNER)

        // background(255);
        image(assets.day22bg, 0, 0)
        fill (0)
        textFont(assets.day22titleFont)
        textSize(40)


        text(this.lineUpper.toUpperCase(), 100, 125, 500)

        text(this.lineLower, 100, 420, 500)

        strokeWeight (3)
        line (60,345, 640, 345)

        fill (80)
        strokeWeight (0)

        angleMode(DEGREES)
        imageMode(CENTER)

        for(var i = 0; i < width; i += 50)
        {
            push()
            translate(i+30, 25)
            image(assets.day22testImage, 0, 0, 40, 40)
            pop()
        }
        for(var i = 50; i < width-50; i += 50)
        {
            push()
            translate(i+25, 675)
            rotate(180)
            image(assets.day22testImage, 0, 0, 40, 40)
            pop()
        }
        for(var i = 50; i < width; i += 50)
        {
            push()
            translate(25, i+25)
            rotate(-90)
            image(assets.day22testImage, 0, 0, 40, 40)
            pop()
        }
            for(var i = 50; i < width; i += 50)
        {
            push()
            translate(675, i+25)
            rotate(90)
            image(assets.day22testImage, 0, 0, 40, 40)
            pop()
        }

        if(this.changingCoin){
            push()
            translate(width-110, lerp(height-110, -50, this.coinChangeTimer))
            image(this.oldcoin, 0, 0, 100, 100)
            pop()

            push()
            translate(width-110, lerp(1000, height-110, this.coinChangeTimer))
            image(this.currentcoin, 0, 0, 100, 100)
            pop()

            this.coinChangeTimer += deltaTime/300
            if(this.coinChangeTimer > 1){
                this.changingCoin = false
            }
        }
        else{
            push()
            translate(width-110, height-110+sin(millis()))
            if(abs(mouseX - (width-110)) < 50 && abs(mouseY - (height-110)) < 50){
            translate(0,  4*sin(millis()))
            rotate(5*sin(millis()))
            }

            image(this.currentcoin, 0, 0, 100, 100)
            pop()
        }
    }

    mousePressed() {
        if(abs(mouseX - (width-110)) < 50 && abs(mouseY - (height-110)) < 50){
            this.oldcoin = this.currentcoin
            this.currentcoin = random([assets.day22sixpence_head, assets.day22sixpence_tail])
            this.coinChangeTimer = 0
            this.oy = height-110
            this.ny = -50
            this.changingCoin = true
            this.newText()
          }
    }
}