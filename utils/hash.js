export const generateHash = () => {
  const seed = new Uint8Array(8);
  return (window.crypto || window.msCrypto)
    .getRandomValues(seed)
    .reduce((currentHash, value) => {
      const nextHash = `${currentHash}${value.toString(16)}`;
      return nextHash;
    }, "");
};
