// Made by Martin O'Leary

class Day16 extends Day {

    constructor() {

        super();
        this.controls = ""; // Write any controls for interactivity if needed or leave blank
        this.credits = "Made by Martin O'Leary"; // Replace with your name
        this.gl = createGraphics(width, height, WEBGL);
        this.cam = this.gl.createCamera();
        this.colors = [
            [0.9, 0.4, 0.01],
            [1.0, 0.05, 0.01],
            [0.01, 0.3, 0.1],
            [0.7, 0.7, 0.7],
            [0.9, 0.4, 0.01],
            [1.0, 0.05, 0.01],
            [0.01, 0.3, 0.1],
            [0.7, 0.7, 0.7],
            [0.01, 0.05, 0.4],
            [0.9, 0.1, 0.5],
            [0.01, 0.01, 0.01],
            [0.3, 0.01, 0.5]
        ];
    }

    prerun() {
        // Initialise/reset variables here. Runs once, every time your day is viewed
        this.boxes = [this.fresh_box()];
        this.yaw = 0.0;
    }

    random_angle() {
        if (random() < 0.5) {
            return random([0, 1, 2, 3]) * PI / 2;
        }
        if (random() < 0.5) {
            return random([1, 3, 5, 7]) * PI / 4
        }
        return random(2 * PI);
    }

    fresh_box() {
        return {
            t: -1,
            color1: random(this.colors),
            color2: random(this.colors),
            shiny1: pow(random(1.0, 3.0), 3.0),
            shiny2: pow(random(1.0, 3.0), 3.0),
            scale: random(0.5, 5.0),
            fallX: random(-0.05, 0.05),
            fallY: random(-0.05, 0.05),
            mode: floor(random(14)),
            paper: [random(0.75, 0.85), random(0.7, 0.8), random(0.6, 0.75)],
            angle: this.random_angle(),
            offset: [random(-2, 2), random(-2, 2)]
        };
    }
    rotate_about(point, angles) {
        const [x, y, z] = point;
        const [rx, ry, rz] = angles;
        this.gl.translate(x, y, z);
        if (rx) this.gl.rotateX(rx);
        if (ry) this.gl.rotateY(ry);
        if (rz) this.gl.rotateZ(rz);
        this.gl.translate(-x, -y, -z);
    }
    quad(coords, normal) {
        this.gl.beginShape(QUADS);
        this.gl.normal(normal[0], normal[1], normal[2]);
        for (const [x, y, z, u, v] of coords) {
            this.gl.vertex(x, y, z, u, v);
        }
        this.gl.endShape(QUADS);
    }

    wrapped_box(w, h, l, t) {
        this.gl.push()
        this.gl.beginGeometry();
        this.gl.translate(0, 0, -l);
        this.quad([
            [-w, -h, 0, -w, -h],
            [-w, h, 0, -w, h],
            [w, h, 0, w, h],
            [w, -h, 0, w, -h]
        ],
            [0, 0, -1]
        );
        let a = t * PI / 2;
        let a2 = t * t * PI / 2;
        let a4 = t*t*t*t * PI / 2;
        let eps = t == 0 ? 1e-2 : 0;

        this.gl.push();
        this.rotate_about([-w, 0, 0], [0, -a, 0]);
        this.quad([
            [-w, -h, 0, -w, -h],
            [-w, h, 0, -w, h],
            [-w, h, 2 * l, -w - 2 * l, h],
            [-w, -h, 2 * l, -w - 2 * l, -h],
        ],
            [-1, 0, 0]
        );
        this.rotate_about([-w, 0, 2 * l], [0, -a, 0]);
        this.quad([
            [0, -h, 2 * l, -2 * w - 2 * l, -h],
            [0, h, 2 * l, -2 * w - 2 * l, h],
            [-w, h, 2 * l, -w - 2 * l, h],
            [-w, -h, 2 * l, -w - 2 * l, -h],
        ],
            [0, 0, 1]
        );
        this.gl.pop();

        this.gl.push();
        this.rotate_about([w, 0, 0], [0, a, 0]);
        this.quad([
            [w, -h, 0, w, -h],
            [w, h, 0, w, h],
            [w, h, 2 * l, w + 2 * l, h],
            [w, -h, 2 * l, w + 2 * l, -h],
        ],
            [1, 0, 0]
        );
        this.rotate_about([w, 0, 2 * l], [0, a, 0]);
        this.quad([
            [0, -h, 2 * l, 2 * w + 2 * l, -h],
            [0, h, 2 * l, 2 * w + 2 * l, h],
            [w, h, 2 * l, w + 2 * l, h],
            [w, -h, 2 * l, w + 2 * l, -h],
        ],
            [0, 0, 1]
        );
        this.gl.pop();


        this.gl.push();
        this.rotate_about([0, -h, 0], [a2, 0, 0]);
        this.quad([
            [w, -h, 0, w, -h],
            [-w, -h, 0, -w, -h],
            [-w, -h, 2 * l, -w, -h - 2 * l],
            [w, -h, 2 * l, w, -h - 2 * l]
        ],
            [0, -1, 0]);
        this.gl.push();
        this.rotate_about([w, -h, 0], [0, 0, -a4 + eps]);
        this.quad([
            [w, -h, 0, w, -h],
            [w, -h, 2 * l, w, -h - 2 * l],
            [w, 0, 2 * l, w + h, -h - 2 * l],
            [w, 0, 0, w + h, -h]

        ], [1, 0, 0]);
        this.gl.pop();
        this.gl.push();
        this.rotate_about([-w, -h, 0], [0, 0, a4 - eps]);
        this.quad([
            [-w, -h, 0, -w, -h],
            [-w, -h, 2 * l, -w, -h - 2 * l],
            [-w, 0, 2 * l, -w - h, -h - 2 * l],
            [-w, 0, 0, -w - h, -h]

        ], [-1, 0, 0]);
        this.gl.pop();
        this.rotate_about([0, -h, 2 * l], [a2 - eps, 0, 0]);
        this.quad([
            [w, 0, 2 * l, w, -2 * h - 2 * l],
            [-w, 0, 2 * l, -w, -2 * h - 2 * l],
            [-w, -h, 2 * l, -w, -h - 2 * l],
            [w, -h, 2 * l, w, -h - 2 * l]
        ],
            [0, 0, 1]);
        this.gl.pop();

        this.gl.push();
        this.rotate_about([0, h, 0], [-a2, 0, 0]);
        this.quad([
            [w, h, 0, w, h],
            [-w, h, 0, -w, h],
            [-w, h, 2 * l, -w, h + 2 * l],
            [w, h, 2 * l, w, h + 2 * l]
        ],
            [0, 1, 0]);
        this.gl.push();
        this.rotate_about([w, h, 0], [0, 0, a4 - eps]);
        this.quad([
            [w, h, 0, w, h],
            [w, h, 2 * l, w, h + 2 * l],
            [w, 0, 2 * l, w + h, h + 2 * l],
            [w, 0, 0, w + h, h]

        ], [1, 0, 0]);
        this.gl.pop();
        this.gl.push();
        this.rotate_about([-w, h, 0], [0, 0, -a4 + eps]);
        this.quad([
            [-w, h, 0, -w, h],
            [-w, h, 2 * l, -w, h + 2 * l],
            [-w, 0, 2 * l, -w - h, h + 2 * l],
            [-w, 0, 0, -w - h, h]

        ], [-1, 0, 0]);
        this.gl.pop();
        this.rotate_about([0, h, 2 * l], [-a2 + eps, 0, 0]);
        this.quad([
            [w, 0, 2 * l, w, 2 * h + 2 * l],
            [-w, 0, 2 * l, -w, 2 * h + 2 * l],
            [-w, h, 2 * l, -w, h + 2 * l],
            [w, h, 2 * l, w, h + 2 * l]
        ],
            [0, 0, 1]);
        this.gl.pop();

        let shapes = this.gl.endGeometry();
        this.gl.model(shapes);
        this.gl.pop();
    }

