const crypto = require('crypto');

function mcHexDigest(str) {
    const hash = new Buffer(crypto.createHash('sha1').update(str).digest(), 'binary');
    // check for negative hashes
    const negative = hash.readInt8(0) < 0;
    if (negative) performTwosCompliment(hash);
    let digest = hash.toString('hex');
    // trim leading zeroes
    digest = digest.replace(/^0+/g, '');
    if (negative) digest = '-' + digest;
    return digest;

}

function performTwosCompliment(buffer) {
    let carry = true;
    let i, newByte, value;
    for (i = buffer.length - 1; i >= 0; --i) {
        value = buffer.readUInt8(i);
        newByte = ~value & 0xff;
        if (carry) {
            carry = newByte === 0xff;
            buffer.writeUInt8(newByte + 1, i);
        } else {
            buffer.writeUInt8(newByte, i);
        }
    }
}

module.exports = () => {
    // TODO
    //return mcHexDigest()
};
