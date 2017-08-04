function Organism() {
  this.location = createVector(width/2, height/2);
  this.velocity = createVector(0, 0);
  this.acceleration = createVector(0, 0);
  this.fitness = 0;
  this.score = 0;
  this.dna = '';
  this.size = 20;
  this.mass = 10;
  this.color = color(100, 100, 100);
}

Organism.prototype.generateNew = function(numLetters) {
  var word = ''
  for (var i = 0; i < numLetters; i++) {
    this.dna += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
}

Organism.prototype.determineFitness = function() {
  this.score = 0;
  for (var i = 0; i < this.dna.length; i++) {
    letter = this.dna[i];
    targetLetter = targetWord[i]
    if (letter == targetLetter) {
      this.score += 1;
    }
  }

  this.fitness = determineFitness(this.score);
}

Organism.prototype.mutate = function() {
  // pick random letter
  newLetter = getRandom(alphabet);
  // console.log('adding ', newLetter, ' to ', this.dna);
  // mutate random character to be this letter
  dnaArray = this.dna.split('');
  dnaArray[Math.floor(Math.random() * dnaArray.length)] = newLetter;
  this.dna = dnaArray.join('');
  // console.log('new dna: ', this.dna);
}

Organism.prototype.display = function() {
    fill(this.color);
    ellipse(this.location.x, this.location.y, this.size, this.size)
  }

Organism.prototype.move = function() {
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
