// for every file in the input folder, run the assembler
const fs = require("fs");
const path = require("path");
const { parseFile } = require("./src/fileManager/fileParser");
const {
  writeSolFile,
  writeProgFile,
} = require("./src/fileManager/fileManager");
const { createSymbolTable } = require("./src/pass1/createSymbolTable");
const generateObjectCode = require("./src/pass2/generateObjectCode");
const {
  generateObjectProgram,
  runCleanUp,
} = require("./src/objectProgram/generateObjectProgram");

const {
  addSymbolTable,
  addProgBlocks,
} = require("./src/objectProgram/generateObjectProgram");

let FILE_NAME = "macros";

const start = () => {
  const parsedLines = parseFile(`./input/${FILE_NAME}.txt`);

  const { symbolTable, parsedLinesWithLocationCounters, progBlocks } =
    createSymbolTable(parsedLines);

  addSymbolTable(symbolTable);
  addProgBlocks(progBlocks);
  const { parsedlines } = generateObjectCode(
    parsedLinesWithLocationCounters,
    symbolTable,
    progBlocks
  );

  writeSolFile(`./output/${FILE_NAME}_sol.txt`, parsedlines);
  const res = generateObjectProgram(parsedlines);
  runCleanUp();
  console.log(res);
  writeProgFile(`./output/${FILE_NAME}_obj.txt`, res);
};

const dir = "./input";
const files = fs.readdirSync(dir);
for (const file of files) {
  FILE_NAME = path.parse(file).name;
  start();
}
