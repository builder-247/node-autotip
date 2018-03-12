const request = require("request");
const logger = require("./logger");

function getHost() {
    request("https://gist.githubusercontent.com/Semx11/35d6b58783ef8d0527f82782f6555834/raw/hosts.json", (err, res, body) => {
        if (err) {
            logger.error(`Unable to get host: ${err}`)
        }
        return body.hosts.find(function (obj) {return obj.id === "totip";})
    })
}

function login() {

}