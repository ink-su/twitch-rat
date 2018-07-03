'use strict';

const bluebird = require('bluebird');
const nconf = require('nconf');
const path = require('path');
const fs = require('fs');
const req = require('request');

/**
 * Returns a list of top clips on twitch
 */
function getClips() {
  const game = 'League of Legends';
  const limit = 10;
  const period = 'day';
  const language = 'en';
  const id = nconf.get('twitchclient');
  const options = {
    method: 'get',
    url: `https://api.twitch.tv/kraken/clips/top?game=${game}&limit=${limit}&period=${period}&language=${language}`,
    json: true,
    headers: {
      'Client-ID': id,
      Accept: 'application/vnd.twitchtv.v5+json',
    },
  };
  return new bluebird.Promise((resolve) => {
    req(options, (error, response, body) => {
      resolve(body);
    });
  });
}

/**
 * Returns the filename of a clip
 * @param {clip} clip
 */
function getFileName(clip) {
  const img = clip.thumbnails.medium;
  const start = img.lastIndexOf('/') + 1;
  const end = img.lastIndexOf('-preview-');
  return `${img.substring(start, end)}.mp4`;
}

/**
 * Get a list of clips in the proper clip format
 */
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
    }));
}
/**
 * Download clip to data directory
 * @param {string} name
 */
function saveClip(name) {
  const url = `https://clips-media-assets2.twitch.tv/${name}`;
  return req(url).pipe(fs.createWriteStream(path.join(__dirname, `../../data/${name}.mp4`)));
}

module.exports = {
  getClips,
  getClipFiles,
  saveClip,
};
