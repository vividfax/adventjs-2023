// Made by Mariana Marangoni (keep this line and replace with your name)

class Day7 extends Day {

    constructor() {

        super();
        this.loop = true; // Set to true or false

        this.controls = "Press SPACEBAR to (re)generate a letter"; // Write any controls for interactivity if needed or leave blank
        this.credits = "Made by Mariana Marangoni"; // Replace with your name

        // Define variables here. Runs once during the sketch holder setup

        this.threeD = createGraphics(width, height, WEBGL);
        this.letter = createGraphics(400, 400);

        this.generatedLetter0;
        this.generatedLetter1;
        this.generatedLetter2;
        this.generatedLetter3;

        this.myGeometry;

        this.greetSentences = [
            "Dear Santa,",
            "Dear Satan,",
            "Dear Santa,",
            "Dear Santa,",
            "Dear Santa,",
            "Dear Santa,",
            "Dear Santa,",
            "Dear Santa,"
        ];
        this.introSentences = [
            "I hope this letter finds you well.",
            "How are you doing?",
            "How are the reindeer doing?",
            "Are you real?? I think you are!",
            "I can't believe it's almost Christmas!",
            "I'll leave cookies and milk for you.",
            "Please say hi to Rudolph for me!"
        ];
        this.wishSentences = [
            "I wish for a robot with laser eyes!",
            "My biggest dream is to have a puppy.",
            "Could you please bring me a book about space pirates?",
            "Can I have a fluffy teddy bear to keep me company at night?"
        ];
        this.nameOptions = [
            "Tommy",
            "Samantha",
            "Alex",
            "Emily",
            "Charlie",
            "Mary",
            "Stella",
            "Lucy",
            "Melissa",
            "Jimmy",
            "Mark"
        ];
    }

    prerun() {
        // Initialise/reset variables here. Runs once, every time your day is viewed

        this.threeD.textureMode(NORMAL);

        let detailX = 20;
        let detailY = 20;
        this.myGeometry = new p5.Geometry(detailX, detailY, function () {
            for (let x = 0; x <= detailX; x++) {
                for (let y = 0; y <= detailY; y++) {
                this.vertices.push(
                    new p5.Vector(
                    x / detailX,
                    y / detailY,
                    (sin((x / detailX) * PI) + cos((y / detailY) * PI)) / 10
                    )
                );
                this.uvs.push([x / detailX, y / detailY]);
                }
            }

            this.computeFaces();
            this.computeNormals();
        });
        this.myGeometry.texture = assets.day7myTexture;

        this.newLetter();

        // describe("a kid letter to Santa");
    }

    newLetter() {

        this.generateLetter();

        // Set texture to the geometry
        this.letter.textFont(assets.day7Font);
        this.letter.textLeading(40);
        this.letter.textSize(42);
        this.letter.background(assets.day7myTexture);
        this.letter.image(assets.day7santaStamp, 180, 10);
        this.letter.image(assets.day7stamp, 220, 30);
        this.letter.fill(50);
        this.letter.text(this.generatedLetter0, 20, 120, 380);
        this.letter.text(this.generatedLetter1, 20, 160, 380);
        this.letter.text(this.generatedLetter2, 20, 200, 380);
        this.letter.text(this.generatedLetter3, 20, 300, 380);
        if (this.generatedLetter0 == "Dear Satan,") {
            this.letter.image(assets.day7satanStamp, 180, 10);
        }

        this.threeD.background(170, 50, 50);
        this.threeD.noStroke();
        this.threeD.push();
        // this.threeD.orbitControl();
        let paperSize = width / 1.5;
        // rotateY((cos(millis() / 10000) * PI) / 8);
        this.threeD.translate(-paperSize / 2, -paperSize / 2);
        this.threeD.scale(paperSize);
        this.threeD.texture(this.letter);
        this.threeD.beginShape(TRIANGLES);
        for (let i = 0; i < this.myGeometry.faces.length; i++) {
            let face = this.myGeometry.faces[i];
            for (let j = 0; j < face.length; j++) {
                let vert = this.myGeometry.vertices[face[j]];
                let uv = this.myGeometry.uvs[face[j]];
                this.threeD.vertex(vert.x, vert.y, vert.z, uv[0], uv[1]);
            }
        }
        this.threeD.endShape(CLOSE);
        this.threeD.pop();
    }

    generateLetter() {

        let greet = random(this.greetSentences);
        let intro = random(this.introSentences);
        let wish = random(this.wishSentences);
        let name = random(this.nameOptions);
        this.generatedLetter0 = `${greet}`;
        this.generatedLetter1 = `${intro}`;
        this.generatedLetter2 = `${wish} `;
        this.generatedLetter3 = `Sincerely, \n${name}`;
    }

    update() {

        image(this.threeD, 0, 0);
    }

    keyPressed() {
        if (keyCode === 32) {
            this.newLetter()
        } else if (keyCode === 83) { // s
            save("letter.png");
        }
    }
}