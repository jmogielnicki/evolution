determineFitness = function(score) {
  // fitness grows in slow exponential curve
  return Math.round(((score * score) / 10)+1)
}
