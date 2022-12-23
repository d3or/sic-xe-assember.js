const convertHexToBinary = (hex, length, base = 16) => {
  // deep copy to avoid changing the original hex
  hex = JSON.parse(JSON.stringify(hex));
  hex = parseInt(hex, base).toString(2);
  if (hex.length < length) {
    hex = "0".repeat(length - hex.length) + hex;
  }
  hex = hex.slice(0, length);
  return hex;
};

module.exports = convertHexToBinary;
