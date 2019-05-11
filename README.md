## About

node-autotip is command-line based version of the Forge mod [Autotip](https://github.com/Semx11/Autotip) (by [Semx11](https://hypixel.net/members/semx11.20123), [2Pi](https://hypixel.net/members/2pi.22108) and [Sk1er](https://hypixel.net/members/sk1er.199731)).
It is useful for long afk sessions, e.g. overnight.

Advantage of using node-autotip instead of the official mod is greatly smaller electricity costs, as it doesn't require any game rendering. This is achieved by communicating with the server directly using minecraft's protocol.

node-autotip also fixes the issue of "That player is not online, try another user!", making it more efficient than the original mod.

## Getting started

1. Install [Node.js](https://nodejs.org/en/)
2. Clone or download the project
3. Run `npm install` command in the project directory
4. Create a credentials.json file following [this example](https://github.com/builder-247/node-autotip/blob/master/credentials.example.json)
    * **OPTIONAL**: Create `.env` file with config values in KEY=VALUE format (see config.js for full listing of options) 
        * In order to track karma gain accurately, update the `TIP_KARMA` value, it is 100 for default rank, 200 for VIP etc. capped at 500 for MVP+.
5. `npm start`   to start node-autotip

## Contributing

We would love to have your input! We want to make contributing to this project as easy and transparent as possible, whether it's:

* Reporting a bug (make a [github issue](https://github.com/builder-247/node-autotip/issues/new))
* Discussing the current state of the code
* Submitting a fix (fork and [pull](https://github.com/builder-247/node-autotip/compare) as explained below)
* Proposing new features (mention it on github or make a [github issue](https://github.com/builder-247/node-autotip/issues/new))

### Developing

In order to see debugging output, set the `NODE_ENV` variable to `development` in your .env file.

### Code style

We use the [airbnb style](https://github.com/airbnb/javascript) on node-autotip.

Run `npm run lint` to automatically fix the style, or use 
`npm run lintnofix` to see a list of inconsistencies.
