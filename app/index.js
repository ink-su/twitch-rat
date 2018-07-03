'use strict';
const nconf = require('nconf');
const twitch = require('./twitch/clips');
nconf.argv().env().file({ file: 'app/config/secret.json' })
twitch.getClipFiles()
  .then(files => console.log(files));
  twitch.saveClip("AT-cm%7C265221254.mp4")
  twitch.saveClip("vod-280040459-offset-732.mp4")