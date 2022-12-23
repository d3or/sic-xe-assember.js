const toObjectCode = (n) => {
  n = n.match(/.{1,4}/g);

  n = n.map((b) => {
    return parseInt(b, 2).toString(16);
  });

  return n.join("").toUpperCase();
};

module.exports = toObjectCode;
