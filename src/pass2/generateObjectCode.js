const { locctrToHex } = require("../utils/locctrToHex");
const { getOperationCode } = require("../utils/opTable");
const {
  addObjectProgramTextRecord,
  addModificationRecord,
} = require("../objectProgram/generateObjectProgram");
const getFlags = require("./getFlags");
const {
  addSymbolTable,
  accessSymbolTable,
} = require("./state/accessSymbolTable");
const {
  setCurrentControlSection,
  setCurrentProgBlock,
  setBase,
  setProgBlocks,
  getProgBlocks,
} = require("./state/programState");

const getOperandAddress = require("./getOperandAddress/getOperandAddress");

const { DIRECTIVES_TO_SKIP } = require("../constants");
const getOperandAddressForLiteral = require("./getOperandAddress/getOperandAddressForLiteral");
const getOperandAddressForByteOrWord = require("./getOperandAddress/getOperandAddressForByteOrWord");
const generateObjectCodeFromFormat = require("./generateObjectCodeFromFormat");

const generateObjectCode = (parsedlines, _symbolTable, _progBlocks) => {
  addSymbolTable(_symbolTable);
  setProgBlocks(_progBlocks);

  for (let index = 0; index < parsedlines.length; index++) {
    const { symbol, operation, operand, comment, locationCounter } =
      parsedlines[index];
    let objectCode = "";
    if (!operation || symbol[0] === ".") {
      continue;
    }

    if (operation === "START") {
      setCurrentControlSection(symbol);
      setCurrentProgBlock(0);
    } else if (operation === "BYTE" || operation === "WORD") {
      parsedlines[index].objectCode = getOperandAddressForByteOrWord(
        operation,
        operand
      );
    } else if (operation === "BASE") {
      setBase(accessSymbolTable(operand));
    } else if (operation === "CSECT") {
      setCurrentControlSection(symbol);
    } else if (operation === "USE") {
      let blockName = operand;
      if (blockName === "") {
        blockName = "DEFAULT";
      }

      setCurrentProgBlock(
        getProgBlocks().find((item) => item.name === blockName).number
      );
    } else if (operation === "MEND") {
      // remove line from parsedlines
      parsedlines.splice(index, 1);
      index--;
    } else if (operation === "LTORG") {
      parsedlines[index].locationCounter = "";
    } else if (DIRECTIVES_TO_SKIP.includes(operation)) {
      // Do nothing
    } else if (operation === "*") {
      parsedlines[index].objectCode = getOperandAddressForLiteral(
        operation,
        operand
      );
    } else {
      const operationCode = getOperationCode(operation);
      const { operandAddress, format, r1, r2 } = getOperandAddress(
        operand,
        locationCounter
      );
      const { n, i, x, b, p, e } = getFlags(
        operation,
        operand,
        operandAddress,
        format,
        locationCounter
      );

      objectCode = generateObjectCodeFromFormat(
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
        locationCounter
      );

      parsedlines[index].objectCode = objectCode;
    }

    addObjectProgramTextRecord(parsedlines[index]);
    addModificationRecord(parsedlines[index]);
  }

  // clean up global variables
  setBase(0);
  setCurrentControlSection("");
  setCurrentProgBlock(0);
  setProgBlocks([]);

  return { parsedlines };
};

module.exports = generateObjectCode;
