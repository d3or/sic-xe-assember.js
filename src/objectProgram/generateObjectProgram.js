const getProgramLength = require("./getProgramLength");
const toHex = require("../utils/toHex");
const getCsectArea = require("./getCsectArea");
const getExtDefArea = require("./getExtDefArea");
const generateTextRecords = require("./generateTextRecords");
const generateModificationRecords = require("./generateModificationRecords");
const space = " ";
const newLine = `\n`;
let textRecords = [];
const curTextRecord = {
  startAddress: "",
  length: 0,
  objectCode: "",
};

let objectProgram = "";
let programName = "";
let startAddress = "";
let modificationRecords = [];
let lengthOfLine = 0;
let locctr = 0;
let ExtRef = [];
let ExtDef = [];
let csects = [];
let csectPlaceHolder = true;

let lastLine;
let largestLocctr = 0;

let currentBlock = "DEFAULT";
let symbolTable = {};
let progBlocks;

const addSymbolTable = (symbolTable_) => {
  symbolTable = symbolTable_;
};

const addProgBlocks = (progBlocks_) => {
  progBlocks = progBlocks_;
};

const generateObjectProgram = () => {
  // Get the length of the current section / program block
  let programLength = getProgramLength(largestLocctr, progBlocks, lastLine);
  // Generate the text records
  let objectProgramTextRecords = generateTextRecords(
    textRecords,
    curTextRecord
  );
  if (!textRecords.length || textRecords[0].objectCode === "") {
    // This means that the object program is finished and there is no more text records
    return objectProgram;
  }
  // Generate the modification records
  let modificationRecords_ = generateModificationRecords(modificationRecords);
  // Generate the csect area (R records)
  let csectArea = getCsectArea(csectPlaceHolder, ExtRef);
  // Generate the ext def area (D records)
  let extDefArea = getExtDefArea(ExtDef, symbolTable, programName);
  // Get the start address
  let startAddress_ = startAddress;
  if (startAddress_ === "") {
    startAddress_ = "";
  } else {
    startAddress_ = toHex(startAddress_, 6);
  }

  let endAddress_ = "E" + startAddress_;
  if (progBlocks.length > 1) {
    endAddress_ = "";
  }
  let finProgram =
    "H" +
    programName +
    space +
    toHex(startAddress_, 6) +
    programLength +
    newLine +
    extDefArea +
    csectArea +
    objectProgramTextRecords +
    modificationRecords_ +
    newLine +
    endAddress_;
  csectPlaceHolder = false;

  // clear all the global variables
  clearGlobalVariables();

  // Add the object program to the object program string
  objectProgram += finProgram + newLine + newLine;

  return objectProgram;
};

const clearGlobalVariables = () => {
  // clear all the global variables for the next program block
  textRecords = [];
  curTextRecord.startAddress = "";
  curTextRecord.length = 0;
  curTextRecord.objectCode = "";
  lengthOfLine = 0;
  locctr = 0;
  modificationRecords = [];
  ExtRef = [];
  ExtDef = [];
  largestLocctr = 0;
};

const addObjectProgramTextRecord = (line) => {
  if (line.operation != "END" && line.operation != "CSECT") {
    lastLine = line;
  }
  if (line.operation === "START") {
    startAddress = line.locationCounter;
    programName = line.symbol;
  }

  if (line.operation === "CSECT") {
    generateObjectProgram();
    startAddress = "";
    programName = line.symbol;
    csects.push(line.symbol);
  }

  if (line.operation === "USE") {
    if (line.operand) {
      currentBlock = line.operand;
    } else {
      currentBlock = "DEFAULT";
    }

    // finish current text record
    textRecords.push(JSON.parse(JSON.stringify(curTextRecord)));

    // start new text record
    curTextRecord.startAddress = toHex(
      parseInt(
        progBlocks.find((progBlock) => progBlock.name === currentBlock)
          .startingAddress,
        16
      ) + parseInt(line.locationCounter, 16),
      4
    );
    curTextRecord.length = 0;
    curTextRecord.objectCode = "";
  }

  if (line.operation === "EXTREF") {
    ExtRef.push(...line.operand.split(","));
  }

  if (line.operation === "EXTDEF") {
    ExtDef.push(...line.operand.split(","));
  }

  if (!line.operation || line.symbol === "." || !line.locationCounter) {
    return;
  }

  updateCurTextRecord(line);
};

