const DIRECTIVES_TO_SKIP = [
  "RESW",
  "RESB",
  "WORD",
  "EQU",
  "LTORG",
  "END",
  "EXTREF",
  "EXTDEF",
  "MACRO",
  "MEND",
];

const REGISTERS = ["A", "X", "L", "B", "S", "T", "F"];
const REGISETERS_TABLE = {
  A: 0,
  X: 1,
  L: 2,
  B: 3,
  S: 4,
  T: 5,
  F: 6,
};

module.exports = {
  DIRECTIVES_TO_SKIP,
  REGISTERS,
  REGISETERS_TABLE,
};
