function Population(lifespan) {
  this.maxSize = 100;
  this.organisms = [];
  this.generation = 0;
  this.matingPool = [];
  this.mutationRate = 0.05;
  this.timer = 0;
  this.lifespan = lifespan;
}

Population.prototype.generateInitial = function() {
  for (var i = 0; i < this.maxSize; i++) {
    organism = new Organism(this.lifespan);
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
    var offspring = new Organism(this.lifespan);
    var mate1 = random(this.matingPool);
    var mate2 = random(this.matingPool);
    for (var j = 0; j < 20; j++) {
      // debugger;
      if (Math.random() > 0.5) {
        offspring.dna[j] = mate1.dna[j];
      } else {
        offspring.dna[j] = mate2.dna[j];
      }
    }
    // if (Math.random()< this.mutationRate) {
    //   offspring.mutate();
    // }
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

Population.prototype.getFitnessValues = function() {
  populationFitnesses = {}
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

Population.prototype.updateAndDisplay = function() {
  // TODO consolidate the loops through organisms so we aren't looping multiple times
  this.timer += 1;
  if (this.timer >= this.lifespan) {
    this.determineFitness();
    this.createMatingPool();
    this.reproduce();
    this.timer = 0;
    this.generation += 1;
    console.log(this);
    // noLoop();
  }
  for (organism of this.organisms) {
    organism.update();
    organism.display();
  }
}
