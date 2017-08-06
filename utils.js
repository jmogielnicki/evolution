determineFitness = function(score) {
  // fitness grows in slow exponential curve
  return Math.round(((score * score) / 10)+1)
}

colliding = function(item1, item2) {
  // debugger
  var distanceBetween = dist(item1.location.x, item1.location.y, item2.location.x, item2.location.y);
  if (distanceBetween < (item1.size/2) + (item2.size/2)) {
    return true;
  } else {
    return false;
  }
}
