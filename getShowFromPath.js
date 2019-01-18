const {dirname, sep} = require('path')

function getShowFromPath(string) {
  console.log(string)
  return (dirname(string).split(sep).slice(-2,-1)[0] || "").trim() || null
}

module.exports = getShowFromPath
