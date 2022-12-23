const locctrToHex = (counter) => {
  return counter.toString(16).padStart(4, "0").toUpperCase();
};

module.exports = {
  locctrToHex,
};
