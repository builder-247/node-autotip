function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function randomVersion() {
    const supportedVersions = [
        "1.8.0",
        "1.8.1",
        "1.8.2",
        "1.8.3",
        "1.8.4",
        "1.8.5",
        "1.8.6",
        "1.8.7",
        "1.8.8",
        "1.8.9",
        "1.9.0",
        "1.9.1",
        "1.9.2",
        "1.9.3",
        "1.9.4",
        "1.10.0",
        "1.10.1",
        "1.10.2",
        "1.11.0",
        "1.11.1",
        "1.11.2",
        "1.12.0",
        "1.12.1",
    ];
    return supportedVersions[getRndInteger(0, supportedVersions.length - 1)]
}

module.exports = {
    randomDelay,
    randomVersion
};