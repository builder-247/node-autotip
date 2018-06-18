/* eslint-disable no-control-regex */
function getRndInteger(min, max) {
  return Math.floor(Math.random() * ((max - min) + 1)) + min;
}

function removeDashes(string) {
  return string.replace(/-/g, '');
}

function removeANSIFormatting(string) {
  return string.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
}

module.exports = {
  getRndInteger,
  removeDashes,
  removeANSIFormatting,
};
