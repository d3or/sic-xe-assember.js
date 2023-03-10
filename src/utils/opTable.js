// Mnemonic     Format  Opcode  Effect                           Notes
// -----------  ------  ------  -------------------------------  -----
// ADD m          3/4     18    A ← (A) + (m..m+2)
// ADDF m         3/4     58    F ← (F) + (m..m+5)                  F
// ADDR r1,r2      2      90    r2 ← (r2) + (r1)
// AND m          3/4     40    A ← (A) & (m..m+2)
// CLEAR r1        2       4    r1 ← 0
// COMP m         3/4     28    A : (m..m+2)                       C
// COMPF m        3/4     88    F : (m..m+5)                       CF
// COMPR r1,r2     2      A0    (r1) : (r2)                        C
// DIV m          3/4     24    A : (A) / (m..m+2)
// DIVF m         3/4     64    F : (F) / (m..m+5)                  F
// DIVR r1,r2      2      9C    (r2) ← (r2) / (r1)
// FIX             1      C4    A ← (F) [convert to integer]
// FLOAT           1      C0    F ← (A) [convert to floating]       F
// HIO             1      F4    Halt I/O channel number (A)       P
// J m            3/4     3C    PC ← m
// JEQ m          3/4     30    PC ← m if CC set to =
// JGT m          3/4     34    PC ← m if CC set to >
// JLT m          3/4     38    PC ← m if CC set to <
// JSUB m         3/4     48    L ← (PC); PC ← m<
// LDA m          3/4     00    A ← (m..m+2)
// LDB m          3/4     68    B ← (m..m+2)
// LDCH m         3/4     50    A [rightmost byte] ← (m)
// LDF m          3/4     70    F ← (m..m+5)                        F
// LDL m          3/4     08    L ← (m..m+2)
// LDS m          3/4     6C    S ← (m..m+2)
// LDT m          3/4     74    T ← (m..m+2)
// LDX m          3/4     04    X ← (m..m+2)
// LPS m          3/4     D0    Load processor status from        P
//                                information beginning at
//                                address m (see Section 6.2.1)
//                                6.2.1)
// MUL m          3/4     20    A ← (A) * (m..m+2)
// MULF m         3/4     60    F ← (F) * (m..m+5)
// MULR r1,r2      2      98    r2 ← (r2) * (r1)
// NORM            1      C8    F ← (F) [normalized]                F
// OR m           3/4     44    A ← (A) | (m..m+2)
// RD m           3/4     D8    A [rightmost byte] ← data         P
//                                from device specified by (m)
// RMO r1,r2       2      AC    r2 ← (r1)
// RSUB           3/4     4C    PC ← (L)
// SHIFTL r1,n     2      A4    r1 ← (r1); left circular
//                                shift n bits. [for assembled
//                                instruction, r2 is n-1]
// SHIFTR r1,n     2      A8    r1 ← (r1); right shift n bits
//                                with vacated bit positions
//                                set equal to leftmost
//                                bit of (r1) [for assembled1101100
//                                instruction, r2 is n-1]
// SIO             1      F0    Start I/O channel number (A);     P
//                                address of channel program
//                                is given by (S)
// SSK m          3/4     EC    Protection key for address m      P
//                                ← (A) (see Section 6.2.4)
// STA m          3/4     0C    m..m+2 ← (A)
// STB m          3/4     78    m..m+2 ← (B)
// STCH m         3/4     54    m ← (A) [rightmost byte]
// STF m          3/4     80    m..m+5 ← (F)                        F
// STI m          3/4     D4    Interval timer value ←            P
//                                (m..m+2) (see Section 6.2.1)
// STL m          3/4     14    m..m+2 ← (L)
// STS m          3/4     7C    m..m+2 ← (S)
// STSW m         3/4     E8    m..m+2 ← (SW)                     P
// STT m          3/4     84    m..m+2 ← (T)
// STX m          3/4     10    m..m+2 ← (X)
// SUB m          3/4     1C    A ← (A) - (m..m+2)
// SUBF m         3/4     5C    F ← (F) - (m..m+5)                  F
// SUBR r1,r2      2      94    r2 ← (r2) - (r1)
// SVC n           2      B0    Generate SVC interrupt. {for
//                                assembled instruction, r1 is n]
// TD m           3/4     E0    Test device specified by (m)      PC
// TIO             1      F8    Test I/O channel number (A)       PC
// TIX m          3/4     2C    X ← (X) + 1; (X) : (m..m+2)        C
// TIXR r1         2      B8    X ← (X) + 1; (X) : (r1)            C
// WD m           3/4     DC    Device specified by (m) ← (A)     P
//                                [rightmost byte to device
//                                 specified by m]