    update() {
        this.yaw -= 0.00005 * (mouseX - width / 2);
        if (!this.shader) {
            this.shader = assets.day16Shader.copyToContext(this.gl);

            let checkShaderError = (shaderObj) => {
                let gl = shaderObj._renderer.GL;
                let glFragShader = gl.createShader(gl.FRAGMENT_SHADER);
                gl.shaderSource(glFragShader, shaderObj._fragSrc);
                gl.compileShader(glFragShader);
                if (!gl.getShaderParameter(glFragShader, gl.COMPILE_STATUS)) {
                    return gl.getShaderInfoLog(glFragShader);
                }
                let glVertShader = gl.createShader(gl.VERTEX_SHADER);
                gl.shaderSource(glVertShader, shaderObj._vertSrc);
                gl.compileShader(glVertShader);
                if (!gl.getShaderParameter(glVertShader, gl.COMPILE_STATUS)) {
                    return gl.getShaderInfoLog(glVertShader);
                }
                return null
            }
            // console.log(checkShaderError(this.shader));
            this.world = assets.day16World.copyToContext(this.gl);
            // console.log(checkShaderError(this.world));
        }
        this.gl.background(10);
        this.cam.camera(5, 5, 0.5 + 3 * mouseY / height, 0, 0, 0, 0, 0, -1);
        this.cam.perspective(PI / 3, 1.0, 0.01, 100);
        this.gl.rotateZ(this.yaw);
        this.gl.setCamera(this.cam);
        this.gl.noStroke();
        this.gl.shader(this.world);
        this.world.setUniform("img", assets.day16Background);
        this.gl.push();
        this.gl.rotateX(-PI / 2);
        this.gl.sphere(30);
        this.gl.pop();

        this.gl.shader(this.shader);

        for (const box of this.boxes) {
            let t = box.t;
            if (box.t >= 0.0)
                box.t += deltaTime / 2000;
            this.gl.push();
            this.shader.setUniform("color1", box.color1);
            this.shader.setUniform("color2", box.color2);
            this.shader.setUniform("shiny1", box.shiny1);
            this.shader.setUniform("shiny2", box.shiny2);
            this.shader.setUniform("scale", box.scale);
            this.shader.setUniform("paper", box.paper);
            this.shader.setUniform("mode", box.mode);
            this.shader.setUniform("angle", box.angle);
            this.shader.setUniform("offset", box.offset);

            let box_t = t;
            if (box_t < 0.0) box_t = 0.0;
            box_t = 10 * box_t / (10 * box_t + 1);
            let fall = 0.0;
            if (t > 0.05) fall = 10. * Math.pow(t - 0.05, 2.0);
            this.gl.translate(0, 0, -fall);
            this.gl.rotateX(box.fallX * fall);
            this.gl.rotateY(box.fallY * fall);
            this.wrapped_box(1.9, 1.3, 1.2, box_t * box_t);
            this.gl.pop();
        }

        this.boxes = this.boxes.filter(b => b.t < 1.5)
        image(this.gl, 0, 0, width, height);

    }

    // Below are optional functions for interactivity. They can be deleted from this file if you want

    mousePressed() {
        // console.log(this.boxes);
        this.boxes[0].t = 0.0;
        this.boxes.unshift(this.fresh_box());

    }
}