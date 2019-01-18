
const getDataFromPath = require('./getDataFromPath')

async function getSubtitleFile(videoPath) {
  const {season, episode, show} = getDataFromPath(videoPath)
  if (show === null) throw new Error("Could not detect show name")
  if (episode === null) throw new Error("Could not detect episode name")

}

module.exports = getSubtitleFile
