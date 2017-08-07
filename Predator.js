class Predator {
  constructor(x, y) {
    this.location = e.createVector(x, y);
    this.size = 80
  }

  display() {
    e.fill(200, 50, 50);
    e.ellipse(this.location.x, this.location.y, this.size, this.size);
  }
}
