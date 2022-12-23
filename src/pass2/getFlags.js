const { accessSymbolTable } = require("./state/accessSymbolTable");
const { getBase } = require("./state/programState");
const getFlags = (
  operation,
  operand,
  operandAddress,
  format,
  locationCounter
) => {
  let n, i, x, b, p, e;
  const isIndirectAddressing = operand[0] === "@";
  const isImmediateAddressing = operand[0] === "#";
  const isDirectAddressing = !isIndirectAddressing && !isImmediateAddressing;
  const isSimpleAddressing = operand[0] === "=";

  const hasPlus = operation.includes("+");

  if (isDirectAddressing) {
    n = 1;
    i = 1;
  } else if (isImmediateAddressing) {
    n = 0;
    i = 1;
    p = 1;
  } else if (isIndirectAddressing) {
    n = 1;
    i = 0;
  } else {
    n = 0;
    i = 0;
  }

  b = 0;

  // handle p
  if (isDirectAddressing && !hasPlus && operand.length > 0) {
    p = 1;
  }
  if (isIndirectAddressing && getBase() === 0) {
    b = 0;
    p = 1;
  } else if (isIndirectAddressing && getBase() !== 0) {
    b = 1;
    p = 0;
  }

  if (isSimpleAddressing) {
    p = 0;
    b = 0;
  } else if (format === 3 && !hasPlus) {
    // if operand > 2048, then p = 0, b = 1
    if (isNaN(parseInt(operandAddress, 16))) {
      operandAddress = accessSymbolTable(operandAddress);
    }
    if (!operandAddress) {
      operandAddress = "";
      b = 0;
      p = 0;
    } else {
      let disp = parseInt(operandAddress, 16) - parseInt(locationCounter, 16);
      if (disp > 2048 || disp < -2048) {
        p = 0;
        b = 1;
      } else if (!isImmediateAddressing && !isSimpleAddressing) {
        p = 1;
        b = 0;
      }
    }
  }
  if (hasPlus) {
    e = 1;
    p = 0;
    b = 0;
  } else {
    e = 0;
  }
  // handle x
  if (operand.endsWith(",X")) {
    x = 1;
  } else {
    x = 0;
  }

  if (isSimpleAddressing) {
    n = 1;
    i = 1;
    p = 1;
    let disp = parseInt(operandAddress, 16) - parseInt(locationCounter, 16);
    if (disp > 2048 || disp < -2048) {
      p = 0;
    }
  }
  return {
    n,
    i,
    x,
    b,
    p,
    e,
  };
};

module.exports = getFlags;
