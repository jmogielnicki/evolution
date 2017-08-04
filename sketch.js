var alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m',
                'n','o','p','q','r','s','t','u','v','w','x','y','z', ' ']
var numLoops = 0;
var targetWord = 'this is a test of a system that i built and the system seems to be working well';
var population;
var fittestLabel;
var bestPhrase;
var allPhrases;
var stats;
var fittestPerGeneration = [];

function setup() {
  createCanvas(600, 200);
  stats = createP("Stats");
  bestPhrase = createP("Best phrase:");
  bestPhrase.class("best");
  allPhrases = createP("All phrases:");

  population = new Population;
  population.generateInitial(targetWord.length);
  fittestLabel = createDiv('');
  console.log(population);
}

function draw() {
  background(0);
  population.determineFitness();
  drawFitnessTimeline(population.getFitnessValues());
  population.createMatingPool();
  population.reproduce();
  var fittest = population.findFittest();
  displayStats(fittest);
  decideWinner(fittest);

  population.generation += 1;
}

function getRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function displayStats() {
  var fittest = population.findFittest();
  bestPhrase.html("Best phrase:<br>" + fittest.dna);
  var statstext = "total generations:     " + population.generation + "<br>";
  statstext += "total population:     " + population.organisms.length + "<br>";
  stats.html(statstext);
  allPhrases.html("All phrases:<br>" + population.getAllPhrases())
}

function decideWinner(fittest) {
  if (fittest.dna == targetWord) {
    console.log(population);
    console.log('** and the winner is: ', fittest.dna);
    noLoop();
  }
}

function drawFitnessTimeline(fitnesses) {
  var maxFitness = determineFitness(targetWord.length);
  console.log(maxFitness);
  for (var i = 0; i < maxFitness; i++) {
    if (fitnesses[i]) {
      var x = map(i, 0, maxFitness, 0, width);
      var y = map(fitnesses[i], 0, population.maxSize, 0, height);
      stroke(100, 100, 100)
      rect(x, height, 10, -y * 2);
    }
  }
}
