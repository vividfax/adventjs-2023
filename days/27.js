// Made by Mike Cook

class Day27 extends Day {

    constructor () {

        super();
        this.loop = true; // Set to true or false

        this.controls = "CLICK to answer the door (and... to close it again)"; // Write any controls for interactivity if needed or leave blank
        this.credits = "Made by Mike Cook"; // Replace with your name

        this.flakes = []
        this.choir = [];
        // Define variables here. Runs once during the sketch holder setup

        this.muted = false;
    }

    cleanup(){
        this.carol.stop()
        // knock.stop()
        // slam.stop()
    }

    prerun() {

        this.interacted = false;

        // Initialise/reset variables here. Runs once, every time your day is viewed

        for(var i=0; i<100; i++){
            this.flakes.push([random(width), random(height), random(5)+5]);
        }

        this.doorProgress = 0;

        this.openingDoor = false;
        this.closingDoor = false;

        this.fft = new p5.FFT();

        this.carol = random([assets.day27carol1, assets.day27carol2, assets.day27carol3])

        this.doorKnockTimer = 2

        this.coatColorsDark = ["#73275c", "#422445", "#473b78", "#272736"]
        this.coatColorsMid = ["#3d6e70", "#e36956", "#4da6ff"]
        this.coatColorsLight = ["#ffffeb", "#c2c2d1", "#ffb5b5", "#66ffe3"]

        this.coatColors = [this.coatColorsDark, this.coatColorsMid, this.coatColorsLight]

        this.skinColors = ["#8c3f5d", "#8d5524", "#ffdbac", "#e0ac69", "#cc9999"]

        this.newChoir()
    }

    update() {

        background(20);
        noStroke();

        fill("#C2D1C4")
        rect(0, 200, width, height)

        fill("#556677")
        beginShape()
        vertex(width/2-30, 200)
        vertex(width/2+30, 200)
        vertex(width/2+290, height)
        vertex(width/2-290, height)
        endShape(CLOSE)

        fill("#3e2731")
        for(var i=0; i<width; i+=50){
          rect(i+10, 0, 30, 200)
          if(i == 250)
            i += 100
        }
        fill("#193c3e");
        for(var i=0; i<width; i+=50){
          // rect(i, 0, 50, 150)
          beginShape()
          vertex(i+5, 0)
          vertex(i+45, 0)
          vertex(i+50, 150)
          vertex(i, 150)
          endShape(CLOSE)
          if(i == 250)
            i += 100
        }

        this.fft.analyze();

        noStroke()
        imageMode(CENTER)
        for(var i=0; i<this.choir.length; i++){
          let p = this.choir[i];
          push()
          translate(p.x, p.y+(p.normalHeight-p.bodyHeight))

          var qhs = p.headSize/4
          var hhs = p.headSize/2

          fill(p.coatColor)
          beginShape();
          vertex(-qhs, qhs)
          vertex(qhs, qhs)
          vertex(p.headSize, p.bodyHeight)
          vertex(-p.headSize, p.bodyHeight)
          endShape(CLOSE)

          // let level = fft.getEnergy(200 * p.row);
          // translate(0, sin(millis()/(100+p.speedVariant) + p.offset))
          translate(0, -this.fft.getEnergy((this.choir.length-i)*100)/5)

          fill(p.skinColor)
          circle(0, 0, p.headSize)

          fill(0)
          circle(0, qhs, lerp(0.25, 1, this.fft.getEnergy(i*100)/255) * qhs);

          // fill("#aaaaaa")
          fill(p.bobColor)
          circle(0, 1.25*-hhs, 30)

          fill(p.coatColor)
          beginShape();
          vertex(-hhs, 0)
          vertex(-qhs, -qhs)
          vertex(0, -qhs)
          vertex(0, -qhs)
          vertex(qhs, -qhs)

          vertex(hhs, 0)
          vertex(hhs, -qhs)
          vertex(qhs, -hhs*1.25)
          vertex(-qhs, -hhs*1.25)
          vertex(-hhs, -qhs)
          endShape(CLOSE)

          translate(0, 2*sin(millis()/(100) + p.offset))
          fill(255)
          rect(-20, hhs, 40, 40)
          fill(p.skinColor)
          circle(-20, hhs+20, qhs)
          circle(20, hhs+20, qhs)

          pop()
        }

        fill(255)
        for(var i=0; i<this.flakes.length; i++){
            let flake = this.flakes[i]
            circle(flake[0], flake[1], flake[2])
            flake[1] += deltaTime/100*flake[2]
            if(flake[1] > height){
              flake[1] = -10
            }
        }

        push()
        imageMode(CORNERS)
        // scale(0.5, 1)
        if(this.doorProgress < 700){
          fill("#8c3f5d")
          rect(this.doorProgress, 0, width, height)
          fill("#ba6156")
          rect(this.doorProgress+50, 50, width-100, 450)
          rect(this.doorProgress+50, 650, width-100, 300)
          fill("#f2a65e")
          circle(this.doorProgress+100, 575, 75)
        }
        pop()

        if(this.openingDoor){
            this.doorProgress += deltaTime
          if(this.doorProgress > 700){
            this.doorProgress = 701;
            this.openingDoor = false;
            this.carol.play()
            this.carol.onended(() => {
                this.closingDoor = true;
            });
          }
        }
        if(this.closingDoor){
            this.doorProgress -= deltaTime*3;
          if(this.doorProgress <= 0){
            this.doorProgress = 0;
            this.closingDoor = false;
            this.doorKnockTimer = 0;
            this.newChoir();
            assets.day27slam.play();
            this.carol.stop();
            this.carol = random([assets.day27carol1, assets.day27carol2, assets.day27carol3])
          }
        }

        if(this.doorProgress == 0){
            this.doorKnockTimer += deltaTime/1000;
            if(this.doorKnockTimer > 4){
                this.doorKnockTimer -= 4+random(2);
                if (this.interacted) assets.day27knock.play();
            }
        }

        textSize(20)
        textStyle(BOLD)
        fill(255)
        if(!this.muted){
          text("M: Mute", 10, 25)
        }
        else{
          text("M: Unmute [MUTED]", 10, 25)
        }
    }

