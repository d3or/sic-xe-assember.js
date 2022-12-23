const { accessSymbolTable } = require("./../state/accessSymbolTable");
const convertHexToBinary = require("../../utils/convertHexToBinary");
const convertOperationCode = require("../../utils/convertOperationCode");
const { getBase } = require("../state/programState");
const toObjectCode = require("./../../utils/toObjectCode");

const handleFormatV3 = (
  operationCode,
  n,
  i,
  x,
  b,
  p,
  e,
  operandAddress,
  programCounter
) => {
  // convert operatonCode to 8 bits, take the first 6 bits
  operationCode = convertOperationCode(operationCode);

  if (p === 1 && b === 0 && i === 1 && n === 0) {
    if (isNaN(operandAddress)) {
      operandAddress = accessSymbolTable(operandAddress);
      disp = parseInt(operandAddress, 16) - programCounter - 3;
      disp = convertHexToBinary(disp, 12, 10);

      return toObjectCode(operationCode + n + i + x + b + p + e + disp);
    }

    if (operandAddress > 4095) {
      operandAddress = convertBinarytoObjectCode(operandAddress, 20, 10);
      return toObjectCode(
        operationCode + n + i + x + b + p + e + operandAddress
      );
    }

    operandAddress = convertHexToBinary(operandAddress, 12, 16);
    p = 0;
    return toObjectCode(operationCode + n + i + x + b + p + e + operandAddress);
  } else if (p === 0 && b === 1 && i === 1 && n === 0) {
    operandAddress = convertHexToBinary(operandAddress, 20, 16);
    return toObjectCode(operationCode + n + i + x + b + p + e + operandAddress);
  } else if (p === 0 && b === 0 && i === 1 && n === 0 && e === 0) {
    let disp =
      parseInt(operandAddress, 16) - parseInt(programCounter, 16) - 4096 - 3;

    // convert disp to 12 bits
    disp = disp.toString(2);
    if (disp.length < 12) {
      disp = "0".repeat(12 - disp.length) + disp;
    }

    return toObjectCode(operationCode + n + i + x + b + p + e + disp);
  } else if (p === 0 && b === 0 && i === 1 && n === 0 && e === 1) {
    if (isNaN(operandAddress)) {
      operandAddress = accessSymbolTable(operandAddress);

      operandAddress = convertHexToBinary(operandAddress, 20, 16);
    } else {
      operandAddress = convertHexToBinary(operandAddress, 20, 10);
    }

    return toObjectCode(operationCode + n + i + x + b + p + e + operandAddress);
  } else if (p === 1 && b === 0 && i === 0 && n === 1) {
    let disp = parseInt(operandAddress, 16) - parseInt(programCounter, 16) - 3;

    // convert disp to 12 bits
    disp = disp.toString(2);
    if (disp.length < 12) {
      disp = "0".repeat(12 - disp.length) + disp;
    }

    return toObjectCode(operationCode + n + i + x + b + p + e + disp);
  } else if (p === 0 && b === 1 && i === 0 && n === 1) {
    // base relative addressing, operandAddress is the address of the value
    // the target address is used as the address of the operand value.

    // TA = BASE + displacement
    // convert operandAddress to 12 bits

    let disp = parseInt(operandAddress, 16) - parseInt(getBase(), 16);

    if (disp < 0) {
      disp = 4096 + disp;
    }
    // convert disp to 12 bits
    disp = disp.toString(2);

    return toObjectCode(operationCode + n + i + x + b + p + e + disp);
  } else if (p === 0 && b === 0 && i === 0 && n === 1) {
    let disp =
      parseInt(operandAddress, 16) - parseInt(programCounter, 16) - 4096 - 3;

    // convert disp to 12 bits
    disp = disp.toString(2);
    if (disp.length < 12) {
      disp = "0".repeat(12 - disp.length) + disp;
    }

    return toObjectCode(operationCode + n + i + x + b + p + e + disp);
  } else if (p === 1 && b === 0 && i === 1 && n === 1) {
    let disp = parseInt(operandAddress, 16) - parseInt(programCounter, 16) - 3;

    if (disp < 0) {
      // 2's complement
      disp = 4096 + disp;
    }
    // convert disp to 12 bits
    disp = disp.toString(2);
    if (disp.length < 12) {
      disp = "0".repeat(12 - disp.length) + disp;
    }

    disp = disp.slice(0, 12); // only include the first 8 digits

    return toObjectCode(operationCode + n + i + x + b + p + e + disp);
  } else if (p === 0 && b === 1 && i === 1 && n === 1) {
    if (x === 1) {
      // (PC) + disp + X
      let disp = parseInt(operandAddress, 16) - parseInt(getBase(), 16);
      if (disp < 0) {
        // 2's complement
        disp = 4096 + disp;
      }
      // convert disp to 12 bits
      disp = disp.toString(2);
      if (disp.length < 12) {
        disp = "0".repeat(12 - disp.length) + disp;
      }

      return toObjectCode(operationCode + n + i + x + b + p + e + disp);
    }
    // (B) + disp

    let disp = parseInt(operandAddress, 16) - parseInt(getBase(), 16);
    if (disp < 0) {
      disp = 4096 + disp;
    }
    // convert disp to 20 bits
    disp = disp.toString(2);
    if (disp.length < 12) {
      disp = "0".repeat(12 - disp.length) + disp;
    }

    return toObjectCode(operationCode + n + i + x + b + p + e + disp);
  } else if (p === 0 && b === 0 && i === 1 && n === 1 && e === 1) {
    operandAddress = convertHexToBinary(operandAddress, 20);
    return toObjectCode(operationCode + n + i + x + b + p + e + operandAddress);
  } else if (p === 0 && b === 0 && i === 1 && n === 1 && e === 0) {
    if (operandAddress === "0") {
      return toObjectCode(operationCode + n + i + x + b + p + e) + "000";
    }

    let disp =
      parseInt(operandAddress, 16) - parseInt(programCounter, 16) - 4096 - 3;

    // convert disp to 12 bits
    disp = disp.toString(2);
    if (disp.length < 12) {
      disp = "0".repeat(12 - disp.length) + disp;
    }

    return toObjectCode(operationCode + n + i + x + b + p + e + disp);
  } else {
    // direct addressing, operandAddress is the address of the value
    // the target address is used as the address of the operand value.
    return "000000";
  }
};

module.exports = handleFormatV3;
