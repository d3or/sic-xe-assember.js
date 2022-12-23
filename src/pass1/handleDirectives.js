// Directives are not operations, so they should not be in the OperationTable.

const Directives = {
  RESW: 3,
  RESB: 1,
  BYTE: 1,
  WORD: 3,

  // These are not directives, but they are used in the same way
  START: 0,
  END: 0,
  BASE: 0,
  LTORG: 0,
};

const isDirective = (operation) => {
  return Object.keys(Directives).includes(operation);
};

const getByteCountForOperation = (operation) => {
  if (isDirective(operation)) {
    return Directives[operation];
  }

  throw new Error("Operation is not a directive:" + operation);
};

module.exports = {
  isDirective,
  getByteCountForOperation,
};