const updateCurTextRecord = (line) => {
  let length = line?.objectCode?.length;
  if (!length) {
    length = 0;
  }

  // if the opreation is RESW or RESB then we need to start a new text record
  if (line.operation === "RESW" || line.operation === "RESB") {
    textRecords.push(JSON.parse(JSON.stringify(curTextRecord)));

    // start new text record
    curTextRecord.startAddress = "";
    curTextRecord.length = 0;
    curTextRecord.objectCode = "";
    return;
  }

  let objectCode = line?.objectCode;
  if (!objectCode) {
    objectCode = "";
  }

  if (largestLocctr < parseInt(line.locationCounter, 16)) {
    largestLocctr = parseInt(line.locationCounter, 16);
  }

  if (
    lengthOfLine + length > 60 ||
    parseInt(line.locationCounter, 16) - locctr > 5
  ) {
    textRecords.push(JSON.parse(JSON.stringify(curTextRecord)));
    curTextRecord.startAddress = line.locationCounter;
    curTextRecord.length = length;
    curTextRecord.objectCode = objectCode;
    lengthOfLine = length;
  } else {
    if (!curTextRecord.startAddress) {
      curTextRecord.startAddress = line.locationCounter;
    }

    curTextRecord.length += length;
    curTextRecord.objectCode += objectCode;
    lengthOfLine += length;
  }

  locctr = parseInt(line.locationCounter, 16);
};

const addModificationRecord = (line) => {
  if (line.operation === "EXTREF" || line.operation === "EXTDEF") {
    return;
  }

  if (line?.operand && line.operand?.includes(",")) {
    const operands = line.operand.split(",");
    if (operands.length > 2) {
      for (let i = 0; i < operands.length; i++) {
        const operand = operands[i];
        if (ExtRef.includes(operand)) {
          modificationRecords.push({
            startAddress: parseInt(line.locationCounter, 16) + 1,
            // Length of the address field to be modified, in half- bytes (hexadecimal)
            length: 6,
            csect: "+" + operand,
          });
          return;
        }
      }
    }
  }

  const equOperations = ["+", "-", "*", "/"];
  const equOperand = line.operand;

  if (equOperand) {
    for (let i = 0; i < equOperations.length; i++) {
      operation = equOperations[i];
      if (equOperand.includes(operation)) {
        const [operand1, operand2] = equOperand.split(operation);

        if (ExtRef.includes(operand1)) {
          modificationRecords.push({
            startAddress: parseInt(line.locationCounter, 16),
            csect: "+" + operand1,
            length: line.objectCode.length,
          });
        }
        if (ExtRef.includes(operand2)) {
          modificationRecords.push({
            startAddress: parseInt(line.locationCounter, 16),
            csect: operation + operand2,
            length: line.objectCode.length,
          });
        }

        if (operand1 || operand2) {
          return;
        }
      }
    }
  }

  if (ExtRef.includes(line?.operand?.split(",")[0])) {
    modificationRecords.push({
      startAddress: parseInt(line.locationCounter, 16) + 1,
      csect: "+" + line.operand.split(",")[0],
    });
    return;
  }

  if (
    line.operation.includes("+") &&
    !(line?.operand && line.operand?.includes("#"))
  ) {
    modificationRecords.push({
      startAddress: parseInt(line.locationCounter, 16) + 1,
      csect: "",
    });
  }
};

const runCleanUp = () => {
  clearGlobalVariables();

  objectProgram = "";
  textRecords = [];

  modificationRecords = [];
  symbolTable = [];
  progBlocks = [];
  ExtRef = [];
  ExtDef = [];
  csects = [];
  csectPlaceHolder = [];
  lastLine = "";
  largestLocctr = 0;
  currentBlock = "DEFAULT";
  symbolTable = {};
  progBlocks = {};
};

module.exports = {
  generateObjectProgram,
  addObjectProgramTextRecord,
  addModificationRecord,
  addSymbolTable,
  addProgBlocks,
  runCleanUp,
};
