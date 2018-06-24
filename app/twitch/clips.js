'use-strict';
let bluebird = require('bluebird');
let nconf = require('nconf');
let req = bluebird.promisify(require('request'), { multiArgs: true });
bluebird.promisifyAll(req);

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
  return req(options);
}
function getFileName(clip) {
  let img = clip.thumbnails.medium;
  let start = img.lastIndexOf('\/') + 1;
  let end = img.lastIndexOf('-preview-');
  return img.substring(start, end) + ".mp4";
}
//League of Legends
function getClipFiles() {
  return getClips()
    .spread((res, body) => body.clips)
    .map(clip => ({
        id: clip.tracking_id,
        title: clip.title,
        poster: clip.broadcaster.display_name,
        duration: clip.duration,
        views: clip.views,
        filename: getFileName(clip),
      }))
}

  module.exports = {
    getClips,
    getClipFiles,
  }