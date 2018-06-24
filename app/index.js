'use strict';
const nconf = require('nconf');
const twitch = require('./twitch/clips');
nconf.argv().env().file({ file: 'app/config/secret.json' })
twitch.getClipFiles()
  // .then(files => console.log(files));