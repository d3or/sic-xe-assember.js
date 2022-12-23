const { getFormatForOperation } = require("../utils/opTable");
const { bytesOcupied } = require("../utils/bytesOccupied");
const { locctrToHex } = require("../utils/locctrToHex");
const createSymbolTable = (parsedLines) => {
  let literals = [];

  // PROG BLOCKS
  let progBlocks = [];
  let progBlockCounter = 0;
  let currentProgBlockIndex = 0;
  let currentBlockName = "";

  // CONTROL SECTION
  let currentControlSection = "";

  // MACROS
  let namTab = {};
  let defTab = {};
  let argTab = {};
  // This returns an object with the symbol table and the parsed lines with location counters
  // This is the symbol table that will be returned
  const symbolTable = {};

  // This is the location counter that will be incremented

  let locationCounter = 0;

  // This is the starting address of the program
  let startingAddress = 0;

  for (let i = 0; i < parsedLines.length; i++) {
    // if the line is not an operation or if the symbol is a dot, skip it
    if (
      !parsedLines[i].operation ||
      (parsedLines[i].symbol === "." && parsedLines[i].operation !== "END")
    ) {
      continue;
    }

    const curLocationCounter = locctrToHex(locationCounter);

    // If the symbol is not empty, add it to the symbol table
    if (parsedLines[i].symbol !== "" && i !== 0) {
      if (
        symbolTable["EXTREF"] &&
        symbolTable["EXTREF"][currentControlSection][parsedLines[i].symbol]
      ) {
        symbolTable[currentControlSection][parsedLines[i].symbol] = {
          address: locctrToHex(startingAddress),
          block: currentProgBlockIndex,
        };
      } else {
        symbolTable[currentControlSection][parsedLines[i].symbol] = {
          address: locctrToHex(curLocationCounter),
          block: currentProgBlockIndex,
        };
      }
    }

    // If the operation is a literal, add it to the literals array
    if (parsedLines[i]?.operand && parsedLines[i]?.operand[0] === "=") {
      literals.push(parsedLines[i]);
    }
    // Add the location counter to the parsed line in hex, with 4 digits
    parsedLines[i].locationCounter = locctrToHex(curLocationCounter);
    switch (parsedLines[i].operation) {
      case "START":
        currentControlSection = parsedLines[i].symbol;
        symbolTable[currentControlSection] = {};
        symbolTable[currentControlSection][parsedLines[i].symbol] = {
          address: locctrToHex(locationCounter),
          block: currentProgBlockIndex,
        };

        symbolTable["EXTREF"] = {};
        symbolTable["EXTDEF"] = {};
        symbolTable["EXTREF"][currentControlSection] = {};
        symbolTable["EXTDEF"][currentControlSection] = {};

        // If the operation is START, set the location counter to the operand
        locationCounter = parseInt(parsedLines[i].operand);
        startingAddress = locationCounter;

        progBlocks.push({
          name: "DEFAULT",
          startingAddress: locctrToHex(startingAddress),
          length: 0,
          number: 0,
        });
        currentProgBlockIndex = 0;
        currentBlockName = "DEFAULT";

        break;
      case "END":
        // If the operation is END, set the location counter to the starting address
        parsedLines[i].locationCounter = "";

        literals.forEach((literal) => {
          i += 1;

          // check if literal is already in symbol table
          if (symbolTable[currentControlSection][literal.operand]) {
            return;
          }
          // add new line to parsedLines
          parsedLines.push({
            lineNumber: i,
            symbol: "",
            operation: "*",
            operand: literal.operand,
            comment: "",
            locationCounter: locctrToHex(locationCounter),
          });

          symbolTable[currentControlSection][literal.operand] = {
            address: locctrToHex(locationCounter),
            block: currentProgBlockIndex,
          };

          locationCounter += bytesOcupied(literal.operand);
        });

        literals = [];

        // end the current block
        progBlocks.find((block) => block.name === currentBlockName)["length"] =
          locctrToHex(locationCounter);

        locationCounter = startingAddress;

        break;
      case "EXTREF":
        // If the operation is EXTDEF, set the location counter to the starting address
        locationCounter = startingAddress;
        parsedLines[i].locationCounter = locctrToHex(startingAddress);

        symbolTable["EXTREF"][currentControlSection] = {};

        parsedLines[i].operand.split(",").forEach((symbol) => {
          symbolTable["EXTREF"][currentControlSection][symbol] = {
            address: locctrToHex(startingAddress),
            block: currentProgBlockIndex,
          };
        });
        break;
      case "EXTDEF":
        // If the operation is EXTDEF, set the location counter to the starting address
        locationCounter = startingAddress;
        parsedLines[i].locationCounter = locctrToHex(startingAddress);

        symbolTable["EXTDEF"] = {};
        symbolTable["EXTDEF"][currentControlSection] = {};

        parsedLines[i].operand.split(",").forEach((symbol) => {
          symbolTable["EXTDEF"][currentControlSection][symbol] = {
            address: locctrToHex(startingAddress),
            block: currentProgBlockIndex,
          };
        });
        break;
      case "CSECT":
        // Set current control section to the symbol
        currentControlSection = parsedLines[i].symbol;
        symbolTable[currentControlSection] = {};

        // If the operation is CSECT, set the location counter to the starting address
        literals.forEach((literal) => {
          // check if literal is already in symbol table
          if (symbolTable[currentControlSection][literal.operand]) {
            return;
          }
          // add new line to parsedLines
          parsedLines.push({
            lineNumber: i,
            symbol: "",
            operation: "*",
            operand: literal.operand,
            comment: "",
            locationCounter: locctrToHex(locationCounter),
          });

          symbolTable[currentControlSection][literal.operand] = {
            address: locctrToHex(locationCounter),
            block: currentProgBlockIndex,
          };

          locationCounter += bytesOcupied(literal.operand);
        });
        locationCounter = startingAddress;
        parsedLines[i].locationCounter = locctrToHex(startingAddress);

        literals = [];

        break;
      case "USE":
        // If the operation is USE, set the location counter to the starting address
        // write code to add program block support
        /*
          during Pass 1, a separate location counter for each program block. The location counter for a block is initialized to 0 when the block is first begun. The current value of this location counter is saved when switching to another block, and the saved value is restored when resuming a previous block. Thus during Pass 1each label in the program is assigned an address that is relative to the start of the block that contains it. When labels are entered into the sym- bol table, the block name or number is stored along with the assigned relative address. At the end of Pass 1 the latest value of the location counter for each block indicates the length of that block. The assembler can then assign to each block a starting address in the object program (beginning with relative loca- tion 0).
        */

        progBlocks.find((block) => block.name === currentBlockName)["length"] =
          locctrToHex(locationCounter);

        currentBlockName = parsedLines[i].operand;

        if (currentBlockName === "") {
          currentBlockName = "DEFAULT";
        }

        // find the block with the operand name and set the location counter to its length to resume
        if (progBlocks.find((block) => block.name === currentBlockName)) {
          locationCounter = parseInt(
            progBlocks.find((block) => block.name === currentBlockName)[
              "length"
            ],
            16
          );
          currentProgBlockIndex = progBlocks.find(
            (block) => block.name === currentBlockName
          ).number;
        } else {
          // if the block does not exist, create it
          progBlockCounter += 1;
          progBlocks.push({
            name: currentBlockName,
            startingAddress: locctrToHex(locationCounter),
            length: locctrToHex(startingAddress),
            number: progBlockCounter,
          });

          currentProgBlockIndex = progBlockCounter;

          locationCounter = startingAddress;
        }

        parsedLines[i].locationCounter = locctrToHex(locationCounter);

        break;
      case "RESW":
        // If the operation is RESW, increment the location counter by 3 times the operand
        locationCounter += 3 * parseInt(parsedLines[i].operand);
        break;
      case "RESB":
        // If the operation is RESB, increment the location counter by the operand
        locationCounter += parseInt(parsedLines[i].operand);
        break;
      case "BYTE":
        if (parsedLines[i].operand[0] === "C") {
          // If the operation is BYTE and the operand starts with C, that means we need to incremenet the location counter by 3 bytes
          locationCounter += 3;
        } else if (parsedLines[i].operand[0] === "X") {
          // If the operation is BYTE and the operand starts with X, increment the location counter by 1 byte
          locationCounter += 1;
        }

        break;
      case "WORD":
        // If the operation is WORD, increment the location counter by 3
        locationCounter += 3;
        break;

      case "BASE":
        // If the operation is BASE, do nothing
        parsedLines[i].locationCounter = "";
        break;
      case "LTORG":
        // If the operation is LTORG, do nothing
        literals.forEach((literal) => {
          // check if literal is already in symbol table
          if (symbolTable[currentControlSection][literal.operand]) {
            return;
          }

          parsedLines.splice(i + 1, 0, {
            lineNumber: i,
            symbol: "",
            operation: "*",
            operand: literal.operand,
            comment: "",
            locationCounter: locctrToHex(locationCounter),
          });

          symbolTable[currentControlSection][literal.operand] = {
            address: locctrToHex(locationCounter),
            block: currentProgBlockIndex,
          };

          locationCounter += bytesOcupied(literal.operand);
          i++;
        });

        literals = [];

        break;

      case "EQU":
        const equOperations = ["+", "-", "*", "/"];
        const equOperand = parsedLines[i].operand;
        equOperations.forEach((operation) => {
          if (equOperand.includes(operation)) {
            const [operand1, operand2] = equOperand.split(operation);
            if (!operand1 || !operand2) {
              return;
            }
            const operand1Value = parsedLines.find(
              (line) => line.symbol === operand1
            ).locationCounter;
            const operand2Value = parsedLines.find(
              (line) => line.symbol === operand2
            ).locationCounter;

            let tempLocationCounter;
            switch (operation) {
              case "+":
                tempLocationCounter = locctrToHex(
                  parseInt(operand1Value, 16) + parseInt(operand2Value, 16)
                );
                break;
              case "-":
                tempLocationCounter = locctrToHex(
                  parseInt(operand1Value, 16) - parseInt(operand2Value, 16)
                );

                break;
              case "*":
                tempLocationCounter = locctrToHex(
                  parseInt(operand1Value, 16) * parseInt(operand2Value, 16)
                );
                break;
              case "/":
                tempLocationCounter = locctrToHex(
                  parseInt(operand1Value, 16) / parseInt(operand2Value, 16)
                );
                break;
            }

            symbolTable[currentControlSection][parsedLines[i].symbol] = {
              address: tempLocationCounter,
              block: currentProgBlockIndex,
              absolute: true,
            };
            parsedLines[i].locationCounter = tempLocationCounter;
          }
        });

        break;
      case "*":
        // If the operation is *, do nothing
        break;
      case "MACRO":
        // remove macro definition from parsedLines, add to defTab, add to namTab
        // from MACRO to MEND, add to defTab
        // add to namTab with name of macro and location counter
        let macroName = parsedLines[i].symbol;

        let macroStartIndex = i;
        let macroEndIndex = i;
        while (true) {
          macroEndIndex += 1;
          if (parsedLines[macroEndIndex].operation === "MEND") {
            // remove MEND from parsedLines
            break;
          }
        }

        let macroDefinition = parsedLines.splice(
          macroStartIndex,
          macroEndIndex - macroStartIndex
        );

        // remove macrodef from parsedLines

        defTab[macroName] = macroDefinition;
        namTab[macroName] = locctrToHex(locationCounter);
        argTab[macroName] = macroDefinition[0].operand.split(",");

        break;
      case "MEND":
        break;
      default:
        if (defTab[parsedLines[i].operation]) {
          // if the operation is a macro, expand it
          // add the macro definition to parsedLines

          let macroDefinition = defTab[parsedLines[i].operation];
          let macroName = parsedLines[i].operation;
          let macroOperand = parsedLines[i].operand;

          // hadle args // replace args with ?1, ?2, ?3, etc
          let args = argTab[macroName];
          let params = macroOperand.split(",");

          // add macro definition to parsedLines
          macroDefinition.forEach((line, index) => {
            // deep copy line
            line = JSON.parse(JSON.stringify(line));
            if (
              !macroDefinition[index].operation ||
              macroDefinition[index].operation === "" ||
              macroDefinition[index].symbol === "."
            ) {
              return;
            }
            if (index === 0) {
              // replace macro call with first line of macro definition
              parsedLines[i].locationCounter = "";
              parsedLines[i].symbol = "." + parsedLines[i].symbol;
              return;
            }
            if (line.operation === "MEND") {
              // remove MEND from macro definition
              i -= 1;
              return;
            }
            if (
              line.operation === "MACRO" ||
              defTab[line.operation] !== undefined ||
              defTab[line.operand] !== undefined
            ) {
              line.operation = macroName;
              line.operand = macroOperand;
              line.symbol = "";
              line.locationCounter = "";
            } else {
              line.locationCounter = locctrToHex(locationCounter);

              // if the operand is one of the args, replace it with the value of the operand

              args.forEach((arg, index) => {
                line.operand = line.operand.replace(arg, `${params[index]}`);
              });

              if (line.operand[0] === "=") {
                literals.push(line);
              }

              locationCounter += getFormatForOperation(
                macroDefinition[index].operation
              );
            }
            i += 1;

            parsedLines.splice(i, 0, line);
          });
        } else {
          // If the operation is not a directive, increment the location counter by the byte count of the operation
          locationCounter += getFormatForOperation(parsedLines[i].operation);
        }

        break;
    }
  }

  // update prog blocks to be one after another in memory

  for (let i = 0; i < progBlocks.length; i++) {
    let block = progBlocks[i];
    let nextBlock = progBlocks[i + 1];
    if (nextBlock) {
      nextBlock.startingAddress = locctrToHex(
        parseInt(block.startingAddress, 16) + parseInt(block.length, 16)
      );
    }
  }

  return {
    symbolTable,
    parsedLinesWithLocationCounters: parsedLines,
    progBlocks: progBlocks,
  };
};

module.exports = {
  createSymbolTable,
};
