const handleFormatV1 = require("./formats/handleFormatV1");
const handleFormatV2 = require("./formats/handleFormatV2");
const handleFormatV3 = require("./formats/handleFormatV3");

const generateObjectCodeFromFormat = (
  format,
  operationCode,
  n,
  i,
  x,
  b,
  p,
  e,
  operandAddress,
  r1,
  r2,
  programCounter
) => {
  switch (format) {
    case 1:
      return handleFormatV1(operationCode);
    case 2:
      // convert operationCode to 8 bits, take the first 6 bits
      return handleFormatV2(operationCode, r1, r2);
    case 3:
      return handleFormatV3(
        operationCode,
        n,
        i,
        x,
        b,
        p,
        e,
        operandAddress,
        programCounter
      );
    case 4:
      // Handled in format v3
      return handleFormatV3(
        operationCode,
        n,
        i,
        x,
        b,
        p,
        e,
        operandAddress,
        programCounter
      );
    default:
      throw new Error("Invalid format: " + programCounter);
  }
};

module.exports = generateObjectCodeFromFormat;
