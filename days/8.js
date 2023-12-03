// Made by Manesh Mistry

class Day8 extends Day {

    constructor () {

        super();
        this.loop = true; // Set to true or false

        this.controls = "MOVE THE MOUSE to decorate the tree. CLICK to randomise the fairy lights.";
        this.credits = "Made by Manesh Mistry";

        // pixelDensity(1);
        this.threeD = createGraphics(width, height, WEBGL);

        let arrayLength = 75;
        this.pointsX = new Array(arrayLength);
        this.pointsY = new Array(arrayLength);
        this.intensities = new Array(arrayLength);
        this.reds = new Array(arrayLength);
        this.greens = new Array(arrayLength);
        this.blues = new Array(arrayLength);
        this.points = new Array(arrayLength);
        // this.initialiseLists();

        // Define variables here. Runs once during the sketch holder setup
    }

    prerun() {
        // Initialise/reset variables here. Runs once, every time your day is viewed
        this.threeD.pixelDensity(1);

        this.initialiseLists();
    }

    initialiseLists()
    {
        for(let i = 0; i < this.pointsX.length; i++)
        {
            this.pointsX[i] = 0.;
            this.pointsY[i] = 0.;
            this.intensities[i] = 0.;
            this.reds[i] = 0.;
            this.greens[i] = 0.;
            this.blues[i] = 0.;
            this.points[i] = null;
        }
    }

    update()
    {
        let coneHeight = 600.0;
        let coneTop = height - coneHeight;

        let tolerance = map(mouseY, coneTop, height, 20.0, 60.0);

        let newPoint = this.getPointFromInput(mouseX, mouseY);
        if(newPoint != null && mouseY > coneTop + 50.0)
        {
            let hasEndPoint = this.points[this.points.length - 1] != null;
            if(!hasEndPoint ||
                abs(newPoint.screenX - this.points[this.points.length - 1].screenX) > tolerance ||
                abs(newPoint.screenY - this.points[this.points.length - 1].screenY) > tolerance)
            {
                this.points.shift();
                this.points.push(newPoint);
            }
        }

        for(let i = 0; i < this.points.length; i++)
        {
            if(this.points[i] != null)
            {
                this.points[i].polarT += 6.0 * (1.0 / deltaTime);
                if(this.points[i].polarT > 360.0)
                {
                    this.points[i].polarT -= 360.0;
                }
                this.points[i].updateScreenPoint();
                this.points[i].intensity = max(this.points[i].intensity - ((1.0 / deltaTime) * 0.05), 0.);

                // Copy into lists used for uniforms.
                this.pointsX[i] = this.points[i].screenX;
                this.pointsY[i] = this.points[i].screenY;
                this.intensities[i] = this.points[i].intensity;
                this.reds[i] = this.points[i].color[0];
                this.greens[i] = this.points[i].color[1];
                this.blues[i] = this.points[i].color[2];
            }
            else
            {
                this.pointsX[i] = 0.;
                this.pointsY[i] = 0.;
                this.intensities[i] = 0.;
            }
        }

        this.threeD.shader(assets.day8Shader);
        assets.day8Shader.setUniform("pointsX", this.pointsX);
        assets.day8Shader.setUniform("pointsY", this.pointsY);
        assets.day8Shader.setUniform("intensities", this.intensities);
        assets.day8Shader.setUniform("reds", this.reds);
        assets.day8Shader.setUniform("greens", this.greens);
        assets.day8Shader.setUniform("blues", this.blues);
        this.threeD.rect(0, 0, width, height);

        image(this.threeD, 0, 0);
    }

    getPointFromInput(inputX, inputY)
    {
        let coneWidthAtBottom = 500.0;
        let coneHeight = 600.0;
        let coneTop = height - coneHeight;
        let coneMid = width * 0.5;

        angleMode(DEGREES);

        let yOffset = max(inputY - coneTop, 0.0);
        let widthAtY = (coneWidthAtBottom * 0.5) * (yOffset / coneHeight);

        let horizT = coneMid - inputX;
        if(inputY < coneTop || inputY > height)
        {
            return null;
        }
        let sinValue = map(horizT, -widthAtY, widthAtY, -1.0, 1.0);
        sinValue = constrain(sinValue, -1.0, 1.0);
        let angle = asin(sinValue);
        let scaleFactor = 0.2;
        let cosValue = -cos(angle) * scaleFactor;
        let circCentre = inputY + (cosValue * widthAtY);
        let newWidth = (coneWidthAtBottom * 0.5) * ((circCentre - coneTop) / coneHeight);

        let pointLight = new this.PointLight();
        pointLight.polarR = circCentre;
        pointLight.polarT = angle;
        pointLight.radius = newWidth;
        pointLight.intensity = 1.5;
        pointLight.color = [random(0.,1.),random(0.,1.),random(0.,1.)];
        pointLight.scaleFactor = scaleFactor;
        pointLight.updateScreenPoint();
        return pointLight;
    }

    mousePressed()
    {
        for(let i = 0; i < this.points.length; i++)
        {
            if(this.points[i] != null && this.points[i].intensity > 0.001)
            {
                this.points[i].color = [random(0.,1.),random(0.,1.),random(0.,1.)];
                this.points[i].intensity = random(0.75, 1.5);
            }
        }
    }

    PointLight = class
    {
        constructor()
        {
            this.polarR = 0.;
            this.polarT = 0.;
            this.radius = 0.;
            this.scaleFactor = 0.;

            this.screenX = 0.;
            this.screenY = 0.;

            this.intensity = 0.;
            this.color = [0., 0., 0.];
            this.shorteningFactor = 1.0;
        }

        updateScreenPoint()
        {
            let coneMid = width * 0.5;
            this.screenX = coneMid - (sin(this.polarT) * this.radius);
            this.screenY = this.polarR + (cos(this.polarT) * this.radius * this.scaleFactor)

            let heightFactor = map(this.polarR, 0., height, 0.3, 0.0);
            let depthFactor = map(cos(this.polarT), -1., 1., 0.4, 0.0);
            this.shorteningFactor = 1.0 - heightFactor - depthFactor;
        }
    }
}