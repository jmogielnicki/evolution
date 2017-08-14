class Organism {
    constructor(lifespan, dnaLength, id, startingLocation) {
    this.location = e.createVector(startingLocation.x, startingLocation.y);
    this.velocity = e.createVector(0, 0);
    this.acceleration = e.createVector(0, 0);
    this.fitness = 0;
    this.score = 0;
    this.dna = [];
    this.dnaLength = dnaLength;
    this.size = 5;
    this.mass = 4;
    this.color = e.color(200, 200, 200, 200);
    this.timer = 0;
    this.timeToGoal = 0;
    this.lifespan = lifespan;
    this.alive = true;
    this.frozen = false;
    this.id = id;
    this.acheivedGoal = false;
    this.startingDistance = e.dist(this.location.x, this.location.y, goal.location.x, goal.location.y);
    this.distanceToGoal;
    this.distanceTravelled = 0;
    this.lastLocation = e.createVector(this.location.x, this.location.y);
    this.generateDNA();
  }

  createRandomVector() {
    return e.createVector(e.random(-1, 1), e.random(-1, 1));
  }

  generateDNA() {
    for (let i = 0; i < this.dnaLength; i++) {
      this.dna.push(this.createRandomVector());
    }
  }

  determineFitness() {
    if (this.alive) {
      this.distanceToGoal = e.dist(this.location.x, this.location.y, goal.location.x, goal.location.y);
      // reward getting closer
      const distanceFactor = e.map(this.distanceToGoal, this.startingDistance, 1, 1, 20);
      this.fitness = distanceFactor > 0 ? distanceFactor : 0;

      if (population.history.length > 0) {
        const lastGeneration = population.history[population.history.length - 1]
        // Add extra reward for beating the current closest distance
        this.fitness = this.distanceToGoal < lastGeneration.closestDistance ? this.fitness * 6 : this.fitness;
        // Reward travelling longest distance
        this.fitness = this.distanceTravelled > lastGeneration.longestDistance ? this.fitness * 4 : this.fitness;
      }


      // reward acheiving goal
      this.fitness = this.acheivedGoal ? this.fitness * 6 : this.fitness;

      // Reward acheiving goal faster than current fastest time
      if (this.acheivedGoal) {
        const amountFaster = population.fastestTime - this.timeToGoal;
        if (amountFaster > 1) {
          // If faster, boost fitness
          this.fitness = this.fitness * amountFaster;
        } else if (amountFaster < 0) {
          // If slower than fastest, reduce fitness by half
          this.fitness = this.fitness * 0.5
        }
      }

      // If stuck, reduce fitness
      this.fitness = this.frozen ? this.fitness * 0.3 : this.fitness;

      // Check for negative values, set to 0
      if (!this.fitness || this.fitness < 0) {
        this.fitness = 0;
      }

      this.fitness = e.pow(this.fitness, 4);
    } else {
      this.fitness = 0;
    }
    // Safeguard against negative or undefinted fitness (will break mating pool)

  }

  mutate(mutationRate) {
    for (var i = 0; i < this.dna.length; i++) {
      if (e.random() <= mutationRate) {
        this.dna[i] = this.createRandomVector();
      }
    }
  }

  determineColor() {
    if (!this.alive) {
      this.color = e.color(0, 0, 0, 0);
    } else if (this.frozen) {
      this.color = this.color = e.color(255, 0, 0, 200);
    } else if (this.acheivedGoal) {
      this.color = e.color(0, 255, 0, 200);
    } else {
      this.color = e.color(200, 200, 200, 200);
    }
  }

  display() {
    // noStroke();
    // Use fitness to calculate area of circle.  Calculate diameter from area.
    let diameter = this.size;
    if (debugMode) {
      // const area = e.map(this.fitness, 0, 100, 0, 100)
      // diameter = e.sqrt(area/e.PI) * 2;
    }

    this.determineColor();
    e.fill(this.color);
    e.ellipse(this.location.x, this.location.y, diameter, diameter)

    if (debugMode) {
      e.textSize(10);
      e.fill(250, 250, 250);
      const text = this.fitness.toFixed(0);
      e.text(text, this.location.x, this.location.y);
    }
  }

  calculateDistanceTravelled() {
    const incrementalDistance = e.dist(this.lastLocation.x, this.lastLocation.y, this.location.x, this.location.y);
    this.distanceTravelled += incrementalDistance;
    this.lastLocation.x = this.location.x;
    this.lastLocation.y = this.location.y;
  }

  update() {
    debugMode ? this.determineFitness() : null;
    if (!this.frozen && !this.acheivedGoal && this.alive) {
      this.move();
      this.calculateDistanceTravelled();
      this.checkPredatorCollision();
      this.checkAcheivedGoal();
      // TODO: move timer outside of if block so that it keeps going even if goal acheived?
      this.timer += 1;
      this.timeToGoal += this.acheivedGoal ? 0 : 1;
    }
  }

  checkAcheivedGoal() {
    if (colliding(this, goal) && this.acheivedGoal == false) {
      this.acheivedGoal = true;
    }
  }

  checkPredatorCollision() {
    for (predator of predators) {
      if (colliding(this, predator)) {
        this.frozen = true;
      }
    }
  }

  move() {
    const interval = this.lifespan/this.dna.length;
    const index = Math.floor(this.timer/interval);
    this.applyForce(this.dna[index]);
    this.velocity.add(this.acceleration);
    this.location.add(this.velocity);
    this.acceleration.mult(0)
  }

  applyForce(force) {
    // Newton's 2nd law
      const f = force.copy()
      f.div(this.mass)
      this.acceleration.add(f)
  }
}
