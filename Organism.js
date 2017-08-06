class Organism {
    constructor(lifespan, dnaLength, id) {
    this.location = e.createVector(100, e.height/2);
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
    this.lifespan = lifespan;
    this.alive = true;
    this.frozen = false;
    this.id = id;
    this.acheivedGoal = false;
    this.timeToGoal;
    this.startingDistance = e.dist(this.location.x, this.location.y, goal.location.x, goal.location.y);
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
      const distance = e.dist(this.location.x, this.location.y, goal.location.x, goal.location.y);
      // reward getting closer and doing it faster
      this.fitness = 1000 / distance;
      // Double fitness if goal is acheived
      this.fitness = this.acheivedGoal ? this.fitness * 2 : this.fitness;
      // If stuck, reduce fitness by half
      this.fitness = this.frozen ? this.fitness * 0.5 : this.fitness;
      // Increase fitness if finished faster
      // TODO debug time to goal boost
      // this.fitness = this.timeToGoal ?
      //   this.fitness * e.map(this.timeToGoal, 0, this.timer, 4, 1) : this.fitness;
      this.fitness = e.pow(this.fitness, 4);
    } else {
      this.fitness = 0;
    }
    // Safeguard against negative or undefinted fitness (will break mating pool)
    if (!this.fitness || this.fitness < 0) {
      this.fitness = 0;
    }
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
    this.determineColor();
    e.fill(this.color);
    e.ellipse(this.location.x, this.location.y, this.size, this.size)
  }

  update() {
    if (!this.frozen && !this.acheivedGoal && this.alive) {
      this.move();
      this.checkPredatorCollision();
      this.checkAcheivedGoal();
      this.timer += 1;
    }
  }

  checkAcheivedGoal() {
    if (colliding(this, goal) && this.acheivedGoal == false) {
      this.acheivedGoal = true;
      this.timeToGoal = this.timer;
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
