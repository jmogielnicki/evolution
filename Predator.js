class Predator {
  constructor(x, y) {
    this.location = e.createVector(x, y);
    this.size = 80
  }

  display() {
    e.fill(200, 100, 100);
    e.ellipse(this.location.x, this.location.y, this.size, this.size);
  }
}
