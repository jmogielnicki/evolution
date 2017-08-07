var predators = [];
var goal;
var population;
var generationText;

var ecosystem = function( e ) {

  e.createSummaryText = function() {
    generationText = e.createP('Generation: ' + population.generation);
    generationText.addClass('generationText');
    generationText.parent('textContainer');
  }

  e.setup = function() {
    e.createCanvas(a.windowWidth, 600);
    goal = new Goal(e.width - 100, e.height/2);
    population = new Population(180, 50, 200);
    population.generateInitial();
    e.createSummaryText();
  }

  e.draw = function() {
    e.background(0);
    for (predator of predators) {
      predator.display();
    }
    goal.display();
    population.updateAndDisplay();
    if (predators.length > 5) {
      population.active = true;
    }
  }

  e.mousePressed = function() {
    predators.push(new Predator(e.mouseX, e.mouseY))
  }
}

var e = new p5(ecosystem, 'ecosystem');

var analysis = function( a ) {

  a.setup = function() {
    a.createCanvas(a.windowWidth, 600);
  }


// Analyzing the population data
  a.draw = function() {
    a.background(0);
    a.frameRate(1);
    a.fill(200, 200, 200, 200);
    // Find maxTotalFitness
    let maxTotalFitness = 0;
    for (pop of population.history) {
      maxTotalFitness = pop.totalFitness > maxTotalFitness ? pop.totalFitness : maxTotalFitness;
    };
    for (let i = 0; i < population.history.length; i++) {
      let thisPop = population.history[i];
      let xPos = a.map(i, 0, population.history.length, 0, a.width)
      let yPos = a.map(thisPop.totalFitness, 0, maxTotalFitness, 0, a.height/2) * -1
      a.rect(xPos, a.height, 10, yPos)
    }
  }
}

var a = new p5(analysis, 'analysis');
