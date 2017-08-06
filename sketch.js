const lifespan = 100;
const dnaLength = 20;
var predators = [];
var goal;

function setup() {
  createCanvas(600, 600);
  goal = new Goal(20, 20);
  population = new Population(lifespan, dnaLength);
  population.generateInitial();
}

function draw() {
  background(0);
  for (predator of predators) {
    predator.display();
  }
  population.updateAndDisplay();
  goal.display();
  // population.determineFitness();
  // population.createMatingPool();
  // population.reproduce();
  // population.generation += 1;
  // console.log(population);
}

function mousePressed() {
  predators.push(new Predator(mouseX, mouseY))
}
