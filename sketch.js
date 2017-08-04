var alphabet = ['a', 'b']
var population;

function setup() {
  createCanvas(600, 600);
  population = new Population;
  population.generateInitial(1000);
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

function getRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}
