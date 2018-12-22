const Future = require("fibers/future");
const compare = require("resemblejs").compare;

module.exports.Image = class Image {
  constructor(name, buffer) {
    this.name = name;
    this.buffer = buffer;
  }

  toString() {
    return `Image<${this.name}>`;
  }

  serialize() {
    return [this.name, this.buffer];
  }

  compare(other) {
    if (this.name !== other.name) return false;
    if (Buffer.compare(this.buffer, other.buffer) === 0) return true;

    const threshold = 5;
    const diff = Future.fromPromise(
      new Promise((resolve, reject) => {
        compare(this.buffer, other.buffer, (err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      })
    ).wait();

    const r = diff.isSameDimensions && diff.rawMisMatchPercentage < threshold;

    if (!r) console.log(this.name, diff);
    return r;
  }
};
