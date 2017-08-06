var predators = [];
var goal;

function setup() {
  createCanvas(800, 600);
  goal = new Goal(width - 100, height/2);
  population = new Population(100, 10, 500);
  population.generateInitial();
}

function draw() {
  background(0);
  for (predator of predators) {
    predator.display();
  }
  goal.display();
  population.updateAndDisplay();
  if (predators.length > 5) {
    population.active = true;
  }
}

function mousePressed() {
  predators.push(new Predator(mouseX, mouseY))
}
