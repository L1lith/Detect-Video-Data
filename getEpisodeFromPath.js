const {basename} = require('path')
const firstRegexMatch = require('./firstRegexMatch')

const episodeSearchExpressions = [/(?<=episode[ ]*)[0-9]*[1-9]+[0-9\.]*/i, /(?<=(^|\s))[0-9]*[1-9]+[0-9\.]*(?=(\s|$))/ ,/[0-9]*[1-9]+[0-9\.]*/]

function getEpisodeFromPath(string) {
	string = basename(string).split('.').slice(0, -1).join('.').toLowerCase().trim().replace(/ +(?= )/g,'')
	let episode = firstRegexMatch(string, ...episodeSearchExpressions)
	if (episode === null) return null
	episode = parseFloat(episode)
	return episode
}

module.exports = getEpisodeFromPath
