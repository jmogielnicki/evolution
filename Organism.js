function Organism(lifespan) {
  this.location = createVector(width/2, height/2);
  this.velocity = createVector(0, 0);
  this.acceleration = createVector(0, 0);
  this.fitness = 0;
  this.score = 0;
  this.dna = [];
  this.generateDNA();
  this.size = 5;
  this.mass = 200;
  this.color = color(200, 200, 200, 200);
  this.timer = 0;
  this.lifespan = lifespan;
}

Organism.prototype.generateDNA = function() {
  for (var i = 0; i < 20; i++) {
    this.dna.push(createVector(random(-1, 1), random(-1, 1)));
  }
}

Organism.prototype.determineFitness = function() {
  const distance = dist(this.location.x, this.location.y, mouseX, mouseY);
  this.fitness = Math.floor(200 - distance);
  console.log(this.fitness);
}

Organism.prototype.mutate = function() {
  // pick random letter
  newLetter = random(alphabet);
  dnaArray = this.dna.split('');
  dnaArray[Math.floor(Math.random() * dnaArray.length)] = newLetter;
  this.dna = dnaArray.join('');
}

Organism.prototype.display = function() {
  // noStroke();
  fill(this.color);
  ellipse(this.location.x, this.location.y, this.size, this.size)
}

Organism.prototype.update = function() {
  this.move();
  this.timer += 1;
}

Organism.prototype.move = function() {
  var interval = this.lifespan/this.dna.length;
  var index = Math.floor(this.timer/interval);
  this.applyForce(this.dna[index]);
  this.velocity.add(this.acceleration);
  this.location.add(this.velocity);
  this.acceleration.mult(0)
}

Organism.prototype.applyForce = function(force) {
  // Newton's 2nd law
    f = force.copy()
    f.div(this.mass)
    this.acceleration.add(f)
}
