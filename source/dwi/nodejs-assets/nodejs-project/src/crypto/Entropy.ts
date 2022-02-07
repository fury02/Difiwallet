const crypto = require('crypto');

class Entropy {
  public getRandomBytes(count: number): Uint8Array{
    let rb = crypto.randomBytes(count);
    return rb;
  }
}
export default Entropy;
