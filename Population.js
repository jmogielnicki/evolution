class Population {
  constructor(lifespan, dnaLength){
    this.maxSize = 200;
    this.organisms = [];
    this.nextGeneration = [];
    this.generation = 0;
    this.mutationRate = 0.15;
    this.timer = 0;
    this.lifespan = lifespan;
    this.dnaLength = dnaLength;
    this.totalFitness;
  }

  generateInitial() {
    for (let i = 0; i < this.maxSize; i++) {
      // debugger;
      let organism = new Organism(this.lifespan, this.dnaLength, i);
      this.organisms.push(organism);
    }
  }

  determineFitness() {
    this.totalFitness = 0;
    for (const organism of this.organisms) {
      organism.determineFitness();
      this.totalFitness += organism.fitness;
    }
  }

  getOrganismFromMatingPool() {
    // returns random weighted organism from 'mating pool'
    var random_index = random(0, this.totalFitness-1);
    var weighted_sum = 0;
    for (var organism of this.organisms) {
      weighted_sum += organism.fitness;
      if (random_index <= weighted_sum) {
        return organism;
      }
    }
  }

  reproduce() {
    for (let i = 0; i < this.organisms.length; i++) {
      let offspring = new Organism(this.lifespan);
      let mate1 = this.getOrganismFromMatingPool();
      let mate2 = this.getOrganismFromMatingPool();
      for (let j = 0; j < this.dnaLength; j++) {
        // debugger;
        if (Math.random() > 0.5) {
          offspring.dna[j] = mate1.dna[j];
        } else {
          offspring.dna[j] = mate2.dna[j];
        }
      }
      if (Math.random()< this.mutationRate) {
        offspring.mutate();
      }
      this.nextGeneration.push(offspring);
    }
    this.organisms = this.nextGeneration;
    this.nextGeneration = [];
  }

  findFittest() {
    const fittestOrganism = {fitness: -1}
    for (organism of this.organisms) {
      if (organism.fitness > fittestOrganism.fitness) {
        fittestOrganism = organism;
      }
    }
    return fittestOrganism;
  }

  getFitnessValues() {
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

  updateAndDisplay() {
    // TODO consolidate the loops through organisms so we aren't looping multiple times
    this.timer += 1;
    if (this.timer >= this.lifespan) {
      this.determineFitness();
      this.reproduce();
      this.timer = 0;
      this.generation += 1;
      console.log(this);
      // noLoop();
    }
    for (const organism of this.organisms) {
      organism.display();
      if (organism.alive && !organism.frozen) {
        organism.update();
      }
    }
  }
}
