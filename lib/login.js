const request = require("request");
const util = require("../util/Utility");
const logger = require("./logger");
const bigInt = require("big-integer");
const createHash = require('../util/createHash');
const Session = require("./session");
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

function autotipLogin(uuid, session, hash, cb) {
    request(
        `https://api.autotip.pro/login?username=${session.selectedProfile.name}&uuid=${util.removeDashes(uuid)}&tips=0&v=2.1.0.6&mc=1.8.9&os=Windows&hash=${hash}`,
        (err, res, body) => {
            if (err) {
                cb(err, null);
            }

            cb(null, body);
        }
    )
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

function login(uuid, session, cb) {
    const accessToken = session.accessToken;
    logger.info(`Trying to log in as ${util.removeDashes(uuid)}`);

    let hash = getServerHash(util.removeDashes(uuid));
    logger.info(`Server hash is: ${hash}`);

    joinServer({
        accessToken: accessToken,
        selectedProfile: util.removeDashes(uuid),
        serverId: hash
    }, (err, success) => {
        if (success) {
            logger.info("Successfully created Mojang session!");

            autotipLogin(uuid, session, hash, (err, body) => {
                if (err) {
                    logger.error(err);
                } else {
                    if (!JSON.parse(body).success) {
                        logger.error(body);
                    }

                    logger.info("Autotip session: " + body);
                    cb(new Session(JSON.parse(body)));
                }
            });
        }
    })

}

function getServerHash(uuid) {
    let salt = bigInt.randBetween("0", "1.3611295e39").toString(32);
    return createHash(uuid + salt);
}

module.exports = {
    login
};