    // Below are optional functions for interactivity. They can be deleted from this file if you want

    mousePressed() {

        if (!this.interacted) this.interacted = true;

        if(this.closingDoor || this.openingDoor) return
        if(this.doorProgress <= 0){
            assets.day27knock.stop()
            this.openingDoor = true
        }
        else{
            this.closingDoor = true;
        }
    }

    keyPressed() {

        if (!this.interacted) this.interacted = true;

        if (key === 'm') {
            this.muted = !this.muted;
            if(this.muted){
              assets.day27carol1.amp(0)
              assets.day27carol2.amp(0)
              assets.day27carol3.amp(0)
              assets.day27knock.amp(0)
              assets.day27slam.amp(0)
            }
            else{
              assets.day27carol1.amp(1)
              assets.day27carol2.amp(1)
              assets.day27carol3.amp(1)
              assets.day27knock.amp(1)
              assets.day27slam.amp(1)
            }
          }
    }

    newChoir(){
        this.choir = []
        this.choir.push(new this.Person(280, 200, 100, 280+random(40), 300, 0))
        this.choir.push(new this.Person(420, 200, 100, 280+random(40), 300, 0))

        this.choir.push(new this.Person(200, 330, 80, 180+random(40), 200, 1))
        this.choir.push(new this.Person(350, 330,  80, 180+random(40), 200, 1))
        this.choir.push(new this.Person(500, 330,  80, 180+random(40), 200, 1))

        this.choir.push(new this.Person(250, 430,  50, 80+random(40), 120, 2))
        this.choir.push(new this.Person(350, 430,  50, 80+random(40), 120, 2))
        this.choir.push(new this.Person(450, 430,  50, 80+random(40), 120, 2))
      }

      Person = class {
        constructor(_x, _y, hs, bh, nh, r){
            this.coatColorsDark = ["#73275c", "#422445", "#473b78", "#272736"]
            this.coatColorsMid = ["#3d6e70", "#e36956", "#4da6ff"]
            this.coatColorsLight = ["#ffffeb", "#c2c2d1", "#ffb5b5", "#66ffe3"]

            this.coatColors = [this.coatColorsDark, this.coatColorsMid, this.coatColorsLight]

            this.skinColors = ["#8c3f5d", "#8d5524", "#ffdbac", "#e0ac69", "#cc9999"]
            this.x = _x;
            this.y = _y;
            this.headSize = hs;
            this.bodyHeight = bh;
            this.skinColor = random(this.skinColors);
            this.coatColor = random(this.coatColors[r]);
            this.bobColor = random(this.coatColorsLight );
            this.row = r;
            this.normalHeight = nh;

            this.offset = random(100)
            this.speedVariant = random(20)-10
        }
      }
}