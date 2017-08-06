class Goal {
  constructor(x, y) {
    this.location = createVector(x, y);
    this.size = 40;
  }

  display() {
    fill(100, 130, 150);
    ellipse(this.location.x, this.location.y, this.size, this.size);
  }
}