const OperationTable = {
  ADD: {
    format: 3,
    opcode: "18",
  },

  ADDF: {
    format: 3,
    opcode: "58",
  },

  ADDR: {
    format: 2,
    opcode: "90",
  },

  AND: {
    format: 3,
    opcode: "40",
  },

  CLEAR: {
    format: 2,
    opcode: "B4",
  },

  COMP: {
    format: 3,
    opcode: "28",
  },

  COMPF: {
    format: 3,
    opcode: "88",
  },

  COMPR: {
    format: 2,
    opcode: "A0",
  },

  DIV: {
    format: 3,
    opcode: "24",
  },

  DIVF: {
    format: 3,
    opcode: "64",
  },

  DIVR: {
    format: 2,
    opcode: "9C",
  },

  FIX: {
    format: 1,
    opcode: "C4",
  },

  FLOAT: {
    format: 1,
    opcode: "C0",
  },

  HIO: {
    format: 1,
    opcode: "F4",
  },

  J: {
    format: 3,
    opcode: "3C",
  },

  JEQ: {
    format: 3,
    opcode: "30",
  },

  JGT: {
    format: 3,
    opcode: "34",
  },

  JLT: {
    format: 3,
    opcode: "38",
  },

  JSUB: {
    format: 3,
    opcode: "48",
  },

  LDA: {
    format: 3,
    opcode: "00",
  },

  LDB: {
    format: 3,
    opcode: "68",
  },

  LDCH: {
    format: 3,
    opcode: "50",
  },

  LDF: {
    format: 3,
    opcode: "70",
  },

  LDL: {
    format: 3,
    opcode: "08",
  },

  LDS: {
    format: 3,
    opcode: "6C",
  },

  LDT: {
    format: 3,
    opcode: "74",
  },

  LDX: {
    format: 3,
    opcode: "04",
  },

  LPS: {
    format: 3,
    opcode: "D0",
  },

  MUL: {
    format: 3,
    opcode: "20",
  },

  MULF: {
    format: 3,
    opcode: "60",
  },

  MULR: {
    format: 2,
    opcode: "98",
  },

  NORM: {
    format: 1,
    opcode: "C8",
  },

  OR: {
    format: 3,
    opcode: "44",
  },

  RD: {
    format: 3,
    opcode: "D8",
  },

  RMO: {
    format: 2,
    opcode: "AC",
  },

  RSUB: {
    format: 3,
    opcode: "4C",
  },

  SHIFTL: {
    format: 2,
    opcode: "A4",
  },

  SHIFTR: {
    format: 2,
    opcode: "A8",
  },

  SIO: {
    format: 1,
    opcode: "F0",
  },

  SSK: {
    format: 3,
    opcode: "EC",
  },

  STA: {
    format: 3,
    opcode: "0C",
  },

  STB: {
    format: 3,
    opcode: "78",
  },

  STCH: {
    format: 3,
    opcode: "54",
  },

  STF: {
    format: 3,
    opcode: "80",
  },

  STI: {
    format: 3,
    opcode: "D4",
  },

  STL: {
    format: 3,
    opcode: "14",
  },

  STS: {
    format: 3,
    opcode: "7C",
  },

  STSW: {
    format: 3,
    opcode: "E8",
  },

  STT: {
    format: 3,
    opcode: "84",
  },

  STX: {
    format: 3,
    opcode: "10",
  },

  SUB: {
    format: 3,
    opcode: "1C",
  },

  SUBF: {
    format: 3,
    opcode: "5C",
  },
  SUBR: {
    format: 2,
    opcode: "94",
  },
  SVC: {
    format: 2,
    opcode: "B0",
  },
  TD: {
    format: 3,
    opcode: "E0",
  },
  TIO: {
    format: 1,
    opcode: "F8",
  },
  TIX: {
    format: 3,
    opcode: "2C",
  },
  TIXR: {
    format: 2,
    opcode: "B8",
  },
  WD: {
    format: 3,
    opcode: "DC",
  },
};

const getFormatForOperation = (operation) => {
  if (operation in OperationTable) {
    return OperationTable[operation].format;
  }

  if (operation.replace("+", "") in OperationTable) {
    return OperationTable[operation.replace("+", "")].format + 1;
  }

  throw new Error("Invalid operation: " + operation);
};

const getOperationCode = (operation) => {
  if (operation in OperationTable) {
    return OperationTable[operation].opcode;
  }

  if (operation.replace("+", "") in OperationTable) {
    return OperationTable[operation.replace("+", "")].opcode;
  }

  throw new Error("Invalid operation: " + operation);
};

module.exports = {
  getFormatForOperation,
  getOperationCode,
};
