const toHex = require("../utils/toHex");

const newLine = `\n`;
const getExtDefArea = (ExtDef, symbolTable, programName) => {
  let extDefArea = ExtDef.map((extDef) => {
    return (
      extDef +
      toHex(
        parseInt(symbolTable[programName.replace("H", "")][extDef].address, 16),
        6
      )
    );
  });
  if (!extDefArea.length) {
    extDefArea = "";
  } else {
    extDefArea = "D" + extDefArea.join("") + newLine;
  }

  return extDefArea;
};

module.exports = getExtDefArea;
