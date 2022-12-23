const toHex = require("../utils/toHex");

const newLine = `\n`;
const generateModificationRecords = (modificationRecords) => {
  if (modificationRecords.length === 0) {
    return "";
  }
  return (
    newLine +
    modificationRecords
      .map((record) => {
        let csect = record.csect;
        let additionalCsect = "";
        if (csect) {
          additionalCsect = csect;
        }

        // LENGTH OF THE ADDRESS FIELD TO BE MODIFIED, IN HALF-BYTES (HEXADECIMAL)
        let length = 5;
        if (record.length) {
          length = record.length;
        }

        return `M${toHex(record.startAddress, 6)}${toHex(
          length,
          2
        )}${additionalCsect}`;
      })
      .join(newLine)
  );
};

module.exports = generateModificationRecords;
