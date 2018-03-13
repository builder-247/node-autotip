const request = require("request");
const logger = require("./logger");
const hosts = "https://gist.githubusercontent.com/Semx11/35d6b58783ef8d0527f82782f6555834/raw/hosts.json";
//TEMP
const info = {
    uuid: null,
    version: "2.1.0.6",
    mc: "1.8.9",
    tips: 0
};

// I have no idea what I'm doing lol
function joinServer(cb) {
    const options = {
        url: "https://sessionserver.mojang.com/session/minecraft/join",
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'charset': 'UTF-8'
        }
    };
    request(options, (err, res, body) => {

    })
}

function requestHandler(url, cb) {
    const options = {
        url: url,
        headers: {
            'User-Agent':  'Autotip v' + info.version
        }
    };
    request(options, (err, res, body) => {
        if (err) throw err;
        if (res.statusCode < 400) {
            cb(body);
        }
    })
}

/*
*  Get url to perform a task.
*  Types: "download", "totip", "update"
*/
function getHost(type) {
    requestHandler(hosts, (body) => {
        return body.hosts.find(function (obj) {
            return obj.id === type;
        })
    })
}

function login(uuid) {

}