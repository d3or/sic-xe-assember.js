const { readFile } = require("./fileManager");

const parseFile = (file) => {
  const content = readFile(file);

  // split lines by new line character
  // EITHER
  const lines = content.split("\r");

  // split each line by tab character and create an object that contains symbol, operation, operand, comment and line number
  const parsedLines = lines.map((line, index) => {
    if (line.includes("\n")) {
      line = line.replace("\n", "");
    }
    let [symbol, operation, operand, comment] = line.split("\t");
    // dont include lines that dont have an operation

    return {
      lineNumber: index + 1,
      symbol,
      operation,
      operand,
      comment,
    };
  });

  // remove null values
  const filteredParsedLines = parsedLines.filter((line) => line !== null);

  return filteredParsedLines;
};

const parseObjectCodeFile = (file) => {
  const content = readFile(file);

  // split lines by new line character
  const lines = content.split("\r\n");

  // split each line by tab character and create an object that contains symbol, operation, operand, comment and line number
  const parsedLines = lines.map((line, index) => {
    let [symbol, operation, operand, objectCode, comment] = line.split("\t");
    // dont include lines that dont have an operation
    if (!operation) {
      return null;
    }
    if (symbol === ".") {
      return null;
    }
    if (operation === ".") {
      return null;
    }
    return {
      lineNumber: index + 1,
      symbol,
      operation,
      operand,
      objectCode,
      comment,
    };
  });

  // remove null values
  const filteredParsedLines = parsedLines.filter((line) => line !== null);

  return filteredParsedLines;
};

module.exports = {
  parseFile,
  parseObjectCodeFile,
};
