const convertOperationCode = (operationCode) => {
  operationCode = parseInt(operationCode, 16).toString(2);
  if (operationCode.length < 8) {
    operationCode = "0".repeat(8 - operationCode.length) + operationCode;
  }
  operationCode = operationCode.slice(0, 6);
  return operationCode;
};

module.exports = convertOperationCode;
