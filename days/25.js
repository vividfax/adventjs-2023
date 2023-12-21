// Made by Kate Compton

class Day25 extends Day {

    constructor () {
        super();
        this.loop = true; // Set to true or false

        this.controls = ""; // Write any controls for interactivity if needed or leave blank
        this.credits = "Made by Kate Compton"; // Replace with your name

        // Define variables here. Runs once during the sketch holder setup
    }

    prerun() {

        this.counts = {
            "galaxykatebranchCount": 0,
            "galaxykatetreeCount": 0,
        }

        this.scene = new this.GalaxykateScene(this, this.counts)
        this.last = millis()*.001
        this.currentTime = 0
        // Initialise/reset variables here. Runs once, every time your day is viewed
    }

    update() {
        let t = millis()*.001
        let dt = t - this.last
        this.last = t

        dt *= .1
        this.currentTime += dt

        this.scene.update({t: this.currentTime,dt})
        // Update and draw stuff here. Runs continuously (or only once if this.loop = false), while your day is being viewed
        colorMode(HSL)
        background(190, 100, 90); // You can delete this line if you want

        this.scene.draw({t,dt})
    }

    GalaxykateScene = class {

        constructor(parent, counts) {
            this.x = 0
            this.trees = []
            this.flock = new parent.GalaxykateFlock(parent)

            let count = 7
            for (var i = 0; i < count; i++) {
                this.trees.push(new parent.GalaxykateTree(parent, counts, new parent.GalaxykateVector2D(parent, 10 + 120*i + 200*Math.random(),300)))
            }
            this.wind = new parent.GalaxykateVector2D(parent)
        }

        draw({t,dt}) {
            background(190, 100, 90)

            fill(0, 0, 100, .3)
            noStroke()
            rect(0, height*.8, width, -40)
            rect(0, height*.9, width, -100)
            rect(0, height*.95, width, -120)
            push()


            this.trees.forEach(tree => {

                tree.draw()
                // text(tree.idNumber, tree.rootPoint.x, tree.rootPoint.y + 30)
            })
            pop()
            this.flock.draw({t, dt})

        }

        update({t,dt, mouse}) {


            // Move along!
            let border = 0
            this.trees.forEach(tree => {
                let pct = tree.idNumber / (this.trees.length)
                pct = ((pct - t*1)%1 + 100)%1

                let x = pct*(width) + 100*noise(tree.idNumber) - 50
                tree.fade = .5*sin(tree.idNumber) + .5
                tree.size = 5 - 5*tree.fade
                let y = height - 100 -  100*tree.fade
                // let pct = constrain(tree.rootPoint.x/width,0, 1)

                let h = .5 - .5*Math.cos(pct*Math.PI*2)
                // console.log(pct, h)

                tree.rootPoint.x  = x
                tree.rootPoint.y  = y

                tree.rootPoint.energy = 30*tree.size*h


                tree.update({t, dt})
            })

            this.flock.update({t, dt})
        }
    }

    GalaxykateTree = class {

        constructor(parent, counts, rootPoint) {
            this.idNumber = counts.galaxykatetreeCount++
            this.size = .5 + Math.random()

            this.rootPoint = Object.assign(rootPoint, {
                energy: 10,
                velocity: new parent.GalaxykateVector2D(parent, 0, -10),
                radius: 12*this.size
            })



            this.root = new parent.GalaxykateBranch(parent, counts, {rootPoint:rootPoint,tree:this})

        }

        update({t, dt}) {
            this.root.update({t, dt})
        }

        draw() {

            // circle(0, 0, 200)
            // Draw up all the branch positions
            fill(0, 0, 0, .7 - .7*this.fade)
            this.root.draw()

            fill(0, 0, 0, .2)
            noStroke()
            // ellipse(...this.rootPoint, 40,20)
            ellipse(...this.rootPoint, 30,10)

        }
    }

