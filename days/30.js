// Made by Mike Cook

class Day30 extends Day {

      constructor () {

          super();
          this.loop = true; // Set to true or false

          this.controls = "WASD to move. CLICK to aim and launch snowballs, and touch presents to collect them!"; // Write any controls for interactivity if needed or leave blank
          this.credits = "Made by Mike Cook"; // Replace with your name

          // Define variables here. Runs once during the sketch holder setup
          this.psize = 40;
      }

      prerun() {
        // Initialise/reset variables here. Runs once, every time your day is viewed
        this.player = {
          x: 350,
          y: 350,
          velX:0,
          velY:0,
          aim:90,
          col: "#4499aa"
        }

        this.ps = [this.player]

        this.targets = [{x:random(width), y:50+random(height-75)}]
        this.obstacles = []
        for(var i=0; i<10; i++){
          this.obstacles.push({x:random(width), y:random(height)})
        }
        this.presents = []
        this.targetTimer = 3 + random(3);
        this.presentTimer = 8 + random(2);

        this.aiming = false;
        this.aimOrigin = createVector(0,0);
        this.aimTarget = createVector(0,0);
        this.aimDirection = createVector(0,0);
        this.held = 0;

        this.psnowballs = []
        this.osnowballs = []

        this.bits = []

        this.pScore = 0
        this.oScore = 0

        this.timer = 60

        this.started = false;
        this.pressingAnything = false;

        this.gameOver = false;
      }

