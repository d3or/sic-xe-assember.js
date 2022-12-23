const bytesOcupied = (operand) => {
  if (operand[1] === "X") {
    return 1;
  } else if (operand[1] === "C") {
    return 3;
  }
};

module.exports = {
  bytesOcupied,
};