    GalaxykateBranch = class {
        // Can contain other branches
        constructor(parent, counts, {rootPoint,tree, parentBranch, branchIndex}) {

            this.parent = parent;
            this.idNumber = counts.galaxykatebranchCount++
            this.galaxykatebranchCount = counts.galaxykatebranchCount;

            this.lengthFalloff = .8
            this.radiusFalloff = .5
            this.parentBranch = parentBranch
            this.tree = tree || parentBranch.tree
            this.energy = 1


            if (!rootPoint) {
                // console.warn("No starting branch rootPoint")

            }
            this.rootPoint = rootPoint

            if (parentBranch) {
                this.branchIndex = branchIndex
                this.level = parentBranch.level + 1

            } else {
                this.level = 0
                this.baseAngle = -Math.PI/2
                this.baseLength = 100
                this.baseRadius = 16

            }

            // Make points along this branch, so we can have scrunkly branches
            this.points = []
            for (var i = 0; i < 10; i++) {
                let pt = Object.assign(new parent.GalaxykateVector2D(parent), {
                    radius:1,
                    energy:1,
                    index: i,
                    id:"pt" + this.idNumber + "-" + i,
                    velocity: new parent.GalaxykateVector2D(parent, 0,0)
                })
                this.points.push(pt)
            }

            this.end = this.points[this.points.length - 1]

            this.branches = []
            const MAX_LEVEL = 3
            if (this.level < MAX_LEVEL) {

                let count = 4
                for (var i = 0; i< count; i++) {
                    // What point are we growing out of?
                    let ptIndex = Math.min(this.points.length - 1, (this.points.length) - i*2)
                    let pos = this.points[ptIndex]

                    if (pos) {
                        this.branches.push(new parent.GalaxykateBranch(parent, counts, {
                            parentBranch: this,
                            rootPoint: pos,
                            branchIndex: i,

                        }))
                    }
                }
            }

        }



        get startAngle() {
            if (this.parentBranch) {
                let deltaAngle = this.spreadAngle*((this.branchIndex%2) - .5)
                return this.rootPoint.velocity.angle + deltaAngle
            }
            return -Math.PI/2
        }


        update({t, dt, p}) {

            let bounce = Math.sin(t*10)
            this.spreadAngle = bounce*.9 + 1.2

            this.tip = new this.parent.GalaxykateVector2D(this.parent, this.rootPoint)
            let branchEnergy = constrain(this.rootPoint.energy, 0, 1)
            let speed = 3*branchEnergy*(this.rootPoint.radius**.4)
            this.tip.v = this.parent.GalaxykateVector2D.polar(this.parent, speed, this.startAngle)

            let animSpeed = .02 + this.level *.1

            // Update each pt
            this.points.forEach((pt, index) => {
                let pct = (index + .5) / (this.points.length - 1)


                pt.setTo(this.tip)
                pt.velocity.setTo(this.tip.v)

                // Add scrunkliness
                // .addNormal(this.start, this.end, n)

                let energyFalloff = Math.min(1, Math.max(1 - index*.1, 0))
                // console.log(energyFalloff)
                pt.energy = energyFalloff*this.rootPoint.energy


                let energy = constrain(pt.energy, 0, 1)
                // console.log("Parent of branch:", pt.id, this.rootPoint.energy)
                // pt.energy = this.rootPoint.energy

                pt.radius = this.rootPoint.radius * (1 - pct*this.radiusFalloff)


                // Update the tip


                if (t) {

                    let droop = bounce*.3 + .5
                    // // gravity
                    this.tip.v.y -= 0 + 1*droop*this.level

                    // // wander
                    let wanderEnergy = 1*this.level*energy
                    this.tip.v.addPolar(2*wanderEnergy, 25*noise(index + this.idNumber, .2*t*animSpeed))

                    let windPower = .04*pt.radius*pt.index
                    this.tip.v.addPolar(windPower, 25*noise(.3*t*animSpeed))

                // console.log(this.level)
                    let raise = 2 - droop
                    this.tip.v.addPolar(4*raise/(this.level*2 + 1), this.startAngle)
                }


                this.tip.v.constrain(speed*.3, speed*3)
                this.tip.add(this.tip.v)


            })

            this.branches.forEach(b => b.update({t, dt, p}))

        }

        draw(p) {
            if (this.rootPoint.energy) {

            // fill(0, 0, 0, .6)
                beginShape(TRIANGLE_STRIP)



                this.points.forEach((pt,index) => {
                    if (pt.energy > 0) {
                    // theta = pt.getRibbonAngle(last, this.points[index + 1])
                        let theta = pt.velocity.angle
                    // // console.log(theta)
                    // pt.polarOffsetCircle(p, 5, theta + Math.PI/2, 3)
                        pt.polarOffsetVertex(p, pt.radius, theta + Math.PI/2)
                        pt.polarOffsetVertex(p, pt.radius, theta + -Math.PI/2)
                    }

                })

                endShape()

            // this.points.forEach(pt => {
            //  debugDraw(p, pt)

            // })

            // debugDraw(p, this.rootPoint)
            // console.log(this.start.toFixed(2), this.end.toFixed(2))
                this.branches.forEach(b => b.draw(p))
            }
        }
    }

