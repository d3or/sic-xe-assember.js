const {
  getCurrentControlSection,
  getCurrentProgBlock,
  getProgBlocks,
} = require("./programState");

let symbolTable = {};

const addSymbolTable = (symbolTable_) => {
  symbolTable = symbolTable_;
};

const accessSymbolTable = (operand) => {
  // check if the operand is a symbol
  if (!symbolTable[getCurrentControlSection()][operand]?.address) {
    // console.log("Error: " + operand + " is not defined");
    return "";
  }

  if (
    symbolTable[getCurrentControlSection()][operand]?.block ===
      getCurrentProgBlock() ||
    symbolTable[getCurrentControlSection()][operand]?.absolute == true
  ) {
    return symbolTable[getCurrentControlSection()][operand].address;
  } else if (getProgBlocks().length > 1) {
    // if the operand is not in the current block, then we need to calculate the new address
    // the new address is the address of the operand in the current block + the base address of the current block
    // we DONT need to move it to binary etc, just add the two addresses and return the result

    // if the base address is greater than the symbol address, then we need to subtract the base address from the symbol address
    // otherwise, we need to add the base address to the symbol address

    /* The starting address for D A T A is 0066. Thus the desired target address for this instruction is 0003 + 0066 = 0069. The instruction is to be assembled using program-counter relative ad- dressing. When the instruction is executed, the program counter contains the address of the following instruction (line 25). The address of this instruction is relative location 0009 within the default block. Since the default block starts at location 0000, this address is simply 0009. Thus the required displacement is 0069- 0009 = 60. The calculation of the other addresses during Pass 2 follows a similar pattern.
     */

    let baseAddress =
      getProgBlocks()[symbolTable[getCurrentControlSection()][operand].block]
        .startingAddress;

    let disp =
      parseInt(baseAddress, 16) +
      parseInt(symbolTable[getCurrentControlSection()][operand].address, 16);

    disp = disp.toString(16);
    if (disp.length < 4) {
      disp = "0".repeat(4 - disp.length) + disp;
    }

    return disp;
  } else {
    console.log("symbol is not in the current block", operand, getProgBlocks());
    // process.exit();
    return "";
  }
};

module.exports = {
  accessSymbolTable,
  addSymbolTable,
};
