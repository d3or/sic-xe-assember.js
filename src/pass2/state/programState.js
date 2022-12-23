let currentControlSection;
let currentProgBlock;
let base;
let progBlocks;

const setCurrentControlSection = (csect) => {
  currentControlSection = csect;
};

const setCurrentProgBlock = (progBlock) => {
  currentProgBlock = progBlock;
};

const setBase = (baseAddress) => {
  base = baseAddress;
};

const getBase = () => {
  return base;
};

const getCurrentControlSection = () => {
  return currentControlSection;
};

const getCurrentProgBlock = () => {
  return currentProgBlock;
};

const setProgBlocks = (progBlocks_) => {
  progBlocks = progBlocks_;
};

const getProgBlocks = () => {
  return progBlocks;
};

module.exports = {
  setCurrentControlSection,
  setCurrentProgBlock,
  getCurrentControlSection,
  getCurrentProgBlock,
  setBase,
  getBase,
  setProgBlocks,
  getProgBlocks,
};
