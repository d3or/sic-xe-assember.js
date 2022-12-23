const {
  getOperandAddressForByteOrWord,
} = require("./getOperandAddressForByteOrWord");
const getOperandAddressForLiteral = (operation, operand) => {
  let operandAddress = "";
  if (operand[1] === "X") {
    operandAddress = operand.slice(3, -1);
  } else if (operand[1] === "C") {
    operandAddress = operand
      .slice(3, -1)
      .split("")
      .map((c) => {
        return c.charCodeAt(0).toString(16);
      })
      .join("");
  } else if (operand[1] === "=") {
    operandAddress = getOperandAddressForByteOrWord(
      operation,
      operand.slice(2)
    );
  }

  return operandAddress;
};

module.exports = getOperandAddressForLiteral;
