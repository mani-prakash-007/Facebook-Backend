const generateRandomNumber = (min = 3000, max = 5000) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Example usage
module.exports = { generateRandomNumber };
