class Predator {
  constructor(x, y) {
    this.location = e.createVector(x, y);
    this.size = 70
  }

  display() {
    e.fill(200, 80, 80);
    e.ellipse(this.location.x, this.location.y, this.size, this.size);
  }
}
