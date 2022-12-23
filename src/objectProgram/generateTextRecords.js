const toHex = require("../utils/toHex");

const newLine = `\n`;
const generateTextRecords = (textRecords, curTextRecord) => {
  // add last text record
  textRecords.push(curTextRecord);

  return textRecords
    .map((record) => {
      if (record.objectCode === "" || record.objectCode === undefined) {
        return "";
      }
      return `T${toHex(record.startAddress, 6)}${toHex(record.length / 2, 2)}${
        record.objectCode
      }`;
    })
    .filter((record) => record !== "")
    .join(newLine);
};

module.exports = generateTextRecords;
