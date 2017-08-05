var alphabet = ['a', 'b']
var population;
const lifespan = 600;

function setup() {
  createCanvas(600, 600);
  population = new Population(lifespan);
  population.generateInitial();
}

function draw() {
  background(0);
  population.updateAndDisplay();
  // population.determineFitness();
  // population.createMatingPool();
  // population.reproduce();
  // population.generation += 1;
  // console.log(population);
}
