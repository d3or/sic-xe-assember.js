const { bytesOcupied } = require("../utils/bytesOccupied");
const toHex = require("../utils/toHex");

const getProgramLength = (largestLocctr, progBlocks, lastLine) => {
  let programLength = largestLocctr;
  let sum = 0;

  if (progBlocks.length > 1) {
    // sum the length of prog blocks
    for (let i = 0; i < progBlocks.length; i++) {
      sum += parseInt(progBlocks[i].length, 16);
    }
    programLength = sum;
  } else if (lastLine.operation === "RESW" || lastLine.operation === "RESB") {
    programLength =
      parseInt(lastLine.locationCounter, 16) + lastLine.operand * 3 - 1;
  } else if (lastLine.operation === "WORD") {
    programLength = parseInt(lastLine.locationCounter, 16) + 3;
  } else if (lastLine.operation === "BYTE") {
    programLength = parseInt(lastLine.locationCounter, 16) + 1;
  } else if (lastLine.operation === "*") {
    programLength =
      parseInt(lastLine.locationCounter, 16) + bytesOcupied(lastLine.operand);
  } else {
    programLength = largestLocctr;
  }

  return toHex(programLength, 6).toUpperCase();
};

module.exports = getProgramLength;
