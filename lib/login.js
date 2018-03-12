const request = require("request");
const logger = require("./logger");
//TEMP
const info = {
    uuid: null,
    version: "2.0.3",
    mc: "1.8.9",
    tips: 0
};

function requestHandler(url) {
    const options = {
        url: url,
        headers: {
            'User-Agent':  'Autotip v' + info.version
        }
    };
    request(options, (err, res, body) => {
        if (err) throw err;
        if (res.statusCode < 400) {
            
        }
    })
}

function getHost() {
    /*
    request("https://gist.githubusercontent.com/Semx11/35d6b58783ef8d0527f82782f6555834/raw/hosts.json", (err, res, body) => {
        if (err) {
            logger.error(`Unable to get host: ${err}`)
        }
        return body.hosts.find(function (obj) {
            return obj.id === "totip";
        })
    })
    */
}

function login() {

}