      update() {
        background(240);
        angleMode(DEGREES)
        textFont(assets.day30Font)

        let dt = deltaTime/2;

        stroke(1)


        for(var i=0; i<this.targets.length; i++){
          fill(255)
          circle(this.targets[i].x, this.targets[i].y, 30);
          circle(this.targets[i].x, this.targets[i].y-20, 20);
          fill(0)
          circle(this.targets[i].x, this.targets[i].y+5, 3);
          circle(this.targets[i].x, this.targets[i].y, 3);
          circle(this.targets[i].x, this.targets[i].y-5, 3);

          circle(this.targets[i].x-4, this.targets[i].y-25, 3);
          circle(this.targets[i].x+4, this.targets[i].y-25, 3);

          fill("#FFA500")
          beginShape()
          vertex(this.targets[i].x, this.targets[i].y-23)
          vertex(this.targets[i].x+10, this.targets[i].y-21)
          vertex(this.targets[i].x, this.targets[i].y-19)
          endShape(CLOSE)
        }

        for(var i=0; i<this.obstacles.length; i++){
          fill("#733e39")
          rect(this.obstacles[i].x, this.obstacles[i].y, 5, 20)
          fill("#265c42")
          beginShape()
          vertex(this.obstacles[i].x-10, this.obstacles[i].y+10)
          vertex(this.obstacles[i].x+15, this.obstacles[i].y+10)
          vertex(this.obstacles[i].x+2.5, this.obstacles[i].y-30)
          endShape(CLOSE)
        }

        for(var i=0; i<this.presents.length; i++){
          let p = this.presents[i]
          fill(200,0,0)
          rect(p.x, p.y, 20, 20)
          fill(255,255,0)
          rect(p.x+5, p.y, 5, 20)
          rect(p.x, p.y+5, 20, 5)

          circle(p.x+8, p.y-4, 7)
          circle(p.x+12, p.y-4, 7)

          push()
          translate(p.x+5, p.y)
          rotate(-45)
          rect(0, 0, 7, 3)
          translate(5, 3)
          rotate(-90)
          rect(-5, 0, 7, 3)
          pop()
          p.l -= deltaTime/1000
          if(p.l < 0){
            this.presents.splice(i, 1);
          }
          else if(abs(this.player.x-p.x) < this.psize/2 && abs(this.player.y-p.y) < this.psize/2){
            this.presents.splice(i, 1)
            this.pScore += 3
          }
        }

        for(var i=0; i<this.ps.length; i++){

          // fill("#733e39")
          // circle(this.ps[i].x, this.ps[i].y, this.pScore);

          fill("#181425")
          push()
          if(this.pressingAnything){
            translate(0, 2*sin(millis()))
          }
          ellipse(this.ps[i].x-5, this.ps[i].y+this.psize/2, 12, 9);
          if(this.pressingAnything){
            translate(0, -(4*sin(millis())))
          }
          ellipse(this.ps[i].x+5, this.ps[i].y+this.psize/2, 12, 9);
          pop()
          // fill("#f8f2e5")
          // circle(this.ps[i].x-5, this.ps[i].y+this.psize/2, 8, 10);
          // circle(this.ps[i].x+5, this.ps[i].y+this.psize/2, 8, 10);
          fill("#a22633")
          ellipse(this.ps[i].x, this.ps[i].y, 2*this.psize/3, this.psize);

          fill("#a22633")
          push()
          translate(this.ps[i].x, this.ps[i].y-20)
          beginShape();
          vertex(0, 0);
          vertex(10, 10);
          bezierVertex(10, 10, 20, 0, 0, -15);
          bezierVertex(0, -15, -20, 0, -10, 10);
          vertex(-10,10)
          vertex(0,0)
          endShape();
          pop()

          fill("#f8f2e5")

          push()
          translate(this.ps[i].x, this.ps[i].y-20)
          ellipse(0, 5, 30, 10)
          translate(2, 0)
          if(this.pressingAnything){
            translate(cos(millis()), sin(millis()))
          }
          ellipse(0, -15, 10, 10)
          // beginShape();
          // vertex(-15, 5);
          // bezierVertex(-15, 5, 0, -10, 15, 5);
          // bezierVertex(15, 5, 0, 10, -15, 5);
          // endShape();
          pop()


          fill("#ead4aa")
          ellipse(this.ps[i].x, this.ps[i].y-10, this.psize/3, this.psize/4);
          ellipse(this.ps[i].x, this.ps[i].y-10, this.psize/3, this.psize/4);

          fill("#f8f2e5")
          push()
          translate(this.ps[i].x, this.ps[i].y-10)
          beginShape();
          vertex(0, 0);
          bezierVertex(0, 0, 20, 0, 0, 20);
          bezierVertex(0, 20, -20, 0, 0, 0);
          vertex(0,0)
          endShape();
          pop()



        }

        if(this.aiming){
          drawingContext.setLineDash([10,10]);
          line(this.aimOrigin.x, this.aimOrigin.y, this.aimOrigin.x+(this.held*this.aimDirection.x), this.aimOrigin.y+(this.held*this.aimDirection.y));
          drawingContext.setLineDash([]);
          this.held += deltaTime/800;
        }

        fill(255)
        for(var i=0; i<this.psnowballs.length; i++){
          circle(this.psnowballs[i].x, this.psnowballs[i].y, 10);
          this.psnowballs[i].x += this.psnowballs[i].v.x*dt
          this.psnowballs[i].y += this.psnowballs[i].v.y*dt
          this.psnowballs[i].lifespan += dt
          if(this.checkTrees(this.psnowballs[i])){
            this.splash(this.psnowballs[i].x, this.psnowballs[i].y)
            this.psnowballs.splice(i, 1);
          }
          else if(this.psnowballs[i].lifespan > this.psnowballs[i].d){
            this.splash(this.psnowballs[i].x, this.psnowballs[i].y)
            this.psnowballs.splice(i, 1);
          }
        }

        // noStroke()
        for(var i=0; i<this.bits.length; i++){
          circle(this.bits[i].x, this.bits[i].y, lerp(1,10, (this.bits[i].l/500)))
          this.bits[i].x += this.bits[i].vx * dt
          this.bits[i].y += this.bits[i].vy * dt
          this.bits[i].l -= dt
          if(this.bits[i].l < 0){
            this.bits.splice(i, 1);
          }
        }

        if(!this.started){
          noStroke()
          fill(255, 255, 255, 180)
          rect(100, 100, 500, 400)
          fill(0)

          textAlign(CENTER)
          textSize(30)
          text("Snow Globe Shootin'",100, 150, 500)

          textSize(20)

          text("Click and hold to aim a snowball, release to fire.\n\nWASD or arrow keys to move.\n\nHit snowfolks with snowballs to gain points, and collect presents before they disappear for bonus points!\n\n(Don't hit the trees with your snowballs)\n\nClick to begin!", 120, 200, 460)
          return;
        }

        stroke(1)
        this.timer -= deltaTime/1000
        if(this.timer <= 0){
          this.timer = 0;
          this.gameOver = true;
        }

        if(!this.gameOver){
          this.targetTimer -= deltaTime/1000
          if(this.targetTimer < 0){
            this.targetTimer += 1 + this.targets.length + random(3)
            this.targets.push({x:25+random(width-50), y:50+random(height-75)})
          }

          this.presentTimer -= deltaTime/1000
          if(this.presentTimer < 0){
            this.presents.push({x:25+random(width-50), y:25+random(height-50), l:3+random(3)})
            this.presentTimer += 5 + random(5)
          }
        }

        textAlign(CENTER)
        textSize(30)
        fill(0)
        noStroke()
        text(round(this.timer) ,0, 40, width)

        if(this.gameOver){
          fill(255, 255, 255, 180)
          rect(100, 100, 500, 400)
          fill(0)
          text("Game Over!\nYou scored: "+this.pScore+"\n\nClick to play again!", 0, height/2-100, width)
        }

        if(!this.aiming && !this.gameOver){
          this.move(this.player)
        }
        else{
          this.pressingAnything = false;
        }
      }

