var predators = [];
var goal;
var population;

var ecosystem = function( e ) {

  e.setup = function() {
    e.createCanvas(800, 600);
    goal = new Goal(e.width - 100, e.height/2);
    population = new Population(180, 50, 200);
    population.generateInitial();
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
    a.createCanvas(800, 600);
  }

  a.draw = function() {
    a.background(0);
    // a.fill(200, 200, 200, 200);
    // for (let i = 0; i < population.history.length; i++) {
    //   let thisPop = population.history[i];
    //   a.rect()
    // }
  }
}

var a = new p5(analysis, 'analysis');
