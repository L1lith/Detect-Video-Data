const getEpisodeFromPath = require('./getEpisodeFromPath')
const getSeasonFromPath = require('./getSeasonFromPath')
const getShowFromPath = require('./getShowFromPath')

function getDataFromPath(string) {
  return {
    episode: getEpisodeFromPath(string),
    season: getSeasonFromPath(string),
    show: getShowFromPath(string)
  }
}

module.exports = getDataFromPath
