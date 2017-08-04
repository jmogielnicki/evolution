function Population() {
  this.maxSize = 1000;
  this.organisms = [];
  this.generation = 0;
  this.matingPool = [];
  this.mutationRate = 0.05;
}

Population.prototype.generateInitial = function(numLetters) {
  for (var i = 0; i < this.maxSize; i++) {
    organism = new Organism;
    organism.generateNew(numLetters);
    this.organisms.push(organism)
  }
}

Population.prototype.determineFitness = function() {
  for (organism of this.organisms) {
    organism.determineFitness();
  }
}

Population.prototype.createMatingPool = function() {
  this.matingPool = [];
  for (organism of this.organisms) {
    for (var i = 0; i < organism.fitness; i++) {
      this.matingPool.push(organism);
    }
  }
}

Population.prototype.reproduce = function() {
  for (var i = 0; i < this.organisms.length; i++) {
    var offspring = new Organism;
    // debugger;
    var mate1 = getRandom(this.matingPool);
    var mate2 = getRandom(this.matingPool);
    for (var j = 0; j < targetWord.length; j++) {
      if (Math.random() > 0.5) {
        offspring.dna += mate1.dna.substring(j, j+1);
      } else {
        offspring.dna += mate2.dna.substring(j, j+1);
      }
    }
    // mutate
    if (Math.random()< this.mutationRate) {
      offspring.mutate();
    }
    this.organisms[i] = offspring;

  }
}

Population.prototype.findFittest = function() {
  var fittestOrganism = {fitness: -1}
  for (organism of this.organisms) {
    if (organism.fitness > fittestOrganism.fitness) {
      fittestOrganism = organism;
    }
  }
  return fittestOrganism;
}

Population.prototype.getAllPhrases = function() {
  var everything = "";
  var displayLimit = min(this.organisms.length,50);

  for (var i = 0; i < displayLimit; i++) {
    everything += this.organisms[i].dna + "<br>";
  }
  return everything;
}

Population.prototype.getFitnessValues = function() {
  populationFitnesses = {}
  // debugger;
  for (organism of this.organisms) {
    organismFitnessValue = organism.fitness;
    // If key already exists in populationFitnesses, increment value by 1, else create new key
    if (populationFitnesses[organismFitnessValue]) {
      populationFitnesses[organismFitnessValue] += 1;
    } else {
      populationFitnesses[organismFitnessValue] = 1;
    }
  }
  return populationFitnesses;
}
