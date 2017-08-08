class Goal {
  constructor(x, y) {
    this.location = e.createVector(x, y);
    this.size = 80;
  }

  display() {
    e.fill(100, 130, 150);
    e.ellipse(this.location.x, this.location.y, this.size, this.size);
  }
}
