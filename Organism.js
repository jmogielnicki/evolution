class Organism {
    constructor(lifespan, dnaLength, id) {
    this.location = createVector(100, height/2);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.fitness = 0;
    this.score = 0;
    this.dna = [];
    this.dnaLength = dnaLength;
    this.generateDNA();
    this.size = 5;
    this.mass = 6;
    this.color = color(200, 200, 200, 200);
    this.timer = 0;
    this.lifespan = lifespan;
    this.alive = true;
    this.frozen = false;
    this.id = id;
    this.acheivedGoal = false;
    this.timeToGoal;
  }

  createRandomVector() {
    return createVector(random(-1, 1), random(-1, 1));
  }

  generateDNA() {
    for (let i = 0; i < this.dnaLength; i++) {
      this.dna.push(this.createRandomVector());
    }
  }

  determineFitness() {
    if (this.alive) {
      const distance = dist(this.location.x, this.location.y, goal.location.x, goal.location.y);
      this.fitness = Math.floor(pow((400/distance), 4));
      if (this.frozen) {
        // If stuck, reduce fitness
        this.fitness = Math.floor(this.fitness * 0.2);
      }
    } else {
      this.fitness = 0;
    }
    // Safeguard against negative or undefinted fitness (will break mating pool)
    if (!this.fitness || this.fitness < 0) {
      this.fitness = 0;
    }
  }

  mutate() {
    this.dna[Math.floor(Math.random() * this.dna.length)] = this.createRandomVector();
  }

  display() {
    // noStroke();
    fill(this.color);
    ellipse(this.location.x, this.location.y, this.size, this.size)
  }

  update() {
    this.move();
    this.checkPredatorCollision();
    this.checkAcheivedGoal();
    this.timer += 1;
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
