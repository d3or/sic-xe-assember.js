const convertHexToBinary = require("../../utils/convertHexToBinary");
const toObjectCode = require("../../utils/toObjectCode");

const handleFormatV2 = (operationCode, r1, r2) => {
  operationCode = convertHexToBinary(operationCode, 8);
  //convert r1 and r2 to 4 bits
  r1 = convertHexToBinary(r1, 4);

  if (!r2) {
    r2 = "0000";
  } else {
    r2 = convertHexToBinary(r2, 4);
  }
  return toObjectCode(operationCode + r1 + r2);
};

module.exports = handleFormatV2;
