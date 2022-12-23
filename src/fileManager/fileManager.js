const fs = require("fs");

const readFile = (path) => {
  console.log("Reading file...", path);
  // print current working directory
  console.log("Current working directory:", process.cwd());

  // read file
  const data = fs.readFileSync(path, "utf8");
  return data;
};

const writeSolFile = (path, data) => {
  console.log("Writing file...", path);

  // iterate through data and add new line to each line. seperate each item key in
  // data with a tab
  const formattedData = data
    .map((item) => {
      let line = "";
      // format is
      // location symbol operation operand objectCode comment
      line +=
        parseWord(item, "locationCounter") +
        "\t" +
        parseWord(item, "symbol") +
        "\t" +
        parseWord(item, "operation") +
        "\t" +
        parseWord(item, "operand") +
        "\t" +
        parseWord(item, "objectCode") +
        "\t" +
        parseWord(item, "comment");
      return line;
    })
    .join("\r");

  fs.writeFileSync(path, formattedData);
};

const writeProgFile = (path, data) => {
  console.log("Writing file...", path);

  // just write the data to the file
  fs.writeFileSync(path, data);
};

const parseWord = (data, word) => {
  if (data[word]) {
    return data[word];
  } else {
    return "";
  }
};

module.exports = {
  readFile,
  writeSolFile,
  writeProgFile,
};