      // Below are optional functions for interactivity. They can be deleted from this file if you want



      mousePressed() {
        if(!this.started){
          this.started = true;
          return
        }

        if(this.gameOver){
          this.gameOver = false;
          this.timer = 60;
          this.pScore = 0;
          this.targets = [];

          this.obstacles = []
          for(var i=0; i<8; i++){
            this.obstacles.push({x:50+random(width-100), y:50+random(height-100)})
          }
          return
        }
        if(!this.aiming){
          this.held = 0;
          this.aiming = true;
          this.aimOrigin = createVector(this.player.x, this.player.y)//[this.player.x, this.player.y]
          // this.aimTarget = createVector(this.player.x, this.player.y)
          this.aimDirection = createVector(mouseX-this.player.x, mouseY-this.player.y);
          this.player.velX = 0;
          this.player.velY = 0;
        }
        else{

        }
      }

      checkTrees(s){
        for(var i=0; i<this.obstacles.length; i++){
          let t = this.obstacles[i]
          if(s.x > t.x-10 && s.x < t.x+15 && s.y > t.y-20 && s.y < t.y+10){
            return true;
          }

        }
        return false
      }

      splash(ox, oy){
        let splashSize = 30

        for(var i=0; i<this.targets.length; i++){
          let av = createVector(this.targets[i].x-ox, this.targets[i].y-oy)
          if(av.mag() < splashSize){
            this.pScore++
            this.targets.splice(i, 1);
            break
          }
        }


        for(var i=0; i<20; i++){
          this.bits.push({
            x: ox,
            y: oy,
            vx: random(2)-1,
            vy: random(2)-1,
            l:(0.2+random(0.2))*500
          })
        }
      }

      throwSnowball(ownercode){
        let heading = createVector((this.held*this.aimDirection.x),
         (this.held*this.aimDirection.y));
        let distance = heading.mag()
        this.psnowballs.push({
          x:this.aimOrigin.x,
          y:this.aimOrigin.y,
          tx:this.aimOrigin.x+(this.held*this.aimDirection.x),
          ty:this.aimOrigin.y+(this.held*this.aimDirection.y),
          v:heading.normalize(),
          d:distance,
          lifespan:0,
          owner:ownercode,
        })
      }


      mouseReleased() {
        if(this.aiming){
          this.aiming = false;
          this.throwSnowball(0);
        }
      }


      move(agent){

        //shamelessly taken from Rianna Suen's Day 2 example - thanks Rianna!
        let friction = 0.93;

        agent.velX *= friction;
        agent.velY *= friction;

        agent.x += agent.velX;
        agent.y += agent.velY;

        if (agent.x > 700) agent.x = 700
        if (agent.x < 0) agent.x = 0
        if (agent.y > 700) agent.y = 700
        if (agent.y < 0) agent.y = 0

        this.pressingAnything = false;
        if (!keyIsPressed) return;

        let speed = 0.3;

        let pressingLeft = keyIsDown(LEFT_ARROW) || keyIsDown(65);
        let pressingRight = keyIsDown(RIGHT_ARROW) || keyIsDown(68);
        let pressingUp = keyIsDown(UP_ARROW) || keyIsDown(87);
        let pressingDown = keyIsDown(DOWN_ARROW) || keyIsDown(83);

        if(pressingLeft || pressingRight || pressingUp || pressingDown){
          this.pressingAnything = true;
        }
        else{

        }

        if (pressingLeft && pressingRight) {
            // do nothing
        } else if (pressingLeft) {
            agent.velX -= speed;
        } else if (pressingRight) {
            agent.velX += speed;
        }

        if (pressingUp && pressingDown) {
            // do nothing
        } else if (pressingUp) {
          agent.velY -= speed;
        } else if (pressingDown) {
          agent.velY += speed;
        }

        agent.velX = constrain(agent.velX, -5, 5)
        agent.velY = constrain(agent.velY, -5, 5)
      }
}