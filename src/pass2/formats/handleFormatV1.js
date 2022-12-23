const convertHexToBinary = require("../../utils/convertHexToBinary");
const toObjectCode = require("../../utils/toObjectCode");

const handleFormatV1 = (operationCode) => {
  operationCode = convertHexToBinary(operationCode, 8);
  return toObjectCode(operationCode);
};

module.exports = handleFormatV1;
