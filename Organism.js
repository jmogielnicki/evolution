function Organism() {
  this.fitness = 0;
  this.score = 0;
  this.dna = ''

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
