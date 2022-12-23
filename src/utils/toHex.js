const toHex = (num, length = 4) => {
  let hex = num.toString(16).toUpperCase();

  // pad hex to be length of 4
  if (hex.length < length) {
    hex = "0".repeat(length - hex.length) + hex;
  }

  hex = hex.slice(0, length);

  return hex.toUpperCase();
};

module.exports = toHex;
