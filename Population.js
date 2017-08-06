class Population {
  constructor(lifespan, dnaLength, maxSize){
    this.maxSize = maxSize;
    this.organisms = [];
    this.nextGeneration = [];
    this.generation = 0;
    this.mutationRate = 0.01;
    this.timer = 0;
    this.lifespan = lifespan;
    this.dnaLength = dnaLength;
    this.totalFitness;
    this.active = false;
    this.history = [];
    this.numGenerationsForMRBoost = 4;
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
    let totalUnstuck = 0;
    for (const organism of this.organisms) {
      organism.determineFitness();
      this.totalFitness += organism.fitness;
      totalUnstuck += organism.frozen ? 0 : 1
    }
    // if all members are stuck, boost the mutationRate to 100% for next generation
    if (totalUnstuck == 0) {
      this.mutationRate = 1;
    } else if (this.generation % this.numGenerationsForMRBoost == 0) {
      // Every x generations boost the mutationRate for next generation
      console.log('boost to .05');
      this.mutationRate = .04;
    } else {
      this.mutationRate = 0.007
    }
  }

  getOrganismFromMatingPool() {
    // returns random weighted organism from 'mating pool'
    var random_index = e.random(0, this.totalFitness-1);
    var weighted_sum = 0;
    for (var organism of this.organisms) {
      weighted_sum += organism.fitness;
      if (random_index <= weighted_sum) {
        return organism;
      }
    }
  }

  recordHistory() {
    this.history.push(this.organisms)
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
      offspring.mutate(this.mutationRate);
      this.nextGeneration.push(offspring);
    }
    this.organisms = this.nextGeneration;
    this.generation += 1;
    this.nextGeneration = [];
    this.timer = 0;
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
    if (this.active) {

      this.timer += 1;
      if (this.timer >= this.lifespan) {
        this.determineFitness();
        this.recordHistory();
        this.reproduce();
        console.log(this);
        // noLoop();
      }
    }

    for (const organism of this.organisms) {
      organism.display();
      if (this.active) {
        organism.update();
      }
    }
  }
}
