const {basename, dirname, sep} = require('path')
const firstRegexMatch = require('./firstRegexMatch')

const seasonSearchExpressions = [/(?<=season[ ]*)[0-9]*[1-9]+[0-9\.]*/i]

function getSeasonFromPath(string) {
  const parentDirectory = dirname(string).split(sep).pop()
	let season = firstRegexMatch(parentDirectory, ...seasonSearchExpressions)
	if (season === null) return parentDirectory.trim()
	season = parseFloat(season)
	return season
}

module.exports = getSeasonFromPath
