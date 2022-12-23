const { locctrToHex } = require("../../utils/locctrToHex");
const { accessSymbolTable } = require("../state/accessSymbolTable");
const toObjectCode = require("../../utils/toObjectCode");

const getOperandAddressForByteOrWord = (operation, operand) => {
  let operandAddress = "";
  if (operation === "BYTE") {
    if (operand[0] === "X") {
      operandAddress = operand.slice(2, -1);
    } else if (operand[0] === "C") {
      operandAddress = operand
        .slice(2, -1)
        .split("")
        .map((c) => {
          return c.charCodeAt(0).toString(16);
        })
        .join("");
    }
  } else if (operation === "WORD") {
    const equOperations = ["+", "-", "*", "/"];
    const equOperand = operand;
    let tempOperandAddress = "";
    equOperations.forEach((operation) => {
      if (equOperand.includes(operation)) {
        const [operand1, operand2] = equOperand.split(operation);
        if (!operand1 || !operand2) {
          return;
        }
        const operand1Value = accessSymbolTable(operand1);
        const operand2Value = accessSymbolTable(operand2);

        let result;
        switch (operation) {
          case "+":
            result = locctrToHex(
              parseInt(operand1Value, 16) + parseInt(operand2Value, 16)
            );
            break;
          case "-":
            result = locctrToHex(
              parseInt(operand1Value, 16) - parseInt(operand2Value, 16)
            );

            break;
          case "*":
            result = locctrToHex(
              parseInt(operand1Value, 16) * parseInt(operand2Value, 16)
            );
            break;
          case "/":
            result = locctrToHex(
              parseInt(operand1Value, 16) / parseInt(operand2Value, 16)
            );
            break;
        }

        tempOperandAddress = result;
      }
    });
    operandAddress = tempOperandAddress;
    if (!operandAddress) {
      return "";
    }
    if (operandAddress.length < 24) {
      operandAddress = "0".repeat(24 - operandAddress.length) + operandAddress;
    }
    operandAddress = toObjectCode(operandAddress);
  }

  return operandAddress;
};

module.exports = getOperandAddressForByteOrWord;
