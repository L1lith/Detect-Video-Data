const {dirname, sep} = require('path')

const invalidShowNames = ["vids", "anime", "show", "video"]

function getShowFromPath(string) {
  const show = (dirname(string).split(sep).slice(-2,-1)[0] || "").trim() || null
  if (show === null) return show
  const showLowercase = show.toLowerCase().split(' ').join('')
  if (invalidShowNames.some(name => showLowercase.includes(name) && showLowercase.length < name.length + 5)) return null
  return show
}

module.exports = getShowFromPath
