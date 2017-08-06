class Predator {
  constructor(x, y) {
    this.location = createVector(x, y);
    this.size = 20
  }

  display() {
    fill(200, 100, 100);
    ellipse(this.location.x, this.location.y, this.size, this.size);
  }
}
