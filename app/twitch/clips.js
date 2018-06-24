'use-strict';
const bluebird = require('bluebird');
const nconf = require('nconf');
const fs = require('fs');
const req = require('request');

function getClips() {
  
  let game = 'League of Legends'
  let limit = 10;
  let period = 'day';
  let language = "en";
  let id = nconf.get("twitchclient");
  let options = {
    method: 'get',
    url: `https://api.twitch.tv/kraken/clips/top?game=${game}&limit=${limit}&period=${period}&language=${language}`,
    json: true,
    headers: {
      "Client-ID": id,
      "Accept": "application/vnd.twitchtv.v5+json"
    }
  };
  return new bluebird.Promise((resolve, reject) => {
    req(options, function (error, response, body) {
      resolve(body);
    });
  });
}
function getFileName(clip) {
  let img = clip.thumbnails.medium;
  let start = img.lastIndexOf('\/') + 1;
  let end = img.lastIndexOf('-preview-');
  return img.substring(start, end) + ".mp4";
}

function getClipFiles() {
  return getClips()
    .then(body => body.clips)
    .map(clip => ({
        id: clip.tracking_id,
        title: clip.title,
        poster: clip.broadcaster.display_name,
        duration: clip.duration,
        views: clip.views,
        filename: getFileName(clip),
      }))
}

function saveClip(name) {
  let url = `https://clips-media-assets2.twitch.tv/${name}`;
  return req(url).pipe(fs.createWriteStream(`../../data/${name}.mp4`));
}
module.exports = {
  getClips,
  getClipFiles,
  saveClip,
}
