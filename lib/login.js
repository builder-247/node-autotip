const request = require("request");
const util = require("../util/Utility");
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
function joinServer(params, cb) {
    const options = {
        url: "https://sessionserver.mojang.com/session/minecraft/join",
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
    };
    request(options, (err, res, body) => {
        if (err) {
            return cb(err, null)
        }
        if (res.statusCode !== 204) {
            logger.error(`Error ${res.statusCode} during authentication: Session servers down?`);
            return cb(res.statusCode, null)
        }
        logger.info(body);
        cb(null, true)
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

function login(uuid, session) {
    const accessToken = session.accessToken;
    logger.info(`Trying to log in as ${util.removeDashes(uuid)}`);
    joinServer({
        accessToken: accessToken,
        selectedProfile: util.removeDashes(uuid),
        serverId: "123"
    }, (err, success) => {
        if (success) {
            logger.info("Successful login")
        }
    })

}

module.exports = {
    login
};