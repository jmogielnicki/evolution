var predators = [];
var goal;
var population;
var generationText, mutationRateText, mutationRateSlider, startButton;
var onCanvas;
var gui;
var baseMutationRate = 0.01;
var debugMode = false;
var mutationRateType = ['automatic', 'manual'];
var guiVisible;
var paused = true;

var ecosystem = function( e ) {
  e.setup = function() {
    canvas = e.createCanvas(a.windowWidth, 600);
    canvas.mouseOver(function() { onCanvas = true; });
    canvas.mouseOut( function() { onCanvas = false; });
    goal = new Goal(e.width - 100, e.height/2);
    population = new Population(240, 100, 400);
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
    if (paused) {
      population.active = false;
    } else {
      population.active = true;
    }
  }

  e.mousePressed = function() {
    if (onCanvas) {
      predators.push(new Predator(e.mouseX, e.mouseY))
    }
  }

  e.keyPressed = function() {
    switch(e.keyCode) {
      // type [F1] to hide / show the GUI
      case e.RETURN:
        guiVisible = !guiVisible;
        if(guiVisible) gui.show(); else gui.hide();
        break;
    }
  }

  pause = function() {
    paused = !paused;
  }

  e.createSummaryText = function() {
    generationText = e.createP('');
    generationText.addClass('generationText');
    generationText.parent('textContainer');
    startButton = e.createButton('play/pause')
    startButton.parent('textContainer');
    startButton.mousePressed(pause);
    population.updateStats();
    e.sliderRange(0.001, 0.5, 0.001);
    gui = e.createGui('controls');
    gui.addGlobals('baseMutationRate');
    gui.addGlobals('debugMode');
    gui.hide();
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
