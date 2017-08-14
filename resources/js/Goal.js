class Goal {
  constructor(x, y) {
    this.location = e.createVector(x, y);
    this.size = 80;
  }

  display() {
    e.fill(100, 130, 150);
    e.stroke(255, 255, 255, 70);
    e.ellipse(this.location.x, this.location.y, this.size, this.size);
    if (debugMode && population.history.length > 0) {
      e.fill(100, 130, 150, 10)
      const closestDistance = population.history[population.history.length - 1].closestDistance;
      e.ellipse(this.location.x, this.location.y, closestDistance * 2, closestDistance * 2)
    }
  }
}