    GalaxykateVector2D = class {
        static polar(parent, r, theta) {
            return new parent.GalaxykateVector2D(parent, r*Math.cos(theta), r*Math.sin(theta))
        }

        static sub(parent, pt0, pt1) {
            return new parent.GalaxykateVector2D(parent, pt0.x - pt1.x, pt0.y - pt1.y)
        }

        static edgePoint(parent, ...args) {
            return new parent.GalaxykateVector2D(parent).setToEdgePoint(...args)
        }

        static distance(v1, v2) {
            if (!(v1 instanceof GalaxykateVector2D) || !(v2 instanceof GalaxykateVector2D)) {
              throw new Error('Both parameters should be instances of GalaxykateVector2D');
          }
          return Math.sqrt((v1.x - v2.x)**2 + (v1.y - v2.y)**2);
        }

        static addMultiple(parent, ...args) {
            return new parent.GalaxykateVector2D(parent).addMultiple(...args)
        }


        static lerpVertex({p, v0, v1, pct=.5, n=0}) {
            if (Array.isArray(v0))
            v0 = {x:v0[0],y:v0[1]}
        if (Array.isArray(v1))
            v1 = {x:v1[0],y:v1[1]}
        let dx = v1.x - v0.x
        let dy = v1.y - v0.y
        let m = Math.sqrt(dx*dx + dy*dy)
        let x = v0.x + pct*dx + dy*n/m
        let y = v0.y + pct*dy + -dx*n/m

        vertex(x, y)
        }


        constructor(parent, x=0, y=0) {

            this.parent = parent;

            this.x = x;
            this.y = y;

            if (x.x !== undefined) {
                    // Ok, its a vector
                this.x = x.x
                this.y = x.y
            }

            if (isNaN(this.x) || isNaN(this.y))  {
                // console.warn("NaN Vector contructed", this)
            }
        }
        clone() {
            return new this.parent.GalaxykateVector2D(this.parent, this.x, this.y);
        }


        // =========
            // Getters

        get angle() {
            return Math.atan2(this.y, this.x)
        }

        get magnitude() {
            return Math.sqrt(this.x ** 2 + this.y**2)
        }

        getDistanceTo(v) {
            return Math.sqrt((this.x-v.x)**2 + (this.y-v.y)**2)
        }

        getAngleTo(v) {
            return atan2(v.y- this.y, v.x - this.x)
        }

        getNormal() {
            let m = this.magnitude() || 1
            return new this.parent.GalaxykateVector2D(this.parent, this.y/m, -this.x/m)
        }

        getClosest(pts, {getPosition, getRadius, range=20}={}) {
            let closest = undefined;
            let closestDistance = range;
            pts.forEach(pt => {
                let pos = getPosition?getPosition(pt):pt
                        const radius = getRadius?getRadius(pt) :pt.radius || 0; // Default radius to 0 if not provided

                        // Calculate the distance between the point and the particle
                        const distance = Math.sqrt((this.x - pos.x) ** 2 + (this.y - pos.y) ** 2) - radius;

                        // Update the closest particle if this particle is closer
                        if (distance < closestDistance) {
                            closestDistance = distance;
                            closest = pt;
                        }


                    })

            return closest;
        }

        isWithin(x0, y0, x1, y1) {
            return this.x >= x0 && this.x <= x1 && this.y >= y0 && this.y <= y1
        }

            // =========
            // Setters


        setTo(...args) {
            if (!isNaN(args[0]) && !isNaN(args[1])) {
                this.x = args[0]
                this.y = args[1]
                return this
            }

            if (typeof args[0] == "object" && !isNaN(args[0].x) && !isNaN(args[0].y)) {
                this.x = args[0].x
                this.y = args[0].y
                return this
            }


            if (Array.isArray(args[0])&& !isNaN(args[0][0]) && !isNaN(args[1][1])) {
                this.x = args[0][0]
                this.y = args[0][1]
                return this
            }


            // console.warn("Incorrect args for 'setTo'", args)
            return this
        }



        setToAverage(pts) {
            if (pts.length > 0) {
            this.mult(0)
            pts.forEach(pt => this.add(pt))
            this.mult(1/pts.length)
        }
        return this
        }


        setToEdgePoint({pt0, pt1, v, pct=0, edgeOffset=0, normalOffset=0}) {
                // Set to a point on the edge, somewhere (pct) between pt0, and pt1,
                // Or from pt0 along a vector v
                // it may be offset some distance with the normal (n)
                // it may be offset some distance along the direction of the edge (m)
                // console.log(this.magnitude)

                // No vector, just use the two endpoints
            if (!v)
                v = new this.parent.GalaxykateVector2D(this.parent, pt1.x - pt0.x, pt1.y - pt0.y)

            let mag = v.magnitude || 1


            let ex = v.x/mag
            let ey = v.y/mag

            let nx = ey
            let ny = -ex

            this.x = pt0.x + v.x*pct + nx*normalOffset + ex*edgeOffset
            this.y = pt0.y + v.y*pct + ny*normalOffset + ey*edgeOffset
            return this
        }

        setToPolar(r, theta) {
            if (isNaN(r))
                // console.warn(`Non-numerical r: ${r}`)
            if (isNaN(theta))
                // console.warn(`Non-numerical theta: ${theta}`)
            this.x = r*Math.cos(theta)
            this.y = r*Math.sin(theta)
            return this
        }

        setToPolarOffset(v, r, theta) {
            if (isNaN(r))
                // console.warn(`Non-numerical r: ${r}`)
            if (isNaN(theta))
                // console.warn(`Non-numerical theta: ${theta}`)

            this.x = v.x + r*Math.cos(theta)
            this.y = v.y + r*Math.sin(theta)
            return this
        }

        setToLerp(v0, v1, pct) {

            this.x = v0.x*(1-pct) + v1.x*pct
            this.y = v0.y*(1-pct) + v1.y*pct

            return this
        }


        setToAddMultiple(...args) {
            this.mult(0)
            this.addMultiple(...args)
            return this
        }

        setToMultiple(m, v) {
            this.x = m*v.x
            this.y = m*v.y
            return this
        }

        setToAdd(...args) {
            this.mult(0)
            this.add(...args)

            return this
        }

        setToOffset(pt0, pt1) {
            this.x = pt1.x - pt0.x
            this.y = pt1.y - pt0.y
            return this
        }


            // =========
            // Adders/Multipliers

        constrain(min, max) {
            let m = this.magnitude
            let m2 = Math.min(max, Math.max(min, m))

                // skip if mag 0
            if (m)
                this.mult(m2/m)
            return this
        }

        wrap(x0, y0, x1, y1) {
                // Off right
            if (this.x > x1)
                this.x = x0

                // Off left
            if (this.x < x0)
                this.x = x1

                // Off the bottom
            if (this.y > x1)
                this.y = y0

                // Off the top
            if (this.y < y0)
                this.y = y1
            return this
        }

        lerpTo(pt, pct) {
            this.x = (1 - pct)*this.x + pct*pt.x
            this.y = (1 - pct)*this.y + pct*pt.y
            return this
        }

        normalize() {
            let m = this.magnitude || 1
            this.div(m)
            return this
        }

        div(m) {
            this.x /= m
            this.y /= m
            return this
        }


        mult(m) {
            this.x *= m
            this.y *= m
            return this
        }


        addPolar(r, theta) {
            this.x += r*Math.cos(theta)
            this.y += r*Math.sin(theta)
            return this
        }

        addNormal(v0, v1, n) {
            let m = this.parent.GalaxykateVector2D.distance(v0, v1)

            let dx = v1.x - v0.x
            let dy = v1.y - v0.y
            this.x += -n*dy / m
            this.y += n*dx / m


            return this
        }

        getRibbonAngle(prev, next) {
                // Get the smooth-ish angle between this and two points on either side



            let v = {x:0,y:0}
            if (prev) {
                let dx0 = this.x - prev.x
                let dy0 = this.y - prev.y
                let m0 = Math.sqrt(dx0**2 + dy0**2)
                v.x += dx0/m0
                v.y += dy0/m0
            }
            if (next) {
                let dx1 = next.x - this.x
                let dy1 = next.y - this.y
                let m1 = Math.sqrt(dx1**2 + dy1**2)
                v.x += dx1/m1
                v.y += dy1/m1
            }

            return Math.atan2(v.y, v.x)

        }


        addMultiple(...args) {

                // Takes alternating params of GalaxykateVector2D (or anything with x,y) and scalars

                // Ensure we have an even number of arguments
            if (args.length % 2 !== 0) {
                throw new Error("Expecting an even number of arguments. Pairs of GalaxykateVector2D (or similar) and scalars are required.");
            }

            for (let i = 0; i < args.length/2; i++) {
                    // Expecting a Point instance at even indices
                let v = args[i*2]
                let m = args[i*2 + 1]

                    // Check if the vector has x and y properties
                if (typeof v.x !== 'number' || typeof v.y !== 'number') {
                    // console.warn(v)
                    throw new Error(`Expecting an object with x and y properties at index ${i * 2}.`);
                }

                    // Check if the scalar is a number
                if (typeof m !== 'number') {

                    throw new Error(`Expecting a number at index ${i * 2 + 1}. Got ${typeof m}`);
                }


                this.x += m*v.x;
                this.y += m*v.y;
            }
            return this
        }


        addOffsetByMagnitude(v0, v1, fxn) {
            let x = v1.x - v0.x
            let y = v1.y - v0.y
            let m = Math.sqrt(x*x + y*y)

            let m2 = fxn(m, x, y)
            this.x += x*m2
            this.y += y*m2
            return this
        }


        offset(x, y) {
            this.x += x
            this.y += y
            return this
        }

        add(...points) {
                // Takes parameters of GalaxykateVector2D (or anything with x,y)
            for (const point of points) {
                this.x  += point.x;
                this.y  += point.y;
            }


            return this
        }

        sub(...points) {
                // Takes parameters of GalaxykateVector2D (or anything with x,y)
            for (const point of points) {
                this.x -= point.x;
                this.y -= point.y;
            }


            return this
        }

            // =========
            // Draw

        draw(p, radius=10) {
            circle(...this, radius)
        }

        drawArrow(p, {v, multiplyLength=1, normalOffset=0,  startOffset=0, endOffset=0, color}) {

                // Make points
            let start = this.parent.GalaxykateVector2D.edgePoint({pt0:this, v, pct: 0, normalOffset, edgeOffset: startOffset})
            let end = this.parent.GalaxykateVector2D.edgePoint({pt0:this, v, pct: multiplyLength, normalOffset, edgeOffset: endOffset})

                // Draw the line
            if (color)
                stroke(...color)

            line(...start, ...end)

            noStroke()
            if (color)
                fill(...color)

                // Draw the arrowhead
            push()
            translate(...end)
            rotate(v.angle)
            let d = 10
            let w = 4
            quad(0,0,
                -d, w,
                -d*.6, 0,
                -d, -w)

                // translate(v)
            pop()

        }

            // Vertices
        vertex(p) {
            vertex(...this)
        }

        polarOffsetVertex(p, r, theta) {
            vertex(this.x + r*Math.cos(theta), this.y+ r*Math.sin(theta))
        }
        polarOffsetCurveVertex(p, r, theta) {
            curveVertex(this.x + r*Math.cos(theta), this.y+ r*Math.sin(theta))
        }


        polarOffsetCircle(p, r, theta, radius) {
            circle(this.x + r*Math.cos(theta), this.y+ r*Math.sin(theta), radius)
        }

            //============
            //Output

        toArray() {
            return [this.x, this.y]
        }

        toFixed(n=3) {
            return `[${this.x.toFixed(n)}, ${this.y.toFixed(n)}]`
        }


            // From chatGPT: make it iterable/spreadable
        [Symbol.iterator]() {
            let index = 0;
            const properties = [this.x, this.y];

            return {
                next: () => {
                    if (index < properties.length) {
                        return { value: properties[index++], done: false };
                    } else {
                        return { done: true };
                    }
                }
            };
        }
    }

