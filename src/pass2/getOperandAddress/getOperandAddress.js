const { accessSymbolTable } = require("../state/accessSymbolTable");

const { REGISTERS, REGISETERS_TABLE } = require("../../constants");

const getOperandAddress = (operand, locationCounter) => {
  const regExp = new RegExp("^[#|@|*]", "g");
  const isIndirectAddressing = regExp.test(operand);
  const isImmediateAddressing = operand[0] === "#";
  const isSimpleAddressing = operand[0] === "=";
  const isBaseRelative = operand[0] === "@";
  const isDirectAddressing = !isIndirectAddressing && !isImmediateAddressing;

  // if the operand is a register, like "A,"B", then its format is 2
  // Check if the operand is a register in the format "A,B"
  const isRegister =
    REGISTERS.includes(operand.split("")[0]) &&
    operand.split("")[1] === "," &&
    operand.split(",").length === 2 &&
    REGISTERS.includes(operand.split(",")[1]);
  let operandAddress;
  let format;
  let r1, r2;

  if (isSimpleAddressing) {
    operandAddress = accessSymbolTable(operand);
    format = 3;
  } else if (operand.length === 1 && REGISTERS.includes(operand)) {
    operandAddress = operand;
    format = 2;
    r1 = REGISETERS_TABLE[operand];
  } else if (isRegister) {
    operandAddress = operand;
    format = 2;
    r1 = REGISETERS_TABLE[operand.split(",")[0]];
    r2 = REGISETERS_TABLE[operand.split(",")[1]];
  } else if (isDirectAddressing) {
    if (operand.includes(",")) {
      operand = operand.split(",")[0];
    }
    operandAddress = accessSymbolTable(operand);

    format = 3;
  } else if (isImmediateAddressing) {
    operandAddress = operand.slice(1);
    format = 3;
  } else if (isIndirectAddressing) {
    if (operand.includes(",")) {
      operand = operand.split(",")[0];
    }
    operandAddress = accessSymbolTable(operand.slice(1));
    format = 3;
  } else if (isBaseRelative) {
    operandAddress = accessSymbolTable(operand.slice(1));
    format = 3;
  }

  if (operand[0] === "*") {
    // if the operand is *, replace it with the location counter
    // if its *-3, that means the location counter of 3 bytes before
    // if its *+3, that means the location counter of 3 bytes after

    let sign = operand[1];
    let value = operand.split(sign)[1];

    if (sign === "+") {
      operandAddress = parseInt(locationCounter, 16) + parseInt(value, 10) + 3;
      operandAddress = operandAddress.toString(16).toUpperCase();
      // pad the operand address with 0s
      if (operandAddress.length < 4) {
        operandAddress = "0".repeat(4 - operandAddress.length) + operandAddress;
      }

      operandAddress = operandAddress.slice(0, 4);
    } else if (sign === "-") {
      operandAddress = parseInt(locationCounter, 16) - parseInt(value, 10) + 3;
      operandAddress = operandAddress.toString(16).toUpperCase();
      // pad the operand address with 0s
      if (operandAddress.length < 4) {
        operandAddress = "0".repeat(4 - operandAddress.length) + operandAddress;
      }
      operandAddress = operandAddress.slice(0, 4);
    } else {
      operandAddress = locationCounter + 3;
    }
  }

  return {
    operandAddress,
    format,
    r1,
    r2,
  };
};

module.exports = getOperandAddress;
