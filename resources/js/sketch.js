// TODO
// - Figure out how to create speciation
// - Write a how it works section

var predators = [];
var goal;
var population;
var generationText, mutationRateText, mutationRateSlider, startButton;
var onCanvas;
var gui;
var baseMutationRate = 0.01;
var debugMode = false;
var historyMode = false;
var showPaths = false;
var mutationRateType = ['automatic', 'manual'];
var obstacleCourseType = ['wall', 'maze', 'scatter']
var guiVisible;
var paused = true;

var ecosystem = function( e ) {
  e.setup = function() {
    canvas = e.createCanvas(1000, 600);
    canvas.mouseOver(function() { onCanvas = true; });
    canvas.mouseOut( function() { onCanvas = false; });
    goal = new Goal(e.width - 100, e.height/2);
    population = new Population(240, 100, 500);
    population.generateInitial();
    e.createSummaryText();
  }

  e.draw = function() {
    let transparency = showPaths ? 3 : 100;
    e.background(0, 0, 0, transparency);
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
    let deletingPredator = false;
    if (onCanvas) {
      for (var i = 0; i < predators.length; i++) {
        predator = predators[i];
        if (e.dist(e.mouseX, e.mouseY, predator.location.x, predator.location.y) < predator.size/2) {
          predators.splice(i, 1);
          deletingPredator = true;
        }
      }
      if (!deletingPredator) {
        predators.push(new Predator(e.mouseX, e.mouseY))
      }
    }
  }

  e.keyPressed = function() {
    var keyCode = e.keyCode;
    switch(true) {
      // type [F1] to hide / show the GUI
      case keyCode == e.RETURN:
        guiVisible = !guiVisible;
        if(guiVisible) gui.show(); else gui.hide();
        break;
      case keyCode == 72:
        historyMode = !historyMode;
        break;
      case keyCode == 68:
        debugMode = !debugMode;
        break;
      case keyCode >= 49 && keyCode <= 57:
        let numberPressed = keyCode - 48;
        baseMutationRate = numberPressed / 100;
        break;
    }
  }

  pause = function() {
    paused = !paused;
    if (paused) {
      startButton.html('play')
    } else {
      startButton.html('pause')
    }
  }

  reset = function() {
    population = new Population(240, 100, 500);
    population.generateInitial();
    predators = [];
    paused = true;
  }

  choosePreset = () => {
    predators = [];
    if (sel.value() == 'wall' || sel.value() == 'walls') {
      for (var i = 0; i < 6; i++) {
        locationY = e.map(i, 0, 5, e.height - 160, 160);
        predators.push(new Predator(e.width/4, locationY))
        if (sel.value() == 'walls') {
          predators.push(new Predator((e.width/4) * 3, locationY))
        }
      }
    }
    if (sel.value() == 'scatter') {
      const xNum = 4;
      const yNum = 4;
      for (var x = 0; x < xNum; x++) {
        for (var y = 0; y < yNum; y++) {
          xLocation = e.map(x, 0, xNum - 1, 200, e.width - 200);
          let offset = 0;
          if (x % 2 == 0) {
            offset = 80;
          }
          yLocation = e.map(y, 0, yNum-1, 40 + offset, e.height-120 + offset);
          predators.push(new Predator(xLocation, yLocation));
        }
      }
    }
  }

  e.createSummaryText = function() {
    generationText = e.createP('');
    generationText.addClass('generationText');
    generationText.parent('textContainer');
    startButton = e.createButton('play')
    startButton.parent('sliderContainer');
    startButton.mousePressed(pause);
    sel = e.createSelect();
    sel.parent('sliderContainer');
    sel.option('choose preset');
    sel.option('wall');
    sel.option('walls');
    sel.option('scatter');
    sel.changed(choosePreset);
    resetButton = e.createButton('reset')
    resetButton.parent('sliderContainer');
    resetButton.mousePressed(reset);
    population.updateStats();
    e.sliderRange(0, 0.5, 0.01);
    gui = e.createGui('controls');
    gui.addGlobals('baseMutationRate');
    gui.addGlobals('debugMode');
    gui.addGlobals('historyMode');
    gui.addGlobals('showPaths');
    gui.hide();
  }
}

var e = new p5(ecosystem, 'ecosystem');

// var analysis = function( a ) {
//
//   a.setup = function() {
//     a.createCanvas(a.windowWidth, 600);
//   }
//
//
// // Analyzing the population data
//   a.draw = function() {
//     a.background(0);
//     a.frameRate(1);
//     a.fill(200, 200, 200, 200);
//     // Find maxTotalFitness
//     let maxTotalFitness = 0;
//     for (pop of population.history) {
//       maxTotalFitness = pop.totalFitness > maxTotalFitness ? pop.totalFitness : maxTotalFitness;
//     };
//     for (let i = 0; i < population.history.length; i++) {
//       let thisPop = population.history[i];
//       let xPos = a.map(i, 0, population.history.length, 0, a.width)
//       let yPos = a.map(thisPop.totalFitness, 0, maxTotalFitness, 0, a.height/2) * -1
//       a.rect(xPos, a.height, 10, yPos)
//     }
//   }
// }
//
// var a = new p5(analysis, 'analysis');
