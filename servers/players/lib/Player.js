module.exports = class {
  constructor(input) {
    this.id = input.id || null;
    this.lastUpdated = input.lastUpdated || new Date();
  }
};
