const newLine = `\n`;

const getCsectArea = (csectPlaceHolder, ExtRef) => {
  if (!ExtRef.length) {
    return "";
  }
  let csectArea = "";
  if (ExtRef.length) {
    csectArea = csectPlaceHolder ? ExtRef.join(" ") : ExtRef.join("");
    csectArea = "R" + csectArea + newLine;
  }
  return csectArea;
};

module.exports = getCsectArea;
