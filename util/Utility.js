
// Returns a number between 1 and 10.
function randomDelay() {
    return Math.floor(Math.random() * 10) + 1;
}

module.exports = {
    randomDelay
};