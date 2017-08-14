class Population {
  constructor(lifespan, dnaLength, maxSize){
    this.maxSize = maxSize;
    this.organisms = [];
    this.nextGeneration = [];
    this.generation = 0;
    this.mutationRate = 0.01;
    this.timer = 0;
    this.lifespan = lifespan;
    this.startingLocation = {x: 100, y: e.height/2};
    this.dnaLength = dnaLength;
    this.totalFitness;
    this.maxFitness = 0;
    this.fastestTime;
    this.totalUnstuck;
    this.closestDistance;
    this.longestDistance;
    this.totalCompleted = 0;
    this.active = false;
    this.history = [];
    this.numGenerationsForMRBoost = 4;
  }

  generateInitial() {
    for (let i = 0; i < this.maxSize; i++) {
      let organism = new Organism(this.lifespan, this.dnaLength, i, this.startingLocation);
      this.organisms.push(organism);
    }
  }

  calculatePopulationStats(organism) {
    if (organism.fitness > this.maxFitness) {
      this.maxFitness = organism.fitness;
    }
    if (organism.acheivedGoal) {
      if (!this.fastestTime || organism.timeToGoal < this.fastestTime) {
        this.fastestTime = organism.timeToGoal;
      }
    }
    if (!this.closestDistance || organism.distanceToGoal < this.closestDistance) {
      this.closestDistance = organism.distanceToGoal;
    }
    if (!this.longestDistance || organism.distanceTravelled > this.longestDistance) {
      this.longestDistance = organism.distanceTravelled;
    }
    this.totalFitness += organism.fitness;
    this.totalUnstuck += organism.frozen ? 0 : 1;
    this.totalCompleted += organism.acheivedGoal ? 1 : 0;
  }

  determineFitness() {
    this.totalFitness = 0;
    this.totalUnstuck = 0;
    this.totalCompleted = 0;
    this.fastestTime = 0;
    this.maxFitness = 0;
    this.closestDistance = undefined;
    this.longestDistance = undefined;
    for (const organism of this.organisms) {
      organism.determineFitness();
      this.calculatePopulationStats(organism);
    }
    // if all members are stuck, boost the mutationRate to 100% for next generation
    if (this.totalUnstuck == 0) {
      this.mutationRate = 1;
    } else if (this.generation % this.numGenerationsForMRBoost == 0) {
      // Every x generations boost the mutationRate for next generation
      this.mutationRate = .05;
    } else {
      this.mutationRate = 0.01
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
    const thisCopy = Object.assign({}, this);
    this.history.push(thisCopy)
  }

  reproduce() {
    for (let i = 0; i < this.organisms.length; i++) {
      let offspring = new Organism(this.lifespan, this.dnaLength, i, this.startingLocation);
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
      offspring.mutate(guiVisible ? baseMutationRate : this.mutationRate);
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

  updateStats() {
    const lastGeneration = this.history[this.history.length]
    const genNum = this.history ? this.history.length : 0;
    const spacer = '<br>'
    const pctComplete = Math.floor(((this.totalCompleted/this.organisms.length) * 100)) + '%';
    const numDied = this.totalUnstuck ? this.organisms.length - this.totalUnstuck : 0;
    const pctDied = Math.floor(((numDied/this.organisms.length) * 100)) + '%';
    generationText.html(
      'Generation: ' + genNum + spacer +
      'Total Population: ' + this.organisms.length + spacer +
      '# successful: ' + this.totalCompleted + ' (' + pctComplete + ')' + spacer +
      '# died: ' + numDied + ' (' + pctDied + ')'
      )
  }

  updateAndDisplay() {
    // TODO consolidate the loops through organisms so we aren't looping multiple times
    if (this.active) {
      this.timer += 1;
      // Generation lifespan is over
      if (this.timer >= this.lifespan + this.organisms.length) {
        this.determineFitness();
        this.recordHistory();
        this.reproduce();
        this.updateStats();
        console.log(this);
        // noLoop();
      }
    }
    for (var i = 0; i < this.organisms.length; i++) {
      let organism = this.organisms[i]
      organism.display();
      if (this.active && organism.timer < organism.lifespan) {
        if (i < this.timer) {
          organism.update();
        }
      }
    }
  }
}