    GalaxykateFlock = class {

        constructor(parent) {
            this.boids = []

            this.center  = new parent.GalaxykateVector2D(parent, 300, 200)

            for (var i = 0; i< 12; i++) {
                let v = parent.GalaxykateVector2D.polar(parent, Math.random()*200, Math.random()*100)
                v.add(this.center)
                v.boidAngle = Math.random()*100
                v.velocity = parent.GalaxykateVector2D.polar(parent, 1900, v.boidAngle)
                v.force = new parent.GalaxykateVector2D(parent)
                this.boids.push(v)
                // console.log(v)
            }


        }


        draw({p,dt, t}) {
            this.boids.forEach((b, index) => {
                push()
                translate(...b)
                rotate(b.boidAngle)
                fill(0, 100, 50 + 10*Math.sin(index))

                let x = 12
                let y = 6
                let back = 1 + 2*Math.sin(t*40 + index)
                x *= 1 - .2*back
                noStroke()
                beginShape()
                vertex(y, 0)
                vertex(y, 0)

                curveVertex(-y*back, x)
                curveVertex(-y*(1 + .2*back), 0)

                curveVertex(-y*back, -x)

                vertex(y, 0)
                endShape()

                pop()

                stroke(0)
                // b.drawArrow(p, {
                //  v:b.velocity,
                //  multiplyLength:.1,
                //  color:[100, 100, 50]
                // })
                // b.drawArrow(p, {
                //  v:b.force,
                //  multiplyLength:.1,
                //  color:[320, 100, 50]
                // })
            })
            fill(0)
            circle(...this.center, 10)
        }

        update({dt, t}) {
            if (mouseIsPressed)
                this.center.setTo(mouseX, mouseY)
            else
                this.center.setTo(width*(.9*noise(t*2)), 200 + 100*noise(t*3))

            // console.log(this.center)

            this.boids.forEach((b, index) => {
                b.x -= dt*2000
                // console.log(b.velocity.toFixed())
                // console.log(b.toFixed())
                b.force.mult(0)

                // Attract to center
                b.force.addOffsetByMagnitude(b, this.center, (m, x, y) => {
                    return 100
                })

                // wander
                b.force.addPolar(100000*noise(index*100, t), 100*noise(index, t))

                // b.force.addPolar(100, b.boidAngle)
                b.velocity.addMultiple(b.force, dt)
                b.velocity.constrain(1000, 2000)
                b.addMultiple(b.velocity, dt)
                b.boidAngle = b.velocity.angle

                b.lerpTo(this.center, .01)


                // console.log(b.toFixed())
            })
        }
    }
}